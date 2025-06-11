// lib/parsePdf.ts
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!, // set this in .env.local
});

export async function parsePdf({ pdfUrl }: { pdfUrl: string }) {
  const response = await anthropic.messages.create({
          model: "claude-3-5-sonnet-20241022",
    max_tokens: 3094,
    temperature: 0,
    messages: [
      {
        role: 'user',
        content: [
             
          {
            type: 'text',
            text: `Extract the data from the VAT certificate and return the structured output as follows:
{
  "taxPayerName": "Tax Payer Name",
  "tradeName": "Trade Name",
  "tinNumber": "2000111222",
  "vatNumber": "220123123"
}`,
          },
          {
            type: 'document',
            source: {
              type: 'url',
              url: pdfUrl,
            },
          },
        ],
      },
    ],
  });

  const textContent = response.content.find((block) => block.type === 'text');

  if (!textContent || !('text' in textContent)) {
    throw new Error("No valid text response from Claude.");
  }

  const jsonMatch = textContent.text.match(/\{[\s\S]*?\}/);
  if (!jsonMatch) {
    throw new Error("No JSON found in Claude's response.");
  }

  try {
    const data = JSON.parse(jsonMatch[0]);
    
    return {
      taxPayerName: data.taxPayerName,
      tradeName: data.tradeName,
      tinNumber: data.tinNumber,
      vatNumber: data.vatNumber,
    };
  } catch (error) {
    throw new Error("Failed to parse JSON from Claude output: " + error);
  }
}
