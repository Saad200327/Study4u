'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import UploadArea from '@/components/UploadArea';

export default function HomePage() {
  const router = useRouter();
  const uploadRef = useRef<HTMLDivElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleUpload = async (files: FileList) => {
    setUploading(true);
    setError('');
    try {
      const formData = new FormData();
      Array.from(files).forEach((f) => formData.append('files', f));

      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Upload failed.');
      router.push(`/workspace?doc=${data.documentId}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
      setUploading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <section className="flex-1 flex flex-col items-center justify-center px-4 py-20 animate-fade-in">
        <div className="max-w-2xl w-full text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-apple-dark mb-4 leading-tight">
            Upload. Learn. Master.
          </h1>
          <p className="text-xl text-apple-gray leading-relaxed">
            Turn your notes, PDFs, and images into an interactive study workspace — powered entirely by your own materials.
          </p>
          <button
            className="btn-primary mt-8 text-lg"
            onClick={() => uploadRef.current?.scrollIntoView({ behavior: 'smooth' })}
          >
            Get Started
          </button>
        </div>

        <div ref={uploadRef} className="max-w-2xl w-full">
          <UploadArea onUpload={handleUpload} uploading={uploading} />
          {error && (
            <p className="mt-4 text-center text-red-500 font-medium animate-fade-in">{error}</p>
          )}
        </div>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl w-full text-center">
          {['📄 Summaries', '🃏 Flashcards', '✏️ Practice Q&A', '🧠 Quiz Mode'].map((f) => (
            <div key={f} className="card text-sm font-medium text-apple-gray hover:shadow-xl">{f}</div>
          ))}
        </div>
      </section>

      <footer className="text-center py-6 text-sm text-apple-gray">
        Study4u © {new Date().getFullYear()} — Built for students, by a student.
      </footer>
    </main>
  );
}
