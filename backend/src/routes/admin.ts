import { Router, Response } from 'express';
import { z } from 'zod';
import { db } from '../db/store';
import { authenticateToken, requireAdmin, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

const AdminUnlockSchema = z.object({
  targetUserId: z.string(),
  unlockedSections: z.array(z.string()),
});

/**
 * GET /api/admin/users
 */
router.get('/users', authenticateToken, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  try {
    const users = db.getUsers().map((user) => {
      const { passwordHash, ...safeUser } = user;
      const history = db.getProgressByUserId(user.id);
      const passedCount = history.filter((h) => h.passed).length;
      const totalExams = history.length;
      const avgScore = totalExams > 0 
        ? Math.round(history.reduce((sum, h) => sum + h.scorePercentage, 0) / totalExams) 
        : 0;

      return {
        ...safeUser,
        stats: {
          totalExams,
          passedCount,
          avgScore,
        },
      };
    });

    return res.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (err: any) {
    console.error('Admin users fetch error:', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve users list.' });
  }
});

/**
 * POST /api/admin/unlock-section
 */
router.post('/unlock-section', authenticateToken, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  try {
    const parseResult = AdminUnlockSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ success: false, message: parseResult.error.issues[0].message });
    }

    const { targetUserId, unlockedSections } = parseResult.data;
    const targetUser = db.findUserById(targetUserId);

    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'Target user not found.' });
    }

    const updated = db.updateUser(targetUserId, { unlockedSections });

    // Trigger persistent notification for target user
    const sectionLabels = unlockedSections.map((s) => s.toUpperCase()).join(', ');
    db.addNotification({
      userId: targetUserId,
      title: '🎉 Module Access Granted by Admin!',
      message: `An administrator updated your module permissions. Unlocked sections: ${sectionLabels}.`,
      type: 'module_unlock',
    });

    return res.json({
      success: true,
      message: `Updated unlocked sections for ${targetUser.email}`,
      user: updated,
    });
  } catch (err: any) {
    console.error('Admin section unlock error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update user section permissions.' });
  }
});

export default router;
