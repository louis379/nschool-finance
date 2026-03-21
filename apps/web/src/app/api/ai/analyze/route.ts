import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const ANALYSIS_SYSTEM_PROMPT = `你是 nSchool 的 AI 財務顧問，專門幫助投資新手分析財務狀況和制定投資策略。

你的風格：
- 用簡單易懂的語言，避免過多專業術語
- 給出具體可行的建議
- 適當使用比喻讓概念更容易理解
- 保持正面積極但誠實的態度

重要提醒：
- 你提供的是教育性質的分析，不構成投資建議
- 提醒用戶投資有風險
- 鼓勵用戶持續學習

回應格式請用 JSON：
{
  "summary": "一句話總結",
  "analysis": "詳細分析（200字內）",
  "suggestions": ["建議1", "建議2", "建議3"],
  "risk_note": "風險提醒",
  "score": 0-100 的評分
}`;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, data } = body;

    let userMessage = '';

    switch (type) {
      case 'portfolio':
        userMessage = `請分析以下投資組合：\n${JSON.stringify(data.holdings, null, 2)}\n\n總資產：${data.totalValue}\n初始資本：${data.initialCapital}`;
        break;
      case 'financial_health':
        userMessage = `請分析以下財務狀況：\n月收入：${data.income}\n月支出：${data.expense}\n總資產：${data.totalAssets}\n總負債：${data.totalDebt}\n緊急預備金：${data.emergencyFund}`;
        break;
      case 'strategy':
        userMessage = `用戶風險偏好：${data.riskProfile}\n投資目標：${data.goals}\n可投資金額：${data.investableAmount}\n投資期限：${data.timeHorizon}\n\n請提供個人化的投資策略建議。`;
        break;
      case 'trade_review':
        userMessage = `請覆盤以下交易記錄：\n${JSON.stringify(data.trades, null, 2)}\n\n勝率：${data.winRate}%\n平均報酬：${data.avgReturn}%`;
        break;
      default:
        return NextResponse.json({ error: 'Invalid analysis type' }, { status: 400 });
    }

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1500,
      system: ANALYSIS_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userMessage }],
    });

    const textContent = response.content.find((c) => c.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      return NextResponse.json({ error: 'No response from AI' }, { status: 500 });
    }

    const parsed = JSON.parse(textContent.text);
    return NextResponse.json({ success: true, data: parsed });
  } catch (error) {
    console.error('AI analysis error:', error);
    return NextResponse.json(
      { error: 'Analysis failed' },
      { status: 500 }
    );
  }
}
