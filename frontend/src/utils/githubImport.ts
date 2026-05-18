// GitHub import utility — uses public GitHub REST API (no auth required for public data; rate-limited to 60/hr per IP)
// Maps a GitHub username's profile + repos into resume / portfolio shapes.

export interface GithubImportResult {
  profile: {
    name: string;
    bio: string;
    location: string;
    blog: string;
    email: string;
    avatar_url: string;
    html_url: string;
    login: string;
  };
  projects: Array<{
    id: string;
    name: string;
    description: string;
    technologies: string;
    link: string;
  }>;
  skills: string[];
}

interface GhRepo {
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  fork: boolean;
  archived: boolean;
  topics?: string[];
  pushed_at: string;
}

interface GhUser {
  login: string;
  name: string | null;
  bio: string | null;
  location: string | null;
  blog: string | null;
  email: string | null;
  avatar_url: string;
  html_url: string;
}

const HEADERS: HeadersInit = {
  Accept: 'application/vnd.github.mercy-preview+json', // include topics
};

export async function importFromGithub(username: string): Promise<GithubImportResult> {
  const cleaned = username.trim().replace(/^@/, '').replace(/^https?:\/\/(www\.)?github\.com\//, '').split('/')[0];
  if (!cleaned) throw new Error('Please enter a valid GitHub username');

  const [userRes, reposRes] = await Promise.all([
    fetch(`https://api.github.com/users/${cleaned}`, { headers: HEADERS }),
    fetch(`https://api.github.com/users/${cleaned}/repos?per_page=100&sort=pushed`, { headers: HEADERS }),
  ]);

  if (userRes.status === 404) throw new Error(`GitHub user "${cleaned}" not found`);
  if (userRes.status === 403) throw new Error('GitHub API rate limit reached. Try again in an hour.');
  if (!userRes.ok) throw new Error(`GitHub error: ${userRes.status}`);
  if (!reposRes.ok) throw new Error(`Failed to load repos: ${reposRes.status}`);

  const user: GhUser = await userRes.json();
  const repos: GhRepo[] = await reposRes.json();

  // Top non-fork, non-archived repos by stars then recency
  const ranked = repos
    .filter((r) => !r.fork && !r.archived)
    .sort((a, b) => b.stargazers_count - a.stargazers_count || +new Date(b.pushed_at) - +new Date(a.pushed_at))
    .slice(0, 6);

  const projects = ranked.map((r) => ({
    id: `gh-${r.name}-${Date.now()}`,
    name: r.name,
    description: r.description || `Open-source project on GitHub.`,
    technologies: [r.language, ...(r.topics || [])].filter(Boolean).slice(0, 6).join(', '),
    link: r.html_url,
  }));

  // Skills = unique languages + top topics
  const langCounts = new Map<string, number>();
  const topicCounts = new Map<string, number>();
  for (const r of repos.filter((r) => !r.fork)) {
    if (r.language) langCounts.set(r.language, (langCounts.get(r.language) || 0) + 1);
    for (const t of r.topics || []) topicCounts.set(t, (topicCounts.get(t) || 0) + 1);
  }
  const skills = [
    ...[...langCounts.entries()].sort((a, b) => b[1] - a[1]).map(([k]) => k),
    ...[...topicCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([k]) => k),
  ].slice(0, 15);

  return {
    profile: {
      name: user.name || user.login,
      bio: user.bio || '',
      location: user.location || '',
      blog: user.blog || '',
      email: user.email || '',
      avatar_url: user.avatar_url,
      html_url: user.html_url,
      login: user.login,
    },
    projects,
    skills,
  };
}
