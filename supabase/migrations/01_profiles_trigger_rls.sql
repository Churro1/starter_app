-- IMPORTANT: The profiles table must exist before running this migration!
-- Ensure it is created in your schema file or an earlier migration.

-- Trigger function for automatic profile creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql;

-- Create trigger on auth.users to insert into profiles after user signup
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

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
