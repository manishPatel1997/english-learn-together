import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { db, UserEntity } from '../db/store';
import { authenticateToken, generateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// Validation Schemas
const RegisterSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long.'),
  email: z.string().email('Invalid email address format.'),
  password: z.string().min(6, 'Password must be at least 6 characters long.'),
});

const LoginSchema = z.object({
  email: z.string().email('Invalid email address format.'),
  password: z.string().min(1, 'Password is required.'),
});

const ALL_DEFAULT_ADMIN_SECTIONS = [
  'section1',
  'section2',
  'section3',
  'section4',
  'section5',
  'all',
  'who_section',
  'what_section',
  'where_section',
  'whose_section',
  'how_many_much_section',
  'which_section',
  'sentence_all',
];

// Helper to sanitize user object
function sanitizeUser(user: UserEntity) {
  const { passwordHash, ...safeUser } = user;
  return safeUser;
}

/**
 * POST /api/auth/register
 */
router.post('/register', async (req: Request, res: Response) => {
  try {
    const parseResult = RegisterSchema.safeParse(req.body);
    if (!parseResult.success) {
      const errorMsg = parseResult.error.issues.map((e) => e.message).join(' ');
      return res.status(400).json({ success: false, message: errorMsg });
    }

    const { name, email, password } = parseResult.data;
    const existingUser = db.findUserByEmail(email);

    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const allUsers = db.getUsers();
    const isFirstUser = allUsers.length === 0;

    // Admin bootstrap: prefer explicit ADMIN_EMAIL env var over first-user heuristic.
    // In production, set ADMIN_EMAIL=you@example.com in your environment.
    const adminEmail = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
    const isAdminByEmail = adminEmail !== '' && email.toLowerCase() === adminEmail;
    const isAdminByFirstUser = isFirstUser && adminEmail === '';

    if (isFirstUser && adminEmail === '') {
      console.warn('[SECURITY] ADMIN_EMAIL is not set. First registered user will become admin. Set ADMIN_EMAIL in production.');
    }

    const role = (isAdminByEmail || isAdminByFirstUser) ? 'admin' : 'user';

    const newUser: UserEntity = {
      id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      email,
      passwordHash,
      name,
      role,
      unlockedSections: role === 'admin' 
        ? ALL_DEFAULT_ADMIN_SECTIONS 
        : ['section1', 'who_section'],
      xp: 0,
      streak: 0,
      createdAt: new Date().toISOString(),
    };

    db.addUser(newUser);
    const token = generateToken(newUser);

    return res.status(201).json({
      success: true,
      message: 'User registered successfully!',
      token,
      user: sanitizeUser(newUser),
    });
  } catch (err: any) {
    console.error('Registration error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error during registration.' });
  }
});

/**
 * POST /api/auth/login
 */
router.post('/login', async (req: Request, res: Response) => {
  try {
    const parseResult = LoginSchema.safeParse(req.body);
    if (!parseResult.success) {
      const errorMsg = parseResult.error.issues.map((e) => e.message).join(' ');
      return res.status(400).json({ success: false, message: errorMsg });
    }

    const { email, password } = parseResult.data;
    const user = db.findUserByEmail(email);

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = generateToken(user);

    return res.json({
      success: true,
      message: 'Login successful!',
      token,
      user: sanitizeUser(user),
    });
  } catch (err: any) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error during login.' });
  }
});

/**
 * GET /api/auth/me
 */
router.get('/me', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Not authenticated.' });
  }

  return res.json({
    success: true,
    user: sanitizeUser(req.user),
  });
});

export default router;
