import { createBrowserClient } from '@supabase/ssr';

export const supabase = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Replace <Database> with your generated types if available, or remove if not using types.
