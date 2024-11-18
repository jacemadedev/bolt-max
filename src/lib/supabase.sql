-- Create the history table
create table public.history (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  type text not null check (type in ('chat', 'completion')),
  model text not null,
  title text not null,
  tokens_used integer not null,
  response_time text not null,
  status text not null check (status in ('success', 'error')),
  messages jsonb,
  prompt text,
  completion text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes for better query performance
create index history_user_id_idx on public.history(user_id);
create index history_created_at_idx on public.history(created_at desc);

-- Create subscriptions table
create table public.subscriptions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade unique,
  stripe_customer_id text,
  stripe_subscription_id text,
  plan_id text not null,
  status text not null check (status in ('active', 'canceled', 'expired')),
  current_period_end timestamp with time zone not null,
  token_limit integer not null,
  tokens_used integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create index for subscription lookups
create index subscriptions_user_id_idx on public.subscriptions(user_id);
create index subscriptions_stripe_customer_id_idx on public.subscriptions(stripe_customer_id);

-- Set up RLS (Row Level Security) policies
alter table public.history enable row level security;
alter table public.subscriptions enable row level security;

-- History policies
create policy "Users can insert their own history items"
  on public.history for insert
  with check (auth.uid() = user_id);

create policy "Users can view their own history items"
  on public.history for select
  using (auth.uid() = user_id);

create policy "Users can delete their own history items"
  on public.history for delete
  using (auth.uid() = user_id);

-- Subscription policies
create policy "Users can view their own subscription"
  on public.subscriptions for select
  using (auth.uid() = user_id);

-- Only allow system to modify subscriptions (via webhooks/functions)
create policy "System can insert subscriptions"
  on public.subscriptions for insert
  with check (auth.uid() = user_id);

create policy "System can update subscriptions"
  on public.subscriptions for update
  using (auth.uid() = user_id);

-- Function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Trigger to automatically update updated_at
create trigger handle_updated_at
  before update on public.subscriptions
  for each row
  execute function public.handle_updated_at();