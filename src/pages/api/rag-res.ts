import { NextApiRequest, NextApiResponse } from "next";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone } from "@pinecone-database/pinecone";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";

const client = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
const index = client.Index("rag-engine-index");

const embeddings = new HuggingFaceInferenceEmbeddings({
    apiKey: process.env.HF_API_KEY,
    model: "sentence-transformers/all-MiniLM-L6-v2",
});

const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex: index,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { human, userId } = req.query;

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    if (typeof human !== "string" || !human) {
        res.write(`data: ${JSON.stringify({ token: "Invalid or Empty human input." })}\n\n`);
    }

    const filter: Record<string, any> = {};
    if (userId) filter.userId = userId;

    try {
        const docsAll = await vectorStore.similaritySearch(human, 10);
        const docs = docsAll.filter(
            doc =>
                (!userId || doc.metadata?.userId == userId)
        );

        if (docs.length === 0) {
            res.write(`data: ${JSON.stringify({ token: "No relevant information found" })}\n\n`);
        }

        const context = docs
            .map(
                d => `
                Topic: ${d.metadata?.topic ?? "unknown topic"}
                Source: ${d.metadata?.source ?? "unknown file"}
                Page: ${d.metadata?.page ?? "?"}
                Content:
                ${d.pageContent}
`
            )
            .join("\n\n");



        const model = new ChatGoogleGenerativeAI({
            temperature: 0.7,
            model: "gemini-2.0-flash",
            apiKey: process.env.GOOGLE_API_KEY,
            streaming: true,
        });

        console.log("before prompt.")

        const stream = await model.stream([
            {
                role: "system",
                content: `
                You are a helpful assistant that answers questions **only based on the provided context**.

                For each answer:
                - Reference the **topic name** and **page number** where the information was found.
                - If the context does not contain enough information, say "I couldn't find relevant information in the uploaded document."
                - Do NOT invent or assume information outside the provided context.

                Context:
                ${context}
                `,
            },
            { role: "user", content: human },
        ]);

        console.log("steaming....")

        for await (const chunk of stream) {
            const token = chunk.content ?? "";
            if (token) {
                res.write(`data: ${JSON.stringify({ token })}\n\n`);
            }
        }

        res.write("data: [DONE]\n\n");
        res.end();
    } catch (error) {
        console.error("Streaming error:", error);
        res.write(`data: ${JSON.stringify({ error: "An error occurred during streaming." })}\n\n`);
        res.end();
    }
}
