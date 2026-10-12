import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api/client';
import ProgressBar from '../components/ProgressBar';

export default function GoalPlannerPage() {
  const { id } = useParams();
  const [goal, setGoal] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [dream, setDream] = useState(null);
  const [taskForm, setTaskForm] = useState({ title: '', dueDate: '', priority: 'medium' });
  const [error, setError] = useState('');

  function load() {
    api
      .getGoal(id)
      .then((res) => {
        setGoal(res.goal);
        setTasks(res.tasks);
        setDream(res.dream);
      })
      .catch((e) => setError(e.message));
  }

  useEffect(() => {
    load();
  }, [id]);

  const done = tasks.filter((t) => t.completed).length;
  const progress = tasks.length ? Math.round((done / tasks.length) * 100) : 0;

  async function addTask(e) {
    e.preventDefault();
    await api.createTask({ goalId: id, ...taskForm, dueDate: taskForm.dueDate || null });
    setTaskForm({ title: '', dueDate: '', priority: 'medium' });
    load();
  }

  async function toggleTask(task) {
    await api.updateTask(task.id, { completed: !task.completed });
    load();
  }

  async function markGoalComplete() {
    await api.updateGoal(id, { status: 'completed' });
    load();
  }

  if (error) return <p className="error">{error}</p>;
  if (!goal) return <p className="muted">Loading…</p>;

  return (
    <div className="page">
      <header className="page-header">
        <div>
          {dream ? (
            <Link to={`/dreams/${dream.id}`} className="back-link">
              ← {dream.title}
            </Link>
          ) : null}
          <h1>{goal.title}</h1>
          <p className="muted">{goal.description}</p>
        </div>
        <div className="row gap">
          <Link to={`/ai-planner?goalId=${id}`} className="btn">
            AI suggest tasks
          </Link>
          {goal.status !== 'completed' ? (
            <button type="button" className="btn primary" onClick={markGoalComplete}>
              Mark completed
            </button>
          ) : (
            <span className="pill">Completed</span>
          )}
        </div>
      </header>

      <section className="card section">
        <ProgressBar value={progress} label="Goal progress" />
      </section>

      <section className="card section stack">
        <h2>Tasks</h2>
        <form className="inline-form wrap" onSubmit={addTask}>
          <input
            placeholder="Task title"
            value={taskForm.title}
            onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
            required
          />
          <input type="date" value={taskForm.dueDate} onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })} />
          <button type="submit" className="btn primary">
            Add task
          </button>
        </form>
        <ul className="task-list">
          {tasks.map((t) => (
            <li key={t.id} className={t.completed ? 'done' : ''}>
              <label>
                <input type="checkbox" checked={t.completed} onChange={() => toggleTask(t)} />
                <span>{t.title}</span>
              </label>
              {t.dueDate ? <time dateTime={t.dueDate}>{t.dueDate}</time> : null}
              <button type="button" className="link-btn danger-text" onClick={() => api.deleteTask(t.id).then(load)}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
