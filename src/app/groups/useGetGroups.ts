import { Octokit } from "octokit"
import { useCallback, useEffect, useState } from "react"

const PER_PAGE_DEFAULT = 100

export const useGetGroups = (auth: string) => {
  const [allGroups, setAllGroups] = useState({
    mutual: [],
    notMutual: [],
    followerLogins: new Set<string>(),
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
    const followers = await octokit.paginate('GET /user/followers', {
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

    setAllGroups({
      mutual,
      notMutual,
      followerLogins,
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