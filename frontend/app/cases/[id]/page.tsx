"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getStatusStyles } from "@/lib/statusStyles";

type Message = {
    id: number;
    role: "ai" | "customer";
    content: string;
    createdAt: string;
};

type ActionLog ={
    id: number;
    action: string;
    reason?: string;
    createdAt: string;
};

type Escalation = {
    id: number;
    reason: string;
    createdAt: string;
};

type CaseData = {
    id: number;
    customerName: string;
    email?: string;
    amountDue: number;
    status: string;
    sessionToken: string;
    workflow: {
        name: string;
        objective: string;
        instructions: string;
    };
    messages: Message[];
    actionLogs: ActionLog[];
    escalation?: Escalation;
};



export default function CaseDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const[customerCase, setCustomerCase] = useState<CaseData | null>(null);
    const fetchCase = async () => {
        const res = await fetch(`http://localhost:5000/case/${id}`);
        const data = await res.json();
        setCustomerCase(data);
    };
    const [copied, setCopied] = useState(false);

    const handleCopySessionLink = async() => {
        await navigator.clipboard.writeText(
            `${process.env.NEXT_PUBLIC_FRONTEND_URL}/session/${customerCase?.sessionToken}`

        );
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);

    };

    useEffect(() => {
        if(id) fetchCase();

    }, [id]);
    if(!customerCase) {
        return <div className="p-8"> Loading case...</div>;

    }
    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-5xl mx-auto space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl text-black font-bold">Case #{customerCase.id}</h1>
                        <p className="text-black">
                            {customerCase.customerName} . {customerCase.workflow.name}

                        </p>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => router.back()}
                            className="px-4 py-2 text-black rounded-xl border bg-white"
                        >
                            Back
                        </button>
                        <button
                            onClick={handleCopySessionLink}
                            className="px-4 py-2  rounded-xl bg-black text-white"
                            >{copied ? "Copied!" : "Copy Session Link"}</button>               
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-2xl shadow p-5">
                        <p className="text-black text-sm">Customer</p>
                        <h2 className="text-xl text-black    font-semibold mt-1">
                            {customerCase.customerName}
                        </h2>
                        <p className="text-gray-600 mt-2">{customerCase.email || "No email" }</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow p-5">
                        <p className="text-gray-500 text-sm">Amount Due</p>
                        <h2 className="text-xl text-black font-semibold mt-1">
                            ${customerCase.amountDue}
                        </h2>
                    </div>

                    <div className="bg-white rounded-2xl shadow p-5">
                        <p className="text-gray-500 text-sm">Current Status</p>
                        <span   
                            className={`px-4 py-2 rounded-xl text-sm font-semibold inline-block ${getStatusStyles(
                                customerCase.status
                            )}`}
                        >
                            {customerCase.status.replaceAll("_", " ")}
                        </span>
                    </div>
                </div>

                <div className="bg-white text-gray-600 rounded-2xl shadow p-6">
                    <h2 className="text-xl text-black font-semibold mb-4">Workflow Details</h2>
                    <div className="space-y-3">
                        <div>
                            <p className="text-black text-sm">Objective</p>
                            <p>{customerCase.workflow.objective}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm">Instructions</p>
                            <p>{customerCase.workflow.instructions}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow p-6">
                    <h2 className="text-xl text-black font-semibold mb-4">AI Action Logs</h2>

                    <div className="space-y-4">
                        {customerCase.actionLogs.length > 0 ?(
                            customerCase.actionLogs.map((log) => (
                                <div key={log.id} className="border text-black rounded-2xl p-4">
                                    <p className="font-semibold">{log.action}</p>
                                    <p className="text-gray-600 mt-1">{log.reason}</p>
                                    <p className="text-xs text-gray-500 mt-2">
                                        {new Date(log.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                    
                            ))
                        ) : (
                            <p className="text-gray-500">No actions logged yet.</p>
                        )}
                    </div>
                </div>

                {customerCase.escalation && (
                    <div className="bg-red-50 border-red-200 rounded-2xl p-6">
                        <h2 className="text-xl font-semibold  mb-2 text-red-700">
                            Escalated Case
                        </h2>
                        <p className="text-red-800">{customerCase.escalation.reason}</p>
                        <p className="text-xs text-red-600 mt-2">
                            Escalated at{" "}
                            {new Date(customerCase.escalation.createdAt).toLocaleString()}
                        </p>
                    </div>

                )}

                <div className="bg-white text-black rounded-2xl shadow p-6">
                    <h2 className="text-xl text-black font-semibold mb-4">Conversion History</h2>
                    <div className="space-y-4">
                        {customerCase.messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`p-4 rounded-2xl max-w-[80%] ${
                                    msg.role === "ai"
                                    ? "bg-blue-100"
                                    : "bg-green-100 ml-auto text-right"
                                }`}
                            >
                                <p className="text-sm text-black font-semibold mb-1">
                                    {msg.role === "ai"? "AI Assistant": customerCase.customerName}

                                </p>
                                <p>{msg.content}</p>
                                <p className="text-xs text-black mt-2">
                                    {new Date(msg.createdAt).toLocaleString()}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>   
            </div>
        </div>
    );
}