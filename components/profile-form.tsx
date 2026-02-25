'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

type ProfileFormProps = {
  userId: string;
  userEmail: string;
  initialFullName: string;
  initialAvatarUrl: string;
};

export function ProfileForm({ userId, userEmail, initialFullName, initialAvatarUrl }: ProfileFormProps) {
  const router = useRouter();
  const [fullName, setFullName] = useState(initialFullName);
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const supabase = getSupabaseBrowserClient();
    setIsSaving(true);
    setError('');
    setMessage('');

    const fileInput = event.currentTarget.elements.namedItem('avatar') as HTMLInputElement | null;
    const file = fileInput?.files?.[0] ?? null;

    let nextAvatarUrl = avatarUrl;

    if (file) {
      const fileExt = file.name.split('.').pop() ?? 'png';
      const filePath = `${userId}/avatar-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file, {
        upsert: true,
      });

      if (uploadError) {
        setError(uploadError.message);
        setIsSaving(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
      nextAvatarUrl = publicUrlData.publicUrl;
      setAvatarUrl(nextAvatarUrl);
    }

    const { error: updateError } = await supabase
      .from('profiles')
      .upsert({ id: userId, email: userEmail, full_name: fullName, avatar_url: nextAvatarUrl }, { onConflict: 'id' });

    if (updateError) {
      setError(updateError.message);
      setIsSaving(false);
      return;
    }

    setMessage('Profile updated successfully.');
    setIsSaving(false);
    router.refresh();
  };

  return (
    <form onSubmit={handleSave} className="space-y-4">
      <div className="space-y-1">
        <label htmlFor="full_name">Full name</label>
        <input
          id="full_name"
          name="full_name"
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          className="w-full rounded border px-3 py-2"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="avatar">Avatar image</label>
        <input id="avatar" name="avatar" type="file" accept="image/*" className="w-full" />
      </div>

      {avatarUrl ? (
        <Image
          src={avatarUrl}
          alt="Current avatar"
          width={96}
          height={96}
          className="h-24 w-24 rounded object-cover"
          unoptimized
        />
      ) : (
        <p>No avatar uploaded yet.</p>
      )}

      <button type="submit" disabled={isSaving} className="rounded border px-4 py-2 disabled:opacity-50">
        {isSaving ? 'Saving...' : 'Save profile'}
      </button>

      {message ? <p className="text-sm text-green-700">{message}</p> : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </form>
  );
}
