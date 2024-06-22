import styles from './page.module.css';
import { Octokit } from 'octokit';

const PER_PAGE_DEFAULT = 100;
const auth = process.env.GITHUB_TOKEN;

export const metadata = {
  title: 'Mutual Github',
  description: 'Check out and count your mutual and not mutual followers on GitHub.',
};

const octokit = new Octokit({
  auth,
});

export default async function Home() {
  // https://docs.github.com/en/rest/users/followers
  const followers = await octokit.paginate('GET /user/followers', {
    headers: {
      'X-GitHub-Api-Version': '2022-11-28',
    },
    per_page: PER_PAGE_DEFAULT,
  });
  const followerLogins = new Set(followers.map(follower => follower.login));
  // https://docs.github.com/en/rest/using-the-rest-api/using-pagination-in-the-rest-api
  const following = await octokit.paginate('GET /user/following', {
    headers: {
      'X-GitHub-Api-Version': '2022-11-28',
    },
    per_page: PER_PAGE_DEFAULT,
  });
  const { mutual, notMutual } = following.reduce(({ mutual, notMutual }, currentFollowing) => {
    if (followerLogins.has(currentFollowing.login)) {
      mutual.push(currentFollowing);
      followerLogins.delete(currentFollowing.login);
    } else {
      notMutual.push(currentFollowing);
    }
    return {
      mutual,
      notMutual,
    };
  }, {
    mutual: [],
    notMutual: [],
  });

  return (
    <main className={styles.main}>
      <h2>
        Non-Mutual Following ({notMutual.length})
      </h2>
      <div className={styles.cards}>
        {notMutual.map(follower => <p key={follower.login} className={styles.userCard}>
          <a href={`https://github.com/${follower.login}`}><img
            width={64}
            src={follower.avatar_url}
            alt={`${follower.login} avatar`}
          /> <span>{follower.login}</span>
          </a></p>)}
      </div>

      <h2>
        Not Followed Followers ({followerLogins.size})
      </h2>
      <p className={styles.enumerated}>{Array.from(followerLogins).map(login => <a
        href={`https://github.com/${login}`}
        key={login}
      >{login}</a>)}</p>

      <h2>
        Mutual Following ({mutual.length})
      </h2>
      <p className={styles.enumerated}>{mutual.map(follower => <span key={follower.login}><a
        href={`https://github.com/${follower.login}`}
      >{follower.login}</a></span>)}</p>
    </main>
  );
}
