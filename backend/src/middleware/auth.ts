import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db, UserEntity } from '../db/store';

export interface AuthenticatedRequest extends Request {
  user?: UserEntity;
}

// JWT_SECRET must be set via environment variable. No hardcoded fallback.
// The server.ts startup check enforces this in production.
const JWT_SECRET = process.env.JWT_SECRET || '';

export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Authentication required. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
    const user = db.findUserById(decoded.userId);

    if (!user) {
      return res.status(403).json({ success: false, message: 'Invalid or expired authentication token.' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ success: false, message: 'Invalid or expired token.' });
  }
}

export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Access denied. Admin role required.' });
  }
  next();
}

export function generateToken(user: UserEntity): string {
  return jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '30d' }
  );
}
