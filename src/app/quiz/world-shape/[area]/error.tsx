'use client';

import Link from 'next/link';

export default function WorldAreaError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main
      style={{
        minHeight: '100dvh',
        padding: '32px 24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-japanese)',
        textAlign: 'center',
        color: '#5C4D4A',
      }}
    >
      <div
        style={{
          maxWidth: 420,
          width: '100%',
          background: '#FFF',
          border: '4px solid #5C4D4A',
          borderRadius: 24,
          boxShadow: '0 8px 0 #5C4D4A',
          padding: 32,
        }}
      >
        <p style={{ fontSize: '3rem', margin: 0 }}>😵</p>
        <h1 style={{ fontSize: '1.4rem', margin: '12px 0 8px', fontWeight: 900 }}>
          よみこみエラー
        </h1>
        <pre
          style={{
            fontSize: '0.75rem',
            color: '#A89591',
            background: '#FFF9E6',
            border: '2px solid #E5DCD0',
            borderRadius: 8,
            padding: 8,
            overflow: 'auto',
            textAlign: 'left',
            margin: '0 0 16px',
            whiteSpace: 'pre-wrap',
          }}
        >
          {error.message}
          {error.digest ? `\n[digest: ${error.digest}]` : ''}
        </pre>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              padding: '12px 20px',
              fontWeight: 800,
              fontFamily: 'inherit',
              background: '#FFD93D',
              border: '3px solid #5C4D4A',
              borderRadius: 14,
              boxShadow: '0 4px 0 #5C4D4A',
              cursor: 'pointer',
            }}
          >
            🔄 もういちど
          </button>
          <Link
            href="/quiz/world-shape"
            style={{
              padding: '12px 20px',
              fontWeight: 800,
              background: '#FFF',
              border: '3px solid #5C4D4A',
              borderRadius: 14,
              boxShadow: '0 4px 0 #5C4D4A',
              color: '#5C4D4A',
              textDecoration: 'none',
            }}
          >
            🌎 エリアえらび
          </Link>
        </div>
      </div>
    </main>
  );
}
