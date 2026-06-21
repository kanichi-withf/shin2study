'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import type { AttemptRecord, QuizId, QuizStats } from '@/lib/quiz-store';
import './mypage.css';

interface MistakeEntry {
  code: string;
  name: string;
  correct: number;
  wrong: number;
  total: number;
  wrongRate: number;
}

const QUIZZES: Array<{ id: QuizId; emoji: string; title: string; href: string }> = [
  { id: 'japan-map', emoji: '🗾', title: 'にほんちず クイズ', href: '/quiz/japan-map' },
  { id: 'japan-shape', emoji: '🧩', title: 'けんのかたち クイズ', href: '/quiz/japan-shape' },
];

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

function quizLabel(id: QuizId): string {
  switch (id) {
    case 'japan-map':
      return '🗾 にほんちず';
    case 'japan-shape':
      return '🧩 けんのかたち';
    default:
      return id;
  }
}

export default function MyPage() {
  const { user, loading: authLoading, signInWithGoogle } = useAuth();
  const [statsByQuiz, setStatsByQuiz] = useState<Record<string, QuizStats | null>>({});
  const [attempts, setAttempts] = useState<AttemptRecord[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    import('@/lib/quiz-store')
      .then(({ getQuizStats, listRecentAttempts }) =>
        Promise.all([
          ...QUIZZES.map((q) =>
            getQuizStats(user.uid, q.id).then((s) => [q.id, s] as const),
          ),
          listRecentAttempts(user.uid, 10),
        ]),
      )
      .then((results) => {
        if (cancelled) return;
        const statsResults = results.slice(0, QUIZZES.length) as Array<
          readonly [QuizId, QuizStats | null]
        >;
        const recent = results[QUIZZES.length] as AttemptRecord[];
        const map: Record<string, QuizStats | null> = {};
        for (const [id, s] of statsResults) map[id] = s;
        setStatsByQuiz(map);
        setAttempts(recent);
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

      {QUIZZES.map((quiz) => {
        const stats = statsByQuiz[quiz.id] ?? null;
        const ranking = buildMistakeRanking(stats);
        return (
          <div key={quiz.id}>
            <section className="mypage__section">
              <h2 className="mypage__section-title">
                {quiz.emoji} {quiz.title}
              </h2>
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
                  まだ きろくが ないよ。<Link href={quiz.href}>はじめて みよう！</Link>
                </p>
              )}
            </section>

            {ranking.length > 0 && (
              <section className="mypage__section">
                <h2 className="mypage__section-title">
                  😢 よく まちがえる けん ({quiz.emoji})
                </h2>
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
          </div>
        );
      })}

      <section className="mypage__section">
        <h2 className="mypage__section-title">🕒 さいきんの ちょうせん</h2>
        {attempts.length > 0 ? (
          <ul className="mypage__attempts">
            {attempts.map((a) => (
              <li key={a.id} className="mypage__attempt">
                <span className="mypage__attempt-date">
                  {formatDate(a.createdAt)}
                </span>
                <span className="mypage__attempt-quiz">
                  {quizLabel(a.quizId)}
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
        <Link href="/" className="mypage__cta-btn">
          🚀 クイズを えらぶ
        </Link>
      </div>
    </main>
  );
}
