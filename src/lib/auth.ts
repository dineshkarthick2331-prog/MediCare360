import { supabase } from './supabase';

export async function signInWithPassword(email: string, password: string, expectedRole: string) {
  if (!supabase) throw new Error('Supabase is not configured.');

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) throw new Error('Invalid credentials.');

  // Role must be checked against a protected profile/role table and enforced by RLS.
  // This client-side check is only a navigation convenience, never the security boundary.
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', data.user.id)
    .single();

  if (profileError || profile?.role !== expectedRole) {
    await supabase.auth.signOut();
    throw new Error('This account does not have access to this portal.');
  }
  return data.user;
}
