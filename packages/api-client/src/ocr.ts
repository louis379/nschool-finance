import type { OcrParsedData } from '@nschool/shared';

const API_BASE = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export const ocrApi = {
  async analyzeImage(
    file: File,
    sourceType: 'bank' | 'broker' | 'accounting' = 'bank'
  ): Promise<OcrParsedData> {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('source_type', sourceType);

    const res = await fetch(`${API_BASE}/api/ocr`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      throw new Error('OCR analysis failed');
    }

    const data = await res.json();
    return data.data;
  },
};
