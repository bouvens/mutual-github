import { Inter } from 'next/font/google';
import { Analytics } from '../components/analytics';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
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
