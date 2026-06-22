import Link from 'next/link';
import './home.css';

const quizzes = [
  {
    id: 'japan-map',
    title: 'にほんちず',
    subtitle: '日本地図クイズ',
    emoji: '🗾',
    description: 'けんのなまえをあてよう！',
    href: '/quiz/japan-map',
    gradient: 'linear-gradient(135deg, #FF9F43, #FFD93D)',
    available: true,
  },
  {
    id: 'japan-capital',
    title: 'けんちょうしょざいち',
    subtitle: '県庁所在地クイズ',
    emoji: '🏛️',
    description: 'けんちょうしょざいちを あてよう！',
    href: '/quiz/japan-capital',
    gradient: 'linear-gradient(135deg, #FF85A1, #FFD93D)',
    available: true,
  },
  {
    id: 'japan-shape',
    title: 'けんのかたち',
    subtitle: '都道府県の形クイズ',
    emoji: '🧩',
    description: 'かたちだけで けんを あてよう！',
    href: '/quiz/japan-shape',
    gradient: 'linear-gradient(135deg, #6BCB77, #4D96FF)',
    available: true,
  },
  {
    id: 'world-map',
    title: 'せかいちず',
    subtitle: '世界地図クイズ',
    emoji: '🌎',
    description: 'せかいのくにをあてよう！',
    href: '/quiz/world-map',
    gradient: 'linear-gradient(135deg, #8E2DE2, #4A00E0)',
    available: true,
  },
  {
    id: 'world-capital',
    title: 'せかいのしゅと',
    subtitle: '世界の首都クイズ',
    emoji: '🏙️',
    description: 'くにのしゅとをあてよう！',
    href: '/quiz/world-capital',
    gradient: 'linear-gradient(135deg, #4D96FF, #6BCB77)',
    available: true,
  },
  {
    id: 'world-shape',
    title: 'くにのかたち',
    subtitle: '国の形クイズ',
    emoji: '🧩',
    description: 'かたちだけで くにを あてよう！',
    href: '/quiz/world-shape',
    gradient: 'linear-gradient(135deg, #A55EEA, #FF9F43)',
    available: true,
  },
  {
    id: 'animals',
    title: 'どうぶつ',
    subtitle: '動物クイズ',
    emoji: '🦁',
    description: 'どうぶつのなまえをおぼえよう！',
    href: '/quiz/animals',
    gradient: 'linear-gradient(135deg, #FF7675, #FF85A1)',
    available: false,
  },
  {
    id: 'numbers',
    title: 'すうじ',
    subtitle: '数字クイズ',
    emoji: '🔢',
    description: 'すうじをかぞえよう！',
    href: '/quiz/numbers',
    gradient: 'linear-gradient(135deg, #4D96FF, #85B5FF)',
    available: false,
  },
  {
    id: 'colors',
    title: 'いろ',
    subtitle: '色クイズ',
    emoji: '🌈',
    description: 'いろのなまえをおぼえよう！',
    href: '/quiz/colors',
    gradient: 'linear-gradient(135deg, #6BCB77, #9DFFAC)',
    available: false,
  },
];

export default function Home() {
  return (
    <main className="home">
      <div className="home__header">
        <div className="home__logo-area">
          <span className="home__logo-emoji">📚</span>
          <h1 className="home__title">
            <span className="home__title-shin">しん²</span>
            <span className="home__title-study">スタディ</span>
          </h1>
        </div>
        <p className="home__subtitle">たのしく まなぼう！</p>
      </div>

      <div className="home__grid">
        {quizzes.map((quiz, index) => (
          <div
            key={quiz.id}
            className="home__card-wrapper"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {quiz.available ? (
              <Link href={quiz.href} className="home__card home__card--active" id={`quiz-${quiz.id}`}>
                <div className="home__card-bg" style={{ background: quiz.gradient }} />
                <div className="home__card-content">
                  <span className="home__card-emoji">{quiz.emoji}</span>
                  <h2 className="home__card-title">{quiz.title}</h2>
                  <p className="home__card-subtitle">{quiz.subtitle}</p>
                  <p className="home__card-desc">{quiz.description}</p>
                </div>
                <div className="home__card-arrow">▶</div>
              </Link>
            ) : (
              <div className="home__card home__card--locked" id={`quiz-${quiz.id}`}>
                <div className="home__card-bg" style={{ background: quiz.gradient, opacity: 0.3 }} />
                <div className="home__card-content">
                  <span className="home__card-emoji">{quiz.emoji}</span>
                  <h2 className="home__card-title">{quiz.title}</h2>
                  <p className="home__card-subtitle">{quiz.subtitle}</p>
                  <p className="home__card-desc">{quiz.description}</p>
                </div>
                <div className="home__card-badge">🔜 じゅんびちゅう</div>
              </div>
            )}
          </div>
        ))}
      </div>

      <footer className="home__footer">
        <p>🎓 おやこで たのしく がくしゅう</p>
      </footer>
    </main>
  );
}
