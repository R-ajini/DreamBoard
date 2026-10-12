import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../api/client';

export default function AIPlannerPage() {
  const [searchParams] = useSearchParams();
  const preselectedGoal = searchParams.get('goalId');

  const [goals, setGoals] = useState([]);
  const [goalId, setGoalId] = useState(preselectedGoal || '');
  const [goalTitle, setGoalTitle] = useState('');
  const [description, setDescription] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [disclaimer, setDisclaimer] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.getGoals().then((res) => setGoals(res.goals));
  }, []);

  useEffect(() => {
    if (!goalId) return;
    const g = goals.find((x) => x.id === goalId);
    if (g) setGoalTitle(g.title);
  }, [goalId, goals]);

  async function generate(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.suggestTasks({ goalTitle: goalTitle || 'My goal', description });
      setSuggestions(res.suggestions);
      setDisclaimer(res.disclaimer);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function saveApproved() {
    if (!goalId) {
      setError('Select a goal to save tasks into.');
      return;
    }
    setLoading(true);
    try {
      for (const s of suggestions) {
        if (!s.title?.trim()) continue;
        await api.createTask({ goalId, title: s.title.trim(), description: s.milestone || '' });
      }
      setSuggestions([]);
      setError('');
      alert('Tasks saved to your goal planner.');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function updateSuggestion(index, field, value) {
    setSuggestions((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
  }

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>AI planner</h1>
          <p className="muted">Review and edit suggested tasks before saving (placeholder AI until Week 7).</p>
        </div>
      </header>

      <form className="card section stack" onSubmit={generate}>
        <label>
          Link to existing goal (optional)
          <select value={goalId} onChange={(e) => setGoalId(e.target.value)}>
            <option value="">— Custom aspiration —</option>
            {goals.map((g) => (
              <option key={g.id} value={g.id}>
                {g.title}
              </option>
            ))}
          </select>
        </label>
        <label>
          Goal title
          <input value={goalTitle} onChange={(e) => setGoalTitle(e.target.value)} required />
        </label>
        <label>
          Context / description
          <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>
        {error ? <p className="error">{error}</p> : null}
        <button type="submit" className="btn primary" disabled={loading}>
          {loading ? 'Generating…' : 'Generate suggestions'}
        </button>
      </form>

      {suggestions.length > 0 ? (
        <section className="card section stack">
          <p className="muted">{disclaimer}</p>
          <ul className="suggestion-list">
            {suggestions.map((s, i) => (
              <li key={i}>
                <input value={s.title} onChange={(e) => updateSuggestion(i, 'title', e.target.value)} />
                <input
                  placeholder="Milestone"
                  value={s.milestone || ''}
                  onChange={(e) => updateSuggestion(i, 'milestone', e.target.value)}
                />
              </li>
            ))}
          </ul>
          <button type="button" className="btn primary" onClick={saveApproved} disabled={loading || !goalId}>
            Save approved tasks to goal
          </button>
        </section>
      ) : null}
    </div>
  );
}
