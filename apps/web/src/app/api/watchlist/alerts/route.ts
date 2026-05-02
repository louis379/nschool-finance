import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';
import {
  alertLimitForTier,
  canCreateAlert,
  toInsertRow,
  validateAlertInput,
  type PlanTier,
} from '@/lib/watchlist-alerts';

async function resolveTier(
  supabase: Awaited<ReturnType<typeof createServerSupabase>>,
  userId: string
): Promise<PlanTier> {
  const { data } = await supabase
    .from('profiles')
    .select('tier')
    .eq('id', userId)
    .maybeSingle<{ tier: string | null }>();
  return data?.tier === 'pro' ? 'pro' : 'free';
}

export async function GET() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('watchlist_alerts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ data });
}

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const validated = validateAlertInput(body);
  if (!validated.ok) {
    return NextResponse.json(
      { error: 'validation_failed', issues: validated.errors },
      { status: 400 }
    );
  }

  const tier = await resolveTier(supabase, user.id);

  const { count, error: countError } = await supabase
    .from('watchlist_alerts')
    .select('id', { count: 'exact', head: true });

  if (countError) {
    return NextResponse.json({ error: countError.message }, { status: 500 });
  }

  if (!canCreateAlert(count ?? 0, tier)) {
    return NextResponse.json(
      {
        error: 'limit_reached',
        limit: alertLimitForTier(tier),
        tier,
      },
      { status: 403 }
    );
  }

  const row = toInsertRow(validated.value, user.id);
  const { data, error } = await supabase
    .from('watchlist_alerts')
    .insert(row)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data }, { status: 201 });
}
