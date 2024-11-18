# Composer Kit - AI-Powered Development Assistant

A modern, production-ready React application template with AI capabilities, authentication, payments, and a beautiful UI.

![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-blue)

## 🚀 Features

- **🎨 Modern UI/UX**
  - Beautiful, responsive design with Tailwind CSS
  - Dark mode support
  - Smooth animations with Framer Motion
  - Component library powered by shadcn/ui
  - Icons from Lucide React

- **🔒 Authentication & Security**
  - Supabase authentication
  - Protected routes
  - Type-safe API calls

- **💳 Payments**
  - Stripe integration
  - Subscription management
  - Usage-based billing

- **🤖 AI Integration**
  - OpenAI API integration
  - Chat interface
  - Token usage tracking
  - History management

- **⚡ Performance**
  - Vite for fast development
  - Optimized production builds
  - Code splitting
  - Lazy loading

## 🛠️ Tech Stack

- React + TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- Supabase
- Stripe
- OpenAI
- Netlify
- Framer Motion
- Zustand
- React Hook Form
- Zod

## 📦 Project Structure 
project-root/
├── src/
│ ├── components/
│ │ ├── ui/ # shadcn/ui components
│ │ ├── payment/ # Stripe-related components
│ │ └── layout/ # Layout components
│ ├── lib/
│ │ ├── utils.ts # Utility functions
│ │ ├── auth.ts # Authentication helpers
│ │ ├── stripe.ts # Stripe helpers
│ │ └── config.ts # App configuration
│ └── pages/ # Route pages
├── netlify/
│ └── functions/ # Serverless functions
└── public/ # Static assets


## 🚀 Getting Started

1. **Clone the repository**
ash
git clone <repository-url>
cd composer-kit


2. **Install dependencies**


3. **Set up environment variables**
Create a `.env` file in the root directory:
env
VITE_OPENAI_API_KEY=your_openai_api_key
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_key
STRIPE_SECRET_KEY=your_stripe_secret


4. **Start development server**
npm run dev


5. **Build for production**
npm run build


## 🧪 Testing and Quality

- ESLint for code linting
- Prettier for code formatting
- TypeScript for type checking

Run quality checks:
npm run lint
npm run format
npm run type-check
or 
npm run check # runs type-check and lint
npm format # formats code with prettier


## 🗄️ Database Setup

1. **Create a Supabase Project**
   - Go to [Supabase](https://supabase.com)
   - Create a new project
   - Save your project URL and anon key for environment variables

2. **Set up Database Tables**
   Run the following SQL in your Supabase SQL editor:

   ```sql
   -- Create history table for tracking user interactions
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

   -- Create subscriptions table for managing user plans
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

   -- Set up indexes
   create index history_user_id_idx on public.history(user_id);
   create index history_created_at_idx on public.history(created_at desc);
   create index subscriptions_user_id_idx on public.subscriptions(user_id);
   create index subscriptions_stripe_customer_id_idx on public.subscriptions(stripe_customer_id);

   -- Enable RLS
   alter table public.history enable row level security;
   alter table public.subscriptions enable row level security;

   -- Set up RLS policies
   create policy "Users can insert their own history items"
     on public.history for insert
     with check (auth.uid() = user_id);

   create policy "Users can view their own history items"
     on public.history for select
     using (auth.uid() = user_id);

   create policy "Users can delete their own history items"
     on public.history for delete
     using (auth.uid() = user_id);

   create policy "Users can view their own subscription"
     on public.subscriptions for select
     using (auth.uid() = user_id);

   create policy "System can insert subscriptions"
     on public.subscriptions for insert
     with check (auth.uid() = user_id);

   create policy "System can update subscriptions"
     on public.subscriptions for update
     using (auth.uid() = user_id);

   -- Set up updated_at trigger
   create or replace function public.handle_updated_at()
   returns trigger as $$
   begin
     new.updated_at = now();
     return new;
   end;
   $$ language plpgsql;

   create trigger handle_updated_at
     before update on public.subscriptions
     for each row
     execute function public.handle_updated_at();
   ```

3. **Initialize Supabase Client**
   The client is already configured in `src/lib/supabase.ts`. Make sure your environment variables are set correctly:

   ```typescript
   // src/lib/supabase.ts
   import { createClient } from '@supabase/supabase-js';

   const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
   const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

   export const supabase = createClient(supabaseUrl, supabaseAnonKey);
   ```

4. **Enable Authentication**
   - Go to Authentication settings in your Supabase dashboard
   - Configure your desired auth providers (Email, Google, GitHub, etc.)
   - Update your site URL and redirect URLs in the auth settings

5. **Test the Setup**
   - Try creating a new user account
   - Verify RLS policies are working by attempting to access/modify data
   - Check that history and subscription records can be created/read properly


6. **Deploy to Netlify**
   - Connect your GitHub repository to Netlify
   - Configure the build settings:
     ```
     Build command: npm run build
     Publish directory: dist
     ```
   - Add the following environment variables in Netlify's settings:
     ```
     VITE_OPENAI_API_KEY
     VITE_SUPABASE_URL
     VITE_SUPABASE_ANON_KEY
     VITE_STRIPE_PUBLISHABLE_KEY
     STRIPE_SECRET_KEY
     STRIPE_WEBHOOK_SECRET
     ```

7. **Set Up Stripe Webhook**
   - Go to Stripe Dashboard > Developers > Webhooks
   - Click "Add Endpoint"
   - Enter your webhook URL: `https://your-netlify-site.netlify.app/.netlify/functions/stripe-webhook`
   - Select events to listen for:
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
   - Copy the webhook signing secret
   - Add it to Netlify environment variables as `STRIPE_WEBHOOK_SECRET`

8. **Test the Deployment**
   - Deploy your site
   - Test the authentication flow
   - Make a test purchase to verify Stripe integration
   - Check Stripe webhook logs to confirm events are being received
   - Monitor Netlify function logs for any errors



