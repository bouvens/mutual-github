export const metadata = {
  title: 'Mutual Github',
  description:
    'Check out and count your mutual and not mutual followers on GitHub.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
