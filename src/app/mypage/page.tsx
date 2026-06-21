'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import type { AttemptRecord, QuizStats } from '@/lib/quiz-store';
import './mypage.css';

interface MistakeEntry {
  code: string;
  name: string;
  correct: number;
  wrong: number;
  total: number;
  wrongRate: number;
}

function buildMistakeRanking(stats: QuizStats | null): MistakeEntry[] {
  if (!stats) return [];
  const items: MistakeEntry[] = Object.entries(stats.perItem).map(
    ([code, v]) => {
      const correct = v.correct ?? 0;
      const wrong = v.wrong ?? 0;
      const total = correct + wrong;
      return {
        code,
        name: v.name ?? code,
        correct,
        wrong,
        total,
        wrongRate: total === 0 ? 0 : wrong / total,
      };
    },
  );
  return items
    .filter((i) => i.wrong > 0)
    .sort((a, b) => {
      if (b.wrong !== a.wrong) return b.wrong - a.wrong;
      return b.wrongRate - a.wrongRate;
    })
    .slice(0, 10);
}

function formatDate(ts: AttemptRecord['createdAt']): string {
  if (!ts) return '';
  const d = ts.toDate();
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(
    d.getDate(),
  ).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(
    d.getMinutes(),
  ).padStart(2, '0')}`;
}

export default function MyPage() {
  const { user, loading: authLoading, signInWithGoogle } = useAuth();
  const [stats, setStats] = useState<QuizStats | null>(null);
  const [attempts, setAttempts] = useState<AttemptRecord[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    import('@/lib/quiz-store')
      .then(({ getQuizStats, listRecentAttempts }) =>
        Promise.all([
          getQuizStats(user.uid, 'japan-map'),
          listRecentAttempts(user.uid, 10),
        ]),
      )
      .then(([s, a]) => {
        if (cancelled) return;
        setStats(s);
        setAttempts(a);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        if (!cancelled) setDataLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  if (authLoading) {
    return (
      <main className="mypage">
        <p className="mypage__loading">よみこみちゅう…</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="mypage">
        <Link href="/" className="mypage__back">← ホームへ</Link>
        <div className="mypage__signin-card">
          <span className="mypage__signin-emoji">🔐</span>
          <h1 className="mypage__signin-title">マイページ</h1>
          <p className="mypage__signin-desc">
            せいせきを みるには ログインしてね
          </p>
          <button
            type="button"
            className="mypage__signin-btn"
            onClick={() => signInWithGoogle().catch(console.error)}
          >
            Google で ログイン
          </button>
        </div>
      </main>
    );
  }

  const ranking = buildMistakeRanking(stats);

  return (
    <main className="mypage">
      <Link href="/" className="mypage__back">← ホームへ</Link>

      <header className="mypage__header">
        <h1 className="mypage__title">📊 マイページ</h1>
        <p className="mypage__welcome">
          {user.displayName ?? user.email} さんの きろく
        </p>
      </header>

      {dataLoading && (
        <p className="mypage__loading">きろくを よみこんでいます…</p>
      )}

      <section className="mypage__section">
        <h2 className="mypage__section-title">🗾 にほんちず クイズ</h2>
        {stats && stats.totalAttempts > 0 ? (
          <div className="mypage__stats-grid">
            <div className="mypage__stat-card">
              <div className="mypage__stat-label">ちょうせんかいすう</div>
              <div className="mypage__stat-value">{stats.totalAttempts} かい</div>
            </div>
            <div className="mypage__stat-card mypage__stat-card--best">
              <div className="mypage__stat-label">ベストスコア</div>
              <div className="mypage__stat-value">
                {stats.bestScore} / {stats.bestTotal}
              </div>
            </div>
            <div className="mypage__stat-card">
              <div className="mypage__stat-label">さいきんのスコア</div>
              <div className="mypage__stat-value">
                {stats.lastScore} / {stats.lastTotal}
              </div>
            </div>
          </div>
        ) : (
          <p className="mypage__empty">
            まだ きろくが ないよ。さいしょの ちょうせんを はじめよう！
          </p>
        )}
      </section>

      {ranking.length > 0 && (
        <section className="mypage__section">
          <h2 className="mypage__section-title">😢 よく まちがえる けん</h2>
          <ol className="mypage__ranking">
            {ranking.map((item, idx) => (
              <li key={item.code} className="mypage__ranking-item">
                <span className="mypage__ranking-rank">{idx + 1}</span>
                <span className="mypage__ranking-name">{item.name}</span>
                <span className="mypage__ranking-meta">
                  まちがい {item.wrong} / {item.total} かい
                  <span className="mypage__ranking-rate">
                    ({Math.round(item.wrongRate * 100)}%)
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </section>
      )}

      <section className="mypage__section">
        <h2 className="mypage__section-title">🕒 さいきんの ちょうせん</h2>
        {attempts.length > 0 ? (
          <ul className="mypage__attempts">
            {attempts.map((a) => (
              <li key={a.id} className="mypage__attempt">
                <span className="mypage__attempt-date">
                  {formatDate(a.createdAt)}
                </span>
                <span className="mypage__attempt-score">
                  {a.score} / {a.total}
                </span>
                <span className="mypage__attempt-meta">
                  {a.timeLimit === 0 ? 'むげん' : `${a.timeLimit}びょう`}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mypage__empty">まだ ちょうせんが ないよ</p>
        )}
      </section>

      <div className="mypage__cta">
        <Link href="/quiz/japan-map" className="mypage__cta-btn">
          🚀 クイズに ちょうせん！
        </Link>
      </div>
    </main>
  );
}
