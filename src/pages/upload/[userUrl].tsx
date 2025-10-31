import { useRef, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { VectorSquare } from 'lucide-react';
import { Codepen } from 'lucide-react';
import { FileText } from 'lucide-react';
import { DatabaseBackup } from 'lucide-react';
import { BrainCog } from 'lucide-react';
import { Slack } from 'lucide-react';


export default function UploadDocsPage() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState("Upload");
    const { data: session, status } = useSession();
    const router = useRouter();
    const { userUrl } = router.query;
    const [authorized, setAuthorized] = useState(false);
    const [user, setUser] = useState();
    const [totalDocs, setTotalDocs] = useState(null);
    const [totalVectors, setTotalVectors] = useState(null);
    const [totalTokens, setTotalTokens] = useState(null);

    useEffect(() => {
        if (!userUrl) return;
        const checkAccess = async () => {
            const res = await fetch(`/api/check-user-access?userUrl=${userUrl}`);
            const { allowed, user } = await res.json();
            console.log(allowed)
            if (!allowed) {
                router.push("/unauthorized");
            } else {
                setAuthorized(true);
                setUser(user)
            }
        };

        checkAccess();
        fetchRagData();

    }, [userUrl]);

    const fetchRagData = async () => {
        const response = await fetch(`/api/doc-rag-data?userUrl=${userUrl}`);

        const data = await response.json();

        setTotalTokens(data.totalTokens);
        setTotalDocs(data.totalDocs);
        setTotalVectors(data.totalVectors);

        console.log(data);
    };

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const userId = user.id;

        setIsUploading(true);
        setUploadStatus("Uploading..")

        const res = await fetch("/api/upload-doc", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                fileName: file.name,
                fileType: file.type,
                fileSize: file.size,
                userId,
            }),
        });

        const { signedUrl, documentId } = await res.json();

        await fetch(signedUrl, {
            method: "PUT",
            body: file,
            headers: { "Content-Type": file.type },
        });
        setUploadStatus("Uploaded")

        console.log("File uploaded! DB record ID:", documentId);
        setUploadStatus("Embedding..")

        await fetch("/api/embed-doc", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                documentId,
                fileUrl: signedUrl.split("?")[0],
                fileName: file.name,
                userId
            }),
        });
        setUploadStatus("Embedded");
        console.log("Embedded document successfully.");
        fetchRagData();
        setIsUploading(false);

    };

    return (
        <div className="min-h-[calc(100vh-64px)] flex flex-col items-center mt-10">
            <div className="w-3/4 flex flex-col">
                <div className="w-full grid grid-cols-3 gap-4">
                    <div className="card p-6 bg-primary/30">
                        <div className="flex items-center">
                            <Slack size={25} />
                            <div className="ml-4">
                                <p className="text-sm">Embedding Model</p>
                                <p className="font-bold text-2xl">text-embedding-3-small</p>
                            </div>
                        </div>
                    </div>
                    <div className="card p-6 bg-primary/30">
                        <div className="flex items-center">
                            <BrainCog size={25} />
                            <div className="ml-4">
                                <p className="text-sm">Large Language Model</p>
                                <p className="font-bold text-2xl">gpt-4o-mini</p>
                            </div>
                        </div>
                    </div>
                    <div className="card p-6 bg-primary/30">
                        <div className="flex items-center">
                            <DatabaseBackup size={25} />
                            <div className="ml-4">
                                <p className="text-sm">Vector Storage</p>
                                <p className="font-bold text-2xl">Pinecone</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-2/4 mt-6">
                <div className="w-full grid grid-cols-2 gap-60">
                    <div className="card p-6 bg-primary/30">
                        <div className="flex items-center">
                            <Codepen size={25} />
                            <div className="ml-4">
                                <p className="text-sm">Embedded Tokens</p>
                                <p className="font-bold text-2xl">{totalTokens}</p>
                            </div>
                        </div>
                    </div>
                    <div className="card p-6 bg-primary/30">
                        <div className="flex items-center">
                            <VectorSquare size={25} />
                            <div className="ml-4">
                                <p className="text-sm">Vectors</p>
                                <p className="font-bold text-2xl">{totalVectors}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-2/4 mt-6">
                <div className="w-full grid grid-cols-2 gap-60">
                    <div className="card p-6 bg-primary/30">
                        <div className="flex items-center">
                            <FileText size={25} />
                            <div className="ml-4">
                                <p className="text-sm">Documents</p>
                                <p className="font-bold text-2xl">{totalDocs}</p>
                            </div>
                        </div>
                    </div>
                    <div className="card p-6 bg-primary/30">
                        <p className="">Upload Progress</p>
                        <p className="font-bold text-sm">10</p>
                    </div>
                </div>
            </div>
            <div className="flex justify-center items-center mt-6">
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                />

                <div
                    className={`absolute w-36 h-36 border-7 border-primary/60 rounded-full 
                    border-t-transparent border-b-transparent rotate-180 ${isUploading ? "animate-spin" : ""}`}
                ></div>

                <button
                    onClick={handleButtonClick}
                    disabled={isUploading}
                    className="w-24 h-24 cursor-pointer rounded-full bg-primary text-white flex items-center justify-center z-10 shadow-lg"
                >
                    {uploadStatus}
                </button>
            </div>

        </div>
    )
}