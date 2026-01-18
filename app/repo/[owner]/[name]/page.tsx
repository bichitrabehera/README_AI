"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function RepoPage() {
  const { owner, name } = useParams();
  const { data: session } = useSession();

  const [repo, setRepo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [readme, setReadme] = useState("");
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (!session?.accessToken) return;

    const fetchRepo = async () => {
      const res = await fetch(`https://api.github.com/repos/${owner}/${name}`, {
        headers: {
          Authorization: `token ${session.accessToken}`,
        },
      });

      const data = await res.json();
      setRepo(data);
      setLoading(false);
    };

    fetchRepo();
  }, [session, owner, name]);

  const generateReadme = async () => {
    setGenerating(true);

    const res = await fetch("/api/readme", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ repo }),
    });

    const data = await res.json();
    setReadme(data.readme);
    setGenerating(false);
  };

  if (loading) return <p className="p-6 text-white">Loading repo...</p>;

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-2xl font-semibold">{repo.name}</h1>
      <p className="text-white/60">{repo.description}</p>

      <button
        onClick={generateReadme}
        className="mt-6 px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg"
      >
        {generating ? "Generating..." : "Generate README"}
      </button>

      {readme && (
        <pre className="mt-8 p-6 border border-white/10 rounded-lg whitespace-pre-wrap">
          {readme}
        </pre>
      )}
    </div>
  );
}
