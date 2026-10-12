import { useState } from 'react';
import { api } from '../api/client';

export default function SettingsPage() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function exportData() {
    setBusy(true);
    setError('');
    try {
      const data = await api.exportData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dreamboard-export-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setMessage('Export downloaded.');
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  async function deleteData() {
    if (!confirm('Delete all dreams, goals, and tasks? This cannot be undone.')) return;
    setBusy(true);
    try {
      await api.deleteAllData();
      setMessage('All personal records were deleted.');
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>Settings</h1>
          <p className="muted">Export or remove your personal data.</p>
        </div>
      </header>
      <section className="card section stack">
        <button type="button" className="btn" onClick={exportData} disabled={busy}>
          Export JSON
        </button>
        <button type="button" className="btn danger" onClick={deleteData} disabled={busy}>
          Delete all data
        </button>
        {message ? <p className="success">{message}</p> : null}
        {error ? <p className="error">{error}</p> : null}
      </section>
    </div>
  );
}
