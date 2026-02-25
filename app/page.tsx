import { AuthStatus } from '@/components/auth-status';

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center gap-6 p-6">
      <h1 className="text-3xl font-semibold">Next.js + Supabase Starter App</h1>
      <p>
        This starter includes authentication, protected routes, profile management, and secure profile access
        policies.
      </p>
      <AuthStatus />
    </main>
  );
}
