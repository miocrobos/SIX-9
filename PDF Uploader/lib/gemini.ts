import 'server-only';

const GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY;
const GEMINI_MODEL = 'gemini-2.0-flash';
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

// Keep the prompt within a sensible size so we don't exceed token limits
const MAX_INPUT_CHARS = 24000;

/**
 * Generates a concise summary of a document's text using Google Gemini.
 * Returns null if the API key is missing or the request fails, so callers can
 * degrade gracefully without breaking the page.
 */
export async function generateSummary(text: string): Promise<string | null> {
    if (!GEMINI_API_KEY) {
        console.warn('GOOGLE_GEMINI_API_KEY is not set; skipping summary generation.');
        return null;
    }

    const trimmed = text.trim();
    if (!trimmed) return null;

    const prompt = `You are a knowledge assistant for SIX, the operator of the financial market infrastructure in Switzerland and Spain.
Summarize the following document so an employee can quickly understand it before asking questions.

Write a clear, professional overview in 3-5 sentences covering:
- what the document is about and its purpose,
- the key topics, decisions, or data it contains,
- who in the organization would find it most useful.

Do not use headings, bullet points, or markdown. Respond with the summary text only.

DOCUMENT:
${trimmed.slice(0, MAX_INPUT_CHARS)}`;

    try {
        const res = await fetch(`${GEMINI_ENDPOINT}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { temperature: 0.3, maxOutputTokens: 600 },
            }),
        });

        if (!res.ok) {
            console.error('Gemini API error:', res.status, await res.text());
            return null;
        }

        const data = await res.json();
        const summary: string | undefined = data?.candidates?.[0]?.content?.parts?.[0]?.text;

        return summary?.trim() || null;
    } catch (e) {
        console.error('Failed to generate summary with Gemini:', e);
        return null;
    }
}
