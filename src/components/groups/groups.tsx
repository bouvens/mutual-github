'use client';
import { useState } from 'react';
import clsx from 'clsx';
import { useGetGroups } from '@/hooks/useGetGroups';
import { NonMutualFollowingGroup } from './components/NonMutualFollowingGroup';
import { NotFollowedFollowersGroup } from './components/NotFollowedFollowersGroup';
import { MutualFollowingGroup } from './components/MutualFollowingGroup';
import commonStyles from './components/common.module.css';
import styles from './groups.module.css';

export function Groups({
  auth,
  onTokenUpdate,
}: {
  auth: string;
  onTokenUpdate: () => void;
}) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { allGroups, error, isInitialLoad, reload } = useGetGroups(auth);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await reload();
    setIsRefreshing(false);
  };

  if (!auth) {
    return (
      <div className={styles.noToken}>
        <h2>Mutual and Non-Mutual GitHub Followers</h2>
        <p>This application helps you manage your GitHub connections:</p>
        <ul className={styles.featuresList}>
          <li>See who follows you back (mutual followers)</li>
          <li>Identify users you follow who don&apos;t follow you back</li>
          <li>Find followers you&apos;re not following yet</li>
          <li>Easily unfollow or follow users in batch</li>
        </ul>
        <p>GitHub token is required to use this application</p>
        <p className={styles.tokenInfo}>
          You can generate one at{' '}
          <a
            href="https://github.com/settings/tokens"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub Settings
          </a>
          <br />
          Required scopes: read:user, user:follow
        </p>
        <button onClick={onTokenUpdate} className={styles.tokenButton}>
          Enter Token
        </button>
      </div>
    );
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (isInitialLoad) {
    return <p>Loading...</p>;
  }

  const { mutual, notMutual, notFollowed } = allGroups;

  return (
    <>
      <div className={styles.controls}>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className={clsx(
            styles.refreshButton,
            isRefreshing && commonStyles.disabledButton
          )}
        >
          {isRefreshing ? (
            <>
              <span className={styles.spinner} />
              Refreshing...
            </>
          ) : (
            'Refresh'
          )}
        </button>
        <button onClick={onTokenUpdate} className={styles.tokenButton}>
          Update Token
        </button>
      </div>
      <NonMutualFollowingGroup
        followers={notMutual}
        auth={auth}
        onReload={handleRefresh}
      />
      <NotFollowedFollowersGroup
        followers={notFollowed}
        auth={auth}
        onReload={handleRefresh}
      />
      <MutualFollowingGroup followers={mutual} />
    </>
  );
}
