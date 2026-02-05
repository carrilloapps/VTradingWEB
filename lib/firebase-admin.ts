import { logger } from './logger';
import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  } catch (error) {
    logger.error('Firebase Admin initialization error', error);
  }
}

export const adminAuth = admin.auth();
export const adminMessaging = admin.messaging();
export const adminDb = admin.firestore();
