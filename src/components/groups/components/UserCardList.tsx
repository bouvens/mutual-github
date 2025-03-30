import styles from './UserCardList.module.css';
import commonStyles from './common.module.css';

interface UserCardListProps {
  followers: { login: string; avatar_url: string }[];
  selectedFollowers: Set<string>;
  onCheckboxChange: (login: string) => void;
}

export const UserCardList: React.FC<UserCardListProps> = ({
  followers,
  selectedFollowers,
  onCheckboxChange,
}) => (
  <div className={styles.cards}>
    {followers.map((follower) => (
      <p key={follower.login} className={styles.userCard}>
        <label className={styles.checkbox}>
          <input
            type="checkbox"
            checked={selectedFollowers.has(follower.login)}
            onChange={() => onCheckboxChange(follower.login)}
          />
        </label>
        <a href={`https://github.com/${follower.login}`}>
          <img
            width={64}
            src={follower.avatar_url}
            alt={`${follower.login} avatar`}
            className={styles.avatar}
          />
          <span className={commonStyles.linkText}>{follower.login}</span>
        </a>
      </p>
    ))}
  </div>
);
