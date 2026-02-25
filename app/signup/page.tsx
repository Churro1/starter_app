import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect('/dashboard');
  }

  const params = await searchParams;

  async function signup(formData: FormData) {
    'use server';

    const email = String(formData.get('email') ?? '');
    const password = String(formData.get('password') ?? '');
    const serverSupabase = createSupabaseServerClient();

    const { error } = await serverSupabase.auth.signUp({ email, password });

    if (error) {
      redirect(`/signup?error=${encodeURIComponent(error.message)}`);
    }

    redirect('/dashboard');
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center gap-6 p-6">
      <h1 className="text-2xl font-semibold">Sign up</h1>
      {params.error ? <p className="text-sm text-red-600">{params.error}</p> : null}
      {params.message ? <p className="text-sm">{params.message}</p> : null}
      <form action={signup} className="space-y-4">
        <div className="space-y-1">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required className="w-full rounded border px-3 py-2" />
        </div>
        <div className="space-y-1">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
            className="w-full rounded border px-3 py-2"
          />
        </div>
        <button type="submit" className="rounded border px-4 py-2">
          Sign up
        </button>
      </form>
      <p>
        Already have an account?{' '}
        <Link href="/login" className="underline">
          Log in
        </Link>
      </p>
    </main>
  );
}
