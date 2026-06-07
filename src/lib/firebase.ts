'use client';

import { initializeFirebase } from '@/firebase';
import { Firestore } from 'firebase/firestore';
import { Auth } from 'firebase/auth';
import { FirebaseApp } from 'firebase/app';

// Use lazy getters to avoid initialization issues during SSR or before config is ready
let memoized: { app: FirebaseApp | null; firestore: Firestore | null; auth: Auth | null } | null = null;

function getInstances() {
  if (!memoized) {
    memoized = initializeFirebase();
  }
  return memoized;
}

export const getFirestoreInstance = () => getInstances().firestore;
export const getAuthInstance = () => getInstances().auth;
export const getAppInstance = () => getInstances().app;

// Re-export for compatibility with existing imports, but these will be null on server
const { firestore, auth, app } = initializeFirebase();
export { firestore, auth, app };
