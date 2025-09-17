// Root layout for Next.js App Router
import './globals.css';

export const metadata = {
  title: 'AI Chat App',
  description: 'Chat application built with Next.js',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-base-100">{children}</body>
    </html>
  );
}
