-- DAOs table
CREATE TABLE daos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  snapshot_space TEXT UNIQUE NOT NULL,
  description TEXT,
  chain TEXT DEFAULT 'ethereum',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Proposals table (DAO proposal data)
CREATE TABLE proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dao_id UUID REFERENCES daos(id),
  snapshot_id TEXT UNIQUE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  state TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  scores_total NUMERIC,
  quorum NUMERIC
);

-- Votes table
CREATE TABLE votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id UUID REFERENCES proposals(id),
  voter_address TEXT NOT NULL,
  voting_power NUMERIC,
  choice INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Analytics cache
CREATE TABLE analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dao_id UUID REFERENCES daos(id),
  metric_type TEXT NOT NULL,
  metric_value JSONB,
  computed_at TIMESTAMP DEFAULT NOW()
);

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table (user accounts)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  tier text default 'free',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- User proposals table (usage tracking)
create table public.user_proposals (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  dao_space text not null,
  proposal_text text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.user_proposals enable row level security;

create policy "Users can view own user_proposals"
  on public.user_proposals for select
  using (auth.uid() = user_id);

create policy "Users can insert own user_proposals"
  on public.user_proposals for insert
  with check (auth.uid() = user_id);

-- Auto-create profile function
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Indexes
create index user_proposals_user_id_idx on public.user_proposals(user_id);
create index user_proposals_created_at_idx on public.user_proposals(created_at);