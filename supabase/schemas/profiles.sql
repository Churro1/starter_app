create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  updated_at timestamp with time zone default timezone('utc', now()) not null
);