const USERNAME = "aditya90569056";
const USER_API_URL = `https://api.github.com/users/${USERNAME}`;
const REPOS_API_URL = `https://api.github.com/users/${USERNAME}/repos?per_page=100&sort=updated`;
const MAX_PAGINATION_REQUESTS = 20;

const statusMessage = document.getElementById("statusMessage");
const profileCard = document.getElementById("profileCard");
const avatarImage = document.getElementById("avatarImage");
const profileName = document.getElementById("profileName");
const profileUsername = document.getElementById("profileUsername");
const profileBio = document.getElementById("profileBio");
const followersCount = document.getElementById("followersCount");
const followingCount = document.getElementById("followingCount");
const repoCount = document.getElementById("repoCount");
const repoList = document.getElementById("repoList");

async function fetchAllRepos() {
  const repos = [];
  let page = 1;
  let pageRepos = [];

  do {
    if (page > MAX_PAGINATION_REQUESTS) {
      throw new Error(`Repository pagination limit of ${MAX_PAGINATION_REQUESTS} pages reached. Some repositories may not be displayed.`);
    }
    const response = await fetch(`${REPOS_API_URL}&page=${page}`);
    if (!response.ok) {
      throw new Error(`GitHub repo request failed with status ${response.status}.`);
    }
    pageRepos = await response.json();
    repos.push(...pageRepos);
    page += 1;
  } while (pageRepos.length === 100);

  return repos;
}

function createRepoCard(repo) {
  const column = document.createElement("div");
  column.className = "col-12 col-md-6";

  const card = document.createElement("article");
  card.className = "card h-100 border";

  const body = document.createElement("div");
  body.className = "card-body d-flex flex-column";

  const titleLink = document.createElement("a");
  titleLink.href = repo.html_url;
  titleLink.target = "_blank";
  titleLink.rel = "noopener noreferrer";
  titleLink.className = "fw-semibold text-decoration-none";
  titleLink.textContent = repo.name;

  const description = document.createElement("p");
  description.className = "text-secondary small mt-2 mb-3";
  description.textContent = repo.description || "No description provided.";

  const meta = document.createElement("div");
  meta.className = "d-flex flex-wrap gap-2 mt-auto";

  const languageBadge = document.createElement("span");
  languageBadge.className = "badge text-bg-light border";
  languageBadge.textContent = `Language: ${repo.language || "N/A"}`;

  const starsBadge = document.createElement("span");
  starsBadge.className = "badge text-bg-light border";
  starsBadge.textContent = `Stars: ${repo.stargazers_count}`;

  const forksBadge = document.createElement("span");
  forksBadge.className = "badge text-bg-light border";
  forksBadge.textContent = `Forks: ${repo.forks_count}`;

  meta.append(languageBadge, starsBadge, forksBadge);
  body.append(titleLink, description, meta);
  card.append(body);
  column.append(card);

  return column;
}

function renderProfile(user) {
  avatarImage.src = user.avatar_url;
  profileName.textContent = user.name || USERNAME;
  profileUsername.textContent = `@${user.login}`;
  profileBio.textContent = user.bio || "No bio available on profile.";
  followersCount.textContent = `Followers: ${user.followers}`;
  followingCount.textContent = `Following: ${user.following}`;
  repoCount.textContent = `Public repos: ${user.public_repos}`;
  profileCard.classList.remove("d-none");
}

function renderRepos(repos) {
  repoList.replaceChildren();
  if (!repos.length) {
    statusMessage.textContent = "No repositories found on GitHub.";
    return;
  }
  repos.forEach((repo) => {
    repoList.appendChild(createRepoCard(repo));
  });
}

async function loadGitHubData() {
  try {
    const userResponse = await fetch(USER_API_URL);
    if (!userResponse.ok) {
      throw new Error(`GitHub profile request failed with status ${userResponse.status}.`);
    }

    const user = await userResponse.json();
    const repos = await fetchAllRepos();

    renderProfile(user);
    renderRepos(repos);
    statusMessage.textContent = `Showing live data from github.com/${USERNAME}`;
  } catch (error) {
    statusMessage.textContent = `Unable to load GitHub details: ${error.message}`;
  }
}

loadGitHubData();
