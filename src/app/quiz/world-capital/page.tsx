import Link from 'next/link';
import { AREAS } from '@/data/world-map-data';
import '../world-map/world-map.css';

export default function WorldCapitalTopPage() {
  return (
    <main className="world-top">
      <Link href="/" className="world-top__back" aria-label="もどる">
        ← もどる
      </Link>

      <header className="world-top__header">
        <span className="world-top__emoji">🏙️</span>
        <h1 className="world-top__title">せかいの しゅと クイズ</h1>
        <p className="world-top__desc">エリアを えらんでね</p>
      </header>

      <div className="world-top__grid">
        {AREAS.map((area, idx) => (
          <Link
            key={area.id}
            href={`/quiz/world-capital/${area.id}`}
            className="world-top__card"
            style={{ animationDelay: `${idx * 0.06}s` }}
          >
            <div
              className="world-top__card-bg"
              style={{ background: area.gradient }}
            />
            <div className="world-top__card-content">
              <span className="world-top__card-emoji">{area.emoji}</span>
              <h2 className="world-top__card-title">{area.name}</h2>
            </div>
            <div className="world-top__card-arrow">▶</div>
          </Link>
        ))}
      </div>
    </main>
  );
}
