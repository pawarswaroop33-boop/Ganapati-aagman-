import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  getDocFromServer,
  type Unsubscribe,
} from 'firebase/firestore';
import { InvitationDetails } from '../types';
import rawConfig from '../../firebase-applet-config.json';

// Support both embedded firebase-applet-config.json AND Vercel/Vite environment variables
const env = (import.meta as unknown as { env?: Record<string, string | undefined> })?.env || {};

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || rawConfig.apiKey,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || rawConfig.authDomain,
  projectId: env.VITE_FIREBASE_PROJECT_ID || rawConfig.projectId,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || rawConfig.storageBucket,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || rawConfig.messagingSenderId,
  appId: env.VITE_FIREBASE_APP_ID || rawConfig.appId,
  firestoreDatabaseId:
    env.VITE_FIREBASE_DATABASE_ID ||
    rawConfig.firestoreDatabaseId ||
    'ai-studio-ganapatiaagman-a6b91e9b-bf18-48ac-a2fa-c8f397de0078',
};

// Initialize Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore targeting the specific provisioned database
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || '(default)');

// Local storage cache keys for instant offline-first rendering
const getCacheKey = (invitationId: string) => `ganapati_invitation_cache_${invitationId}`;

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(errInfo.error);
}

/**
 * Deep sanitization for Firestore:
 * Strips all `undefined` values and converts empty optional objects
 * so Firestore setDoc will NEVER crash with:
 * "Unsupported field value: undefined"
 */
export function sanitizeForFirestore<T>(data: T): T {
  if (data === undefined) {
    return null as unknown as T;
  }
  if (data === null || typeof data !== 'object') {
    return data;
  }
  if (Array.isArray(data)) {
    return data.map((item) => sanitizeForFirestore(item)) as unknown as T;
  }
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(data as Record<string, any>)) {
    if (value !== undefined) {
      result[key] = sanitizeForFirestore(value);
    }
  }
  return result as T;
}

// Validate connection on boot as required by Firebase skill
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('✅ Firestore connection verified successfully.');
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase running in offline-ready state.');
    }
    return false;
  }
}

// Immediately trigger non-blocking connection verification
testFirestoreConnection();

/**
 * Real-time subscription to an invitation by ID (e.g. 'main' or unique invite link)
 * Uses instant local storage cache first, then syncs with Firestore in real-time.
 */
export function subscribeToInvitation(
  invitationId: string,
  onUpdate: (data: InvitationDetails | null) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  // 1. Instant cache retrieval for lightning-fast, zero-flicker render
  try {
    const cached = localStorage.getItem(getCacheKey(invitationId));
    if (cached) {
      const parsed = JSON.parse(cached) as InvitationDetails;
      onUpdate(parsed);
    }
  } catch (e) {
    console.warn('Local cache read note:', e);
  }

  // 2. Real-time Firestore document sync
  const invDocRef = doc(db, 'invitations', invitationId);

  return onSnapshot(
    invDocRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const remoteData = snapshot.data() as InvitationDetails;
        try {
          localStorage.setItem(getCacheKey(invitationId), JSON.stringify(remoteData));
        } catch {}
        onUpdate(remoteData);
      } else {
        onUpdate(null);
      }
    },
    (err) => {
      console.warn('Firestore subscription fallback:', err);
      try {
        const cached = localStorage.getItem(getCacheKey(invitationId));
        if (cached) {
          onUpdate(JSON.parse(cached) as InvitationDetails);
        }
      } catch {}
      if (onError) onError(err);
    }
  );
}

/**
 * Fetch invitation once
 */
export async function getInvitationOnce(invitationId: string): Promise<InvitationDetails | null> {
  const path = `invitations/${invitationId}`;
  try {
    const invDocRef = doc(db, 'invitations', invitationId);
    const snap = await getDoc(invDocRef);
    if (snap.exists()) {
      const data = snap.data() as InvitationDetails;
      try {
        localStorage.setItem(getCacheKey(invitationId), JSON.stringify(data));
      } catch {}
      return data;
    }
    // Fallback to cache if exists
    const cached = localStorage.getItem(getCacheKey(invitationId));
    if (cached) return JSON.parse(cached);
    return null;
  } catch (err) {
    console.warn('Error fetching invitation from Firestore:', err);
    try {
      const cached = localStorage.getItem(getCacheKey(invitationId));
      if (cached) return JSON.parse(cached);
    } catch {}
    handleFirestoreError(err, OperationType.GET, path);
    return null;
  }
}

/**
 * Save invitation to Firestore persistently so images and changes remain across all devices
 */
export async function saveInvitation(
  invitationId: string,
  data: InvitationDetails
): Promise<void> {
  const path = `invitations/${invitationId}`;
  const payload = {
    ...data,
    updatedAt: new Date().toISOString(),
  };

  // Deep sanitize to prevent any `undefined` values from failing setDoc
  const sanitized = sanitizeForFirestore(payload);

  try {
    // 1. Persist directly to cloud Firestore first
    const invDocRef = doc(db, 'invitations', invitationId);
    await setDoc(invDocRef, sanitized, { merge: true });

    // 2. Only after cloud save succeeds, update local storage cache
    try {
      localStorage.setItem(getCacheKey(invitationId), JSON.stringify(sanitized));
    } catch (e) {
      console.warn('Local storage write warning:', e);
    }
    console.log(`✅ [Firebase Cloud Sync] Successfully saved invitation "${invitationId}" to Firestore.`);
  } catch (err) {
    console.error(`❌ [Firebase Cloud Sync] Failed to save invitation "${invitationId}":`, err);
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

/**
 * Compresses an uploaded image file into an optimized base64 Data URL (WebP/JPEG)
 * Keeps image quality crisp while ensuring lightweight document size for Firestore
 */
export async function compressImageFile(
  file: File,
  maxDimension = 1000,
  quality = 0.82
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('कृपया योग्य फोटो निवडा (Please upload a valid image file)'));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('फोटो वाचण्यात अडचण आली (Failed to read file)'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('फोटो लोड होऊ शकला नाही (Failed to load image)'));
      img.onload = () => {
        let { width, height } = img;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(reader.result as string);
          return;
        }

        // Draw image onto canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Try WebP first for optimal compression; fallback to JPEG
        let dataUrl = canvas.toDataURL('image/webp', quality);
        if (!dataUrl.startsWith('data:image/webp')) {
          dataUrl = canvas.toDataURL('image/jpeg', quality);
        }

        resolve(dataUrl);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}
