import { Router } from 'express';
import { store } from '../store/index.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);

router.get('/', async (req, res) => {
  const dreams = await store.listDreams(req.user.id, {
    search: req.query.search,
    category: req.query.category,
    status: req.query.status,
  });
  res.json({ dreams });
});

router.get('/:id', async (req, res) => {
  const dream = await store.getDream(req.user.id, req.params.id);
  if (!dream) return res.status(404).json({ error: 'Dream not found.' });
  const goals = await store.listGoals(req.user.id, { dreamId: dream.id });
  res.json({ dream, goals });
});

router.post('/', async (req, res) => {
  const { title, description, category, imageUrl, status } = req.body ?? {};
  if (!title?.trim()) {
    return res.status(400).json({ error: 'Title is required.' });
  }
  const dream = await store.createDream(req.user.id, {
    title: title.trim(),
    description,
    category,
    imageUrl,
    status,
  });
  res.status(201).json({ dream });
});

router.patch('/:id', async (req, res) => {
  const dream = await store.updateDream(req.user.id, req.params.id, req.body ?? {});
  if (!dream) return res.status(404).json({ error: 'Dream not found.' });
  res.json({ dream });
});

router.delete('/:id', async (req, res) => {
  const ok = await store.deleteDream(req.user.id, req.params.id);
  if (!ok) return res.status(404).json({ error: 'Dream not found.' });
  res.status(204).send();
});

export default router;
