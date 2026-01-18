"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";
interface Props {
  username?: string | null;
}

const DashboardHeader = ({ username }: Props) => {
  return (
    <div className="flex items-center justify-between py-3">
      
      {/* Left */}
      <div className="leading-tight">
        <h1 className="text-white font-[GT] font-semibold text-lg tracking-wide">
          <Link href="/">README.AI</Link>
        </h1>
      </div>

      {/* Right */}
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="
          text-xs
          text-white
          hover:text-white
          transition
          bg-red-500 px-3 py-2
          rounded
          shadow-sm
          hover:bg-red-950
        "
      >
        Logout
      </button>
    </div>
  );
};

export default DashboardHeader;
