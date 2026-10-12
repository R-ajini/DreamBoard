import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import ProgressBar from '../components/ProgressBar';

export default function ProgressPage() {
  const [goals, setGoals] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getGoals()
      .then(async (res) => {
        const withProgress = await Promise.all(
          res.goals.map(async (g) => {
            const detail = await api.getGoal(g.id);
            const total = detail.tasks.length;
            const done = detail.tasks.filter((t) => t.completed).length;
            return { ...g, progress: total ? Math.round((done / total) * 100) : 0, taskTotal: total };
          }),
        );
        setGoals(withProgress);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (error) return <p className="error">{error}</p>;
  if (loading) return <p className="muted">Loading progress…</p>;

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>Progress</h1>
          <p className="muted">Track completion across all goals.</p>
        </div>
      </header>
      <div className="stack gap">
        {goals.length === 0 ? (
          <p className="muted">No goals yet.</p>
        ) : (
          goals.map((g) => (
            <div key={g.id} className="card section">
              <div className="section-head">
                <Link to={`/goals/${g.id}`}>
                  <h2>{g.title}</h2>
                </Link>
                <span className="pill subtle">{g.status}</span>
              </div>
              <ProgressBar value={g.progress} label={`${g.taskTotal} tasks`} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
