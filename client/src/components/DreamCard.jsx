import { Link } from 'react-router-dom';

const PLACEHOLDER =
  'data:image/svg+xml,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="240" viewBox="0 0 400 240">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ffd6e8"/>
          <stop offset="50%" stop-color="#e4d9ff"/>
          <stop offset="100%" stop-color="#cce5ff"/>
        </linearGradient>
      </defs>
      <rect fill="url(#g)" width="400" height="240"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#7a718f" font-family="system-ui" font-size="20">✨ Dream</text>
    </svg>`,
  );

export default function DreamCard({ dream, index = 0 }) {
  return (
    <Link
      to={`/dreams/${dream.id}`}
      className="dream-card card"
      style={{ animationDelay: `${0.08 + index * 0.07}s` }}
    >
      <div className="dream-card-image">
        <img src={dream.imageUrl || PLACEHOLDER} alt="" loading="lazy" />
        <span className="pill">{dream.category}</span>
      </div>
      <div className="dream-card-body">
        <h3>{dream.title}</h3>
        <p>{dream.description || 'No description yet.'}</p>
      </div>
    </Link>
  );
}
