
"use server"

import { api } from "@/convex/_generated/api";
import { currentUser } from "@clerk/nextjs/server"
import { v } from "convex/values";
import { inngest } from "@/inngest/client";
import Events from "@/inngest/constants";
import { getFileDownloadUrl } from "./getFileDownloadUrl";
import convex from "../convexClient";

export async function uploadPDF(formData:FormData){
    const user = await currentUser();

    if(!user){
        return {success:false, error:"Not authenticated"}
    }

    try {

        // Get the file from the formdata

        const file = formData.get("file")as File;

        if(!file){
            return {success:false, error:"No file provided"}
        }
        
        // Validate the file type

        if(
            !file.type.includes("pdf")&& !file.name.toLocaleLowerCase().endsWith(".pdf")
        ){
            return {
                success:false,
                error:"Only PDF files allowed"
            }

        }
          // Get the upload url from convex
          const uploadUrl = await convex.mutation(api.docs.generateUploadUrl,{})
          // Conver the file to an array buffer for fetch api
          const arrayBuffer = await file.arrayBuffer();
          
          // Upload the file to convex storage
          const uploadResponse = await fetch(uploadUrl,{
              method:"POST",
              headers:{
                  "Content-Type":file.type,
              },
              body: new Uint8Array(arrayBuffer)
          });

              if(!uploadResponse.ok){
                  throw new Error(`Failed to upload file: ${uploadResponse.statusText}`)
              }

              // Get storage Id from the response

              const {storageId} = await uploadResponse.json();

              // Add doc to the database
              const docId = await convex.mutation(api.docs.storeDoc,{
                  userId:user.id,
                  fileId:storageId,
                  fileName:file.name,
                  size:file.size,
                  mimeType:file.type
              })

              // Generate the file URL
              const fileUrl = await getFileDownloadUrl(storageId)

            //  Triggering inngest agent flow
            // await inngest.send({
            //     name:Events.EXTRACT_DATA_AND_SAVE_TO_DB,
            //     data:{
            //         url:fileUrl.downloadUrl,
            //         docId
            //     }
            // })
            
            return {
                success:true,
                data:{
                    docId,
                    fileName:file.name
                }
            }


    } catch (error) {
        console.log("Server action upload error:", error)

        return {success:false,
            error: error instanceof Error ? error.message:"Unknown error"
        }
    }
}
