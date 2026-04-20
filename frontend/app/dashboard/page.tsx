"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getStatusStyles } from "@/lib/statusStyles";

type Case = {
    id: number;
    customerName: string;
    email?: string;
    amountDue: number;
    status: string;
    sessionToken: string;
    workflow: {
        name: string;
    };
    messages: {
        content: string;

    }[];
};

export default function DashboardPage() {
    const [cases, setCases] = useState<Case[]>([]);

    const fetchCases = async () => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_FRONTEND_URL}/case`);
        const data = await res.json();
        setCases(data);
    };

    const [copied, setCopied] = useState(false);

const [copiedId, setCopiedId] = useState<number | null>(null);

const [filter, setFilter] = useState("ALL");

const handleCopySessionLink = async (sessionToken: string, caseId: number) => {
  await navigator.clipboard.writeText(
    `${process.env.NEXT_PUBLIC_FRONTEND_URL}/session/${sessionToken}`
  );
  setCopiedId(caseId);
  setTimeout(() => setCopiedId(null), 2000);
};
    
    useEffect(() => {
        fetchCases();

        const interval = setInterval(fetchCases, 5000);

        return () => clearInterval(interval);

    }, []);

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className=" text-black text-3xl font-bold">AgentFlow Dashboard</h1>
                    <div className="flex gap-3">
                        <Link
                        href="/"
                        className="bg-black text-white px-4 py-2 rounded-xl"
                        >
                            Home
                        </Link>

                        
                        <Link
                            href="/escalations"
                            className="bg-red-50 text-red-700 border border-red-200 px-4 py-2 rounded-xl"
                        >Escalations
                        </Link>
                        
                        <Link
                            href="/workflows/new"
                            className="bg-black border px-4 py-2 rounded-xl"
                        >
                            New Workflow
                        </Link>
                        <Link 
                            href="/cases/new"
                            className="bg-black text-white px-4 py-2 rounded-xl"
                        >New Case
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-2xl shadow p-4">
                    <p className="text-gray-500"> Total Cases</p>
                    <h2 className="text-2xl text-black font-bold">{cases.length}</h2>
                    </div> 

                    <div className="bg-white rounded-2xl shadow p-4">
                        <p className="text-gray-500">Resolved</p>
                        <h2 className="text-2xl text-black font-bold">
                            {cases.filter((c) => c.status === "RESOLVED").length}
                        </h2>
                    </div>
                    
                    <div className="bg-white rounded-2xl shadow p-4">
                        <p className="text-gray-500">Escalated</p>
                        <h2 className="text-2xl text-black font-bold">
                            {cases.filter((c) => c.status === "ESCALATED").length}
                        </h2>
                    </div>

                    <div className="bg-white rounded-2xl shadow p-4">
                        <p className="text-gray-500">Follow-up</p>
                        <h2 className="text-2xl text-black font-bold">
                            {cases.filter((c) => c.status === "FOLLOW_UP_SCHEDULED").length}
                        </h2>
                    </div>
                </div>

                <div className="flex text-black gap-2 mb-4">
                    {["ALL", "ESCALATED", "FOLLOW_UP_SCHEDULED", "RESOLVED"].map((f) => (
                        <button
                            key={f}
                            onClick={()=> setFilter(f)}
                            className={`px-4 py-2 rounded-xl text-sm ${
                                filter === f? "bg-black text-white": "bg-whote border"
                            }`}
                        >
                            {f.replaceAll("_"," ")}
                        </button>
                    ))}
                </div>

                <div className="bg-white rounded-2xl shadow overflow-hidden">
                    <div className="p-6 border-b border-black">
                        <h2 className="text-xl text-black font-semibold">Customer Cases</h2>
                    </div>

                    <div className="divide-y">
                        {cases
                            .filter((c) => filter === "ALL" || c.status === filter)
                            .map((customerCase) => (
                                
                            <div
                            key={customerCase.id}
                            className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                            >
                                <div>
                                    <h3 className="text-black font-semibold">
                                        {customerCase.customerName}
                                    </h3>
                                    <p className="text-gray-500 text-sm">
                                        Workflow: {customerCase.workflow.name}
                                    </p>
                                    <p className="text-gray-500 text-sm">
                                        Amount Due: ${customerCase.amountDue}

                                    </p>
                                    {customerCase.messages[0] && (
                                        <p className="text-gray-600 text-sm mt-2">
                                            Latest: {customerCase.messages[0].content}
                                        </p>
                                    )}
                                </div>

                                <div className="flex items-center gap-3">
                                    <span 
                                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusStyles(
                                            customerCase.status

                                        )}`}
                                        >
                                            {customerCase.status.replaceAll("_"," ")}
                                        </span>
                                    <Link
                                        href={`/cases/${customerCase.id}`}
                                        className="bg-black px-4 py-2 rounded-xl text-sm"
                                    >
                                        View Case
                                    </Link>
                                    <button
                                        onClick={() =>
                                            handleCopySessionLink(customerCase.sessionToken, customerCase.id)
                                        }
                                        className="bg-black text-white px-4 py-2 rounded-xl text-sm"
                                        >
                                        {copiedId === customerCase.id ? "Copied!" : "Copy Session Link"}
                                    </button>
                                </div>
                            </div>
                        ))}

                        {cases.length === 0 && (
                            <div className="p-10 text-center text-gray-500">
                                <p className="mb-2">No cases found.</p>
                                <p className="text-sm">Create a new case to get started.</p>
                            </div>

                        )}
                    </div>
                </div>
            </div>   
        </div>
    );
}