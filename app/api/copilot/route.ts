import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { GoogleGenAI } from '@google/genai';

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();
    const lastMessage = messages[messages.length - 1].content.toLowerCase();

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      // Use Real Gemini
      const ai = new GoogleGenAI({ apiKey });
      
      // Fetch context
      const claims = await prisma.claim.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { employee: true, findings: true }
      });
      
      const contextStr = JSON.stringify(claims.map((c: any) => ({
        id: c.id,
        merchant: c.merchantRaw,
        amount: c.amount,
        status: c.status,
        employee: c.employee.name,
        findings: c.findings.map((f: any) => f.title)
      })));

      const systemInstruction = `You are the AI Receipt Shield Auditor Copilot. Answer questions based on this recent claims data: ${contextStr}`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          { role: 'user', parts: [{ text: systemInstruction + "\n\nUser: " + lastMessage }] }
        ],
      });
      
      return NextResponse.json({ reply: response.text });
    } else {
      // Deterministic Mock Simulation
      let reply = "I'm analyzing the data...";

      if (lastMessage.includes('risk') || lastMessage.includes('flag')) {
        const conflicting = await prisma.claim.count({ where: { status: 'CONFLICTING' } });
        reply = `I see ${conflicting} claims currently marked as CONFLICTING. The most critical issue right now is clm-002 (The Taj Mahal Palace) where the ledger amount (18,750 INR) doesn't match the receipt amount.`;
      } else if (lastMessage.includes('email') || lastMessage.includes('draft')) {
        reply = "Here is a draft you can send:\n\nSubject: Clarification needed on recent expense\n\nHi [Employee],\nWe noticed a discrepancy in the receipt uploaded for the Taj Mahal Palace on Oct 12. Could you please provide the final folio or clarify the room charges vs. meals?\n\nThanks,\nFinance Team";
      } else if (lastMessage.includes('policy')) {
        reply = "Currently, our policy allows up to 5,000 INR per night for hotels. Anything above this requires Director-level approval or will be flagged as a POLICY_EXCEPTION.";
      } else {
        reply = "Based on the dashboard metrics, our verified rate is looking steady, but we have a few unverified claims pending review. You can ask me to draft an email to employees with pending claims, or summarize our top vendor risks.";
      }

      // Add a slight delay for realism
      await new Promise(r => setTimeout(r, 1000));
      return NextResponse.json({ reply });
    }
  } catch (error) {
    console.error('Copilot error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
