// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://tgaxwpeqbdkbncvssjhm.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRnYXh3cGVxYmRrYm5jdnNzamhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI2NzgxODgsImV4cCI6MjA1ODI1NDE4OH0.OssMhejyLXMVAyZORZCezchYFyIOePvdTt7YUbBVJSE";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);