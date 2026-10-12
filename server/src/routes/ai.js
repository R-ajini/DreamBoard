import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);

/** Placeholder until an external model API is configured (Week 7). */
router.post('/suggest-tasks', (req, res) => {
  const { goalTitle, description } = req.body ?? {};
  if (!goalTitle?.trim()) {
    return res.status(400).json({ error: 'goalTitle is required.' });
  }
  const context = (description || goalTitle).toLowerCase();
  const suggestions = buildSuggestions(context, goalTitle.trim());
  res.json({
    suggestions,
    disclaimer:
      'These are starter suggestions. Review, edit, and set your own deadlines before saving.',
  });
});

function buildSuggestions(context, title) {
  if (context.includes('travel') || context.includes('trip')) {
    return [
      { title: 'Research destinations and budget', milestone: 'Planning' },
      { title: 'Set a target travel date and savings plan', milestone: 'Planning' },
      { title: 'Book transport and accommodation', milestone: 'Booking' },
      { title: 'Prepare documents and packing list', milestone: 'Preparation' },
    ];
  }
  if (context.includes('software') || context.includes('developer') || context.includes('portfolio')) {
    return [
      { title: 'Review React and Node fundamentals', milestone: 'Learning' },
      { title: 'Design a PostgreSQL schema for a sample app', milestone: 'Design' },
      { title: 'Build and test a small full-stack project', milestone: 'Build' },
      { title: 'Document the project for your portfolio', milestone: 'Portfolio' },
    ];
  }
  return [
    { title: `Define success criteria for “${title}”`, milestone: 'Clarity' },
    { title: 'Break the goal into 3–5 weekly milestones', milestone: 'Planning' },
    { title: 'Schedule the first actionable step this week', milestone: 'Action' },
    { title: 'Review progress and adjust the plan', milestone: 'Review' },
  ];
}

export default router;
