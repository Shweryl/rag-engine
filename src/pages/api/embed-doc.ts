
import { NextApiRequest, NextApiResponse } from "next";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { Pinecone } from "@pinecone-database/pinecone";
import { pipeline, env } from "@xenova/transformers";

import path from "path";
import fs from "fs/promises";
import prisma from "@/lib/db";

env.cacheDir = path.join(process.cwd(), "src", "embedding-model").replace(/\\/g, "/");

const client = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!,
});
const index = client.Index("rag-engine-index");

const MODEL_NAME = "all-MiniLM-L6-v2";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405).end();

    try {
        const { documentId, fileUrl, fileName, userId } = req.body;
        if (!documentId || !fileUrl) return res.status(400).json({ error: "Missing data" });

        const response = await fetch(fileUrl);
        const buffer = Buffer.from(await response.arrayBuffer());
        const tempPath = path.join(process.cwd(), "tmp", `${documentId}.pdf`);
        await fs.writeFile(tempPath, buffer);

        const loader = new PDFLoader(tempPath, { splitPages: true });
        const rawDocs = await loader.load();

        const docsWithMeta = rawDocs.map((doc, i) => {
            const { loc, pdf, ...restMetadata } = doc.metadata; 
            
            return {
                pageContent: doc.pageContent,
                metadata: {
                    ...restMetadata,
                    topic: fileName,
                    page: i + 1,
                    source: path.basename(tempPath),
                    userId
                },
            };
        });

        const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 500, chunkOverlap: 50 });
        const splitDocs = await splitter.splitDocuments(docsWithMeta);

        console.log("already splitted.");

        const embedder = await pipeline("feature-extraction", MODEL_NAME, { local_files_only: true });

        let totalTokens = 0;
        const vectors = await Promise.all(splitDocs.map(async (doc, i) => {
            const embeddingResult = await embedder(doc.pageContent);
            const values = Array.from(embeddingResult.data).slice(0, 384);

            totalTokens += values.length; 
            const { loc, pdf, ...finalMetadata } = doc.metadata;

            return {
                id: `${doc.metadata.source}-${doc.metadata.page}-${i}`, 
                values,
                metadata: finalMetadata
            };
        }));

        console.log("embedding done.");

        await index.upsert(vectors);
        console.log("vectors upserted to Pinecone.");

        await prisma.document.update({
            where: { id: documentId },
            data: {
                vectorsCount: splitDocs.length,
                tokensCount: totalTokens,
            },
        });

        await fs.unlink(tempPath);

        console.log("embedded successfully.");
        return res.status(200).json({ success: true, chunksEmbedded: splitDocs.length });

    } catch (err) {
        console.error("Embedding error:", err);
        return res.status(500).json({ error: "Failed to embed PDF" });
    }
}