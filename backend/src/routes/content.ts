import { Router, Request, Response } from 'express';
import { db } from '../db/store';

const router = Router();

/**
 * GET /api/content/vocabulary
 */
router.get('/vocabulary', (req: Request, res: Response) => {
  try {
    const sectionId = req.query.sectionId as string | undefined;
    const items = db.getVocabulary(sectionId);
    return res.json({
      success: true,
      count: items.length,
      sectionId: sectionId || 'all',
      data: items,
    });
  } catch (err: any) {
    console.error('Error fetching vocabulary:', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve vocabulary items.' });
  }
});

/**
 * GET /api/content/sentences
 */
router.get('/sentences', (req: Request, res: Response) => {
  try {
    const topic = (req.query.topic || req.query.sectionKey) as string | undefined;
    const items = db.getSentences(topic);
    return res.json({
      success: true,
      count: items.length,
      topic: topic || 'all',
      data: items,
    });
  } catch (err: any) {
    console.error('Error fetching sentences:', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve sentence items.' });
  }
});

export default router;
