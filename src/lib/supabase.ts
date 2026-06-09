// Supabase client singleton
// Currently unused - all data comes from the mock API layer (api.ts)
// This file will be used when migrating from mock to real Supabase backend
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
