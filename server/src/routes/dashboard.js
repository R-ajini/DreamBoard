import { Router } from 'express';
import { store } from '../store/index.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);

router.get('/', async (req, res) => {
  const dashboard = await store.getDashboard(req.user.id);
  res.json({ dashboard });
});

router.get('/achievements', async (req, res) => {
  const achievements = await store.listAchievements(req.user.id);
  res.json({ achievements });
});

export default router;
