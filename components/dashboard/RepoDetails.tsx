import Image from "next/image";
import { Star, GitFork, Clock } from "lucide-react";
import { GitHubRepo } from "@/types/github";

interface Props {
  repo: GitHubRepo;
}

const RepoDetails = ({ repo }: Props) => {
  const updated = new Date(repo.updated_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.02] backdrop-blur-xl p-5">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Image
          src={repo.owner.avatar_url}
          alt={repo.owner.login}
          width={48}
          height={48}
          className="rounded-full border border-white/10 shrink-0"
        />

        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-semibold break-all text-white">
            {repo.full_name}
          </h2>

          <p className="text-sm text-white/60 mt-1">
            Branch: <span className="text-white/80">{repo.default_branch}</span>
          </p>

          {repo.description && (
            <p className="text-sm text-white/60 mt-2">{repo.description}</p>
          )}

          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-2 text-xs text-blue-400 hover:underline"
          >
            View on GitHub
          </a>
        </div>
      </div>

      {/* Stats */}
      <div className="flex flex-wrap items-center gap-4 mt-5 text-xs text-white/60">
        {repo.language && (
          <span className="flex items-center gap-1 px-2 py-1 rounded bg-white/5 border border-white/10">
            <span className="w-2 h-2 rounded-full bg-green-400" />
            {repo.language}
          </span>
        )}

        <span className="flex items-center gap-1">
          <Star className="w-3 h-3" />
          {repo.stargazers_count}
        </span>

        <span className="flex items-center gap-1">
          <GitFork className="w-3 h-3" />
          {repo.forks_count}
        </span>

        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {updated}
        </span>

        {repo.license && (
          <span className="px-2 py-1 rounded bg-white/5 border border-white/10">
            {repo.license.name}
          </span>
        )}

        <span className="px-2 py-1 rounded bg-white/5 border border-white/10">
          {repo.size} KB
        </span>
      </div>

      {/* Topics */}
      {repo.topics?.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {repo.topics.slice(0, 6).map((topic) => (
            <span
              key={topic}
              className="text-xs px-2 py-1 rounded-md bg-white/5 border border-white/10 text-white/70"
            >
              #{topic}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default RepoDetails;
