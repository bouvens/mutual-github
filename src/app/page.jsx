import styles from './page.module.css';
import { Groups } from './groups/groups';

const auth = process.env.GITHUB_TOKEN;

export const metadata = {
  title: 'Mutual Github',
  description:
    'Check out and count your mutual and not mutual followers on GitHub.',
};

export default function Home() {
  return (
    <main className={styles.main}>
      <Groups auth={auth} />
    </main>
  );
}
