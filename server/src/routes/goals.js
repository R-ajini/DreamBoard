import { Router } from 'express';
import { store } from '../store/index.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);

router.get('/', async (req, res) => {
  const goals = await store.listGoals(req.user.id, {
    dreamId: req.query.dreamId,
    status: req.query.status,
  });
  res.json({ goals });
});

router.get('/:id', async (req, res) => {
  const goal = await store.getGoal(req.user.id, req.params.id);
  if (!goal) return res.status(404).json({ error: 'Goal not found.' });
  const tasks = await store.listTasks(req.user.id, { goalId: goal.id });
  const dream = await store.getDream(req.user.id, goal.dreamId);
  res.json({ goal, tasks, dream });
});

router.post('/', async (req, res) => {
  const { dreamId, title, description, priority, targetDate, status } = req.body ?? {};
  if (!dreamId || !title?.trim()) {
    return res.status(400).json({ error: 'dreamId and title are required.' });
  }
  const dream = await store.getDream(req.user.id, dreamId);
  if (!dream) return res.status(400).json({ error: 'Invalid dream.' });
  const goal = await store.createGoal(req.user.id, {
    dreamId,
    title: title.trim(),
    description,
    priority,
    targetDate,
    status,
  });
  res.status(201).json({ goal });
});

router.patch('/:id', async (req, res) => {
  const goal = await store.updateGoal(req.user.id, req.params.id, req.body ?? {});
  if (!goal) return res.status(404).json({ error: 'Goal not found.' });
  res.json({ goal });
});

router.delete('/:id', async (req, res) => {
  const ok = await store.deleteGoal(req.user.id, req.params.id);
  if (!ok) return res.status(404).json({ error: 'Goal not found.' });
  res.status(204).send();
});

export default router;
