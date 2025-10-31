'use client'

import { useRef, useState, useEffect } from "react"
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";


export default function ChatRoom() {
    const [messages, setMessages] = useState<{ human: string, AI?: string }[]>([]);
    const [humanInput, setHumanInput] = useState("");
    const aiMessageRef = useRef("");
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const [isTyping, setIsTyping] = useState<Boolean>(false);
    const [authorized, setAuthorized] = useState(false);

    const [isOpen, setIsOpen] = useState(false);

    const {data : session} = useSession()
    const router = useRouter();
    const { userUrl } = router.query;
    const [user, setUser] = useState();


    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

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
    }, [userUrl]);


    const handleSubmit = async () => {
        if (humanInput == "") {
            return;
        }

        setMessages((prev) => [...prev, { human: humanInput }]);
        setHumanInput("");

        aiMessageRef.current = "";

        handleEventQuery(humanInput);
    };

    const handleEventQuery = (input: string) => {
        setIsTyping(true);
        const source = new EventSource(`/api/rag-res?human=${encodeURIComponent(input)}&userId=${user.id ?? ""}`);

        source.onmessage = (event) => {
            const data = event.data;

            if (data === "[DONE]") {
                setIsTyping(false);
                source.close();
                return;
            }

            try {
                //Assuming the data is a JSON string of a chunk

                const chunk = JSON.parse(data);

                if (chunk.token) {
                    aiMessageRef.current += chunk.token;
                    // console.log(aiMessageRef.current);
                    setMessages((prev) => {
                        const newMessages = [...prev];
                        const lastMessage = newMessages[newMessages.length - 1];
                        lastMessage.AI = aiMessageRef.current;
                        return newMessages;
                    });
                }


            } catch (error) {
                console.error("Failed to parse message:", error);
            }
        };

        source.onerror = (error) => {
            setIsTyping(false);
            console.error("EventSource failed:", error);
            source.close();
        };
    }


    return (
        <main className="h-[calc(100vh-4rem)] flex items-center justify-center">
            <div className="md:w-2/3 lg:w-3/5 h-full grid grid-rows-[1fr_auto] p-4">
                {/* <div className="flex justify-between items-center">
                    <div className="">
                        <button
                            className="md:hidden py-2 px-3 bg-cyan-500 text-white rounded shadow"
                            onClick={() => setIsOpen(true)}
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                    </div>
                    <h1 className="text-cyan-700 ">Gemini Flash 2.5</h1>
                </div> */}
                <div className="bg-gradient-to-b from-slate-900 via-gray-800 to-slate-900 mt-4 mb-2 no-scrollbar overflow-y-scroll p-3 md:p-5 rounded-xl shadow-inner">
                    {
                        messages.length == 0 && (

                            <div className="flex items-center justify-center h-full">
                                <div className="text-center">
                                    {/* <Image
                                        className="mx-auto"
                                        src="/bot.png"
                                        alt="Picture of the author"
                                        width={50}
                                        height={50}
                                    /> */}
                                    <p className="text-slate-600 mt-2">Hello!</p>
                                    <p className="text-slate-600">What would you like to know for today?</p>
                                </div>
                            </div>
                        )
                    }

                    {messages && messages.map((message, index) => (
                        <div key={index} className="flex flex-col gap-2 mb-2">
                            <div className="flex justify-end">
                                <p className="human-message text-sm px-4 py-2 max-w-[80%] bg-gray-800 text-gray-100 inline-block rounded-l-2xl rounded-tr-2xl shadow-md animate-fadeIn">
                                    {message.human}
                                </p>
                            </div>
                            {message.AI && (
                                <div className="flex justify-start">
                                    <p className="ai-message text-sm px-4 py-2 max-w-[80%] bg-cyan-600 text-white inline-block rounded-r-2xl rounded-tl-2xl shadow-md animate-fadeIn">
                                        {message.AI}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}

                    {isTyping && (
                        <div className="flex items-center gap-2 my-2">
                            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-150"></div>
                            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-300"></div>
                            {/* <p className="text-gray-400 text-sm">Gemini is typing...</p> */}
                        </div>
                    )}


                    <div ref={messagesEndRef}></div>
                </div>
                <div className="input-box mt-3">

                    <textarea name="" id=""
                        placeholder="Type your question..." value={humanInput}
                        onChange={(e) => setHumanInput(e.target.value)} onKeyUp={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                handleSubmit();
                            }
                        }}
                        className="w-full p-3 bg-gray-900 text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-200" rows={3}></textarea>
                </div>
            </div>
        </main >
    )
}