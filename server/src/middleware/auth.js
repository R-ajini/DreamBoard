import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import { store } from '../store/index.js';

export function signToken(user) {
  return jwt.sign({ sub: user.id, email: user.email }, config.jwtSecret, {
    expiresIn: '7d',
  });
}

export async function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required.' });
  }
  try {
    const payload = jwt.verify(header.slice(7), config.jwtSecret);
    const user = await store.findUserById(payload.sub);
    if (!user) {
      return res.status(401).json({ error: 'Invalid session.' });
    }
    req.user = { id: user.id, email: user.email };
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
}
