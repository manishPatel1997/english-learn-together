import { Router, Response } from 'express';
import { z } from 'zod';
import { db } from '../db/store';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

const UpdateSettingsSchema = z.object({
  dailyGoal: z.number().optional(),
  autoAdvanceMs: z.number().optional(),
  soundEnabled: z.boolean().optional(),
  theme: z.enum(['light', 'dark', 'system']).optional(),
  geminiKey: z.string().optional(),
});

/**
 * GET /api/settings
 */
router.get('/', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  const settings = db.getSettings(req.user.id);
  return res.json({
    success: true,
    settings,
  });
});

/**
 * POST /api/settings
 */
router.post('/', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  try {
    const parseResult = UpdateSettingsSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ success: false, message: parseResult.error.issues[0].message });
    }

    const updated = db.saveSettings(req.user.id, parseResult.data);
    return res.json({
      success: true,
      message: 'Settings updated successfully.',
      settings: updated,
    });
  } catch (err: any) {
    console.error('Error saving settings:', err);
    return res.status(500).json({ success: false, message: 'Failed to update settings.' });
  }
});

export default router;
