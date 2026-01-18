import RepoCard from "./RepoCard";

interface RepoGridProps {
  repos: any[];
  onSelect: (repo: any) => void;
}

const RepoGrid = ({ repos, onSelect }: RepoGridProps) => {
  return (
    <div className="flex flex-wrap gap-4">
      {repos.map((repo) => (
        <RepoCard
          key={repo.id}
          repo={repo}
          onClick={() => onSelect(repo)}
        />
      ))}
    </div>
  );
};

export default RepoGrid;
