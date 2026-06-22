'use client';

import { Suspense, useState, useCallback, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import TimeBar from '@/components/TimeBar';
import ChoiceButtons from '@/components/ChoiceButtons';
import QuizResult from '@/components/QuizResult';
import QuizStartOptions from '@/components/QuizStartOptions';
import { useAuth } from '@/components/AuthProvider';
import type { AttemptQuestion } from '@/lib/quiz-store';
import { PREFECTURES, type PrefectureData } from '@/data/japan-map-data';
import { SPECIALTIES, type SpecialtyData } from '@/data/japan-specialty-data';
import '../japan-map/japan-map-quiz.css';

type GamePhase = 'ready' | 'playing' | 'feedback' | 'result';

interface QuizState {
  currentQuestion: number;
  score: number;
  currentSpecialty: SpecialtyData | null;
  currentPrefecture: PrefectureData | null;
  choices: string[];
  phase: GamePhase;
  selectedAnswer: string | null;
  usedSpecialtyIds: string[];
  answers: AttemptQuestion[];
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function findPrefByCode(code: string): PrefectureData | null {
  return PREFECTURES.find((p) => p.code === code) ?? null;
}

function pickChoices(correct: PrefectureData): string[] {
  const wrong: string[] = [];
  for (const p of shuffle(PREFECTURES.filter((p) => p.code !== correct.code))) {
    if (wrong.length >= 3) break;
    wrong.push(p.name);
  }
  return shuffle([correct.name, ...wrong]);
}

function makePlayingState(): QuizState {
  const target = SPECIALTIES[Math.floor(Math.random() * SPECIALTIES.length)];
  const pref = findPrefByCode(target.prefCode);
  return {
    currentQuestion: 1,
    score: 0,
    currentSpecialty: target,
    currentPrefecture: pref,
    choices: pref ? pickChoices(pref) : [],
    phase: 'playing',
    selectedAnswer: null,
    usedSpecialtyIds: [target.id],
    answers: [],
  };
}

const READY_STATE: QuizState = {
  currentQuestion: 0,
  score: 0,
  currentSpecialty: null,
  currentPrefecture: null,
  choices: [],
  phase: 'ready',
  selectedAnswer: null,
  usedSpecialtyIds: [],
  answers: [],
};

const MAX_Q = SPECIALTIES.length;

export default function JapanSpecialtyQuizPage() {
  return (
    <Suspense fallback={null}>
      <Inner />
    </Suspense>
  );
}

function Inner() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const playFromUrl = searchParams?.get('play') === '1';
  const qFromUrl = Number(searchParams?.get('q'));
  const tFromUrlRaw = searchParams?.get('t');
  const tFromUrl =
    tFromUrlRaw === null || tFromUrlRaw === undefined ? NaN : Number(tFromUrlRaw);

  const [state, setState] = useState<QuizState>(READY_STATE);
  const [timeLimit, setTimeLimit] = useState(
    Number.isFinite(tFromUrl) ? tFromUrl : 0,
  );
  const [totalQuestions, setTotalQuestions] = useState(
    Number.isFinite(qFromUrl) && qFromUrl > 0 ? Math.min(qFromUrl, MAX_Q) : 10,
  );
  const [timerKey, setTimerKey] = useState(0);
  const savedAttemptRef = useRef<string | null>(null);
  const urlPlayConsumedRef = useRef(false);

  const startGame = useCallback(() => {
    savedAttemptRef.current = null;
    setState(makePlayingState());
    setTimerKey((p) => p + 1);
  }, []);

  const handleAnswer = useCallback(
    (answer: string, isCorrect: boolean) => {
      if (state.phase !== 'playing') return;
      setState((prev) => {
        const sp = prev.currentSpecialty;
        const pref = prev.currentPrefecture;
        const entry: AttemptQuestion | null =
          sp && pref
            ? { code: sp.id, name: sp.name, selected: answer, isCorrect }
            : null;
        return {
          ...prev,
          phase: 'feedback',
          selectedAnswer: answer,
          score: isCorrect ? prev.score + 1 : prev.score,
          answers: entry ? [...prev.answers, entry] : prev.answers,
        };
      });
    },
    [state.phase],
  );

  const goToNextQuestion = useCallback(() => {
    setState((prev) => {
      const next = prev.currentQuestion + 1;
      if (next > totalQuestions) return { ...prev, phase: 'result' };
      const available = SPECIALTIES.filter(
        (s) => !prev.usedSpecialtyIds.includes(s.id),
      );
      if (available.length === 0) return { ...prev, phase: 'result' };
      const target = available[Math.floor(Math.random() * available.length)];
      const pref = findPrefByCode(target.prefCode);
      return {
        ...prev,
        currentQuestion: next,
        currentSpecialty: target,
        currentPrefecture: pref,
        choices: pref ? pickChoices(pref) : [],
        phase: 'playing',
        selectedAnswer: null,
        usedSpecialtyIds: [...prev.usedSpecialtyIds, target.id],
      };
    });
    setTimerKey((p) => p + 1);
  }, [totalQuestions]);

  const handleTimeUp = useCallback(() => {
    if (state.phase !== 'playing') return;
    handleAnswer('timeout', false);
  }, [state.phase, handleAnswer]);

  useEffect(() => {
    if (!playFromUrl) return;
    if (urlPlayConsumedRef.current) return;
    urlPlayConsumedRef.current = true;
    setState(makePlayingState());
    setTimerKey((k) => k + 1);
  }, [playFromUrl]);

  useEffect(() => {
    if (state.phase !== 'result') return;
    if (!user) return;
    if (savedAttemptRef.current === 'pending' || savedAttemptRef.current) return;
    savedAttemptRef.current = 'pending';
    import('@/lib/quiz-store')
      .then(({ saveQuizAttempt }) =>
        saveQuizAttempt(user.uid, {
          quizId: 'japan-specialty',
          score: state.score,
          total: totalQuestions,
          timeLimit,
          questions: state.answers,
        }),
      )
      .then((id) => {
        savedAttemptRef.current = id;
      })
      .catch((err) => {
        console.error('failed to save quiz attempt', err);
        savedAttemptRef.current = null;
      });
  }, [state.phase, state.score, state.answers, user, totalQuestions, timeLimit]);

  const handleRetry = useCallback(() => startGame(), [startGame]);

  if (state.phase === 'ready') {
    const qOptions = Array.from(
      new Set([5, 10, 20, MAX_Q].filter((n) => n > 0 && n <= MAX_Q)),
    ).sort((a, b) => a - b);

    return (
      <main className="quiz-page">
        <form
          className="qstart"
          method="GET"
          action=""
          onSubmit={(e) => {
            try {
              e.preventDefault();
              startGame();
            } catch {}
          }}
        >
          <input type="hidden" name="play" value="1" />

          <Link href="/" className="qstart__back" aria-label="もどる">
            ← もどる
          </Link>

          <div className="qstart__card">
            <span className="qstart__emoji">🍎</span>
            <h1 className="qstart__title">めいさんひん クイズ</h1>
            <p className="qstart__desc">
              この めいさんひんが いちばん おおいのは どこの けん？
            </p>

            <QuizStartOptions
              label="もんだいすう"
              name="q"
              value={totalQuestions}
              onChange={setTotalQuestions}
              options={qOptions.map((n) => ({
                value: n,
                label: n === MAX_Q ? `${n}もん\n(ぜんぶ)` : `${n}もん`,
              }))}
            />

            <QuizStartOptions
              label="じかん"
              name="t"
              value={timeLimit}
              onChange={setTimeLimit}
              options={[
                { value: 0, label: 'むげん\n(じかんなし)' },
                { value: 15, label: '15びょう\n(かんたん)' },
                { value: 10, label: '10びょう\n(ふつう)' },
                { value: 5, label: '5びょう\n(むずかしい)' },
              ]}
            />

            <button type="submit" className="qstart__submit" id="start-quiz-btn">
              🚀 スタート！
            </button>
          </div>
        </form>
      </main>
    );
  }

  if (state.phase === 'result') {
    return (
      <main className="quiz-page">
        <QuizResult
          score={state.score}
          total={totalQuestions}
          onRetry={handleRetry}
        />
      </main>
    );
  }

  return (
    <main className="quiz-page">
      <div className="quiz-layout">
        <div className="quiz-header">
          <Link href="/" className="quiz-back-btn-small" aria-label="もどる">
            ←
          </Link>
          <div className="quiz-progress">
            <span className="quiz-progress__current">{state.currentQuestion}</span>
            <span className="quiz-progress__divider">/</span>
            <span className="quiz-progress__total">{totalQuestions}</span>
          </div>
          <div className="quiz-score">⭐ {state.score}</div>
        </div>

        <section className="quiz-section quiz-section--question">
          <div className="quiz-timer">
            <TimeBar
              key={timerKey}
              duration={timeLimit}
              isRunning={state.phase === 'playing'}
              onTimeUp={handleTimeUp}
            />
          </div>
          <p className="quiz-question__text">
            この めいさんひんが いちばん おおいのは？
          </p>
          {state.currentSpecialty && (
            <div className="specialty-card">
              <span className="specialty-card__emoji" aria-hidden>
                {state.currentSpecialty.emoji}
              </span>
              <span className="specialty-card__name">
                {state.currentSpecialty.name}
              </span>
            </div>
          )}
        </section>

        <section className="quiz-section quiz-section--answer">
          <div className="quiz-choices-container">
            <ChoiceButtons
              choices={state.choices}
              correctAnswer={state.currentPrefecture?.name ?? ''}
              onAnswer={handleAnswer}
              disabled={state.phase !== 'playing'}
              showResult={
                state.phase === 'feedback'
                  ? state.selectedAnswer ?? 'timeout'
                  : null
              }
            />
          </div>
        </section>

        {state.phase === 'feedback' &&
          state.currentSpecialty &&
          state.currentPrefecture &&
          (() => {
            const isCorrect =
              state.selectedAnswer === state.currentPrefecture.name;
            const isTimeout = state.selectedAnswer === 'timeout';
            const isLast = state.currentQuestion >= totalQuestions;
            const sp = state.currentSpecialty;
            const p = state.currentPrefecture;
            return (
              <div
                className="quiz-modal-backdrop"
                onClick={goToNextQuestion}
                role="dialog"
                aria-modal="true"
                aria-label="けっか"
              >
                <div
                  className={`quiz-modal ${isCorrect ? 'quiz-modal--correct' : 'quiz-modal--wrong'}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="quiz-modal__icon">
                    {isCorrect ? '🎉' : isTimeout ? '⏰' : '😢'}
                  </div>
                  <div className="quiz-modal__title">
                    {isCorrect ? 'せいかい！' : isTimeout ? 'じかんぎれ…' : 'ざんねん…'}
                  </div>
                  <div className="quiz-modal__answer">
                    {sp.emoji} {sp.name} が いちばん おおいのは<br />
                    <span className="quiz-modal__answer-name">
                      {p.kana}（{p.name}）
                    </span>
                  </div>
                  <button
                    type="button"
                    className="quiz-modal__btn"
                    onClick={goToNextQuestion}
                  >
                    {isLast ? '🏁 けっかをみる' : 'つぎのもんだいへ ➔'}
                  </button>
                </div>
              </div>
            );
          })()}
      </div>
    </main>
  );
}
