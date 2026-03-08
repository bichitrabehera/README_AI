"use client";

import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import RepoDetails from "@/components/dashboard/RepoDetails";
import ReadmePreview from "@/components/dashboard/ReadmePreview";
import { GitHubRepo } from "@/types/github";

export default function RepoPage() {
  const params = useParams();
  const owner = params.owner as string;
  const name = params.name as string;

  const { data: session } = useSession();

  const [repo, setRepo] = useState<GitHubRepo | null>();
  const [loading, setLoading] = useState(true);
  // const [readme, setReadme] = useState("");
  const [generating, setGenerating] = useState(false);
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  // const [commitMessage, setCommitMessage] = useState("Updated Readme File");

  const cacheKey = `readme_cache_${owner}_${name}`;

  const [readme, setReadme] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;

    const cached = localStorage.getItem(cacheKey);
    return cached ?? null;
  });

  const updateReadme = useCallback(
    (value: string) => {
      setReadme(value);
      if (value) {
        localStorage.setItem(cacheKey, value);
      }
    },
    [cacheKey],
  );

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
    setError("");

    const res = await fetch("/api/readme", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ repo, description }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Something went wrong");
      setGenerating(false);
      return;
    }

    updateReadme(data.readme);
    setGenerating(false);
  };

  // const commitReadme = async () => {
  //   await fetch("/api/commit-readme", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({
  //       owner,
  //       repo: name,
  //       content: readme,
  //       message: commitMessage,
  //     }),
  //   });

  //   alert("README committed successfully 🚀");
  // };

  if (loading) return <p className="p-6 text-white">Loading repo...</p>;

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <DashboardHeader username={session?.user?.name} />

      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <section
            className="
            bg-black/40
            backdrop-blur-xl
          "
          >
            <h2 className="text-sm uppercase tracking-wider text-white/50 mb-4">
              Repository Preview
            </h2>

            {repo && <RepoDetails repo={repo} />}

            <div className="mt-6">
              <label className="block text-sm text-white/60 mb-2">
                Project Description (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Briefly describe what your project does (e.g. 'A kanban board for managing tasks with drag-and-drop'). This helps the AI generate a better introduction."
                className="w-full bg-black/20 border border-white/10 rounded p-3 text-white text-sm focus:border-white/30 outline-none min-h-[100px]"
              />
            </div>

            {error && (
              <p className="mt-4 text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded px-3 py-2">
                {error}
              </p>
            )}

            <p className="mt-4 text text-white/90">
              Note: You can generate one README per day.
            </p>

            <div className="flex justify-end pt-4">
              <button
                onClick={generateReadme}
                disabled={!repo || generating}
                className="
                px-6 py-2
                text-sm
                border border-white/30
                hover:bg-white/10
                disabled:opacity-40
                transition
              "
              >
                {generating ? "Generating..." : "Generate"}
              </button>
            </div>
          </section>

          <section
            className="
      
          
            bg-black/40
            backdrop-blur-xl
        
          "
          >
            {readme ? (
              <ReadmePreview content={readme} />
            ) : (
              <div className="flex items-center justify-center h-75 text-white/30 text-sm border border-dashed border-white/10">
                Generate a README to preview it here
              </div>
            )}

            {/* commit UI stays here later */}
          </section>
        </div>
      </div>
    </div>
  );
}
