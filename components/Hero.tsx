"use client";

import Link from "next/link";
import Pattern from "./Pattern";

const Hero = () => {
  return (
    <section className="relative w-full flex-1 h-[90vh] flex justify-center items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Pattern />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight text-white">
          Generate beautiful <br />
          <span className="bg-linear-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
            GitHub README files
          </span>{" "}
          using AI
        </h1>

        <p className="mt-6 text-lg text-white/70 max-w-2xl mx-auto">
          Turn your GitHub repositories into professional, clean, and
          resume-ready README files in seconds. No templates. No copy-paste.
          Just AI.
        </p>

        <div className="mt-10 flex items-center justify-center gap-4">
          <Link
            href="/login"
            className="px-6 py-3 font-medium bg-black text-white border border-white/30 hover:bg-white hover:text-black transition-all duration-300"
          >
            <button className="button">Get started</button>
          </Link>
        </div>

        <p className="mt-8 text-sm text-white/40">
          Free · No signup · Login with GitHub
        </p>
      </div>
    </section>
  );
};

export default Hero;
