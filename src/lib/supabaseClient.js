import { createClient } from '@supabase/supabase-js';

// Singleton Supabase client instance to avoid multiple instances warning
let supabaseInstance = null;

export const getSupabaseClient = () => {
  if (!supabaseInstance) {
    supabaseInstance = createClient(
      import.meta.env.VITE_SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_ANON_KEY
    );
  }
  return supabaseInstance;
};

export default getSupabaseClient();
