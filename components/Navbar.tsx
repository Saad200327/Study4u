import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="w-full px-6 py-4 flex items-center justify-between backdrop-blur-md bg-white/80 border-b border-gray-100 sticky top-0 z-50">
      <Link href="/" className="text-xl font-bold tracking-tight text-apple-dark hover:text-apple-blue transition-colors">
        Study4u
      </Link>
      <div className="flex gap-6 text-sm font-medium text-apple-gray">
        <Link href="/" className="hover:text-apple-dark transition-colors">Home</Link>
        <a href="https://github.com/Saad200327/Study4u" target="_blank" rel="noreferrer" className="hover:text-apple-dark transition-colors">GitHub</a>
      </div>
    </nav>
  );
}
