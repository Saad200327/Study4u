'use client';

import { useRef, useState, DragEvent, ChangeEvent } from 'react';

interface Props {
  onUpload: (files: FileList) => void;
  uploading: boolean;
}

export default function UploadArea({ onUpload, uploading }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files.length) {
      setSelectedFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) setSelectedFiles(Array.from(e.target.files));
  };

  const handleSubmit = () => {
    if (selectedFiles.length === 0) return;
    const dt = new DataTransfer();
    selectedFiles.forEach((f) => dt.items.add(f));
    onUpload(dt.files);
  };

  return (
    <div className="card">
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-200
          ${ dragging ? 'border-apple-blue bg-blue-50 scale-105' : 'border-gray-300 hover:border-apple-blue hover:bg-blue-50' }`}
      >
        <div className="text-4xl mb-3">📂</div>
        <p className="text-apple-dark font-semibold text-lg">Drop your files here or click to upload</p>
        <p className="text-apple-gray text-sm mt-1">Supports PDF, TXT, MD — up to 20 MB each</p>
        <p className="text-apple-gray text-xs mt-1 opacity-70">Note: Image files (PNG/JPG) are not supported — convert to PDF or TXT first</p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".pdf,.txt,.md"
          className="hidden"
          onChange={handleChange}
        />
      </div>

      {selectedFiles.length > 0 && (
        <div className="mt-4 space-y-2 animate-fade-in">
          {selectedFiles.map((f) => (
            <div key={f.name} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-2 text-sm">
              <span className="font-medium truncate text-apple-dark">{f.name}</span>
              <span className="text-apple-gray ml-4 shrink-0">{(f.size / 1024).toFixed(1)} KB</span>
            </div>
          ))}
          <button
            onClick={handleSubmit}
            disabled={uploading}
            className="btn-primary w-full mt-4 flex items-center justify-center gap-2"
          >
            {uploading ? <><span className="spinner h-5 w-5" /> Processing...</> : 'Generate Study Materials →'}
          </button>
        </div>
      )}
    </div>
  );
}
