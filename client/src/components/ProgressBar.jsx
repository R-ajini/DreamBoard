export default function ProgressBar({ value, label }) {
  const pct = Math.min(100, Math.max(0, value ?? 0));
  return (
    <div className="progress-wrap">
      {label ? (
        <div className="progress-label">
          <span>{label}</span>
          <span>{pct}%</span>
        </div>
      ) : null}
      <div className="progress-track" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
