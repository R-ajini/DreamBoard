import { useCallback, useEffect, useState } from 'react';
import { api } from '../api/client';
import DreamCard from '../components/DreamCard';

const CATEGORIES = ['General', 'Career', 'Travel', 'Education', 'Health', 'Personal'];

export default function VisionBoardPage() {
  const [dreams, setDreams] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [form, setForm] = useState({ title: '', description: '', category: 'General', imageUrl: '' });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    api
      .getDreams({ search: search || undefined, category: category || undefined })
      .then((res) => setDreams(res.dreams))
      .catch((e) => setError(e.message));
  }, [search, category]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleCreate(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await api.createDream({
        ...form,
        imageUrl: form.imageUrl || null,
      });
      setForm({ title: '', description: '', category: 'General', imageUrl: '' });
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>Vision Board</h1>
          <p className="muted">Visual cards for your aspirations and notes.</p>
        </div>
      </header>

      <div className="two-col align-start">
        <form className="card section stack" onSubmit={handleCreate}>
          <h2>Add a dream</h2>
          <label>
            Title
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </label>
          <label>
            Description
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </label>
          <label>
            Category
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <label>
            Image URL (optional)
            <input
              type="url"
              placeholder="https://…"
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            />
          </label>
          {error ? <p className="error">{error}</p> : null}
          <button type="submit" className="btn primary" disabled={saving}>
            {saving ? 'Saving…' : 'Create dream'}
          </button>
        </form>

        <div className="stack grow">
          <div className="filters card">
            <input
              placeholder="Search dreams…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search dreams"
            />
            <select value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Filter by category">
              <option value="">All categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="dream-grid">
            {dreams.length === 0 ? (
              <p className="muted">No dreams match your filters.</p>
            ) : (
              dreams.map((d) => <DreamCard key={d.id} dream={d} />)
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
