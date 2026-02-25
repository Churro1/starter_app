'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export function AuthStatus() {
  const { user, loading } = useAuth();

  if (loading) {
    return <p>Checking authentication status...</p>;
  }

  if (!user) {
    return (
      <div className="space-y-2">
        <p>You are not signed in.</p>
        <div className="flex gap-3">
          <Link href="/login" className="underline">
            Log in
          </Link>
          <Link href="/signup" className="underline">
            Sign up
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p>Signed in as: {user.email}</p>
      <Link href="/dashboard" className="underline">
        Go to dashboard
      </Link>
    </div>
  );
}
