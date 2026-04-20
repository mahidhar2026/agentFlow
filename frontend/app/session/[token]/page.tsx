"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Message = {
    id: number;
    role: "ai" | "customer";
    content: string;
};

type SessionData = {
    customerName: string;
    amountDue: number;
    status: string;
    messages: Message[];
};

export default function SessionPage() {
    const params = useParams();
    const token = params.token as string;

    const [session, setSession] = useState<SessionData | null>(null);
    const [input, setInput] = useState("");
    

    const fetchSession = async() => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/session/${token}`);
        const data = await res.json();
        setSession(data);
    };

    useEffect(() => {
        if (token) fetchSession();

    },[token]);

    const sendMessage = async (messageText?: string) => {
        const finalMessage = messageText || input;
        if (!finalMessage.trim()) return;

        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/message`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json",

            },
            body: JSON.stringify({ token, content: finalMessage}),

        });
        setInput("");
        fetchSession();
    };

    if (!session) {
        return <div className="p-8">Loading session..</div>
    }

    return (
        <div className = "min-h-screen bg-gray-100 flex justify-center items-center p-6">
            <div className="bg-white w-full max-w-2x1 rounded-2x1 shadow-lg p-6">
                <h1 className="text-gray-600 mb-4">
                    <p className="text-gray-600 mb-4">
                        Customer: <span className="font-medium">{session.customerName}</span>
                    </p>
                    <p className="text-gray-600 mb-6">
                        Amount Due: <span className="font-medium">${session.amountDue}</span>
                    </p>
                    <div className="border rounded-xl p-4 h-96 overflow-y-auto bg-gray-50 mb-4 space-y-3">
                        {session.messages.map((msg) => (
                            <div 
                              key={msg.id}
                              className={`p-3 rounded-xl max-w-[80%] ${
                                msg.role === "ai"
                                 ? "bg-blue-100 text-left"
                                 : "bg-green-100 ml-auto text-right"
                              }`}
                            >
                               <p className="text-sm font-semibold mb-1">
                                  {msg.role === "ai" ? "AI Assistant" : "You"}
                               </p>
                               <p>{msg.content}</p>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                        <button 
                            onClick={() => sendMessage("I will pay soon")}
                            className="px-4 py-2 rounded-xl bg-purple-100 text-purple-700 text-sm font-medium"
                        >
                            I'll pay soon   
                        </button>

                        <button 
                            onClick={() => sendMessage("Remind me later")}
                            className="px-5 py-2 rounded-xl bg-blue-100 text-blue-700 text-sm font-medium"
                        >
                            Remind me later
                        </button>

                        <button
                            onClick={() => sendMessage("I already paid")}
                            className="px-4 py-2 rounded-xl bg-yellow-100 text-yellow-800 text-sm font-medium"
                        >
                            I already paid
                        </button>

                        <button
                            onClick={() => sendMessage("I need support")}
                            className="px-4 py-2 rounded-xl bg-red-100 text-red-700 text-sm font-medium"

                        >
                            I need support
                        </button>

                    </div>

                    <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Type your response..."
                          className="flex-1 border rounded-xl px-4 py-2"
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                sendMessage();
                            }
                          }}
                        />
                        <button
                         onClick={() => {sendMessage} }
                         className="bg-black text-white px-5 py-2 rounded-xl"
                        >
                            send
                        </button>
                    </div>
                </h1>
            </div>
        </div>
    )
}
