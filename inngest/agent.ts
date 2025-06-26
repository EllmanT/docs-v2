import {
    createNetwork,
} from "@inngest/agent-kit"
import {createServer} from "@inngest/agent-kit/server"
import { inngest } from "./client";
import { docScanningAgent } from "./agents/docScanningAgent";
import Events from "@/constants/constants";


const agentNetwork = createNetwork({

    name:"Agent Team",
    agents:[ docScanningAgent],
   
    defaultRouter:({network})=>{
        const savedToDatabase = network.state.kv.get("save-to-database");
        const wrongDocType = network.state.kv.get("wrong-doc-type");
         if(savedToDatabase !==undefined || wrongDocType){
            // Terminate the agent process if the data has been saved to the database

            return undefined;
        }
        return docScanningAgent;
    }
})

export const server = createServer({
    agents:[ docScanningAgent],
    networks:[agentNetwork]
});

export const extractAndSavePDF = inngest.createFunction(
    {id: "Extract PDF and Save in Database"},
    {event: Events.EXTRACT_DATA_AND_SAVE_TO_DB},


    async({event})=>{
        const result = await agentNetwork.run(
            `Make sure the document is called VAT REGISTRATION CERTIFICATE or VAT CERTIFICATE or any variation. 
            Ensure that the document is not an invoice, receipt, or credit note. If document is not specifically a vat certificate terminate the process immediately and return an error message that says it is not a vat certificate.
            Extract the key data from this vat certificate pdf: ${event.data.url}, Once the data is extracted , save it to the database using the docId: ${event.data.docId}.
             Once the document is successflly saved to the database you can terminate the agent process.`
        )
        return result.state.kv.get("doc")
    }

)