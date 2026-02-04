export type DocumentMeta = {
  id: string;
  name: string;
  type: string;
};

export type StoredDocument = {
  id: string;
  name: string;
  type: string;
  blob: Blob;
};

const DB_NAME = 'signpubliq';
const STORE_NAME = 'documents';
const DB_VERSION = 1;

const openDb = () =>
  new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

export const saveDocuments = async (files: File[]): Promise<DocumentMeta[]> => {
  const db = await openDb();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const timestamp = Date.now();

    const metaList: DocumentMeta[] = files.map((file, index) => {
      const id = `doc-${timestamp}-${index}`;
      store.put({ id, name: file.name, type: file.type, blob: file } as StoredDocument);
      return { id, name: file.name, type: file.type };
    });

    transaction.oncomplete = () => resolve(metaList);
    transaction.onerror = () => reject(transaction.error);
  });
};

export const getDocuments = async (): Promise<StoredDocument[]> => {
  const db = await openDb();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result as StoredDocument[]);
    request.onerror = () => reject(request.error);
  });
};

export const clearDocuments = async (): Promise<void> => {
  const db = await openDb();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.clear();

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};
