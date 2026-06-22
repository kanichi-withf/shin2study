import Link from 'next/link';
import './home.css';

type Category = {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  color: string;
};

type Quiz = {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  emoji: string;
  href: string;
  available: boolean;
};

const categories: Category[] = [
  {
    id: 'japan',
    title: 'にほん',
    subtitle: 'にほんの クイズ',
    emoji: '🗾',
    color: '#FF9F43',
  },
  {
    id: 'world',
    title: 'せかい',
    subtitle: 'せかいの クイズ',
    emoji: '🌎',
    color: '#4D96FF',
  },
  {
    id: 'others',
    title: 'そのほか',
    subtitle: 'いろんな クイズ',
    emoji: '🌈',
    color: '#A55EEA',
  },
];

const quizzes: Quiz[] = [
  {
    id: 'japan-map',
    category: 'japan',
    title: 'にほんちず',
    subtitle: '都道府県',
    emoji: '🗾',
    href: '/quiz/japan-map',
    available: true,
  },
  {
    id: 'japan-capital',
    category: 'japan',
    title: 'けんちょう',
    subtitle: '県庁所在地',
    emoji: '🏛️',
    href: '/quiz/japan-capital',
    available: true,
  },
  {
    id: 'japan-shape',
    category: 'japan',
    title: 'けんのかたち',
    subtitle: '都道府県の形',
    emoji: '🧩',
    href: '/quiz/japan-shape',
    available: true,
  },
  {
    id: 'world-map',
    category: 'world',
    title: 'せかいちず',
    subtitle: '世界の国',
    emoji: '🌎',
    href: '/quiz/world-map',
    available: true,
  },
  {
    id: 'world-capital',
    category: 'world',
    title: 'しゅと',
    subtitle: '世界の首都',
    emoji: '🏙️',
    href: '/quiz/world-capital',
    available: true,
  },
  {
    id: 'world-shape',
    category: 'world',
    title: 'くにのかたち',
    subtitle: '国の形',
    emoji: '🧩',
    href: '/quiz/world-shape',
    available: true,
  },
  {
    id: 'animals',
    category: 'others',
    title: 'どうぶつ',
    subtitle: '動物',
    emoji: '🦁',
    href: '/quiz/animals',
    available: false,
  },
  {
    id: 'numbers',
    category: 'others',
    title: 'すうじ',
    subtitle: '数字',
    emoji: '🔢',
    href: '/quiz/numbers',
    available: false,
  },
  {
    id: 'colors',
    category: 'others',
    title: 'いろ',
    subtitle: '色',
    emoji: '🌈',
    href: '/quiz/colors',
    available: false,
  },
];

export default function Home() {
  return (
    <main className="home">
      <header className="home__hero">
        <span className="home__hero-logo" aria-hidden>📚</span>
        <h1 className="home__hero-title">
          <span className="home__hero-shin">しん²</span>
          <span className="home__hero-study">スタディ</span>
        </h1>
        <p className="home__hero-tagline">たのしく まなぼう！</p>
      </header>

      <div className="home__sections">
        {categories.map((cat) => {
          const items = quizzes.filter((q) => q.category === cat.id);
          if (items.length === 0) return null;
          return (
            <section
              key={cat.id}
              className="cat"
              style={{ '--cat-color': cat.color } as React.CSSProperties}
            >
              <header className="cat__head">
                <span className="cat__head-emoji" aria-hidden>{cat.emoji}</span>
                <div className="cat__head-text">
                  <h2 className="cat__head-title">{cat.title}</h2>
                  <p className="cat__head-sub">{cat.subtitle}</p>
                </div>
                <span className="cat__head-count" aria-label={`${items.length}このクイズ`}>
                  {items.length}
                </span>
              </header>

              <ul className="cat__grid">
                {items.map((quiz) => (
                  <li key={quiz.id} className="cat__grid-item">
                    {quiz.available ? (
                      <Link href={quiz.href} className="tile" id={`quiz-${quiz.id}`}>
                        <span className="tile__emoji" aria-hidden>{quiz.emoji}</span>
                        <span className="tile__title">{quiz.title}</span>
                        <span className="tile__sub">{quiz.subtitle}</span>
                      </Link>
                    ) : (
                      <div
                        className="tile tile--locked"
                        id={`quiz-${quiz.id}`}
                        aria-disabled
                      >
                        <span className="tile__emoji" aria-hidden>{quiz.emoji}</span>
                        <span className="tile__title">{quiz.title}</span>
                        <span className="tile__sub">{quiz.subtitle}</span>
                        <span className="tile__lock" aria-label="じゅんびちゅう">🔒</span>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>

      <footer className="home__footer">
        <p>🎓 おやこで たのしく がくしゅう</p>
      </footer>
    </main>
  );
}
