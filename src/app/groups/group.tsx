import styles from './group.module.css';
import { useState, useEffect } from 'react';
import { GitHubAPI } from '../github/api';

interface GroupProps {
  title: string;
  followers: { login: string; avatar_url: string }[];
  enumerated?: boolean;
  auth?: string;
  onReload?: () => Promise<void>;
}

export const Group: React.FC<GroupProps> = ({ title, followers, enumerated, auth, onReload }) => {
  const storageKey = `selectedFollowers_${title}`;
  const [isUnfollowing, setIsUnfollowing] = useState(false);
  
  const [selectedFollowers, setSelectedFollowers] = useState<Set<string>>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(storageKey);
      return stored ? new Set(JSON.parse(stored)) : new Set();
    }
    return new Set();
  });

  useEffect(() => {
    if (!enumerated) {
      localStorage.setItem(storageKey, JSON.stringify(Array.from(selectedFollowers)));
    }
  }, [selectedFollowers, storageKey, enumerated]);

  const handleCheckboxChange = (login: string) => {
    setSelectedFollowers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(login)) {
        newSet.delete(login);
      } else {
        newSet.add(login);
      }
      return newSet;
    });
  };

  const handleUnfollowUnchecked = async () => {
    if (!auth || !onReload) {
      console.error('GitHub token or reload callback is not provided');
      return;
    }

    const uncheckedFollowers = followers
      .filter(follower => !selectedFollowers.has(follower.login))
      .map(follower => follower.login);

    if (uncheckedFollowers.length === 0) return;

    const confirmed = window.confirm(
      `Are you sure you want to unfollow ${uncheckedFollowers.length} user${uncheckedFollowers.length > 1 ? 's' : ''}?`
    );

    if (!confirmed) return;

    setIsUnfollowing(true);
    const api = new GitHubAPI(auth);
    
    try {
      for (const login of uncheckedFollowers) {
        await api.unfollowUser(login);
      }
    } catch (error) {
      console.error('Failed to unfollow users:', error);
      alert('Failed to unfollow some users. Please try again later.');
    } finally {
      await onReload();
      setIsUnfollowing(false);
    }
  };

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
        <>
          <div className={styles.cards}>
            {followers.map(follower => (
              <p key={follower.login} className={styles.userCard}>
                {title === "Non-Mutual Following" && (
                  <label className={styles.checkbox}>
                    <input
                      type="checkbox"
                      checked={selectedFollowers.has(follower.login)}
                      onChange={() => handleCheckboxChange(follower.login)}
                    />
                  </label>
                )}
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
          {title === "Non-Mutual Following" && (
            <button 
              className={styles.actionButton}
              onClick={handleUnfollowUnchecked}
              disabled={followers.length === selectedFollowers.size || isUnfollowing}
            >
              {isUnfollowing ? 'Unfollowing...' : 'Unfollow Unchecked'}
            </button>
          )}
        </>
      )}
    </>
  );
};