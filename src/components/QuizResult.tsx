'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import './QuizResult.css';

interface QuizResultProps {
  score: number;
  total: number;
  onRetry: () => void;
}

export default function QuizResult({ score, total, onRetry }: QuizResultProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const percentage = Math.round((score / total) * 100);

  useEffect(() => {
    if (percentage >= 60) {
      setShowConfetti(true);
    }
  }, [percentage]);

  const getMessage = () => {
    if (percentage === 100) return { text: 'パーフェクト！🌟', emoji: '👑' };
    if (percentage >= 80) return { text: 'すごい！', emoji: '🎉' };
    if (percentage >= 60) return { text: 'よくできました！', emoji: '😊' };
    if (percentage >= 40) return { text: 'がんばったね！', emoji: '💪' };
    return { text: 'もういちどやってみよう！', emoji: '🌈' };
  };

  const getStars = () => {
    if (percentage >= 90) return 3;
    if (percentage >= 60) return 2;
    if (percentage >= 30) return 1;
    return 0;
  };

  const message = getMessage();
  const stars = getStars();

  return (
    <div className="quiz-result">
      {showConfetti && (
        <div className="confetti-container" aria-hidden="true">
          {Array.from({ length: 40 }).map((_, i) => (
            <div
              key={i}
              className="confetti-piece"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
                backgroundColor: ['#6C5CE7', '#00b894', '#fdcb6e', '#e17055', '#fd79a8', '#55efc4', '#a29bfe'][i % 7],
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
            />
          ))}
        </div>
      )}

      <div className="quiz-result__card">
        <div className="quiz-result__emoji">{message.emoji}</div>
        <h2 className="quiz-result__message">{message.text}</h2>
        
        <div className="quiz-result__stars">
          {Array.from({ length: 3 }).map((_, i) => (
            <span
              key={i}
              className={`quiz-result__star ${i < stars ? 'quiz-result__star--active' : ''}`}
              style={{ animationDelay: `${i * 0.2}s` }}
            >
              ⭐
            </span>
          ))}
        </div>

        <div className="quiz-result__score">
          <span className="quiz-result__score-number">{score}</span>
          <span className="quiz-result__score-divider">/</span>
          <span className="quiz-result__score-total">{total}</span>
          <span className="quiz-result__score-label">もん</span>
        </div>

        <div className="quiz-result__actions">
          <button className="quiz-result__btn quiz-result__btn--retry" onClick={onRetry}>
            🔄 もういっかい
          </button>
          <Link href="/" className="quiz-result__btn quiz-result__btn--home">
            🏠 トップへ
          </Link>
        </div>
      </div>
    </div>
  );
}
