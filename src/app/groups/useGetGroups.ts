import { useCallback, useEffect, useState } from "react"
import { GitHubAPI } from "../github/api"

const PER_PAGE_DEFAULT = 100

type Follower = {
  login:               string;
  id:                  number;
  node_id:             string;
  avatar_url:          string;
  gravatar_id:         string;
  url:                 string;
  html_url:            string;
  followers_url:       string;
  following_url:       string;
  gists_url:           string;
  starred_url:         string;
  subscriptions_url:   string;
  organizations_url:   string;
  repos_url:           string;
  events_url:          string;
  received_events_url: string;
  type:                string;
  site_admin:          boolean;
}

export const useGetGroups = (auth: string) => {
  const [allGroups, setAllGroups] = useState({
    mutual: [],
    notMutual: [],
    notFollowed: [],
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const getGroups = useCallback(async function () {
    setIsLoading(true)
    setError(null)
    
    try {
      const api = new GitHubAPI(auth)
      const followers: Follower[] = await api.getFollowers()
      const followerLogins = new Set<string>(followers.map(follower => follower.login))
      const following = await api.getFollowing()

      const { mutual, notMutual } = following.reduce(({ mutual, notMutual }, currentFollowing) => {
        if (followerLogins.has(currentFollowing.login)) {
          mutual.push(currentFollowing)
          followerLogins.delete(currentFollowing.login)
        } else {
          notMutual.push(currentFollowing)
        }
        return {
          mutual,
          notMutual,
        }
      }, {
        mutual: [],
        notMutual: [],
      })

      const notFollowed = Array.from(followerLogins).map(login => followers.find((follower) => follower.login === login))

      setAllGroups({
        mutual,
        notMutual,
        notFollowed,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data')
    } finally {
      setIsLoading(false)
    }
  }, [auth])

  useEffect(() => {
    getGroups()
  }, [getGroups])

  return {
    allGroups,
    error,
    isLoading,
    reload: getGroups,
  }
}