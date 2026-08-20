import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || '';

let supabase: SupabaseClient | null = null;

if (supabaseUrl && supabaseKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false
      }
    });
    console.log('⚡ Supabase client initialized with URL:', supabaseUrl);
  } catch (err: any) {
    console.warn('Failed to initialize Supabase client:', err.message);
  }
} else {
  console.log('ℹ️ Supabase credentials not fully configured in .env');
}

export { supabase };

export const isSupabaseConfigured = (): boolean => {
  return !!supabase;
};

/**
 * Fetch programs from Supabase table 'programs'
 */
export async function getProgramsFromSupabase(): Promise<any[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('programs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase getPrograms error (table might need to be created):', error.message);
      return null;
    }
    return data;
  } catch (e: any) {
    console.warn('Supabase programs query exception:', e.message);
    return null;
  }
}

/**
 * Insert or update program in Supabase
 */
export async function insertProgramToSupabase(program: any): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase
      .from('programs')
      .upsert(program);

    if (error) {
      console.warn('Supabase insertProgram error:', error.message);
      return false;
    }
    return true;
  } catch (e: any) {
    console.warn('Supabase insertProgram exception:', e.message);
    return false;
  }
}

/**
 * Fetch applications from Supabase table 'applications'
 */
export async function getApplicationsFromSupabase(filter: { status?: string; search?: string } = {}): Promise<any[] | null> {
  if (!supabase) return null;
  try {
    let query = supabase
      .from('applications')
      .select('*')
      .order('created_at', { ascending: false });

    if (filter.status && filter.status !== 'All') {
      query = query.eq('status', filter.status);
    }

    const { data, error } = await query;
    if (error) {
      console.warn('Supabase getApplications error (table might need to be created):', error.message);
      return null;
    }
    return data;
  } catch (e: any) {
    console.warn('Supabase applications query exception:', e.message);
    return null;
  }
}

/**
 * Save new application to Supabase
 */
export async function insertApplicationToSupabase(application: any): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase
      .from('applications')
      .insert(application);

    if (error) {
      console.warn('Supabase insertApplication error:', error.message);
      return false;
    }
    return true;
  } catch (e: any) {
    console.warn('Supabase insertApplication exception:', e.message);
    return false;
  }
}

/**
 * Update application status in Supabase
 */
export async function updateApplicationInSupabase(id: string, status: string, staffNotes?: string): Promise<boolean> {
  if (!supabase) return false;
  try {
    const updateData: any = { status };
    if (staffNotes !== undefined) updateData.staffNotes = staffNotes;

    const { error } = await supabase
      .from('applications')
      .update(updateData)
      .eq('id', id);

    if (error) {
      console.warn('Supabase updateApplication error:', error.message);
      return false;
    }
    return true;
  } catch (e: any) {
    console.warn('Supabase updateApplication exception:', e.message);
    return false;
  }
}
