interface RepoCardProps {
  repo: any;
  onClick: () => void;
}

const RepoCard = ({ repo, onClick }: RepoCardProps) => {
  return (
    <div
      onClick={onClick}
      className="px-3 py-3 rounded border flex border-white/20 shadow gap-8 cursor-pointer hover:bg-white/5 transition"
    >
      <h2 className="font-medium">{repo.name}</h2>
    </div>
  );
};

export default RepoCard;
