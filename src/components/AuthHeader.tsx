'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import './AuthHeader.css';

export default function AuthHeader() {
  const { user, loading, signInWithGoogle, signOutUser } = useAuth();
  const [busy, setBusy] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignIn = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error(err);
      alert('ログインできませんでした');
    } finally {
      setBusy(false);
    }
  };

  const handleSignOut = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await signOutUser();
      setMenuOpen(false);
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return null;
  }

  if (!user) {
    return (
      <div className="auth-header">
        <button
          type="button"
          className="auth-header__signin"
          onClick={handleSignIn}
          disabled={busy}
        >
          <span className="auth-header__google">G</span>
          Google で ログイン
        </button>
      </div>
    );
  }

  const initial = (user.displayName ?? user.email ?? '?').charAt(0).toUpperCase();

  return (
    <div className="auth-header">
      <div className="auth-header__user">
        <button
          type="button"
          className="auth-header__avatar-btn"
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-label="メニュー"
        >
          {user.photoURL ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.photoURL}
              alt=""
              className="auth-header__avatar-img"
              referrerPolicy="no-referrer"
            />
          ) : (
            <span className="auth-header__avatar-fallback">{initial}</span>
          )}
        </button>
        {menuOpen && (
          <div className="auth-header__menu" role="menu">
            <div className="auth-header__menu-name">
              {user.displayName ?? user.email}
            </div>
            <Link
              href="/mypage"
              className="auth-header__menu-item"
              onClick={() => setMenuOpen(false)}
              role="menuitem"
            >
              📊 マイページ
            </Link>
            <button
              type="button"
              className="auth-header__menu-item auth-header__menu-item--signout"
              onClick={handleSignOut}
              disabled={busy}
              role="menuitem"
            >
              👋 ログアウト
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
