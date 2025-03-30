import styles from '../group.module.css';

interface UserInlineListProps {
  followers: { login: string }[];
}

export const UserInlineList: React.FC<UserInlineListProps> = ({
  followers,
}) => (
  <p className={styles.enumerated}>
    {followers.map((follower) => (
      <span key={follower.login} className={styles.userCard}>
        <a href={`https://github.com/${follower.login}`}>{follower.login}</a>
      </span>
    ))}
  </p>
);
