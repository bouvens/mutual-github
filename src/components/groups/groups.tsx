'use client';
import { useState } from 'react';
import { useGetGroups } from '@/hooks/useGetGroups';
import { NonMutualFollowingGroup } from './components/NonMutualFollowingGroup';
import { NotFollowedFollowersGroup } from './components/NotFollowedFollowersGroup';
import { MutualFollowingGroup } from './components/MutualFollowingGroup';
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
          className={styles.refreshButton}
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
