import { createServerSupabase } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST() {
  const supabase = await createServerSupabase();
  await supabase.auth.signOut();

  const response = NextResponse.json({ success: true });

  // Clear all Supabase auth cookies
  const cookieNames = [
    'sb-access-token',
    'sb-refresh-token',
  ];

  // Also clear any cookies that start with sb-
  response.cookies.getAll().forEach((cookie) => {
    if (cookie.name.startsWith('sb-')) {
      response.cookies.delete(cookie.name);
    }
  });

  for (const name of cookieNames) {
    response.cookies.delete(name);
  }

  return response;
}
