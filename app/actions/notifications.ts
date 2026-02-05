'use server';

/* eslint-disable @typescript-eslint/no-explicit-any */

import { adminMessaging } from '@/lib/firebase-admin';
import { logger } from '@/lib/logger';

/**
 * Subscribes a registration token to a topic.
 *
 * @param token The registration token to subscribe.
 * @param topic The topic to subscribe to.
 */
export async function subscribeToTopicAction(token: string, topic: string) {
  if (!token || !topic) {
    return { success: false, error: 'Token and topic are required' };
  }

  try {
    await adminMessaging.subscribeToTopic(token, topic);
    return { success: true };
  } catch (error: any) {
    logger.error('Error subscribing to topic', error, { topic });
    return { success: false, error: error.message };
  }
}

/**
 * Unsubscribes a registration token from a topic.
 *
 * @param token The registration token to unsubscribe.
 * @param topic The topic to unsubscribe from.
 */
export async function unsubscribeFromTopicAction(token: string, topic: string) {
  if (!token || !topic) {
    return { success: false, error: 'Token and topic are required' };
  }

  try {
    await adminMessaging.unsubscribeFromTopic(token, topic);
    return { success: true };
  } catch (error: any) {
    logger.error('Error unsubscribing from topic', error, { topic });
    return { success: false, error: error.message };
  }
}
