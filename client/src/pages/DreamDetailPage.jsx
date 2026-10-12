import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../api/client';

export default function DreamDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dream, setDream] = useState(null);
  const [goals, setGoals] = useState([]);
  const [goalForm, setGoalForm] = useState({ title: '', targetDate: '', priority: 'medium' });
  const [error, setError] = useState('');

  function load() {
    api
      .getDream(id)
      .then((res) => {
        setDream(res.dream);
        setGoals(res.goals);
      })
      .catch((e) => setError(e.message));
  }

  useEffect(() => {
    load();
  }, [id]);

  async function addGoal(e) {
    e.preventDefault();
    try {
      await api.createGoal({ dreamId: id, ...goalForm, targetDate: goalForm.targetDate || null });
      setGoalForm({ title: '', targetDate: '', priority: 'medium' });
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function removeDream() {
    if (!confirm('Delete this dream and its goals?')) return;
    await api.deleteDream(id);
    navigate('/vision-board');
  }

  if (error) return <p className="error">{error}</p>;
  if (!dream) return <p className="muted">Loading…</p>;

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <Link to="/vision-board" className="back-link">
            ← Vision board
          </Link>
          <h1>{dream.title}</h1>
          <p className="muted">{dream.description}</p>
        </div>
        <button type="button" className="btn danger" onClick={removeDream}>
          Delete dream
        </button>
      </header>

      <section className="card section stack">
        <h2>Goals for this dream</h2>
        <form className="inline-form" onSubmit={addGoal}>
          <input
            placeholder="Goal title"
            value={goalForm.title}
            onChange={(e) => setGoalForm({ ...goalForm, title: e.target.value })}
            required
          />
          <input
            type="date"
            value={goalForm.targetDate}
            onChange={(e) => setGoalForm({ ...goalForm, targetDate: e.target.value })}
          />
          <select value={goalForm.priority} onChange={(e) => setGoalForm({ ...goalForm, priority: e.target.value })}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <button type="submit" className="btn primary">
            Add goal
          </button>
        </form>
        <ul className="link-list">
          {goals.length === 0 ? (
            <li className="muted">No goals yet.</li>
          ) : (
            goals.map((g) => (
              <li key={g.id}>
                <Link to={`/goals/${g.id}`}>
                  {g.title}
                  {g.targetDate ? ` · due ${g.targetDate}` : ''}
                </Link>
                <span className="pill subtle">{g.status}</span>
              </li>
            ))
          )}
        </ul>
      </section>
    </div>
  );
}
