import { Router } from 'express';
import { store } from '../store/index.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);

router.get('/export', async (req, res) => {
  const data = await store.exportUserData(req.user.id);
  res.json(data);
});

router.delete('/data', async (req, res) => {
  await store.deleteAllUserData(req.user.id);
  res.status(204).send();
});

export default router;
