'use client'
import styles from './page.module.css'
import { useGetGroups } from './groups/useGetGroups'
import Loading from './loading'

export function Groups ({ auth }: { auth: string }) {
  const { allGroups, error, isLoading, reload } = useGetGroups(auth)
  if (error) {
    return <p>Error: {error}</p>
  }
  

  if (isLoading) {
    return <p>Loading...</p>
  }

  const { mutual, notMutual, followerLogins } = allGroups

  // TODO extract a group component
  return (
    <>
      <button onClick={reload}>Refresh</button>
      <h2>
        Non-Mutual Following ({notMutual.length})
      </h2>
      <div className={styles.cards}>
        {notMutual.map(follower => <p key={follower.login} className={styles.userCard}>
          <a href={`https://github.com/${follower.login}`}><img
            width={64}
            src={follower.avatar_url}
            alt={`${follower.login} avatar`}
          /> <span>{follower.login}</span>
          </a></p>)}
      </div>

      <h2>
        Not Followed Followers ({followerLogins.size})
      </h2>
      <p className={styles.enumerated}>{Array.from(followerLogins).map(login => <span key={login}><a
        href={`https://github.com/${login}`}
      >{login}</a></span>)}</p>

      <h2>
        Mutual Following ({mutual.length})
      </h2>
      <p className={styles.enumerated}>{mutual.map(follower => <span key={follower.login}><a
        href={`https://github.com/${follower.login}`}
      >{follower.login}</a></span>)}</p>
    </>
  )
}
