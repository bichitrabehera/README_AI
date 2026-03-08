"use client";

import { useState } from "react";
import RepoCard from "./RepoCard";
import { GitHubRepo } from "@/types/github";

interface RepoGridProps {
  repos: GitHubRepo[];
  onSelect: (repo: GitHubRepo) => void;
}

const ITEMS_PER_PAGE = 10;

const RepoGrid = ({ repos, onSelect }: RepoGridProps) => {
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(repos.length / ITEMS_PER_PAGE);

  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const currentRepos = repos.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="px-4 pb-20">
      <div className=" grid grid-cols-1 md:grid-cols-4  gap-4">
        {currentRepos.map((repo, index) => (
          <RepoCard
            key={repo.id ?? index}
            repo={repo}
            onClick={() => onSelect(repo)}
          />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-12">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-3 py-1 border border-white/30 rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span>
          Page {page} / {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 border border-white/30 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default RepoGrid;
