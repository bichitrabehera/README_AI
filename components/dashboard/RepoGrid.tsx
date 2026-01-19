import RepoCard from "./RepoCard";
import { GitHubRepo } from "@/types/github";

interface RepoGridProps {
  repos: GitHubRepo[];
  onSelect: (repo: GitHubRepo) => void;
}

const RepoGrid = ({ repos, onSelect }: RepoGridProps) => {
  return (
    <div className="flex flex-wrap px-4 gap-4">
      {repos.map((repo) => (
        <RepoCard key={repo.id} repo={repo} onClick={() => onSelect(repo)} />
      ))}
    </div>
  );
};

export default RepoGrid;
