"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";

interface Props {
  username?: string | null;
}

const DashboardHeader = ({ username }: Props) => {
  return (
    <header className="w-full border-b border-white/10 bg-black/60 backdrop-blur-md">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 h-14">
        {/* Left section */}
        <div className="flex items-center gap-6">
          <Link
            href="/dashboard"
            className="text-sm font-semibold text-white tracking-tight"
          >
            README.AI
          </Link>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-4">
          <span className="text-sm text-white/60 hidden sm:block">
            {username}
          </span>

          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="text-sm text-white/60 hover:text-white transition"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
