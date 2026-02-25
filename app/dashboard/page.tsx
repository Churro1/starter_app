import Image from 'next/image';
import Link from 'next/link';
import { requireUser } from '@/lib/auth/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { SignOutButton } from '@/components/sign-out-button';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const user = await requireUser('/login');
  const supabase = createSupabaseServerClient();

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, email, full_name, avatar_url, updated_at')
    .eq('id', user.id)
    .maybeSingle();

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-4 p-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p>Signed in as: {user.email}</p>
      <p>Profile email: {profile?.email ?? 'No profile yet'}</p>
      <p>Full name: {profile?.full_name ?? 'Not set'}</p>
      {profile?.avatar_url ? (
        <Image
          src={profile.avatar_url}
          alt="Profile avatar"
          width={128}
          height={128}
          className="h-32 w-32 rounded object-cover"
          unoptimized
        />
      ) : (
        <p className="text-sm text-gray-500">No avatar uploaded yet</p>
      )}
      <div className="flex gap-4">
        <Link href="/profile" className="underline">
          Edit profile
        </Link>
        <SignOutButton />
      </div>
    </main>
  );
}
