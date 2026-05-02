import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

import { rateLimit } from '@/lib/rate-limit';
import { createServerSupabase } from '@/lib/supabase/server';

export const runtime = 'nodejs';

type Summary = { totalValue: number; totalCost: number; pnl: number; pnlPct: number };
type WeightItem = { symbol: string; name: string; value: number; weight: number };
type Metrics = { var95: number; sharpe: number; maxDrawdown: number; annualizedVol: number };

type Body = {
  summary: Summary;
  weights: WeightItem[];
  metrics: Metrics;
  concentration: number;
};

function isValidBody(b: unknown): b is Body {
  if (!b || typeof b !== 'object') return false;
  const obj = b as Record<string, unknown>;
  return (
    typeof obj.summary === 'object' &&
    Array.isArray(obj.weights) &&
    typeof obj.metrics === 'object' &&
    typeof obj.concentration === 'number'
  );
}

const SYSTEM = `你是 nSchool 的財務教育助理，專門針對「投資組合風險」給一句建議。
規則：
- 回應只回 JSON：{"sentence": "..."}
- sentence 用繁體中文，30~60 字
- 內容圍繞集中度、波動率、回撤；不要提具體股價或預測
- 語氣鼓勵但誠實，最後可加一個適合新手的小提醒
- 教學用，不構成投資建議`;

export async function POST(request: Request): Promise<NextResponse> {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: '無效的 JSON' }, { status: 400 });
    }
    if (!isValidBody(body)) {
      return NextResponse.json({ error: '請求格式不正確' }, { status: 400 });
    }

    // Auth — 已登入才能用 LLM；guest fallback 給 deterministic 文字
    let userKey = '';
    try {
      const supabase = await createServerSupabase();
      const { data } = await supabase.auth.getUser();
      if (data?.user) userKey = data.user.id;
    } catch {
      userKey = '';
    }
    if (!userKey) {
      const fwd = request.headers.get('x-forwarded-for') ?? '';
      userKey = `anon:${fwd.split(',')[0]?.trim() || 'unknown'}`;
    }

    // Rate limit — 1 次 / 5 分鐘 / 用戶
    const FIVE_MIN = 5 * 60 * 1000;
    const rl = rateLimit(`risk:${userKey}`, 1, FIVE_MIN);
    if (!rl.allowed) {
      const resetSec = Math.max(0, Math.ceil((rl.resetAt - Date.now()) / 1000));
      console.log('[risk-checkup] rate limited', { userKey, resetSec });
      return NextResponse.json(
        { error: `太快了，${resetSec} 秒後再試` },
        { status: 429 }
      );
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      // Fallback 在沒設 API key 的環境也能 ship
      const sentence = buildFallbackSentence(body);
      console.log('[risk-checkup] no api key, fallback sentence');
      return NextResponse.json({ sentence });
    }

    const client = new Anthropic({ apiKey });
    const prompt = buildPrompt(body);

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 200,
      system: SYSTEM,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = response.content.find((c) => c.type === 'text');
    if (!text || text.type !== 'text') {
      return NextResponse.json({ error: 'AI 沒有回應' }, { status: 502 });
    }

    let sentence = '';
    try {
      const parsed: unknown = JSON.parse(text.text);
      if (
        parsed &&
        typeof parsed === 'object' &&
        'sentence' in parsed &&
        typeof (parsed as { sentence: unknown }).sentence === 'string'
      ) {
        sentence = (parsed as { sentence: string }).sentence;
      }
    } catch {
      sentence = text.text.trim();
    }

    if (!sentence) sentence = buildFallbackSentence(body);

    console.log('[risk-checkup] sentence ok', { userKey, len: sentence.length });
    return NextResponse.json({ sentence });
  } catch (err) {
    console.error('[risk-checkup] error', err);
    return NextResponse.json({ error: '處理失敗' }, { status: 500 });
  }
}

function buildPrompt(body: Body): string {
  return [
    `總市值 ${Math.round(body.summary.totalValue)} 元，報酬率 ${body.summary.pnlPct.toFixed(2)}%。`,
    `最大持股權重 ${body.concentration.toFixed(1)}%。`,
    `VaR95 ${body.metrics.var95.toFixed(2)}%、Sharpe ${body.metrics.sharpe.toFixed(2)}、`,
    `最大回撤 ${body.metrics.maxDrawdown.toFixed(2)}%、年化波動率 ${body.metrics.annualizedVol.toFixed(2)}%。`,
    '請給一句話的風險體檢建議。',
  ].join(' ');
}

function buildFallbackSentence(body: Body): string {
  if (body.concentration > 40) {
    return `最大持股佔了 ${body.concentration.toFixed(1)}%，建議分散到 4~6 檔不同產業，降低單一風險。`;
  }
  if (body.metrics.maxDrawdown > 20) {
    return `回撤達 ${body.metrics.maxDrawdown.toFixed(1)}%，留意波動承受度，適度配置防禦型資產。`;
  }
  if (body.metrics.annualizedVol > 30) {
    return `年化波動率 ${body.metrics.annualizedVol.toFixed(1)}% 偏高，可加入較低波動的標的平衡。`;
  }
  return '配置看起來相對均衡，繼續保持紀律 — 別忘了定期再平衡並複習基礎概念。';
}
