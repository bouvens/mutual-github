import { useCallback, useEffect, useState } from 'react';
import { GitHubAPI } from '../github/api';

type Follower = {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
};

export const useGetGroups = (auth: string) => {
  const [allGroups, setAllGroups] = useState({
    mutual: [] as Follower[],
    notMutual: [] as Follower[],
    notFollowed: [] as Follower[],
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
        const followers: Follower[] = await api.getFollowers();
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
            mutual: [] as Follower[],
            notMutual: [] as Follower[],
          }
        );

        const notFollowed = Array.from(followerLogins).map((login) =>
          followers.find((follower) => follower.login === login)
        );

        setAllGroups({
          mutual,
          notMutual,
          notFollowed: notFollowed as Follower[],
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
