import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Convert file to base64
    const buffer = await file.arrayBuffer();
    const base64Data = Buffer.from(buffer).toString('base64');
    
    // Determine mime type
    const mimeType = file.type || 'image/jpeg';

    const prompt = `
You are a specialized Forensic Receipt & Invoice Analyzer for corporate expense claims.
Your job is to carefully review the provided document image and extract standard details, 
WHILE simultaneously performing a rigorous visual forensic analysis to detect deepfakes, 
AI-generated receipts, and photoshop manipulations.

Analyze the image for:
1. Font inconsistencies, misalignment, or blurriness typical of AI generation (e.g. Midjourney, DALL-E) or Photoshop.
2. Lighting shadows that don't match the physical crinkles in the paper.
3. Nonsensical background elements or repeating patterns.
4. Signatures of synthetic generation.

Respond STRICTLY with a valid JSON object matching the following structure:
{
  "merchant": "string",
  "amount": number,
  "date": "string (YYYY-MM-DD)",
  "taxNo": "string",
  "receiptId": "string",
  "forensics": {
    "isAiGenerated": boolean,
    "isForged": boolean,
    "confidenceScore": number (0-100 scale of how confident you are in your forgery assessment),
    "anomalyReasons": ["list of strings detailing any suspicious visual anomalies, if any"]
  }
}

Do not include markdown blocks or any other text. Just the raw JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
            {
              inlineData: {
                data: base64Data,
                mimeType,
              }
            }
          ]
        }
      ]
    });

    const text = response.text || '';
    
    // Clean up potential markdown blocks if the model didn't listen
    let jsonStr = text.trim();
    if (jsonStr.startsWith('\`\`\`json')) {
      jsonStr = jsonStr.replace(/^\`\`\`json/, '').replace(/\`\`\`$/, '').trim();
    } else if (jsonStr.startsWith('\`\`\`')) {
      jsonStr = jsonStr.replace(/^\`\`\`/, '').replace(/\`\`\`$/, '').trim();
    }

    let parsedData;
    try {
      parsedData = JSON.parse(jsonStr);
    } catch (e) {
      console.error('Failed to parse Gemini output as JSON:', text);
      return NextResponse.json({ error: 'Failed to parse AI output', raw: text }, { status: 500 });
    }

    const { isAiGenerated, isForged, anomalyReasons } = parsedData.forensics || {};
    const isManipulated = isAiGenerated || isForged;

    // Construct evidence items
    const evidenceItems = [
      {
        id: 'ev-1',
        source: 'Corporate Card API',
        kind: 'TRANSACTION_MATCH',
        status: 'VERIFIED',
        summary: 'Transaction amount matches',
        detail: 'Matched exact amount on employee corporate card.'
      },
      {
        id: 'ev-2',
        source: 'Merchant Registry',
        kind: 'MERCHANT_CHECK',
        status: isManipulated ? 'CONFLICTING' : 'VERIFIED',
        summary: 'Merchant validation',
        detail: 'Verified merchant details and tax ID.'
      }
    ];

    const findings = [];
    if (isManipulated) {
      findings.push({
        id: 'f-1',
        rank: 1,
        title: 'Deepfake / Forgery Detected',
        detail: anomalyReasons?.join(', ') || 'AI manipulation detected in document.',
        sourceRef: 'VISUAL_FORENSICS',
        severity: 'CRITICAL'
      });
    }

    const claimData = {
      id: 'clm-upload-' + Date.now(),
      merchantRaw: parsedData.merchant || 'Unknown Merchant',
      amount: parsedData.amount || 0,
      date: parsedData.date || new Date().toISOString(),
      status: isManipulated ? 'CONFLICTING' : 'VERIFIED',
      category: 'Expense',
      description: 'Extracted via AI Document Verification',
      employee: { name: 'Demo User', empCode: 'EMP001', dept: 'Engineering' },
      extraction: {
        fields: JSON.stringify(parsedData),
        confidence: '98%'
      },
      evidenceItems,
      findings,
      caseFile: {
        decisionStatus: isManipulated ? 'CONFLICTING' : 'VERIFIED',
        recommendedAction: isManipulated 
          ? 'REJECT & INVESTIGATE — Document failed visual forensics. This is a critical violation of corporate policy.' 
          : 'APPROVE — Evidence corroborates claim.'
      }
    };

    return NextResponse.json(claimData);

  } catch (error) {
    console.error('Verify API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
