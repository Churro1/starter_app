import Link from 'next/link';
import { requireUser } from '@/lib/auth/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { ProfileForm } from '@/components/profile-form';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const user = await requireUser('/login');
  const supabase = createSupabaseServerClient();

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, avatar_url')
    .eq('id', user.id)
    .maybeSingle();

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-4 p-6">
      <h1 className="text-2xl font-semibold">Profile</h1>
      <p>Email: {user.email}</p>
      <ProfileForm
        userId={user.id}
        userEmail={user.email ?? ''}
        initialFullName={profile?.full_name ?? ''}
        initialAvatarUrl={profile?.avatar_url ?? ''}
      />
      <Link href="/dashboard" className="underline">
        Back to dashboard
      </Link>
    </main>
  );
}
