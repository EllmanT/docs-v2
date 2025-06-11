import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import convex from "@/lib/convexClient";
import { client } from "@/lib/schematic";
import { createAgent, createTool, openai } from "@inngest/agent-kit";

import {z} from "zod"
export const saveToDatabase = createTool({
    name:"save-to-database",
    description:"Saves the given data to the convex database",
    parameters:z.object({
        fileDisplayName:
        z.string()
        .describe(
            "THe readable display name of the vat certificate document to show in the UI. If the file name is not human readale use this to give a more readable name"
        ),
        docId: z.string().describe("The Id of the vat certificate document to update"),
        taxPayerName:z.string().describe("The name that is under the heading that says taxpayer name"),
        tradeName:z.string().describe("The name that is under the heading that says trade name"),
        tinNumber:z.string().describe("The number that is under the heading that says TIN . This is a 10 digit number . This number starts with 200"),
        vatNumber:z.string().describe("The number that is under the heading that says VAT . This is a 9 digit number . This number starts with 220"),
    }),
    handler:async(params, context)=>{
        const {
            fileDisplayName,
            docId,
            taxPayerName,
            tradeName,
            tinNumber,
            vatNumber,
           
        } = params;

        const result= await context.step?.run(
            "save-receipt-to-database",
            async()=>{
                // 
                try {

                    // Call the convex mutation to update the receipt with the extracted data
                    const {userId} = await convex.mutation(
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

                    // Track event in schematic
                    await client.track({
                        event:"scan",
                        company:{
                            id:userId,
                        },
                        user:{
                            id:userId,
                        }
                    });

                    return {
                        addedToDb:"Success",
                        docId,
                        fileDisplayName,
                        taxPayerName,
                        tradeName,
                        tinNumber,
                        vatNumber,
                    }
                } catch (error) {
                    return{
                        addedToDb:"Failed",
                        error: error instanceof Error ? error.message: "Unknown error"
                    }
                }
            },
        );
        if(result?.addedToDb ==="Success"){
            // Only set KV values if the operation was successful
            context.network?.state.kv.set("save-to-database", true);
            context.network?.state.kv.set("doc", docId); 
        }
        return result;
    
    }
})

export const databaseAgent = createAgent({
    name : "Database Agent",
    description:"responsible for taking key information regarding vat certificate and saving it to the convex database",
    system:"You are a helpful assistatnt that takes key information regarding vat certificate and saves it to the convex database",
    model: openai({
        model:"gpt-4o-mini",
        defaultParameters:{
            max_completion_tokens:1000,
        }
    }),
    tools: [saveToDatabase]
})