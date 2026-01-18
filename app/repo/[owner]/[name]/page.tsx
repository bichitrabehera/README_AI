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
  // const [commitMessage, setCommitMessage] = useState("Updated Readme File");

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
    <div className="min-h-screen bg-black text-white p-4 overflow-hidden">
      <div className="mx-auto">
        <DashboardHeader username={session?.user?.name} />

        <div className="py-6 flex flex-col md:flex-row gap-10">
          <div className="md:w-1/2">
            <h1 className="text-xl text-center ">Repository Preview</h1>

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
          </div>

          <div className="md:w-1/2 ">
            <h1 className="text-xl text-center ">Preview and commit</h1>
            {readme && <ReadmePreview content={readme} />}
            {/* {readme && (
              <div className="mt-6 flex justify-center items-center gap-10">
                <textarea
                  placeholder="Commit message..."
                  value={commitMessage}
                  onChange={(e) => setCommitMessage(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/10 px-3 py-2 rounded-lg text-sm"
                />

                <div className="flex justify-end">
                  <button
                    onClick={commitReadme}
                    disabled={!commitMessage}
                    className="border border-white/30 px-5 py-2 text-sm hover:bg-white/10 disabled:opacity-40"
                  >
                    Commit
                  </button>
                </div>
              </div>
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
}
