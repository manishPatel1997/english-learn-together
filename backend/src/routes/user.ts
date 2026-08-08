import { Router, Response } from 'express';
import { z } from 'zod';
import { db, UserProgressEntity } from '../db/store';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

const SECTION_ORDER = ['section1', 'section2', 'section3', 'section4', 'section5'];
const UNLOCK_THRESHOLD_PERCENT = 80;

const RecordProgressSchema = z.object({
  sectionId: z.string(),
  examType: z.string().default('vocabulary'),
  totalQuestions: z.number().min(1),
  correctAnswers: z.number().min(0),
  xpEarned: z.number().min(0).default(0),
});

/**
 * GET /api/user/unlocked-sections
 */
router.get('/unlocked-sections', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  return res.json({
    success: true,
    unlockedSections: req.user.unlockedSections,
    nextLockedSection: SECTION_ORDER.find((s) => !req.user!.unlockedSections.includes(s)) || null,
  });
});

/**
 * GET /api/user/progress
 */
router.get('/progress', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  const history = db.getProgressByUserId(req.user.id);

  return res.json({
    success: true,
    xp: req.user.xp,
    streak: req.user.streak,
    unlockedSections: req.user.unlockedSections,
    history,
  });
});

/**
 * POST /api/user/progress
 */
router.post('/progress', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  try {
    const parseResult = RecordProgressSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ success: false, message: parseResult.error.issues[0].message });
    }

    const { sectionId, examType, totalQuestions, correctAnswers, xpEarned } = parseResult.data;
    const scorePercentage = Math.round((correctAnswers / totalQuestions) * 100);
    const passed = scorePercentage >= UNLOCK_THRESHOLD_PERCENT;

    const progressEntry: UserProgressEntity = {
      id: `prog_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId: req.user.id,
      sectionId,
      examType,
      scorePercentage,
      totalQuestions,
      correctAnswers,
      passed,
      timestamp: new Date().toISOString(),
    };

    db.addProgress(progressEntry);

    // Update User XP & streak
    const newXp = (req.user.xp || 0) + (xpEarned || correctAnswers * 10);
    let updatedUnlockedSections = [...req.user.unlockedSections];
    let newlyUnlockedSection: string | null = null;

    if (passed && req.user.role !== 'admin') {
      const currentIdx = SECTION_ORDER.indexOf(sectionId);
      if (currentIdx !== -1 && currentIdx + 1 < SECTION_ORDER.length) {
        const nextSection = SECTION_ORDER[currentIdx + 1];
        if (!updatedUnlockedSections.includes(nextSection)) {
          updatedUnlockedSections.push(nextSection);
          newlyUnlockedSection = nextSection;

          if (SECTION_ORDER.every((sec) => updatedUnlockedSections.includes(sec))) {
            if (!updatedUnlockedSections.includes('all')) {
              updatedUnlockedSections.push('all');
            }
          }
        }
      }
    }

    db.updateUser(req.user.id, {
      xp: newXp,
      unlockedSections: updatedUnlockedSections,
    });

    if (newlyUnlockedSection) {
      db.addNotification({
        userId: req.user.id,
        title: `🔓 New Module Unlocked: ${newlyUnlockedSection.toUpperCase()}!`,
        message: `Awesome job! You scored ${scorePercentage}% in ${sectionId.toUpperCase()} and unlocked ${newlyUnlockedSection.toUpperCase()}!`,
        type: 'module_unlock',
      });
    }

    return res.json({
      success: true,
      scorePercentage,
      passed,
      xpEarned: xpEarned || correctAnswers * 10,
      totalXp: newXp,
      newlyUnlockedSection,
      unlockedSections: updatedUnlockedSections,
      message: newlyUnlockedSection
        ? `🎉 Outstanding performance (${scorePercentage}%)! You unlocked ${newlyUnlockedSection.toUpperCase()}!`
        : `Progress saved! Score: ${scorePercentage}%.`,
    });
  } catch (err: any) {
    console.error('Error saving progress:', err);
    return res.status(500).json({ success: false, message: 'Failed to record progress.' });
  }
});

export default router;
