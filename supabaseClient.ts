
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kvwyuyrurmgdcswxlogb.supabase.co';
const supabaseKey = 'sb_publishable_0_Bsr2X9VUA5i8wrwPhTwA_zMyio_EZ';

export const supabase = createClient(supabaseUrl, supabaseKey);
