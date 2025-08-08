'use client';
import { useEffect, useState } from 'react';
import { Groups } from '@/components/groups/groups';

const TOKEN_STORAGE_KEY = 'githubToken';

export default function Home() {
  const [token, setToken] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const promptForToken = () => {
    const newToken = window.prompt(
      'Please enter your GitHub token.\n' +
        "The token will be stored only in your browser's local storage and sent only to GitHub."
    );

    // if user clicked "Cancel"
    if (newToken === null) {
      return;
    }

    const trimmedToken = newToken.trim();
    if (trimmedToken) {
      localStorage.setItem(TOKEN_STORAGE_KEY, trimmedToken);
      setToken(trimmedToken);
    }
  };

  const clearToken = () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken(null);
    return;
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
    <main>
      <Groups
        auth={token || ''}
        onTokenUpdate={promptForToken}
        onClearToken={clearToken}
      />
    </main>
  );
}
