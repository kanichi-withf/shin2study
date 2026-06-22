'use client';

import { Suspense, useState, useCallback, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import JapanMap from '@/components/JapanMap';
import TimeBar from '@/components/TimeBar';
import ChoiceButtons from '@/components/ChoiceButtons';
import QuizResult from '@/components/QuizResult';
import { useAuth } from '@/components/AuthProvider';
import type { AttemptQuestion } from '@/lib/quiz-store';
import { PREFECTURES, PrefectureData } from '@/data/japan-map-data';
import '../japan-map/japan-map-quiz.css';

type GamePhase = 'ready' | 'playing' | 'feedback' | 'result';

interface QuizState {
  currentQuestion: number;
  score: number;
  currentPrefecture: PrefectureData | null;
  choices: string[];
  phase: GamePhase;
  selectedAnswer: string | null;
  answeredCodes: string[];
  usedCodes: string[];
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

function formatCapital(p: PrefectureData): string {
  // 4さいでもよめるよう、ひらがなを先頭に置き、漢字を括弧でそえる。
  return `${p.capitalKana}（${p.capital}）`;
}

function pickChoices(correct: PrefectureData, all: PrefectureData[]): string[] {
  const wrong: string[] = [];
  for (const p of shuffle(all.filter((p) => p.code !== correct.code))) {
    if (wrong.length >= 3) break;
    wrong.push(formatCapital(p));
  }
  return shuffle([formatCapital(correct), ...wrong]);
}

function makePlayingState(): QuizState {
  const target = PREFECTURES[Math.floor(Math.random() * PREFECTURES.length)];
  return {
    currentQuestion: 1,
    score: 0,
    currentPrefecture: target,
    choices: pickChoices(target, PREFECTURES),
    phase: 'playing',
    selectedAnswer: null,
    answeredCodes: [],
    usedCodes: [target.code],
    answers: [],
  };
}

const READY_STATE: QuizState = {
  currentQuestion: 0,
  score: 0,
  currentPrefecture: null,
  choices: [],
  phase: 'ready',
  selectedAnswer: null,
  answeredCodes: [],
  usedCodes: [],
  answers: [],
};

export default function JapanCapitalQuizPage() {
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
    Number.isFinite(qFromUrl) && qFromUrl > 0 ? qFromUrl : 47,
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
        const pref = prev.currentPrefecture;
        const entry: AttemptQuestion | null = pref
          ? { code: pref.code, name: pref.capital, selected: answer, isCorrect }
          : null;
        return {
          ...prev,
          phase: 'feedback',
          selectedAnswer: answer,
          score: isCorrect ? prev.score + 1 : prev.score,
          answeredCodes: pref
            ? [...prev.answeredCodes, pref.code]
            : prev.answeredCodes,
          usedCodes: pref ? [...prev.usedCodes, pref.code] : prev.usedCodes,
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
      const available = PREFECTURES.filter(
        (p) => !prev.usedCodes.includes(p.code),
      );
      if (available.length === 0) return { ...prev, phase: 'result' };
      const target = available[Math.floor(Math.random() * available.length)];
      return {
        ...prev,
        currentQuestion: next,
        currentPrefecture: target,
        choices: pickChoices(target, PREFECTURES),
        phase: 'playing',
        selectedAnswer: null,
        usedCodes: [...prev.usedCodes, target.code],
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
          quizId: 'japan-capital',
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
            <span className="qstart__emoji">🏛️</span>
            <h1 className="qstart__title">けんちょうしょざいち クイズ</h1>
            <p className="qstart__desc">
              ひかっている けんの けんちょうしょざいちは どこ？
            </p>

            <label className="qstart__label">
              もんだいすう
              <select
                className="qstart__select"
                name="q"
                value={totalQuestions}
                onChange={(e) => setTotalQuestions(Number(e.target.value))}
              >
                <option value={10}>10もん</option>
                <option value={47}>47もん (ぜんぶ)</option>
              </select>
            </label>

            <label className="qstart__label">
              じかん
              <select
                className="qstart__select"
                name="t"
                value={timeLimit}
                onChange={(e) => setTimeLimit(Number(e.target.value))}
              >
                <option value={0}>むげん (じかんなし)</option>
                <option value={15}>15びょう (かんたん)</option>
                <option value={10}>10びょう (ふつう)</option>
                <option value={5}>5びょう (むずかしい)</option>
              </select>
            </label>

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
          <p className="quiz-question__text">この けんの しょざいちは？</p>
          <div className="quiz-map">
            <JapanMap
              highlightedCode={state.currentPrefecture?.code ?? null}
              answeredCodes={state.answeredCodes}
            />
          </div>
        </section>

        <section className="quiz-section quiz-section--answer">
          <div className="quiz-choices-container">
            <ChoiceButtons
              choices={state.choices}
              correctAnswer={
                state.currentPrefecture ? formatCapital(state.currentPrefecture) : ''
              }
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
          state.currentPrefecture &&
          (() => {
            const isCorrect =
              state.selectedAnswer === formatCapital(state.currentPrefecture);
            const isTimeout = state.selectedAnswer === 'timeout';
            const isLast = state.currentQuestion >= totalQuestions;
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
                    {p.name} の しょざいちは<br />
                    <span className="quiz-modal__answer-name">
                      {p.capitalKana}（{p.capital}）
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
