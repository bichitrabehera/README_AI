"use client";

import Link from "next/link";
import { FaGithub } from "react-icons/fa";

const Header = () => {
  return (
    <header className="w-full border-b border-black/10 bg-[#f8fafc] backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <h1 className="text-black font-[GT] font-semibold text-lg tracking-wide">
          <Link href="/">README.AI</Link>
        </h1>

        <button className="bg-white border border-black/20 text-black py-1 px-3 hover:bg-black hover:text-white transition-all">
          <div className="flex justify-center items-center gap-2">
            <Link href="/login">Login </Link>
            <FaGithub />
          </div>
        </button>
      </div>
    </header>
  );
};

export default Header;
