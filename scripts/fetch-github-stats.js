import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, '../src/data/github-stats.json');
const USERNAME = 'tuefekci';
const CACHE_HOURS = parseInt(process.env.HOURS || '4');

function readCache() {
  if (!fs.existsSync(DATA_FILE)) return null;
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  } catch {
    return null;
  }
}

function writeCache(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

function isCacheStale(cached) {
  if (!cached || !cached.fetchedAt) return true;
  const ageHours = (Date.now() - new Date(cached.fetchedAt).getTime()) / (1000 * 60 * 60);
  return ageHours >= CACHE_HOURS;
}

async function fetchGitHubProfile() {
  const res = await fetch(`https://api.github.com/users/${USERNAME}`, {
    headers: { Accept: 'application/vnd.github.v3+json' }
  });
  if (!res.ok) throw new Error(`GitHub profile API error: ${res.status}`);
  return res.json();
}

async function fetchAllRepos() {
  let page = 1;
  let allRepos = [];
  let hasMore = true;

  while (hasMore) {
    const res = await fetch(
      `https://api.github.com/users/${USERNAME}/repos?per_page=100&page=${page}&sort=updated`,
      { headers: { Accept: 'application/vnd.github.v3+json' } }
    );
    if (!res.ok) throw new Error(`GitHub repos API error: ${res.status}`);
    const repos = await res.json();
    if (!Array.isArray(repos) || repos.length === 0) break;
    allRepos = allRepos.concat(repos);
    hasMore = repos.length === 100;
    page++;
    if (page > 10) break; // safety limit
  }
  return allRepos;
}

async function fetchContributions() {
  const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${USERNAME}`);
  if (!res.ok) throw new Error(`Contributions API error: ${res.status}`);
  const data = await res.json();
  // Sum all contributions from the yearly totals object
  const total = Object.values(data.total).reduce((sum, count) => sum + count, 0);
  return total;
}

async function main() {
  const force = process.argv.includes('--force');
  const cached = readCache();

  if (!force && !isCacheStale(cached)) {
    console.log(`GitHub stats cache is fresh (${DATA_FILE}). Skipping fetch.`);
    console.log(`Use --force to bypass, or set HOURS=<number> to change cache interval (currently ${CACHE_HOURS}h).`);
    return;
  }

  console.log('Fetching GitHub stats...');

  try {
    const [profile, repos, contributions] = await Promise.all([
      fetchGitHubProfile(),
      fetchAllRepos(),
      fetchContributions()
    ]);

    const totalStars = repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0);

    const stats = {
      stars: totalStars,
      followers: profile.followers,
      publicRepos: profile.public_repos,
      contributions: contributions,
      fetchedAt: new Date().toISOString()
    };

    writeCache(stats);
    console.log(`GitHub stats updated: ${JSON.stringify(stats)}`);
  } catch (err) {
    console.error('Failed to fetch GitHub stats:', err.message);
    if (cached) {
      console.log('Using cached data instead.');
    } else {
      process.exit(1);
    }
  }
}

main();
