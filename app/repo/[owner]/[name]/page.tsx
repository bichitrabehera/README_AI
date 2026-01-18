"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import RepoDetails from "@/components/dashboard/RepoDetails";
import ReadmePreview from "@/components/dashboard/ReadmePreview";

export default function RepoPage() {
  const params = useParams();
  const owner = params.owner as string;
  const name = params.name as string;

  const { data: session } = useSession();

  const [repo, setRepo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [readme, setReadme] = useState("");
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (!session?.accessToken || !owner || !name) return;

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
    if (!repo) return;

    setGenerating(true);
    setReadme("");

    const res = await fetch("/api/readme", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ repo }),
    });

    if (!res.ok || !res.body) {
      setGenerating(false);
      return;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();

    let text = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      text += decoder.decode(value);
      setReadme(text);
    }

    setGenerating(false);
  };

  if (loading) return <p className="p-6 text-white">Loading repo...</p>;

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="mx-auto max-w-6xl">
        <DashboardHeader username={session?.user?.name} />

        <div className="py-6">
          <RepoDetails repo={repo} />

          <div className="flex justify-end py-6">
            <button
              onClick={generateReadme}
              disabled={!repo || generating}
              className="
                border border-white/30
                px-6 py-2
                text-sm
                hover:bg-white/10
                disabled:opacity-40
              "
            >
              {generating ? "Generating..." : "Generate README"}
            </button>
          </div>

          {readme && <ReadmePreview content={readme} />}
        </div>
      </div>
    </div>
  );
}
