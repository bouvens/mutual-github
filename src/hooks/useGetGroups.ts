import { useCallback, useEffect, useState } from 'react';
import { GitHubAPI } from '@/lib/github/api';
import type { GitHubFollower } from '@/lib/github/types';

export const useGetGroups = (auth: string) => {
  const [allGroups, setAllGroups] = useState({
    mutual: [] as GitHubFollower[],
    notMutual: [] as GitHubFollower[],
    notFollowed: [] as GitHubFollower[],
  });
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getGroups = useCallback(
    async function () {
      if (!auth) {
        setIsInitialLoad(false);
        return;
      }

      setError(null);

      try {
        const api = new GitHubAPI(auth);
        const followers: GitHubFollower[] = await api.getFollowers();
        const followerLogins = new Set<string>(
          followers.map((follower) => follower.login)
        );
        const following = await api.getFollowing();

        const { mutual, notMutual } = following.reduce(
          ({ mutual, notMutual }, currentFollowing) => {
            if (followerLogins.has(currentFollowing.login)) {
              mutual.push(currentFollowing);
              followerLogins.delete(currentFollowing.login);
            } else {
              notMutual.push(currentFollowing);
            }
            return {
              mutual,
              notMutual,
            };
          },
          {
            mutual: [] as GitHubFollower[],
            notMutual: [] as GitHubFollower[],
          }
        );

        const notFollowed = Array.from(followerLogins).map((login) =>
          followers.find((follower) => follower.login === login)
        );

        setAllGroups({
          mutual,
          notMutual,
          notFollowed: notFollowed as GitHubFollower[],
        });
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to fetch data');
      } finally {
        setIsInitialLoad(false);
      }
    },
    [auth]
  );

  useEffect(() => {
    setIsInitialLoad(true);
    setAllGroups({
      mutual: [],
      notMutual: [],
      notFollowed: [],
    });
    setError(null);

    if (auth) {
      getGroups();
    }
  }, [getGroups, auth]);

  return {
    allGroups,
    error,
    isInitialLoad,
    reload: getGroups,
  };
};
