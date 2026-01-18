"use client";

import Link from "next/link";
import Pattern from "./Pattern";

const Hero = () => {
  return (
    <section className="relative w-full min-h-[80vh] overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Pattern />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 text-center">
        <div className="inline-block mb-6 rounded-full border border-black/10 bg-white/60 px-4 py-1 text-sm text-black/70">
          ⚡ Open-source GitHub tool
        </div>

        <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight text-black">
          Generate beautiful <br />
          <span className="bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
            GitHub README files
          </span>{" "}
          using AI
        </h1>

        <p className="mt-6 text-lg text-black/70 max-w-2xl mx-auto">
          Turn your GitHub repositories into professional, clean, and
          resume-ready README files in seconds. No templates. No copy-paste.
          Just AI.
        </p>

        <div className="mt-10 flex items-center justify-center gap-4">
          <Link
            href="/login"
            className="px-6 py-3 font-medium bg-black text-white border border-black hover:bg-black/90 transition"
          >
            <button className="button">
              Get started
              <span className="button-span"> ─ it's free</span>
            </button>
          </Link>

          <a
            href="https://github.com"
            target="_blank"
            className="px-6 py-3 border border-black/20 text-black bg-white hover:bg-black hover:text-white transition"
          >
            View on GitHub
          </a>
        </div>

        <p className="mt-8 text-sm text-black/40">
          Free · No signup · Login with GitHub
        </p>
      </div>
    </section>
  );
};

export default Hero;
