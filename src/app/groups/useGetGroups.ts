import { Octokit } from "octokit"
import { useCallback, useEffect, useState } from "react"

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
    const octokit = new Octokit({
      auth,
    })
    // https://docs.github.com/en/rest/users/followers
    const followers: Follower[] = await octokit.paginate('GET /user/followers', {
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
      },
      per_page: PER_PAGE_DEFAULT,
    })
    const followerLogins = new Set<string>(followers.map(follower => follower.login))
    // https://docs.github.com/en/rest/using-the-rest-api/using-pagination-in-the-rest-api
    const following = await octokit.paginate('GET /user/following', {
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
      },
      per_page: PER_PAGE_DEFAULT,
    })
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
    setIsLoading(false)
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