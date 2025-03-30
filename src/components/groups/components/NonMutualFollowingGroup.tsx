import { useState, useEffect } from 'react';
import { GitHubAPI } from '@/lib/github/api';
import { UserCardList } from './UserCardList';
import styles from '../group.module.css';

interface NonMutualFollowingGroupProps {
  followers: { login: string; avatar_url: string }[];
  auth: string;
  onReload: () => Promise<void>;
}

export const NonMutualFollowingGroup: React.FC<
  NonMutualFollowingGroupProps
> = ({ followers, auth, onReload }) => {
  const [isUnfollowing, setIsUnfollowing] = useState(false);
  const [selectedFollowers, setSelectedFollowers] = useState<Set<string>>(
    () => {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(
          'selectedFollowers_NON_MUTUAL_FOLLOWING'
        );
        if (stored) {
          return new Set(JSON.parse(stored));
        }
      }
      return new Set();
    }
  );

  useEffect(() => {
    localStorage.setItem(
      'selectedFollowers_NON_MUTUAL_FOLLOWING',
      JSON.stringify(Array.from(selectedFollowers))
    );
  }, [selectedFollowers]);

  const handleCheckboxChange = (login: string) => {
    setSelectedFollowers((prev) => {
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
    const uncheckedFollowers = followers
      .filter((follower) => !selectedFollowers.has(follower.login))
      .map((follower) => follower.login);

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
      <h2>Non-Mutual Following ({followers.length})</h2>
      <UserCardList
        followers={followers}
        selectedFollowers={selectedFollowers}
        onCheckboxChange={handleCheckboxChange}
      />
      <button
        className={styles.actionButton}
        onClick={handleUnfollowUnchecked}
        disabled={followers.length === selectedFollowers.size || isUnfollowing}
      >
        {isUnfollowing ? 'Unfollowing...' : 'Unfollow Unchecked'}
      </button>
    </>
  );
};
