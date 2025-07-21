import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yhbeqyppvyukvmwqjqbo.supabase.co';
const supabaseKey = 'sb_publishable_ORNOgcK_jhZ6eL0H9BMd1Q_piEe1cFr';

export const supabase = createClient(supabaseUrl, supabaseKey);

