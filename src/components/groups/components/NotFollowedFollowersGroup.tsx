import { useState } from 'react';
import clsx from 'clsx';
import { GitHubAPI } from '@/lib/github/api';
import { UserInlineList } from './UserInlineList';
import styles from './ActionButton.module.css';
import commonStyles from './common.module.css';

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

  const isDisabled = isFollowing;

  return (
    <>
      <h2>Not Followed Followers ({followers.length})</h2>
      <UserInlineList followers={followers} />
      {followers.length > 0 && (
        <button
          className={clsx(
            styles.actionButton,
            styles.followButton,
            isDisabled && commonStyles.disabledButton
          )}
          onClick={handleFollowAll}
          disabled={isDisabled}
        >
          {isFollowing ? 'Following...' : `Follow All (${followers.length})`}
        </button>
      )}
    </>
  );
};
