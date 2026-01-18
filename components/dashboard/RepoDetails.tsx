import Image from "next/image";
import {
  Star,
  GitFork,
  Eye,
  AlertCircle,
  Scale,
  GitBranch,
  Calendar,
  Clock,
} from "lucide-react";

interface RepoDetailsProps {
  repo: any;
}

const RepoDetails = ({ repo }: RepoDetailsProps) => {
  return (
    <div className="mt-4 sm:mt-6 bg-black border border-zinc-800 overflow-hidden">
      {/* Repo Header with Gradient Background */}
      <div className="bg-gradient-to-br from-zinc-900 via-black to-black border-b border-zinc-800 p-4 sm:p-6">
        {/* Mobile: Stack vertically, Desktop: Horizontal */}
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="relative flex-shrink-0">
              <Image
                src={repo.owner.avatar_url}
                alt="owner"
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-full ring-2 ring-zinc-800"
                width={64}
                height={64}
              />
              <div className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 w-4 h-4 sm:w-5 sm:h-5 bg-green-500 rounded-full border-2 border-black"></div>
            </div>

            <div className="flex-1 sm:hidden">
              <h2 className="text-lg font-bold text-white mb-1 break-all">
                {repo.full_name}
              </h2>
              <a
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-blue-400 transition-colors"
              >
                <span>View on GitHub</span>
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>

          {/* Desktop Header */}
          <div className="hidden sm:block flex-1">
            <h2 className="text-xl lg:text-2xl font-bold text-white mb-1 break-all">
              {repo.full_name}
            </h2>
            <a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-blue-400 transition-colors group"
            >
              <span>View on GitHub</span>
              <svg className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>

          {/* Language Badge */}
          {repo.language && (
            <div className="px-3 py-2 sm:px-4 sm:py-2 bg-zinc-900 border border-zinc-800 self-start">
              <p className="text-xs text-zinc-500 mb-0.5">Primary Language</p>
              <p className="text-sm font-semibold text-white">
                {repo.language}
              </p>
            </div>
          )}
        </div>

        {/* Description */}
        {repo.description && (
          <p className="mt-3 sm:mt-4 text-sm sm:text-base text-zinc-300 leading-relaxed">
            {repo.description}
          </p>
        )}

        {/* Topics */}
        {repo.topics?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-3 sm:mt-4">
            {repo.topics.map((topic: string) => (
              <span
                key={topic}
                className="px-2.5 py-1 sm:px-3 sm:py-1.5 text-xs font-medium rounded-md bg-zinc-900 text-zinc-300 border border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer"
              >
                #{topic}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Key Stats - Highlighted Section */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-zinc-800 p-px">
        <StatCard
          icon={<Star className="w-4 h-4 sm:w-5 sm:h-5" />}
          label="Stars"
          value={repo.stargazers_count.toLocaleString()}
          color="yellow"
        />
        <StatCard
          icon={<GitFork className="w-4 h-4 sm:w-5 sm:h-5" />}
          label="Forks"
          value={repo.forks_count.toLocaleString()}
          color="blue"
        />
        <StatCard
          icon={<Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
          label="Watchers"
          value={repo.watchers_count.toLocaleString()}
          color="green"
        />
        <StatCard
          icon={<AlertCircle className="w-4 h-4 sm:w-5 sm:h-5" />}
          label="Open Issues"
          value={repo.open_issues_count.toLocaleString()}
          color="red"
        />
      </div>

      {/* Additional Details Grid */}
      <div className="p-4 sm:p-6">
        <h3 className="text-xs sm:text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3 sm:mb-4">
          Repository Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <InfoCard
            icon={<Scale className="w-4 h-4" />}
            label="License"
            value={repo.license?.name || "No License"}
          />
          <InfoCard
            icon={<GitBranch className="w-4 h-4" />}
            label="Default Branch"
            value={repo.default_branch}
          />
          <InfoCard
            icon={
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            }
            label="Size"
            value={`${(repo.size / 1024).toFixed(2)} MB`}
          />
          <InfoCard
            icon={<Calendar className="w-4 h-4" />}
            label="Created"
            value={new Date(repo.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          />
          <InfoCard
            icon={<Clock className="w-4 h-4" />}
            label="Last Updated"
            value={new Date(repo.updated_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          />
          <InfoCard
            icon={
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            }
            label="Visibility"
            value={repo.private ? "Private" : "Public"}
          />
        </div>
      </div>
    </div>
  );
};

const StatCard = ({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: "yellow" | "blue" | "green" | "red";
}) => {
  const colorClasses = {
    yellow: "text-yellow-400 bg-yellow-400/10",
    blue: "text-blue-400 bg-blue-400/10",
    green: "text-green-400 bg-green-400/10",
    red: "text-red-400 bg-red-400/10",
  };

  return (
    <div className="bg-black p-2 sm:p-6 hover:bg-zinc-950 transition-colors">
      <div className={`inline-flex p-1 sm:p-2 mb-2 sm:mb-3 ${colorClasses[color]}`}>
        {icon}
      </div>
      <p className="text-lg sm:text-2xl font-bold text-white mb-0.5 sm:mb-1">{value}</p>
      <p className="text-[10px] sm:text-xs text-zinc-500 uppercase tracking-wide">{label}</p>
    </div>
  );
};

const InfoCard = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="bg-zinc-950 border border-zinc-800 p-3 sm:p-4 hover:border-zinc-700 transition-colors">
    <div className="flex items-center gap-2 mb-2">
      <div className="text-zinc-500">{icon}</div>
      <p className="text-[10px] sm:text-xs text-zinc-500 uppercase tracking-wide">{label}</p>
    </div>
    <p className="text-sm font-medium text-white break-all">{value}</p>
  </div>
);

export default RepoDetails;