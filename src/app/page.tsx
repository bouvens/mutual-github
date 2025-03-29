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
      'Please enter your GitHub token. You can generate one at https://github.com/settings/tokens\n\n' +
        'Required scopes: read:user, user:follow\n\n' +
        "Note: The token will be stored only in your browser's local storage and sent only to GitHub."
    );
    if (newToken?.trim()) {
      localStorage.setItem(TOKEN_STORAGE_KEY, newToken.trim());
      setToken(newToken.trim());
    } else {
      setToken('');
    }
    setIsInitializing(false);
  };

  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (storedToken?.trim()) {
      setToken(storedToken.trim());
      setIsInitializing(false);
    } else {
      promptForToken();
    }
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
