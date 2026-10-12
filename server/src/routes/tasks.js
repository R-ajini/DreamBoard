import { Router } from 'express';
import { store } from '../store/index.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);

router.get('/', async (req, res) => {
  const tasks = await store.listTasks(req.user.id, { goalId: req.query.goalId });
  res.json({ tasks });
});

router.post('/', async (req, res) => {
  const { goalId, title, description, dueDate, priority, completed } = req.body ?? {};
  if (!goalId || !title?.trim()) {
    return res.status(400).json({ error: 'goalId and title are required.' });
  }
  const task = await store.createTask(req.user.id, {
    goalId,
    title: title.trim(),
    description,
    dueDate,
    priority,
    completed,
  });
  if (!task) return res.status(400).json({ error: 'Invalid goal.' });
  res.status(201).json({ task });
});

router.patch('/:id', async (req, res) => {
  const task = await store.updateTask(req.user.id, req.params.id, req.body ?? {});
  if (!task) return res.status(404).json({ error: 'Task not found.' });
  res.json({ task });
});

router.delete('/:id', async (req, res) => {
  const ok = await store.deleteTask(req.user.id, req.params.id);
  if (!ok) return res.status(404).json({ error: 'Task not found.' });
  res.status(204).send();
});

export default router;
