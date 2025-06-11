import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import convex from "@/lib/convexClient";
import { client } from "@/lib/schematic";
import { createAgent, createTool, openai } from "@inngest/agent-kit";
import { anthropic } from "inngest";
import { z } from "zod";

/**
 * Tool to extract data from a VAT certificate PDF
 */
export const parsePDFTool = createTool({
  name: "parse-pdf",
  description: "Analyse the given PDF and extract VAT certificate data",
  parameters: z.object({
    pdfUrl: z.string(),
  }),
  handler: async ({ pdfUrl }, { step }) => {
    try {
      const step1= await step?.ai.infer("parse-pdf", {
        model: anthropic({
          model: "claude-3-5-sonnet-20241022",
          defaultParameters: {
            max_tokens: 3094,
          },
        }),
        body: {
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "document",
                  source: {
                    type: "url",
                    url: pdfUrl,
                  },
                },
                {
                  type: "text",
                  text: `Extract the data from the VAT certificate and return the structured output as follows:
{
  "taxPayerName": "Tax Payer Name",
  "tradeName": "Trade Name",
  "tinNumber": "2000111222",
  "vatNumber": "220123123"
}`,
                },
              ],
            },
          ],
        },
      });

      console.log("body", step1?.content)
      return step1;
    } catch (error) {
        console.log("Error")
      console.error(error);
      throw error;
    }
  },
});

/**
 * Tool to save extracted VAT certificate data into the database
 */
const saveToDatabase = createTool({
  name: "save-to-database",
  description: "Saves the given VAT certificate data to the Convex database",
  parameters: z.object({
    fileDisplayName: z.string().describe("The readable name of the VAT certificate"),
    docId: z.string().describe("The ID of the document to update"),
    taxPayerName: z.string().describe("Name under 'Taxpayer Name' heading"),
    tradeName: z.string().describe("Name under 'Trade Name' heading"),
    tinNumber: z.string().describe("TIN (10 digits starting with 200)"),
    vatNumber: z.string().describe("VAT (9 digits starting with 220)"),
  }),
  handler: async (params, context) => {
    const { fileDisplayName, docId, taxPayerName, tradeName, tinNumber, vatNumber } = params;
    console.log("here")
    console.log("params", params)
    const result = await context.step?.run("save-vat-data", async () => {
        console.log("here 2")
      try {
                console.log("here 3")

        const { userId } = await convex.mutation(api.docs.updateDocWithExtractedData, {
          id: docId as Id<"docs">,
          fileDisplayName,
          taxPayerName,
          tradeName,
          tinNumber,
          vatNumber,
        });
        console.log("here 4")

        await client.track({
          event: "scan",
          company: { id: userId },
          user: { id: userId },
        });
                    console.log("here 6")

        return {

          addedToDb: "Success",
          docId,
          fileDisplayName,
          taxPayerName,
          tradeName,
          tinNumber,
          vatNumber,
        };
      } catch (error) {
        return {
          addedToDb: "Failed",
          error: error instanceof Error ? "error.message "+error.message : "Unknown error",
        };
      }
    });

    if (result?.addedToDb === "Success") {
      context.network?.state.kv.set("save-to-database", true);
      context.network?.state.kv.set("doc", docId);
    }

    return result;
  },
});

/**
 * Unified VAT Document Processing Agent
 */
export const vatDocProcessingAgent = createAgent({
  name: "VAT Document Processing Agent",
  description: "Extracts and saves data from VAT certificate PDFs",
  system: `
You are an AI agent that processes scanned VAT certificate PDFs. You should:
1. Extract Taxpayer Name, Trade Name, TIN (10-digit starting with 200), and VAT Number (9-digit starting with 220) from the PDF.
Handle OCR errors, format variations, and return structured JSON responses.`,
  model: openai({
    model: "gpt-4o-mini",
    defaultParameters: {
      max_completion_tokens: 3094,
    },
  }),
  tools: [parsePDFTool],
});
