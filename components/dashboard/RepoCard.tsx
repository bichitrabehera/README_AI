import Image from "next/image";
import { GitHubRepo } from "@/types/github";

interface Props {
  repo: GitHubRepo;
  onClick: () => void;
}

const formatDate = (date?: string) => {
  if (!date) return "Unknown";
  const d = new Date(date);
  if (isNaN(d.getMinutes())) return "Unknown";

  return d.toLocaleDateString("en-US");
};

const RepoCard = ({ repo, onClick }: Props) => {
  return (
    <div
      onClick={onClick}
      className="w-full flex items-center bg-white/2 justify-between gap-4 p-4 border border-white/10 rounded-lg cursor-pointer hover:bg-white/5 transition-colors duration-200"
    >
      <div className="flex items-center gap-4 min-w-0">
        <Image
          src={repo.owner.avatar_url}
          alt={repo.owner?.login}
          width={40}
          height={40}
          className="rounded-full border border-white/10 shrink-0"
        />

        <div className="flex flex-col min-w-0">
          <h2 className="text-sm font-medium text-white/80 hover:text-white truncate">
            {repo.name}
          </h2>

          <p className="text-xs text-white/50">{repo.owner.login}</p>
        </div>
      </div>

      <div className="flex flex-col items-end text-xs text-white/40 shrink-0">
        <span>Updated {formatDate(repo.updated_at)}</span>
        <span>Branch: {repo.default_branch}</span>
      </div>
    </div>
  );
};

export default RepoCard;
