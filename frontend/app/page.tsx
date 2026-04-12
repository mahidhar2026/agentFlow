import Link from "next/link";
export default function HomePage(){
  return (
    <div 
      className="min-h-screen bg-gray-100 flex items-center justify-center p-8"
      style={{backgroundImage: "url('/download.jpeg')"}}
    >
      <div className="bg-white rounded-3xl shadow-xl p-10 max-w-2xl w-full text-center">
        <h1 className="text-4xl text-black font-bold mb-4">AgentFlow</h1>
        <p className="text-gray-600 mb-8 text-lg">
        AI Workflow platform for customer Operations
        </p>

        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Link
            href="/dashboard"
            className="bg-black text-white px-6 py-3 rounded-2xl font-medium"
          >Open Dashboard
          </Link>  

          <Link
            href="/escalations"
            className="bg-black  text-white px-6 py-3 rounded-2xl font-medium"
          >
            Escalations Page
          </Link>

          <Link
            href="/workflows/new"
            className="bg-black border px-6 py-3 rounded-2xl font-medium"
          >
            Create Workflow
          </Link>

          <Link 
            href="/cases/new"
            className="bg-black border px-6 py-3 rounded-2xl font-medium"
          >
            Create Case
          </Link>
        </div>
      </div>
    </div>
  );
}