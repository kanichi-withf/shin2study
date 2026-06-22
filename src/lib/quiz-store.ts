import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  type Timestamp,
} from 'firebase/firestore';
import { getDb } from '@/lib/firebase';

export type QuizId =
  | 'japan-map'
  | 'japan-shape'
  | 'japan-capital'
  | 'world-asia'
  | 'world-europe'
  | 'world-north-america'
  | 'world-south-america'
  | 'world-africa'
  | 'world-oceania';

export interface AttemptQuestion {
  code: string;
  name: string;
  selected: string;
  isCorrect: boolean;
}

export interface SaveAttemptInput {
  quizId: QuizId;
  score: number;
  total: number;
  timeLimit: number;
  questions: AttemptQuestion[];
}

export interface AttemptRecord extends SaveAttemptInput {
  id: string;
  createdAt: Timestamp | null;
}

export interface QuizStats {
  quizId: QuizId;
  totalAttempts: number;
  bestScore: number;
  bestTotal: number;
  lastScore: number;
  lastTotal: number;
  perItem: Record<string, { name: string; correct: number; wrong: number }>;
  updatedAt: Timestamp | null;
}

export async function saveQuizAttempt(
  uid: string,
  input: SaveAttemptInput,
): Promise<string> {
  const db = getDb();

  const attemptRef = await addDoc(
    collection(db, 'users', uid, 'attempts'),
    {
      ...input,
      createdAt: serverTimestamp(),
    },
  );

  const statsRef = doc(db, 'users', uid, 'stats', input.quizId);
  const prev = await getDoc(statsRef);
  const prevBest = prev.exists() ? (prev.data().bestScore ?? -1) : -1;

  const perItemUpdates: Record<string, unknown> = {};
  for (const q of input.questions) {
    perItemUpdates[`perItem.${q.code}.name`] = q.name;
    perItemUpdates[`perItem.${q.code}.${q.isCorrect ? 'correct' : 'wrong'}`] =
      increment(1);
  }

  await setDoc(
    statsRef,
    {
      quizId: input.quizId,
      totalAttempts: increment(1),
      lastScore: input.score,
      lastTotal: input.total,
      updatedAt: serverTimestamp(),
      ...(input.score > prevBest
        ? { bestScore: input.score, bestTotal: input.total }
        : {}),
      ...perItemUpdates,
    },
    { merge: true },
  );

  return attemptRef.id;
}

export async function getQuizStats(
  uid: string,
  quizId: QuizId,
): Promise<QuizStats | null> {
  const snap = await getDoc(doc(getDb(), 'users', uid, 'stats', quizId));
  if (!snap.exists()) return null;
  const data = snap.data();
  return {
    quizId,
    totalAttempts: data.totalAttempts ?? 0,
    bestScore: data.bestScore ?? 0,
    bestTotal: data.bestTotal ?? 0,
    lastScore: data.lastScore ?? 0,
    lastTotal: data.lastTotal ?? 0,
    perItem: data.perItem ?? {},
    updatedAt: data.updatedAt ?? null,
  };
}

export async function listRecentAttempts(
  uid: string,
  max = 10,
): Promise<AttemptRecord[]> {
  const q = query(
    collection(getDb(), 'users', uid, 'attempts'),
    orderBy('createdAt', 'desc'),
    limit(max),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      quizId: data.quizId,
      score: data.score,
      total: data.total,
      timeLimit: data.timeLimit,
      questions: data.questions ?? [],
      createdAt: data.createdAt ?? null,
    };
  });
}
