import { Inter } from 'next/font/google';
import { Analytics } from '../components/analytics';
import styles from './layout.module.css';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Mutual GitHub',
  description: 'Explore and update your GitHub connections',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <p className={styles.navigation}>
          {/* Using regular <a> tag because this is not an internal Next.js navigation */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/" title="JavaScript Experiments">
            ← To all experiments
          </a>
        </p>
        {children}
        <a href="https://github.com/bouvens/mutual-github">
          <img
            style={{ position: 'absolute', top: 0, right: 0, border: '0' }}
            src="https://bouvens.github.io/images/github-forkme-ribbon-right.svg"
            alt="Fork me on GitHub"
          />
        </a>
        <Analytics />
      </body>
    </html>
  );
}
