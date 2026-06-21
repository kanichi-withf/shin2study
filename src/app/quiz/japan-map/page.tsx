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
import './japan-map-quiz.css';


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

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function generateChoices(correct: PrefectureData, allPrefectures: PrefectureData[]): string[] {
  const wrongChoices: string[] = [];
  const available = allPrefectures.filter(p => p.code !== correct.code);
  const shuffled = shuffleArray(available);

  for (const pref of shuffled) {
    if (wrongChoices.length >= 3) break;
    wrongChoices.push(pref.name);
  }

  const choices = [correct.name, ...wrongChoices];
  return shuffleArray(choices);
}

function makePlayingState(): QuizState {
  const randomPref = PREFECTURES[Math.floor(Math.random() * PREFECTURES.length)];
  const choices = generateChoices(randomPref, PREFECTURES);
  return {
    currentQuestion: 1,
    score: 0,
    currentPrefecture: randomPref,
    choices,
    phase: 'playing',
    selectedAnswer: null,
    answeredCodes: [],
    usedCodes: [randomPref.code],
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

export default function JapanMapQuizPage() {
  return (
    <Suspense fallback={null}>
      <JapanMapQuizInner />
    </Suspense>
  );
}

function JapanMapQuizInner() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const playFromUrl = searchParams?.get('play') === '1';
  const qFromUrl = Number(searchParams?.get('q'));
  const tFromUrlRaw = searchParams?.get('t');
  const tFromUrl = tFromUrlRaw === null || tFromUrlRaw === undefined ? NaN : Number(tFromUrlRaw);

  // If the form's URL fallback fired (?play=1), initialize directly in
  // playing phase so the game starts without needing the React onSubmit
  // handler to run.
  const [state, setState] = useState<QuizState>(() =>
    playFromUrl ? makePlayingState() : READY_STATE,
  );

  const [timeLimit, setTimeLimit] = useState(
    Number.isFinite(tFromUrl) ? tFromUrl : 10,
  );
  const [totalQuestions, setTotalQuestions] = useState(
    Number.isFinite(qFromUrl) && qFromUrl > 0 ? qFromUrl : 10,
  );
  const [timerKey, setTimerKey] = useState(0);
  const savedAttemptRef = useRef<string | null>(null);

  const startGame = useCallback(() => {
    const randomPref = PREFECTURES[Math.floor(Math.random() * PREFECTURES.length)];
    const choices = generateChoices(randomPref, PREFECTURES);

    savedAttemptRef.current = null;
    setState({
      currentQuestion: 1,
      score: 0,
      currentPrefecture: randomPref,
      choices,
      phase: 'playing',
      selectedAnswer: null,
      answeredCodes: [],
      usedCodes: [randomPref.code],
      answers: [],
    });
    setTimerKey(prev => prev + 1);
  }, []);

  const handleAnswer = useCallback((answer: string, isCorrect: boolean) => {
    if (state.phase !== 'playing') return;

    setState(prev => {
      const pref = prev.currentPrefecture;
      const answerEntry: AttemptQuestion | null = pref
        ? { code: pref.code, name: pref.name, selected: answer, isCorrect }
        : null;
      return {
        ...prev,
        phase: 'feedback',
        selectedAnswer: answer,
        score: isCorrect ? prev.score + 1 : prev.score,
        answeredCodes: pref
          ? [...prev.answeredCodes, pref.code]
          : prev.answeredCodes,
        usedCodes: pref
          ? [...prev.usedCodes, pref.code]
          : prev.usedCodes,
        answers: answerEntry ? [...prev.answers, answerEntry] : prev.answers,
      };
    });
  }, [state.phase]);

  const goToNextQuestion = useCallback(() => {
    setState(prev => {
      const nextQuestion = prev.currentQuestion + 1;
      if (nextQuestion > totalQuestions) {
        return { ...prev, phase: 'result' };
      }

      const available = PREFECTURES.filter(p => !prev.usedCodes.includes(p.code));
      if (available.length === 0) {
        return { ...prev, phase: 'result' };
      }

      const randomPref = available[Math.floor(Math.random() * available.length)];
      const choices = generateChoices(randomPref, PREFECTURES);

      return {
        ...prev,
        currentQuestion: nextQuestion,
        currentPrefecture: randomPref,
        choices,
        phase: 'playing',
        selectedAnswer: null,
        usedCodes: [...prev.usedCodes, randomPref.code],
      };
    });
    setTimerKey(prev => prev + 1);
  }, [totalQuestions]);

  const handleTimeUp = useCallback(() => {
    if (state.phase !== 'playing') return;
    handleAnswer('timeout', false);
  }, [state.phase, handleAnswer]);

  useEffect(() => {
    if (state.phase !== 'result') return;
    if (!user) return;
    if (savedAttemptRef.current === 'pending' || savedAttemptRef.current) return;
    savedAttemptRef.current = 'pending';
    import('@/lib/quiz-store')
      .then(({ saveQuizAttempt }) =>
        saveQuizAttempt(user.uid, {
          quizId: 'japan-map',
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

  const handleRetry = useCallback(() => {
    startGame();
  }, [startGame]);

  // Start screen — uses a native <form method="GET"> so submission works even
  // if JavaScript fails to hydrate on older browsers (iPad Air 3 / iOS 15).
  // When JS is alive, onSubmit handles it locally. When JS is dead, the form
  // navigates to ?play=1&q=...&t=... and the page re-renders in playing phase
  // thanks to the URL-driven initial state above.
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
            } catch {
              // fall through to native form submission
            }
          }}
        >
          <input type="hidden" name="play" value="1" />

          <Link href="/" className="qstart__back" aria-label="もどる">
            ← もどる
          </Link>

          <div className="qstart__card">
            <span className="qstart__emoji">🗾</span>
            <h1 className="qstart__title">にほんちず クイズ</h1>
            <p className="qstart__desc">けんの なまえを あてよう！</p>

            <label className="qstart__label">
              もんだいすう
              <select
                className="qstart__select"
                name="q"
                value={totalQuestions}
                onChange={(e) => setTotalQuestions(Number(e.target.value))}
              >
                <option value={10}>10もん (ふつう)</option>
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

            <button
              type="submit"
              className="qstart__submit"
              id="start-quiz-btn"
            >
              🚀 スタート！
            </button>
          </div>
        </form>
      </main>
    );
  }

  // Result screen
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

  // Quiz screen (playing & feedback)
  return (
    <main className="quiz-page">
      <div className="quiz-layout">
        {/* Header */}
        <div className="quiz-header">
          <Link href="/" className="quiz-back-btn-small" aria-label="もどる">
            ←
          </Link>
          <div className="quiz-progress">
            <span className="quiz-progress__current">{state.currentQuestion}</span>
            <span className="quiz-progress__divider">/</span>
            <span className="quiz-progress__total">{totalQuestions}</span>
          </div>
          <div className="quiz-score">
            ⭐ {state.score}
          </div>
        </div>

        {/* Question section */}
        <section className="quiz-section quiz-section--question">
          <div className="quiz-section__badge quiz-section__badge--question">
            <span className="quiz-section__badge-icon">🎯</span>
            <span className="quiz-section__badge-text">もんだい</span>
          </div>
          <div className="quiz-timer">
            <TimeBar
              key={timerKey}
              duration={timeLimit}
              isRunning={state.phase === 'playing'}
              onTimeUp={handleTimeUp}
            />
          </div>
          <p className="quiz-question__text">この けんは どこ？</p>
          <div className="quiz-map">
            <JapanMap
              highlightedCode={state.currentPrefecture?.code ?? null}
              answeredCodes={state.answeredCodes}
            />
          </div>
        </section>

        {/* Answer section */}
        <section className="quiz-section quiz-section--answer">
          <div className="quiz-section__badge quiz-section__badge--answer">
            <span className="quiz-section__badge-icon">✋</span>
            <span className="quiz-section__badge-text">こたえを えらぼう</span>
          </div>
          <div className="quiz-choices-container">
            <ChoiceButtons
              choices={state.choices}
              correctAnswer={state.currentPrefecture?.name ?? ''}
              onAnswer={handleAnswer}
              disabled={state.phase !== 'playing'}
              showResult={state.phase === 'feedback' ? (state.selectedAnswer ?? 'timeout') : null}
            />
          </div>
        </section>

        {/* Result modal */}
        {state.phase === 'feedback' && state.currentPrefecture && (() => {
          const isCorrect = state.selectedAnswer === state.currentPrefecture.name;
          const isTimeout = state.selectedAnswer === 'timeout';
          const isLast = state.currentQuestion >= totalQuestions;
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
                  こたえ：<br />
                  <span className="quiz-modal__answer-name">
                    {state.currentPrefecture.kana}（{state.currentPrefecture.name}）
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
