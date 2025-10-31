"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Copy } from 'lucide-react';
import { CopyCheck } from 'lucide-react';



export default function GetUrl() {
    const [uploadUrl, setUploadUrl] = useState("");
    const [chatUrl, setChatUrl] = useState("");
    const [isloading, setIsLoading] = useState(false);
    const [uploadClipped, setUploadClipped] = useState(false);
    const [chatClipped, setChatClipped] = useState(false);
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/login");
        }
    }, [status]);

    useEffect(() => {
        if (session) {
            fetchUrls().then((data) => {
                if (data) {
                    setUploadUrl(data.uploadUrl);
                    setChatUrl(data.chatUrl);
                }
            })
        }
    }, [session]);

    const fetchUrls = async () => {
        try {
            const res = await fetch("/api/generate-url");
            const data = await res.json();
            return data;
        } catch (error) {
            console.error("Error fetching URLs:", error);
        }
    }

    const handleGenerate = async () => {
        setIsLoading(true);
        const data = await fetchUrls();
        setUploadUrl(data.uploadUrl);
        setChatUrl(data.chatUrl);
        setIsLoading(false);
    };

    const handleClipboardCopy = (text: string, setClipped: (v: boolean) => void) => {
        navigator.clipboard.writeText(text);
        setClipped(true);
        setTimeout(() => setClipped(false), 3000);
    };


    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
            <div className="w-2/5 card bg-base-200 shadow-sm p-8">
                <h1 className="text-2xl font-bold mb-4 text-primary">Generate Your URL</h1>

                {!uploadUrl ? (
                    <button
                        onClick={handleGenerate}
                        disabled={isloading}
                        className="btn btn-primary"
                    >
                        {isloading ? "Generating..." : "Generate URL"}
                    </button>
                ) : (
                    <div className="">
                        <div className="mb-4">
                            <p className=" mb-2">Your Upload URL:</p>
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    readOnly
                                    value={uploadUrl}
                                    className="input input-bordered text-center w-full "
                                />
                                <button
                                    className="btn btn-info"
                                    onClick={() => handleClipboardCopy(uploadUrl, setUploadClipped)}
                                >
                                    {
                                        uploadClipped ? <CopyCheck size={16} /> : <Copy size={16} />
                                    }
                                </button>
                            </div>
                        </div>
                        <div className="">
                            <p className=" mb-2">Your Chat URL:</p>
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    readOnly
                                    value={chatUrl}
                                    className="input input-bordered w-full text-center"
                                />
                                <button
                                    className="btn btn-info"
                                    onClick={() => handleClipboardCopy(chatUrl, setChatClipped)}
                                >
                                    {
                                        chatClipped ? <CopyCheck size={16} /> : <Copy size={16} />
                                    }
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
