import { Candidate } from '../interfaces/Candidate.interface';

const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;
console.log('🔐 Loaded GitHub token:', GITHUB_TOKEN);

// 🔍 Get a random list of users
const searchGithub = async () => {
  try {
    const start = Math.floor(Math.random() * 10000) + 1;
    const response = await fetch(`https://api.github.com/users?since=${start}`, {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
      },
    });

    if (!response.ok) throw new Error('Invalid GitHub API response');
    const data = await response.json();
    return data;
  } catch (err) {
    console.error('❌ Error in searchGithub:', err);
    return [];
  }
};

// 🔍 Get detailed info for a specific user
const searchGithubUser = async (username: string) => {
  try {
    const response = await fetch(`https://api.github.com/users/${username}`, {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
      },
    });

    if (!response.ok) throw new Error('Invalid GitHub API user response');
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(`❌ Error fetching user ${username}:`, err);
    return null;
  }
};

// 👤 Combine both calls to get a usable Candidate object
const getCandidate = async (): Promise<Candidate | null> => {
  try {
    const users = await searchGithub();
    console.log('📋 Fetched users list:', users);

    for (const user of users) {
      try {
        const detailedUser = await searchGithubUser(user.login);
        if (detailedUser && detailedUser.login) {
          console.log('✅ Valid candidate:', detailedUser);
          return {
            name: detailedUser.name || 'N/A',
            login: detailedUser.login,
            location: detailedUser.location || 'N/A',
            avatar_url: detailedUser.avatar_url,
            email: detailedUser.email || 'N/A',
            html_url: detailedUser.html_url,
            company: detailedUser.company || 'N/A',
          };
        }
      } catch (err) {
        console.warn(`⚠️ Failed to process user ${user.login}`, err);
      }
    }

    console.warn('⚠️ No valid candidates found in this batch');
    return null;
  } catch (err) {
    console.error('❌ Error in getCandidate():', err);
    return null;
  }
};

export { searchGithub, searchGithubUser, getCandidate };
