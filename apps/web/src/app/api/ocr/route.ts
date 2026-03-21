import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const OCR_SYSTEM_PROMPT = `你是一個專業的財務資料 OCR 辨識助手。用戶會上傳銀行 APP、券商 APP 或記帳 APP 的截圖。

你的任務是：
1. 辨識截圖中的所有交易記錄
2. 提取每筆交易的日期、描述、金額、類型（收入/支出）
3. 為每筆交易建議分類（餐飲、交通、購物、娛樂、居住、醫療、教育、通訊、保險、薪資、獎金、投資收入等）
4. 如果能辨識帳戶餘額，也一併提取

請以 JSON 格式回傳，格式如下：
{
  "transactions": [
    {
      "date": "YYYY-MM-DD",
      "description": "交易描述",
      "amount": 數字（支出為負數，收入為正數）,
      "type": "income" | "expense",
      "category_suggestion": "分類名稱"
    }
  ],
  "account_balance": 數字或null,
  "account_name": "帳戶名稱或null"
}

只回傳 JSON，不要其他文字。`;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File | null;
    const sourceType = formData.get('source_type') as string || 'bank';

    if (!file) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString('base64');
    const mediaType = file.type as 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif';

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2000,
      system: OCR_SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mediaType,
                data: base64,
              },
            },
            {
              type: 'text',
              text: `這是一張${sourceType === 'bank' ? '銀行 APP' : sourceType === 'broker' ? '券商 APP' : '記帳 APP'}的截圖，請辨識其中的交易資料。`,
            },
          ],
        },
      ],
    });

    const textContent = response.content.find((c) => c.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      return NextResponse.json({ error: 'No text response from AI' }, { status: 500 });
    }

    const parsed = JSON.parse(textContent.text);
    return NextResponse.json({ success: true, data: parsed });
  } catch (error) {
    console.error('OCR error:', error);
    return NextResponse.json(
      { error: 'OCR processing failed' },
      { status: 500 }
    );
  }
}
