import { Router, Response } from 'express';
import { db } from '../db/store';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

/**
 * GET /api/notifications
 * Returns unread notifications for logged-in user
 */
router.get('/', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  try {
    const notifications = db.getNotificationsForUser(req.user.id);
    return res.json({
      success: true,
      count: notifications.length,
      notifications,
    });
  } catch (err: any) {
    console.error('Error fetching notifications:', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve notifications.' });
  }
});

/**
 * PUT /api/notifications/read-all
 * Mark all notifications as read for logged-in user
 */
router.put('/read-all', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  try {
    db.markAllNotificationsAsRead(req.user.id);
    return res.json({ success: true, message: 'All notifications marked as read.' });
  } catch (err: any) {
    console.error('Error marking all notifications as read:', err);
    return res.status(500).json({ success: false, message: 'Failed to mark all notifications as read.' });
  }
});

/**
 * PUT /api/notifications/:id/read
 * Mark a single notification as read
 */
router.put('/:id/read', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  try {
    const { id } = req.params;
    const success = db.markNotificationAsRead(req.user.id, id);
    if (!success) {
      return res.status(404).json({ success: false, message: 'Notification not found.' });
    }
    return res.json({ success: true, message: 'Notification marked as read.' });
  } catch (err: any) {
    console.error('Error marking notification as read:', err);
    return res.status(500).json({ success: false, message: 'Failed to mark notification as read.' });
  }
});

export default router;
