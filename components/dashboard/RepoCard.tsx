import { GitHubRepo } from "@/types/github";

interface RepoCardProps {
  repo: GitHubRepo;
  onClick: () => void;
}

const RepoCard = ({ repo, onClick }: RepoCardProps) => {
  return (
    <div
      onClick={onClick}
      className="px-3 py-1 md:py-3 rounded text-sm border flex border-white/20 shadow gap-4 cursor-pointer hover:bg-white/5 transition"
    >
      <h2 className="font">{repo.name}</h2>
    </div>
  );
};

export default RepoCard;
