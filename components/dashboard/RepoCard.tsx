interface RepoCardProps {
  repo: any;
  onClick: () => void;
}

const RepoCard = ({ repo, onClick }: RepoCardProps) => {
  return (
    <div
      onClick={onClick}
      className="p-2 border border-white/10 cursor-pointer hover:bg-white/5 transition"
    >
      <h2 className="font-medium">{repo.name}</h2>
    </div>
  );
};

export default RepoCard;
