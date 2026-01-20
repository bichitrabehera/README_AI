import Image from "next/image";
import { Star, GitFork, Clock } from "lucide-react";
import { GitHubRepo } from "@/types/github";

interface Props {
  repo: GitHubRepo;
}

const RepoDetails = ({ repo }: Props) => {
  return (
    <div className="rounded-xl border border-white/10 bg-black/40 backdrop-blur-xl p-5">
      
      <div className="flex items-start gap-4">
        <Image
          src={repo.owner.avatar_url}
          alt="owner"
          width={48}
          height={48}
          className="rounded-full border border-white/10"
        />

        <div className="flex-1">
          <h2 className="text-lg font-semibold break-all">
            {repo.full_name}
          </h2>

          {repo.description && (
            <p className="text-sm text-white/60 mt-1">
              {repo.description}
            </p>
          )}

          <a
            href={repo.html_url}
            target="_blank"
            className="inline-block mt-2 text-xs text-blue-400 hover:underline"
          >
            View on GitHub
          </a>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mt-5 text-xs text-white/60">
        {repo.language && (
          <span className="px-2 py-1 rounded bg-white/5 border border-white/10">
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
          {new Date(repo.updated_at).toLocaleDateString()}
        </span>
      </div>

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
