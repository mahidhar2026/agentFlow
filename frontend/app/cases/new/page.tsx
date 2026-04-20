"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Workflow = {
    id: number;
    name: string;
};

export default function NewCasePage() {
    const router = useRouter();

    const [customerName, setCustomerName] = useState("");
    const [email, setEmail] = useState("");
    const [amountDue, setAmountDue] = useState("");
    const [workflowId, setWorkflowId] = useState<number | "">("");
    const [workflows, setWorkflows] = useState<Workflow[]>([]);
    const [sessionLink, setSessionLink] = useState("");
    
    useEffect(() => {
        const fetchWorkflows = async () => {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/workflow`
            );
            const data = await res.json();
            setWorkflows(data);

        };

        fetchWorkflows();

    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/case`,{
            method: "POST",
            headers: {
                "Content-Type" : "application/json",

            },
            body: JSON.stringify({
                customerName,
                email,
                amountDue: Number(amountDue),
                workflowId: Number(workflowId),

            }),
        });

        const data = await res.json();
        setSessionLink(data.sessionLink);

    };

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center items-center p-8">
            <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-2xl">
                <div className="flex justify-between text-black items-center mb-6">
                    <h1 className="text-3xl font-bold">Create Customer case</h1>
                    <button
                        onClick={() => router.back()}
                        className="text-sm text-gray-600"
                    >
                        Back
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5" >
                    <div>
                        <label className="block text-sm text-gray-600 font-medium mb-2">Customer Name</label>
                        <input
                            type= "text"
                            className="w-full border rounded-xl text-gray-600 px-4 py-3"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-600 font-medium mb-2">Email</label>
                        <input
                            type="email"
                            className="w-full border rounded-xl text-gray-600 px-4 py-3"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                    </div>

                    <div>
                        <label className="block text-sm text-gray-600 font-medium mb-2">Amount Due</label>
                        <input
                            type="number"
                            className="w-full border rounded-xl text-gray-600 px-4 py-3"
                            value={amountDue}
                            onChange={(e) => setAmountDue(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">Assign workflow</label>
                        <select
                            className="w-full border rounded-xl text-gray-600 px-4 py-3"
                            value={workflowId}
                            onChange={(e) => setWorkflowId(Number(e.target.value))}
                            required
                        >
                            <option value="">Select a workflow</option>
                            {workflows.map((workflow) => (
                                <option key = {workflow.id} value={workflow.id}>
                                    {workflow.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-black text-white py-3 rounded-2xl font-medium"
                    >Create Case</button>

                </form>    

                {sessionLink && (
                    <div className="mt-6 p-4 bg-green-100 text-gray-600 rounded-2xl">
                        <p className="font-medium mb-2">Customer session Link created:</p>
                        <a
                            href={sessionLink}
                            target="_blank"
                            className="text-blue-600 underline break-all"
                        >
                            {sessionLink}
                        </a>
                    </div>
                )}           
            </div>
        </div>
    )

    
}