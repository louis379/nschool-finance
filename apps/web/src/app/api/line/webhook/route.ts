import { NextResponse } from 'next/server';
import crypto from 'crypto';

const CHANNEL_SECRET = process.env.LINE_CHANNEL_SECRET || '';
const CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN || '';

// --- Natural language parser for bookkeeping ---

type ParsedEntry = {
  type: 'expense' | 'income';
  amount: number;
  description: string;
  category: string;
};

const CATEGORY_KEYWORDS: Record<string, { keywords: string[]; type: 'expense' | 'income' }> = {
  '餐飲': { keywords: ['早餐', '午餐', '晚餐', '宵夜', '飲料', '咖啡', '便當', '吃', '餐', '火鍋', '拉麵', '小吃', '外送', 'uber eats', 'foodpanda', '手搖', '奶茶', '茶', '麵', '飯', '食', '雞排', '滷味', '鹽酥雞', '麥當勞', '肯德基', '摩斯'], type: 'expense' },
  '交通': { keywords: ['捷運', '公車', '高鐵', '台鐵', '計程車', '加油', 'uber', '停車', '交通', 'youbike', '油錢', '火車', '機車', '汽車'], type: 'expense' },
  '購物': { keywords: ['買', '購物', '衣服', '鞋', '包', '網購', '蝦皮', 'momo', '淘寶', '超商', '超市', '全聯', '家樂福', '好市多', '日用品'], type: 'expense' },
  '娛樂': { keywords: ['電影', '遊戲', 'netflix', 'spotify', 'KTV', '玩', '門票', '旅遊', '旅行', '住宿', '飯店'], type: 'expense' },
  '居住': { keywords: ['房租', '租金', '水電', '瓦斯', '管理費', '電費', '水費', '網路費'], type: 'expense' },
  '通訊': { keywords: ['電話費', '手機費', '網路', '電信'], type: 'expense' },
  '醫療': { keywords: ['看醫生', '醫院', '藥', '掛號', '牙醫', '診所', '看診'], type: 'expense' },
  '薪資': { keywords: ['薪水', '薪資', '工資', '月薪', '發薪'], type: 'income' },
  '投資收入': { keywords: ['股利', '利息', '分紅', '投資', '收益', '配息'], type: 'income' },
  '獎金': { keywords: ['獎金', '年終', '紅包', '中獎'], type: 'income' },
  '兼職': { keywords: ['兼職', '外快', '接案', '打工', '副業'], type: 'income' },
};

function parseBookkeepingMessage(text: string): ParsedEntry | null {
  const trimmed = text.trim();

  // Pattern 1: "午餐 120" or "午餐120" — description + amount
  const match1 = trimmed.match(/^(.+?)\s*(\d+(?:\.\d+)?)$/);
  // Pattern 2: "+45000 薪水" or "-120 午餐" — signed amount + description
  const match2 = trimmed.match(/^([+-]?)(\d+(?:\.\d+)?)\s+(.+)$/);
  // Pattern 3: "$120 午餐" or "NT$120 午餐"
  const match3 = trimmed.match(/^(?:NT?\$?|＄)\s*(\d+(?:\.\d+)?)\s+(.+)$/i);

  let amount: number;
  let description: string;
  let forceType: 'expense' | 'income' | null = null;

  if (match1) {
    description = match1[1].trim();
    amount = parseFloat(match1[2]);
  } else if (match2) {
    const sign = match2[1];
    amount = parseFloat(match2[2]);
    description = match2[3].trim();
    if (sign === '+') forceType = 'income';
    if (sign === '-') forceType = 'expense';
  } else if (match3) {
    amount = parseFloat(match3[1]);
    description = match3[2].trim();
  } else {
    return null;
  }

  if (amount <= 0 || amount > 10000000) return null;

  // Auto-categorize
  let category = '其他';
  let type: 'expense' | 'income' = 'expense';
  const descLower = description.toLowerCase();

  for (const [cat, config] of Object.entries(CATEGORY_KEYWORDS)) {
    if (config.keywords.some((kw) => descLower.includes(kw))) {
      category = cat;
      type = config.type;
      break;
    }
  }

  if (forceType) type = forceType;

  return { type, amount, description, category };
}

// --- LINE Messaging API helpers ---

async function replyMessage(replyToken: string, messages: { type: string; text: string }[]) {
  if (!CHANNEL_ACCESS_TOKEN) return;

  await fetch('https://api.line.me/v2/bot/message/reply', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${CHANNEL_ACCESS_TOKEN}`,
    },
    body: JSON.stringify({ replyToken, messages }),
  });
}

function verifySignature(body: string, signature: string): boolean {
  if (!CHANNEL_SECRET) return true; // Skip verification in dev
  const hash = crypto
    .createHmac('SHA256', CHANNEL_SECRET)
    .update(body)
    .digest('base64');
  return hash === signature;
}

// --- In-memory store (per LINE userId) for demo ---
// In production, this should use Supabase
const userTransactions: Record<string, ParsedEntry[]> = {};

// --- Webhook handler ---

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get('x-line-signature') || '';

  // Verify LINE signature
  if (CHANNEL_SECRET && !verifySignature(rawBody, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
  }

  const body = JSON.parse(rawBody);
  const events = body.events || [];

  for (const event of events) {
    if (event.type !== 'message' || event.message?.type !== 'text') continue;

    const userId = event.source?.userId || 'unknown';
    const text = event.message.text.trim();
    const replyToken = event.replyToken;

    // Command: help
    if (text === '說明' || text === '幫助' || text === 'help' || text === '?') {
      await replyMessage(replyToken, [{
        type: 'text',
        text: `📒 nSchool 快速記帳

直接輸入就能記帳：
• 午餐 120
• 咖啡 65
• +45000 薪水
• 捷運 30

查詢指令：
• 今日 → 查看今天的記錄
• 本月 → 查看本月統計
• 清除 → 清除所有紀錄

小技巧：
• 加「+」號代表收入
• AI 會自動分類（餐飲、交通...）`
      }]);
      continue;
    }

    // Command: today summary
    if (text === '今日' || text === '今天') {
      const txs = userTransactions[userId] || [];
      if (txs.length === 0) {
        await replyMessage(replyToken, [{ type: 'text', text: '📭 今天還沒有記帳喔！\n\n直接輸入「午餐 120」就能開始記帳' }]);
      } else {
        const totalExp = txs.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
        const totalInc = txs.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
        const lines = txs.map((t, i) =>
          `${i + 1}. ${t.type === 'income' ? '📈' : '📉'} ${t.description} — ${t.type === 'income' ? '+' : '-'}$${t.amount.toLocaleString()} (${t.category})`
        );
        await replyMessage(replyToken, [{
          type: 'text',
          text: `📊 今日紀錄（${txs.length} 筆）\n\n${lines.join('\n')}\n\n💰 收入：+$${totalInc.toLocaleString()}\n💸 支出：-$${totalExp.toLocaleString()}\n📋 淨額：$${(totalInc - totalExp).toLocaleString()}`
        }]);
      }
      continue;
    }

    // Command: monthly summary
    if (text === '本月' || text === '月報') {
      const txs = userTransactions[userId] || [];
      const totalExp = txs.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
      const totalInc = txs.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);

      // Category breakdown
      const catBreakdown: Record<string, number> = {};
      txs.filter((t) => t.type === 'expense').forEach((t) => {
        catBreakdown[t.category] = (catBreakdown[t.category] || 0) + t.amount;
      });
      const catLines = Object.entries(catBreakdown)
        .sort(([, a], [, b]) => b - a)
        .map(([cat, amt]) => `  ${cat}：$${amt.toLocaleString()}`);

      await replyMessage(replyToken, [{
        type: 'text',
        text: `📅 本月統計\n\n💰 總收入：+$${totalInc.toLocaleString()}\n💸 總支出：-$${totalExp.toLocaleString()}\n📋 結餘：$${(totalInc - totalExp).toLocaleString()}\n\n📊 支出分類：\n${catLines.length > 0 ? catLines.join('\n') : '  （尚無紀錄）'}\n\n共 ${txs.length} 筆紀錄`
      }]);
      continue;
    }

    // Command: clear
    if (text === '清除' || text === '重置') {
      userTransactions[userId] = [];
      await replyMessage(replyToken, [{ type: 'text', text: '🗑️ 已清除所有紀錄！' }]);
      continue;
    }

    // Try to parse as bookkeeping entry
    const parsed = parseBookkeepingMessage(text);

    if (parsed) {
      // Save transaction
      if (!userTransactions[userId]) userTransactions[userId] = [];
      userTransactions[userId].push(parsed);

      const emoji = parsed.type === 'income' ? '📈' : '✅';
      const sign = parsed.type === 'income' ? '+' : '-';
      const todayTotal = userTransactions[userId]
        .filter((t) => t.type === 'expense')
        .reduce((s, t) => s + t.amount, 0);

      await replyMessage(replyToken, [{
        type: 'text',
        text: `${emoji} 已記錄！\n\n${parsed.description}\n${sign}$${parsed.amount.toLocaleString()}\n分類：${parsed.category}\n\n📊 今日累計支出：$${todayTotal.toLocaleString()}`
      }]);
    } else {
      // Not recognized
      await replyMessage(replyToken, [{
        type: 'text',
        text: `🤔 我看不懂這筆記帳\n\n試試這樣輸入：\n• 午餐 120\n• 咖啡 65\n• +45000 薪水\n\n輸入「說明」看完整教學`
      }]);
    }
  }

  return NextResponse.json({ success: true });
}

// LINE webhook verification (GET)
export async function GET() {
  return NextResponse.json({ status: 'ok', message: 'nSchool Finance LINE Bot webhook' });
}
