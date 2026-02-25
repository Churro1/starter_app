-- IMPORTANT: The profiles table must exist before running this migration!
-- Ensure it is created in your schema file or an earlier migration.

-- Trigger function for automatic profile creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

-- Trigger function to keep updated_at current on profile updates
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$ language plpgsql;

-- Create trigger on auth.users to insert into profiles after user signup
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

-- Enable Row Level Security (RLS) on profiles
alter table profiles enable row level security;

-- Policy: Allow users to select their own profile
create policy "Select own profile" on profiles
  for select using (auth.uid() = id);

-- Policy: Allow users to update their own profile
create policy "Update own profile" on profiles
  for update using (auth.uid() = id);

-- Policy: Allow users to insert their own profile (safety)
create policy "Insert own profile" on profiles
  for insert with check (auth.uid() = id);

-- Avatar storage bucket + policies
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

create policy "Avatar images are publicly accessible" on storage.objects
  for select using (bucket_id = 'avatars');

create policy "Users can upload own avatar" on storage.objects
  for insert with check (
    bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can update own avatar" on storage.objects
  for update using (
    bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text
  );
