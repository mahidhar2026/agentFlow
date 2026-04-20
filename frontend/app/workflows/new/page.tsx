"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewWorkflow() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [objective, setObjective] = useState("");
    const [instructions, setInstructions] = useState("");

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();

        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/workflow`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",

            },
            body: JSON.stringify({ name, objective, instructions }),

        });

        router.push("/dashboard");

    };

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center items-center p-8">
            <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl text-black font-bold">Create Workflow</h1>
                    <button
                        onClick={() => router.back()}
                        className="text-sm text-gray-600"
                    >
                        Back
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm text-black font-medium mb-2">WorkflowName</label>
                        <input 
                            type="text"
                            placeholder="e.g. Payment Reminder Workflow"
                            className="w-full text-gray-600 border rounded-xl px-4 py-3"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 font-medium mb-2">Objective</label>
                        <textarea
                            placeholder="what should this workflow achieve?"
                            className="w-full border  rounded-xl text-gray-600 px-4 py-3"
                            rows={3}
                            value={objective}
                            onChange={(e) => setObjective(e.target.value)}
                            required
                        />

                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">AI Instructions</label>
                        <textarea
                            placeholder="e.g. Be polite. Escalate if customer disputes amount."
                            className="w-full border rounded-xl text-gray-600 px-4 py-3"
                            rows={4}
                            value={instructions}
                            onChange={(e) => setInstructions(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type = "submit"
                        className="w-full bg-black text-white py-3 rounded-2xl font-medium"
                    >
                        Create Workflow</button>    
                </form>
            </div>
        </div>
    )
}