"use client";

import Link from "next/link";
import { FaGithub } from "react-icons/fa";

const Header = () => {
  return (
    <header className="w-full sticky border-b border-zinc-800 bg-black">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="text-lg font-semibold tracking-widest uppercase text-white"
        >
          README.AI
        </Link>

        <Link
          href="/login"
          className="flex items-center gap-2 text-sm text-white transition-colors duration-200"
        >
          <FaGithub className="text-base" />
          <span>Login with GitHub</span>
        </Link>
      </div>
    </header>
  );
};

export default Header;
