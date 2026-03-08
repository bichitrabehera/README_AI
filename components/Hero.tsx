"use client";

import Link from "next/link";
import Image from "next/image";
import Pattern from "./Pattern";

const Hero = () => {
  return (
    <section className="relative w-full min-h-[90vh] flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Pattern />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 w-full flex flex-col md:flex-row items-center gap-12 py-12">

        {/* Left */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight text-white">
            Generate beautiful <br />
            <span className="bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
              GitHub README files
            </span>{" "}
            using AI
          </h1>

          <p className="mt-6 text-lg text-white/70 max-w-xl md:mx-0 mx-auto">
            Turn your GitHub repositories into professional, clean, and
            resume-ready README files in seconds. No templates. No copy-paste.
            Just AI.
          </p>

          <div className="mt-10 flex items-center justify-center md:justify-start gap-4">
            <Link
              href="/login"
              className="px-6 py-3 font-medium bg-black text-white border border-white/30 hover:bg-white hover:text-black transition-all duration-300 rounded-md"
            >
              Get started
            </Link>
          </div>

          <p className="mt-8 text-sm text-white/40">
            Free · No signup · Login with GitHub
          </p>
        </div>

        {/* Right image */}
        <div className="flex-1 flex justify-center md:justify-end shrink-0">
          <Image
            src="/assets/image.png"
            alt="README preview"
            width={420}
            height={320}
            className="rounded-xl border border-white/10 shadow-2xl"
            priority
          />
        </div>

      </div>
    </section>
  );
};

export default Hero;