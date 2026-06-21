'use client';

import { PREFECTURES } from '@/data/japan-map-data';
import './ChoiceButtons.css';

interface ChoiceButtonsProps {
  choices: string[];
  correctAnswer: string;
  onAnswer: (answer: string, isCorrect: boolean) => void;
  disabled: boolean;
  showResult: string | null; // the answer the user selected, or 'timeout'
}

export default function ChoiceButtons({ choices, correctAnswer, onAnswer, disabled, showResult }: ChoiceButtonsProps) {
  const handleClick = (choice: string) => {
    if (disabled) return;
    onAnswer(choice, choice === correctAnswer);
  };

  const getButtonClass = (choice: string) => {
    if (!showResult) return 'choice-btn';
    if (choice === correctAnswer) return 'choice-btn choice-btn--correct';
    if (choice === showResult) return 'choice-btn choice-btn--wrong';
    return 'choice-btn choice-btn--dimmed';
  };

  const getFormattedChoice = (choiceName: string) => {
    const pref = PREFECTURES.find(p => p.name === choiceName);
    return pref ? `${pref.kana} (${pref.name})` : choiceName;
  };

  const buttonColors = [
    'choice-btn--color-1',
    'choice-btn--color-2',
    'choice-btn--color-3',
    'choice-btn--color-4',
  ];

  return (
    <div className="choice-buttons">
      {choices.map((choice, index) => (
        <button
          key={choice}
          id={`choice-${index}`}
          className={`${getButtonClass(choice)} ${!showResult ? buttonColors[index % buttonColors.length] : ''}`}
          onClick={() => handleClick(choice)}
          disabled={disabled}
          aria-label={choice}
        >
          <span className="choice-btn__text">{getFormattedChoice(choice)}</span>
          {showResult && choice === correctAnswer && (
            <span className="choice-btn__icon">⭕</span>
          )}
          {showResult && choice === showResult && choice !== correctAnswer && (
            <span className="choice-btn__icon">❌</span>
          )}
        </button>
      ))}
    </div>
  );
}
