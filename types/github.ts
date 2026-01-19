export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;

  language: string | null;

  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  open_issues_count: number;

  html_url: string;
  default_branch: string;
  private: boolean;

  topics: string[];

  license: {
    key: string;
    name: string;
  } | null;

  owner: {
    login: string;
    avatar_url: string;
  };

  created_at: string;
  updated_at: string;
  size: number;
}
