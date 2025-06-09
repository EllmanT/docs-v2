import { createAgent, createTool, openai } from "@inngest/agent-kit";
import { anthropic } from "inngest";
import { z } from "zod";

const parsePDFTool = createTool({
    name:"parse-pdf",
    description:"Analyse the given PDF",
    parameters:z.object({
        pdfUrl:z.string()
    }),

    handler: async ({pdfUrl}, {step})=>{
        try {
            return await step?.ai.infer("parse-pdf",{
                model:anthropic({
                    model:"claude-3-5-sonnet-20241022",
                    defaultParameters:{
                        max_tokens:3094,
                    }
                }),
                body:{
                    messages:[
                        {
                            role:"user",
                            content:[
                                {
                                    type:"document",
                                    source:{
                                        type:"url",
                                        url:pdfUrl
                                    }
                                },
                                {
                                    type:"text",
                                    text:`Extract the data from the vat certificate and return the structured output as follows:
                                    {
                                    "taxPayerName":" Tax Payer Name",
                                    "tradeName":"Trade Name",
                                    "tinNumber":"2000111222",
                                    "vatNumber":"220123123",
                                           
                                    }
                                    `
                                }
                            ]
                        }
                    ]
                }
            })  
        } catch (error) {
            console.error(error);
            throw error;
        }
      
    }
})

export const docScanningAgent = createAgent({
    name:"Doc Scanning Agent",
    description:
    "Processes vat certificate PDFs to extract key information -  the trade name, tax payer name , TIN Number VAT number",
    system:` You are an AI powered vat certificate scanning assistant. Your primary role is to accurately extract and structure
    relevant information from scanned vat vertificate. Your task includes recognizing and parsing the following details
    - Tax Payer Name: The name that is under the heading that says taxpayer name.
    -Trade name: The name that is under the heading that says trade name.
    - Tin Number: The number that is under the heading that says TIN . This is a 10 digit number . This number starts with 200.
    - Vat Number: The number that is under the heading that says VAT . This is a 9 digit number . This number starts with 230.
    - Ensure high accuracy by detecting OCR errors and correcting misread text when possible.
    - If any key details are missing or unclear return a structured response indicating incomplete data.
    - Handle multiple formats , languages and varying vat certificate document layouts efficiently.
    -Maintain a structured JSON output for easy integration with databases or expense tracking systems
    `,
    model:openai({
        model:"gpt-4o-mini",
        defaultParameters:{
            max_completion_tokens:3094,
        }
    }),
    tools:[parsePDFTool]
})