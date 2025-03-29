'use client';
import { useState } from 'react';
import { useGetGroups } from './useGetGroups';
import { Group } from './group';
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
      <Group
        title="Non-Mutual Following"
        followers={notMutual}
        auth={auth}
        onReload={handleRefresh}
      />
      <Group
        title="Not Followed Followers"
        followers={notFollowed}
        enumerated
      />
      <Group title="Mutual Following" followers={mutual} enumerated />
    </>
  );
}
