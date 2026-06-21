'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import Link from 'next/link';
import JapanMap from '@/components/JapanMap';
import TimeBar from '@/components/TimeBar';
import ChoiceButtons from '@/components/ChoiceButtons';
import QuizResult from '@/components/QuizResult';
import { PREFECTURES, PrefectureData } from '@/data/japan-map-data';
import './japan-map-quiz.css';

const TOTAL_QUESTIONS = 10;

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

export default function JapanMapQuizPage() {
  const [state, setState] = useState<QuizState>({
    currentQuestion: 0,
    score: 0,
    currentPrefecture: null,
    choices: [],
    phase: 'ready',
    selectedAnswer: null,
    answeredCodes: [],
    usedCodes: [],
  });

  const [timeLimit, setTimeLimit] = useState(10); // 5s, 10s, 15s difficulty
  const [timerKey, setTimerKey] = useState(0);
  const feedbackTimerRef = useRef<NodeJS.Timeout | null>(null);

  const startGame = useCallback(() => {
    const randomPref = PREFECTURES[Math.floor(Math.random() * PREFECTURES.length)];
    const choices = generateChoices(randomPref, PREFECTURES);

    setState({
      currentQuestion: 1,
      score: 0,
      currentPrefecture: randomPref,
      choices,
      phase: 'playing',
      selectedAnswer: null,
      answeredCodes: [],
      usedCodes: [randomPref.code],
    });
    setTimerKey(prev => prev + 1);
  }, []);

  const handleAnswer = useCallback((answer: string, isCorrect: boolean) => {
    if (state.phase !== 'playing') return;

    setState(prev => ({
      ...prev,
      phase: 'feedback',
      selectedAnswer: answer,
      score: isCorrect ? prev.score + 1 : prev.score,
      answeredCodes: prev.currentPrefecture
        ? [...prev.answeredCodes, prev.currentPrefecture.code]
        : prev.answeredCodes,
      usedCodes: prev.currentPrefecture
        ? [...prev.usedCodes, prev.currentPrefecture.code]
        : prev.usedCodes,
    }));

    // Move to next question after feedback delay
    feedbackTimerRef.current = setTimeout(() => {
      setState(prev => {
        const nextQuestion = prev.currentQuestion + 1;
        if (nextQuestion > TOTAL_QUESTIONS) {
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
    }, 1800);
  }, [state.phase]);

  const handleTimeUp = useCallback(() => {
    if (state.phase !== 'playing') return;
    handleAnswer('timeout', false);
  }, [state.phase, handleAnswer]);

  const handleRetry = useCallback(() => {
    startGame();
  }, [startGame]);

  // Cleanup feedback timer on unmount
  useEffect(() => {
    return () => {
      if (feedbackTimerRef.current) {
        clearTimeout(feedbackTimerRef.current);
      }
    };
  }, []);

  // Start screen
  if (state.phase === 'ready') {
    return (
      <main className="quiz-page">
        <div className="quiz-start">
          <Link href="/" className="quiz-back-btn" aria-label="トップへ戻る">
            ← もどる
          </Link>
          <div className="quiz-start__card">
            <span className="quiz-start__emoji">🗾</span>
            <h1 className="quiz-start__title">にほんちず クイズ</h1>
            <p className="quiz-start__desc">
              ちずで ひかっている けんの なまえを あてよう！
            </p>
            
            <div className="quiz-start__difficulty">
              <p className="quiz-start__difficulty-label">じかん（むずかしさ）を えらんでね：</p>
              <div className="quiz-start__difficulty-buttons">
                <button
                  type="button"
                  className={`quiz-difficulty-btn ${timeLimit === 0 ? 'quiz-difficulty-btn--active' : ''}`}
                  onClick={() => setTimeLimit(0)}
                >
                  🎈 むげん (なし)
                </button>
                <button
                  type="button"
                  className={`quiz-difficulty-btn ${timeLimit === 15 ? 'quiz-difficulty-btn--active' : ''}`}
                  onClick={() => setTimeLimit(15)}
                >
                  🐢 15びょう (かんたん)
                </button>
                <button
                  type="button"
                  className={`quiz-difficulty-btn ${timeLimit === 10 ? 'quiz-difficulty-btn--active' : ''}`}
                  onClick={() => setTimeLimit(10)}
                >
                  🐥 10びょう (ふつう)
                </button>
                <button
                  type="button"
                  className={`quiz-difficulty-btn ${timeLimit === 5 ? 'quiz-difficulty-btn--active' : ''}`}
                  onClick={() => setTimeLimit(5)}
                >
                  🐰 5びょう (むずかしい)
                </button>
              </div>
            </div>

            <div className="quiz-start__info">
              <div className="quiz-start__info-item">
                <span className="quiz-start__info-icon">❓</span>
                <span>{TOTAL_QUESTIONS}もん</span>
              </div>
              <div className="quiz-start__info-item">
                <span className="quiz-start__info-icon">⏰</span>
                <span>{timeLimit === 0 ? 'なし' : `${timeLimit}びょう`}</span>
              </div>
            </div>
            <div className="quiz-start__btn-wrapper">
              <button
                type="button"
                className="quiz-start__btn"
                onClick={startGame}
                id="start-quiz-btn"
              >
                🚀 スタート！
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Result screen
  if (state.phase === 'result') {
    return (
      <main className="quiz-page">
        <QuizResult
          score={state.score}
          total={TOTAL_QUESTIONS}
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
          <Link href="/" className="quiz-back-btn-small" aria-label="トップへ戻る">
            ←
          </Link>
          <div className="quiz-progress">
            <span className="quiz-progress__current">{state.currentQuestion}</span>
            <span className="quiz-progress__divider">/</span>
            <span className="quiz-progress__total">{TOTAL_QUESTIONS}</span>
          </div>
          <div className="quiz-score">
            ⭐ {state.score}
          </div>
        </div>

        {/* Timer */}
        <div className="quiz-timer">
          <TimeBar
            key={timerKey}
            duration={timeLimit}
            isRunning={state.phase === 'playing'}
            onTimeUp={handleTimeUp}
          />
        </div>

        {/* Question prompt */}
        <div className="quiz-question">
          <p className="quiz-question__text">
            {state.phase === 'feedback' && state.selectedAnswer !== 'timeout' && state.selectedAnswer === state.currentPrefecture?.name
              ? '🎉 せいかい！'
              : state.phase === 'feedback'
              ? `❌ こたえは「${state.currentPrefecture?.kana} (${state.currentPrefecture?.name})」`
              : 'この けんは どこ？'}
          </p>
        </div>

        {/* Map */}
        <div className="quiz-map">
          <JapanMap
            highlightedCode={state.currentPrefecture?.code ?? null}
            answeredCodes={state.answeredCodes}
          />
        </div>

        {/* Choices */}
        <div className="quiz-choices">
          <ChoiceButtons
            choices={state.choices}
            correctAnswer={state.currentPrefecture?.name ?? ''}
            onAnswer={handleAnswer}
            disabled={state.phase !== 'playing'}
            showResult={state.phase === 'feedback' ? (state.selectedAnswer ?? 'timeout') : null}
          />
        </div>
      </div>
    </main>
  );
}
