'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import './AuthHeader.css';

export default function AuthHeader() {
  const { user, loading, signInWithGoogle, signOutUser } = useAuth();
  const [busy, setBusy] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  // Quiz pages have their own top bar (progress + score). The floating avatar
  // would collide with that bar, and login isn't needed mid-game anyway —
  // suppress the AuthHeader entirely while on a quiz route. Login is still
  // accessible from the home page and the mypage.
  if (pathname?.startsWith('/quiz/')) return null;

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
            <Image
              src={user.photoURL}
              alt=""
              width={48}
              height={48}
              className="auth-header__avatar-img"
              referrerPolicy="no-referrer"
              unoptimized
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
