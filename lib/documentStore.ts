export interface StoredDoc {
  text: string;
  filenameList: string[];
  createdAt: number;
}

// In-memory store — resets on server restart.
// Upgrade to Redis/Supabase for production.
const store = new Map<string, StoredDoc>();

export function setDoc(id: string, doc: StoredDoc): void {
  store.set(id, doc);
}

export function getDoc(id: string): StoredDoc | undefined {
  return store.get(id);
}

export function deleteDoc(id: string): void {
  store.delete(id);
}
