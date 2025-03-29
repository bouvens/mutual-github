'use client'
import { useGetGroups } from './useGetGroups'
import { Group } from './group'

export function Groups ({ auth }: { auth: string }) {
  const { allGroups, error, isLoading, reload } = useGetGroups(auth)
  if (error) {
    return <p>Error: {error}</p>
  }
  

  if (isLoading) {
    return <p>Loading...</p>
  }

  const { mutual, notMutual, notFollowed } = allGroups

  return (
    <>
      <button onClick={reload}>Refresh</button>
      <Group title="Non-Mutual Following" followers={notMutual} auth={auth} onReload={reload} />
      <Group title="Not Followed Followers" followers={notFollowed} enumerated />
      <Group title="Mutual Following" followers={mutual} enumerated />
    </>
  )
}
