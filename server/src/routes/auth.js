import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { store } from '../store/index.js';
import { requireAuth, signToken } from '../middleware/auth.js';

const router = Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body ?? {};
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }
  const user = await store.findUserByEmail(email);
  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }
  const token = signToken(user);
  res.json({
    token,
    user: { id: user.id, email: user.email },
  });
});

router.post('/register', async (req, res) => {
  const { email, password } = req.body ?? {};
  if (!email || !password || password.length < 8) {
    return res.status(400).json({ error: 'Valid email and password (8+ chars) required.' });
  }
  const existing = await store.findUserByEmail(email);
  if (existing) {
    return res.status(409).json({ error: 'An account with this email already exists.' });
  }
  const passwordHash = bcrypt.hashSync(password, 10);
  const user = await store.createUser({ email, passwordHash });
  const token = signToken({ id: user.id, email: user.email });
  res.status(201).json({ token, user });
});

router.get('/me', requireAuth, (req, res) => {
  res.json({ user: req.user });
});

export default router;
