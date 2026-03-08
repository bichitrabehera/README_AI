"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";

interface Props {
  username?: string | null;
}

const DashboardHeader = ({ username }: Props) => {
  return (
    <header className="w-full border-b border-white/10 bg-black">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-4">

        <div className="flex flex-col leading-tight">
          <Link href="/dashboard" className="text-sm font-semibold tracking-widest uppercase text-white">
            README.AI
          </Link>
          <span className="text-xs text-white/40">Welcome, {username}</span>
        </div>

        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="text-sm text-white/40 hover:text-white transition-colors duration-200"
        >
          Logout
        </button>

      </div>
    </header>
  );
};

export default DashboardHeader;