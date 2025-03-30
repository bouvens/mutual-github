'use client';
import styles from './page.module.css';
import { Groups } from './groups/groups';
import { useEffect, useState } from 'react';

const TOKEN_STORAGE_KEY = 'githubToken';

export default function Home() {
  const [token, setToken] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const promptForToken = () => {
    const newToken = window.prompt(
      'Please enter your GitHub token.\n' +
        "The token will be stored only in your browser's local storage and sent only to GitHub."
    );

    // If user clicked "Cancel"
    if (newToken === null) {
      return;
    }

    // If user entered an empty token
    if (!newToken.trim()) {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      setToken(null);
      return;
    }

    const trimmedToken = newToken.trim();
    localStorage.setItem(TOKEN_STORAGE_KEY, trimmedToken);
    setToken(trimmedToken);
  };

  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (storedToken?.trim()) {
      setToken(storedToken.trim());
    }
    setIsInitializing(false);
  }, []);

  if (isInitializing) {
    return null;
  }

  return (
    <main className={styles.main}>
      <Groups auth={token || ''} onTokenUpdate={promptForToken} />
    </main>
  );
}
