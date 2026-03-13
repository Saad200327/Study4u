import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Study4u — Upload. Learn. Master.',
  description: 'Turn your notes into an interactive AI-powered study workspace.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-apple-bg text-apple-dark antialiased">
        {children}
      </body>
    </html>
  );
}
