import { useState } from 'react';
import { GitHubAPI } from '../../github/api';
import { UserInlineList } from './UserInlineList';
import styles from '../group.module.css';

interface NotFollowedFollowersGroupProps {
  followers: { login: string; avatar_url: string }[];
  auth: string;
  onReload: () => Promise<void>;
}

export const NotFollowedFollowersGroup: React.FC<
  NotFollowedFollowersGroupProps
> = ({ followers, auth, onReload }) => {
  const [isFollowing, setIsFollowing] = useState(false);

  const handleFollowAll = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to follow ${followers.length} user${followers.length > 1 ? 's' : ''}?`
    );

    if (!confirmed) return;

    setIsFollowing(true);
    const api = new GitHubAPI(auth);

    try {
      for (const follower of followers) {
        await api.followUser(follower.login);
      }
    } catch (error) {
      console.error('Failed to follow users:', error);
      alert('Failed to follow some users. Please try again later.');
    } finally {
      await onReload();
      setIsFollowing(false);
    }
  };

  return (
    <>
      <h2>Not Followed Followers ({followers.length})</h2>
      <UserInlineList followers={followers} />
      {followers.length > 0 && (
        <button
          className={`${styles.actionButton} ${styles.followButton}`}
          onClick={handleFollowAll}
          disabled={isFollowing}
        >
          {isFollowing ? 'Following...' : `Follow All (${followers.length})`}
        </button>
      )}
    </>
  );
};
