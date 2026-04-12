"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getStatusStyles } from "@/lib/statusStyles";

type EscalatedCase ={
    id: number;
    customerName: string;
    amountDue: number;
    status: string;
    workflow: {
         name: string;

    };
    escalation?: {
        reason: string;
        createdAt: string;
    };
};

export default function EscalationsPage(){
    const [cases, setCases] = useState<EscalatedCase[]>([])
    
    const fetchEscalations = async () => {
        const res = await fetch("http://localhost:5000/escalation");
        const data = await res.json();
        setCases(data);
    };

    useEffect(() => {
        fetchEscalations();

        const interval = setInterval(fetchEscalations, 5000)
        return () => clearInterval(interval);

    }, []);

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h1 className="text-3xl text-black font-bold">Escalations</h1>
                    <p className="text-gray-500 mt-1">
                        Cases requiring human review
                    </p>
                    </div>  

                    <button
                        onClick={() => {
                            if (window.history.length > 1) {
                            window.history.back();
                            } else {
                            window.location.href = "/dashboard";
                            }
                        }}
                        className="bg-black text-white px-4 py-2 rounded-xl"
                    >
                        Back
                    </button>
                </div>

                <div className="bg-white rounded-2xl shadow overflow-hidden">
                    <div className="divide-y">
                        {cases.length > 0? (
                            cases.map((customerCase) => (
                                <div
                                  key={customerCase.id}
                                  className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                                >
                                    <div>
                                        <h2 className="text-lg text-black font-semibold">
                                            {customerCase.customerName}
                                            </h2> 
                                        <p className="text-gray-500 text-sm">
                                            Workflow: {customerCase.workflow.name}
                                        </p>
                                        <p className="text-gray-500 text-sm">
                                            Amount Due: ${customerCase.amountDue}
                                        </p>

                                        {customerCase.escalation && (
                                            <div className="mt-3">
                                                <p className="text-sm font-medium text-red-700">
                                                    Escalation Reason:
                                                </p>
                                                <p className="text-sm text-gray-700 mt-1">
                                                    {customerCase.escalation.reason}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {new Date(
                                                        customerCase.escalation.createdAt
                                                    ).toLocaleString()}
                                                    
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="fle items-center gap-3">
                                        <span   
                                            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusStyles(
                                                customerCase.status
                                            )}`}
                                        >
                                        {customerCase.status.replaceAll("_", " ")}
                                        </span>
                                        <Link
                                            href={`/cases/${customerCase.id}`}
                                            className="bg-white border text-black px-4 py-2 rounded-xl text-sm"
                                        >
                                            View Case
                                        </Link>
                                    </div>
                                </div>  

                            ))
                        ) : (
                            <div className="p-10 text-center text-gray-500">
                                <p className="mb-2">No escalated cases right now.</p>
                                <p className="text-sm">
                                    Escalations will appear here when human review is needed.
                                </p>

                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}