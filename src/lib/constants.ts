/**
 * Application-wide constants for English Learn Together.
 *
 * IMPORTANT: Change values here only with explicit product approval.
 * These values affect the XP economy for all users.
 *
 * DO NOT change the SECTION_UNLOCK_THRESHOLD without updating the backend route:
 *   backend/src/routes/user.ts (UNLOCK_THRESHOLD_PERCENT)
 * Both must remain in sync.
 */

// XP awarded per correct vocabulary answer (card exam and list exam)
export const XP_PER_VOCAB_CORRECT = 15;

// XP awarded per correct sentence translation
export const XP_PER_SENTENCE_CORRECT = 25;

// Minimum accuracy (%) required to unlock the next vocabulary section
// NOTE: This must match UNLOCK_THRESHOLD_PERCENT in backend/src/routes/user.ts
export const SECTION_UNLOCK_THRESHOLD_PCT = 80;
