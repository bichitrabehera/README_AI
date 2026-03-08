"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FaGithub } from "react-icons/fa";

export default function Page() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) router.push("/dashboard");
  }, [session, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <span className="text-sm text-zinc-400 tracking-widest uppercase animate-pulse">
          Loading...
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-sm text-center space-y-8">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            README.AI
          </h1>
          <p className="text-sm text-zinc-100">
            Generate professional README files using AI
          </p>
        </div>

        <button
          onClick={() => signIn("github")}
          className="w-full flex items-center justify-center gap-3 border border-zinc-300 py-3 text-sm font-medium text-white hover:bg-zinc-50 hover:text-black transition-colors duration-300"
        >
          <FaGithub className="text-lg" />
          Continue with GitHub
        </button>

        <p className="text-xs text-zinc-500 tracking-wide">
          Free · Open source · No passwords
        </p>
      </div>
    </div>
  );
}
