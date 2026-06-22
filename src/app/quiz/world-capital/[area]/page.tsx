'use client';

import { Suspense, useState, useCallback, useEffect, useRef, use } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import WorldMapArea from '@/components/WorldMapArea';
import TimeBar from '@/components/TimeBar';
import ChoiceButtons from '@/components/ChoiceButtons';
import QuizResult from '@/components/QuizResult';
import QuizStartOptions from '@/components/QuizStartOptions';
import { useAuth } from '@/components/AuthProvider';
import type { AttemptQuestion, QuizId } from '@/lib/quiz-store';
import {
  AREAS,
  getCountriesInArea,
  type AreaId,
  type CountryData,
} from '@/data/world-map-data';
import '../../japan-map/japan-map-quiz.css';

type GamePhase = 'ready' | 'playing' | 'feedback' | 'result';

interface QuizState {
  currentQuestion: number;
  score: number;
  currentCountry: CountryData | null;
  choices: string[];
  phase: GamePhase;
  selectedAnswer: string | null;
  answeredCodes: string[];
  usedCodes: string[];
  answers: AttemptQuestion[];
}

const READY_STATE: QuizState = {
  currentQuestion: 0,
  score: 0,
  currentCountry: null,
  choices: [],
  phase: 'ready',
  selectedAnswer: null,
  answeredCodes: [],
  usedCodes: [],
  answers: [],
};

function shuffle<T>(a: T[]): T[] {
  const r = [...a];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
}

function pickChoices(correct: CountryData, pool: CountryData[]): string[] {
  const wrong: string[] = [];
  for (const c of shuffle(pool.filter((c) => c.code !== correct.code))) {
    if (wrong.length >= 3) break;
    wrong.push(c.capital);
  }
  return shuffle([correct.capital, ...wrong]);
}

function makePlaying(area: AreaId): QuizState {
  const pool = getCountriesInArea(area);
  const target = pool[Math.floor(Math.random() * pool.length)];
  return {
    currentQuestion: 1,
    score: 0,
    currentCountry: target,
    choices: pickChoices(target, pool),
    phase: 'playing',
    selectedAnswer: null,
    answeredCodes: [],
    usedCodes: [target.code],
    answers: [],
  };
}

function areaIdToQuizId(area: AreaId): QuizId {
  return `world-capital-${area}` as QuizId;
}

const AREA_IDS = AREAS.map((a) => a.id) as AreaId[];
function isAreaId(s: string | undefined): s is AreaId {
  return !!s && (AREA_IDS as string[]).includes(s);
}

export default function WorldCapitalAreaPage({
  params,
}: {
  params: Promise<{ area: string }>;
}) {
  const resolved = use(params);
  if (!isAreaId(resolved.area)) {
    return (
      <main className="quiz-page">
        <div className="qstart">
          <Link href="/quiz/world-capital" className="qstart__back">
            ← もどる
          </Link>
          <div className="qstart__card">
            <span className="qstart__emoji">🤔</span>
            <h1 className="qstart__title">エリアが ありません</h1>
          </div>
        </div>
      </main>
    );
  }

  return (
    <Suspense fallback={null}>
      <Inner area={resolved.area} />
    </Suspense>
  );
}

function Inner({ area }: { area: AreaId }) {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const playFromUrl = searchParams?.get('play') === '1';
  const qFromUrl = Number(searchParams?.get('q'));
  const tFromUrlRaw = searchParams?.get('t');
  const tFromUrl =
    tFromUrlRaw === null || tFromUrlRaw === undefined ? NaN : Number(tFromUrlRaw);

  const pool = getCountriesInArea(area);
  const areaMeta = AREAS.find((a) => a.id === area)!;

  // Default to the full set of countries in the area, matching the world-map
  // quiz behaviour.
  const defaultQ = pool.length;
  const maxQ = pool.length;

  const [state, setState] = useState<QuizState>(READY_STATE);
  const [timeLimit, setTimeLimit] = useState(
    Number.isFinite(tFromUrl) ? tFromUrl : 0,
  );
  const [totalQuestions, setTotalQuestions] = useState(
    Number.isFinite(qFromUrl) && qFromUrl > 0
      ? Math.min(qFromUrl, maxQ)
      : defaultQ,
  );
  const [timerKey, setTimerKey] = useState(0);
  const savedAttemptRef = useRef<string | null>(null);
  const urlPlayConsumedRef = useRef(false);

  const startGame = useCallback(() => {
    savedAttemptRef.current = null;
    setState(makePlaying(area));
    setTimerKey((p) => p + 1);
  }, [area]);

  const handleAnswer = useCallback(
    (answer: string, isCorrect: boolean) => {
      if (state.phase !== 'playing') return;
      setState((prev) => {
        const c = prev.currentCountry;
        const entry: AttemptQuestion | null = c
          ? { code: c.code, name: c.capital, selected: answer, isCorrect }
          : null;
        return {
          ...prev,
          phase: 'feedback',
          selectedAnswer: answer,
          score: isCorrect ? prev.score + 1 : prev.score,
          answeredCodes: c ? [...prev.answeredCodes, c.code] : prev.answeredCodes,
          usedCodes: c ? [...prev.usedCodes, c.code] : prev.usedCodes,
          answers: entry ? [...prev.answers, entry] : prev.answers,
        };
      });
    },
    [state.phase],
  );

  const goNext = useCallback(() => {
    setState((prev) => {
      const next = prev.currentQuestion + 1;
      if (next > totalQuestions) return { ...prev, phase: 'result' };
      const available = pool.filter((c) => !prev.usedCodes.includes(c.code));
      if (available.length === 0) return { ...prev, phase: 'result' };
      const target = available[Math.floor(Math.random() * available.length)];
      return {
        ...prev,
        currentQuestion: next,
        currentCountry: target,
        choices: pickChoices(target, pool),
        phase: 'playing',
        selectedAnswer: null,
        usedCodes: [...prev.usedCodes, target.code],
      };
    });
    setTimerKey((p) => p + 1);
  }, [totalQuestions, pool]);

  const handleTimeUp = useCallback(() => {
    if (state.phase !== 'playing') return;
    handleAnswer('timeout', false);
  }, [state.phase, handleAnswer]);

  useEffect(() => {
    if (!playFromUrl) return;
    if (urlPlayConsumedRef.current) return;
    urlPlayConsumedRef.current = true;
    setState(makePlaying(area));
    setTimerKey((k) => k + 1);
  }, [playFromUrl, area]);

  useEffect(() => {
    if (state.phase !== 'result') return;
    if (!user) return;
    if (savedAttemptRef.current === 'pending' || savedAttemptRef.current) return;
    savedAttemptRef.current = 'pending';
    import('@/lib/quiz-store')
      .then(({ saveQuizAttempt }) =>
        saveQuizAttempt(user.uid, {
          quizId: areaIdToQuizId(area),
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
  }, [state.phase, state.score, state.answers, user, totalQuestions, timeLimit, area]);

  const handleRetry = useCallback(() => startGame(), [startGame]);

  if (state.phase === 'ready') {
    const qOptions = Array.from(
      new Set([5, 10, maxQ].filter((n) => n <= maxQ && n > 0)),
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

          <Link
            href="/quiz/world-capital"
            className="qstart__back"
            aria-label="もどる"
          >
            ← もどる
          </Link>

          <div className="qstart__card">
            <span className="qstart__emoji">🏙️</span>
            <h1 className="qstart__title">{areaMeta.name} しゅと クイズ</h1>
            <p className="qstart__desc">
              ひかっている くにの しゅとは どこ？
            </p>

            <QuizStartOptions
              label="もんだいすう"
              name="q"
              value={totalQuestions}
              onChange={setTotalQuestions}
              options={qOptions.map((n) => ({
                value: n,
                label: n === maxQ ? `${n}もん\n(ぜんぶ)` : `${n}もん`,
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
          <Link
            href="/quiz/world-capital"
            className="quiz-back-btn-small"
            aria-label="もどる"
          >
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
          <p className="quiz-question__text">この くにの しゅとは？</p>
          <div className="quiz-map">
            <WorldMapArea
              area={area}
              highlightedCode={state.currentCountry?.code ?? null}
              answeredCodes={state.answeredCodes}
            />
          </div>
        </section>

        <section className="quiz-section quiz-section--answer">
          <div className="quiz-choices-container">
            <ChoiceButtons
              choices={state.choices}
              correctAnswer={state.currentCountry?.capital ?? ''}
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
          state.currentCountry &&
          (() => {
            const isCorrect =
              state.selectedAnswer === state.currentCountry.capital;
            const isTimeout = state.selectedAnswer === 'timeout';
            const isLast = state.currentQuestion >= totalQuestions;
            const c = state.currentCountry;
            return (
              <div
                className="quiz-modal-backdrop"
                onClick={goNext}
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
                    {c.name} の しゅとは<br />
                    <span className="quiz-modal__answer-name">
                      {c.capitalKana}（{c.capital}）
                    </span>
                  </div>
                  <button type="button" className="quiz-modal__btn" onClick={goNext}>
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
