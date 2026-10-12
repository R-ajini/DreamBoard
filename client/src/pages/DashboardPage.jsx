import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import DreamCard from '../components/DreamCard';
import ProgressBar from '../components/ProgressBar';

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .getDashboard()
      .then((res) => setData(res.dashboard))
      .catch((e) => setError(e.message));
  }, []);

  if (error) return <p className="error">{error}</p>;
  if (!data) {
    return (
      <p className="muted loading-dots" aria-busy="true">
        Loading dashboard
        <span aria-hidden />
        <span aria-hidden />
        <span aria-hidden />
      </p>
    );
  }

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p className="muted">Overview of dreams, goals, and upcoming deadlines.</p>
        </div>
        <Link to="/vision-board" className="btn primary">
          + New dream
        </Link>
      </header>

      <section className="stat-grid">
        <div className="stat card stat-pink">
          <span className="stat-label">Dreams</span>
          <strong>{data.dreamCount}</strong>
        </div>
        <div className="stat card stat-blue">
          <span className="stat-label">Active goals</span>
          <strong>{data.activeGoalCount}</strong>
        </div>
        <div className="stat card stat-lavender">
          <span className="stat-label">Completed goals</span>
          <strong>{data.completedGoalCount}</strong>
        </div>
      </section>

      <div className="two-col">
        <section className="card section">
          <div className="section-head">
            <h2>Active goal progress</h2>
            <Link to="/progress">View all</Link>
          </div>
          {data.goalsWithProgress.length === 0 ? (
            <p className="muted">Create a dream and goal to see progress here.</p>
          ) : (
            <ul className="goal-progress-list">
              {data.goalsWithProgress.map((g) => (
                <li key={g.id}>
                  <Link to={`/goals/${g.id}`}>{g.title}</Link>
                  <ProgressBar value={g.progress} />
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="card section">
          <h2>Upcoming deadlines</h2>
          {data.upcomingDeadlines.length === 0 ? (
            <p className="muted">No task deadlines yet.</p>
          ) : (
            <ul className="deadline-list">
              {data.upcomingDeadlines.map((t) => (
                <li key={t.id}>
                  <div>
                    <strong>{t.title}</strong>
                    <span className="muted">{t.goalTitle}</span>
                  </div>
                  <time dateTime={t.dueDate}>{t.dueDate}</time>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="section">
        <div className="section-head">
          <h2>Recent dreams</h2>
          <Link to="/vision-board">Vision board</Link>
        </div>
        <div className="dream-grid">
          {data.recentDreams.length === 0 ? (
            <p className="muted">Your vision board is empty — add your first dream.</p>
          ) : (
            data.recentDreams.map((d) => <DreamCard key={d.id} dream={d} />)
          )}
        </div>
      </section>
    </div>
  );
}
