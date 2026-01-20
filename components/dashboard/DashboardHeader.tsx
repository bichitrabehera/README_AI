"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";

interface Props {
  username?: string | null;
}

const DashboardHeader = ({ username }: Props) => {
  return (
    <header className=" top-0 z-40 border-b border-white/10 bg-black/60 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        
        <Link href="/dashboard" className="flex flex-col leading-tight">
          <span className="text-white font-semibold tracking-wide text-sm sm:text-base">
            README.AI
          </span>
          <span className="text-white/50 text-xs sm:text-sm">
            Welcome {username}
          </span>
        </Link>

        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="
            text-xs sm:text-sm
            px-3 sm:px-4 py-1.5
            border border-red-500/40
            text-red-400
            bg-red-500/5
            backdrop-blur
            hover:bg-red-500/15
            hover:text-red-300
            transition
            active:scale-[0.98]
          "
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default DashboardHeader;
