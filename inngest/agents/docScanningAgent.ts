import { createAgent, createTool, openai } from "@inngest/agent-kit";
import { anthropic } from "inngest";
import { z } from "zod";
import { client } from "@/lib/schematic";
import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import convex from "@/lib/convexClient";

export const parsePDFTool = createTool({
  name: "parse-pdf",
  description: "Analyse the given vat certificate PDF. ",
  parameters: z.object({
    pdfUrl: z.string(),
    fileDisplayName: z
      .string()
 .describe(
            "THe readable display name of the vat certificate document to show in the UI. If the file name is not human readale use this to give a more readable name"
        ),
            docId: z.string().describe("The ID of the VAT certificate document"),
    taxPayerName: z.string().describe("Name under the heading 'Taxpayer Name' or 'Name of Registered Operator'"),
    tradeName: z.string().describe("Name under the heading 'Trade Name'"),
    tinNumber: z
      .string()
      .describe("TIN: 10-digit number starting with 200"),
    vatNumber: z
      .string()
      .describe("VAT: 9-digit number starting with 220"),
  }),

  handler: async (params, context) => {
    const { pdfUrl, fileDisplayName, docId } = params;
    const { step } = context;

    try {
      const result1 = await step?.ai.infer("parse-pdf", {
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
                  text: `
                  
                 
  Make sure the document is called VAT REGISTRATION CERTIFICATE or VAT CERTIFICATE or any variation. 
  Ensure that the document is not an invoice, receipt, or credit note. If document is not specifically a vat certificate terminate the process immediately and return an error message that says it is not a vat certificate.
 If the document is a vat certificate then Extract the data from the VAT certificate and return the structured output as follows:
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

      const textBlock = result1?.content.find((block) => block.type === "text");

      if (textBlock && "text" in textBlock) {
        const rawText = textBlock.text;
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);

        if (jsonMatch) {
          try {
            const data = JSON.parse(jsonMatch[0]);
            const { taxPayerName, tradeName, tinNumber, vatNumber } = data;

            console.log("Extracted:", taxPayerName, tradeName, tinNumber, vatNumber);

            // Save to database
            try {
              const { userId } = await convex.mutation(
                api.docs.updateDocWithExtractedData,
                {
                  id: docId as Id<"docs">,
                  fileDisplayName,
                  taxPayerName,
                  tradeName,
                  tinNumber,
                  vatNumber,
                }
              );

              await client.track({
                event: "scan",
                company: { id: userId },
                user: { id: userId },
              });

              // ✅ Mark agent as done
              await context.network?.state.kv.set("save-to-database", true);

             
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
                error: error instanceof Error ? error.message : "Unknown error",
              };
            }
          } catch (err) {
            console.error("Error parsing JSON:", err);
          }
        } else {
         await context.network?.state.kv.set("wrong-doc-type", true);

         const cleanUp=await convex.mutation(api.docs.deleteDocRecord,{
            id:docId as Id<"docs">

        })
          console.error("Invalid docment type.");

        return {cleanUp}
        }
      } else {
        console.error("No text block found.");
      }
    } catch (error) {
      console.error("AI parsing failed:", error);
      throw error;
    }
  },
});

export const docScanningAgent = createAgent({
  name: "Doc Scanning Agent",
  description:
    "Processes VAT certificate PDFs to extract key info: Trade name, Tax Payer Name, TIN Number, VAT Number.   Make sure the document is called VAT REGISTRATION CERTIFICATE or VAT CERTIFICATE or any variation. else terminate the process",
  system: `You are an AI-powered VAT certificate scanning assistant.
  Make sure the document is called VAT REGISTRATION CERTIFICATE or VAT CERTIFICATE or any variation. 
  Ensure that the document is not an invoice, receipt, or credit note. If document is not specifically a vat certificate terminate the process immediately and return an error message that says it is not a vat certificate.
Your job is to extract and structure the following:
- Tax Payer Name: The name under 'Taxpayer Name'
- Trade Name: The name under 'Trade Name'
- TIN Number: 10-digit starting with 200
- VAT Number: 9-digit starting with 220
You must detect OCR errors, handle different formats and languages, and return results in structured JSON.`,
  model: openai({
    model: "gpt-4o-mini",
    defaultParameters: {
      max_completion_tokens: 3094,
    },
  }),
  tools: [parsePDFTool],
});