'use client'
import { useState } from 'react'
import { useGetGroups } from './useGetGroups'
import { Group } from './group'
import styles from './groups.module.css'

export function Groups ({ auth }: { auth: string }) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { allGroups, error, isInitialLoad, reload } = useGetGroups(auth)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await reload()
    setIsRefreshing(false)
  }

  if (error) {
    return <p>Error: {error}</p>
  }

  if (isInitialLoad) {
    return <p>Loading...</p>
  }

  const { mutual, notMutual, notFollowed } = allGroups

  return (
    <>
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
      <Group 
        title="Non-Mutual Following" 
        followers={notMutual} 
        auth={auth} 
        onReload={handleRefresh} 
      />
      <Group title="Not Followed Followers" followers={notFollowed} enumerated />
      <Group title="Mutual Following" followers={mutual} enumerated />
    </>
  )
}
