import { useEffect, useState } from 'react';
import { api } from '../api/client';

export default function TimelinePage() {
  const [achievements, setAchievements] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .getAchievements()
      .then((res) => setAchievements(res.achievements))
      .catch((e) => setError(e.message));
  }, []);

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>Achievement timeline</h1>
          <p className="muted">Completed goals in chronological order.</p>
        </div>
      </header>
      {error ? <p className="error">{error}</p> : null}
      <ol className="timeline">
        {achievements.length === 0 ? (
          <li className="muted">Complete a goal to see it here.</li>
        ) : (
          achievements.map((a) => (
            <li key={a.id} className="timeline-item card">
              <time dateTime={a.completedAt}>{new Date(a.completedAt).toLocaleDateString()}</time>
              <h3>{a.title}</h3>
            </li>
          ))
        )}
      </ol>
    </div>
  );
}
