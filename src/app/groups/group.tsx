import styles from './group.module.css';

interface GroupProps {
  title: string;
  followers: { login: string; avatar_url: string }[];
  enumerated?: boolean;
}

export const Group: React.FC<GroupProps> = ({ title, followers, enumerated }) => {
  return (
    <> 
      <h2>{title} ({followers.length})</h2>
      {enumerated ? (
        <p className={styles.enumerated}>
          {followers.map(follower => (
            <span key={follower.login} className={styles.userCard}>
              <a href={`https://github.com/${follower.login}`}>
                {follower.login}
              </a>
            </span>
          ))}
        </p>
      ) : (
        <div className={styles.cards}>
          {followers.map(follower => (
            <p key={follower.login} className={styles.userCard}>
              <a href={`https://github.com/${follower.login}`}>
                <img
                  width={64}
                  src={follower.avatar_url}
                  alt={`${follower.login} avatar`}
                />
                <span>{follower.login}</span>
              </a>
            </p>
          ))}
        </div>
      )}
    </>
  );
};