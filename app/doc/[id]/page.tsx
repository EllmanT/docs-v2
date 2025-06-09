"use client"

import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { deleteDoc } from "@/lib/actions/doc.action";
import { getFileDownloadUrl } from "@/lib/actions/getFileDownloadUrl";
import { formatFileSize } from "@/lib/utils";
import { useSchematicFlag } from "@schematichq/schematic-react";
import { useQuery } from "convex/react";
import { ChevronLeft, FileText } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react";

function Page() {

    const params = useParams<{id:string}>();
    const [docId, setDocId] = useState<Id<"docs">|null>(null);

    const router = useRouter();

    const isSummariesEnabled= useSchematicFlag("summary")
    const [isDeleting, setIsDeleting]= useState(false);
    const [isLoadingDownload,setIsLoadingDownload] = useState(false)

    console.log("Is summaries enabled",isSummariesEnabled)
    // Fetch the doc details
    const doc = useQuery(
        api.docs.getDocById,
        docId?{id:docId}: "skip",
    )

     // Get file download URL for the view button

     const fileId = doc?.fileId;
     const downloadUrl = useQuery(
         api.docs.getDocDownloadUrl,
         fileId?{fileId}: "skip"
     )

    //  handleDownload
    const handleDownload = async()=>{
        if(!doc || !doc.fileId) return;

        try {
            setIsLoadingDownload(true);

            // Call the server action to get download url
            const result = await getFileDownloadUrl(doc.fileId);
            
            if(!result.success){
                throw new Error(result.error)
            }

            // Create temporary link and trigger download
            const link = document.createElement("a");
            if(result.downloadUrl){
                link.href = result.downloadUrl;
                link.download =doc.fileName || "doc.pdf";

                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link)
            }else{
                throw new Error("No donwload URL found")
            }

        } catch (error) {

            console.log("Error downloading file", error)
            alert("Failed to download the file . Try again")
            
        } finally{
            setIsLoadingDownload(false)
        }
    }


    // Handle delete doc

    const handleDeleteDoc = async()=>{
        if(!docId) return ;

        if(window.confirm("Are you sure you want to delete the document")){
            try {
                setIsDeleting(true)
                // Call the server action to delete the doc
                const result = await deleteDoc(docId)

                if(!result.success){
                    throw new Error(result.error)
                }
                router.push("/docs")
            } catch (error) {
                console.log("Error deleting the file", error);
                alert("Failed to delete the file")
                setIsDeleting(false)
            }
        }
    }

    //  Convert the URL string to a Convex Id
    useEffect(()=>{
        try {
            const id = params.id as Id<"docs">
            setDocId(id)
        } catch (error) {
            console.log("invalid doc Id ", error)
            router.push("/")
        }
    },[params.id,router])

    if(doc ===undefined){
        return(
            <div className="container mx-auto py-10 px-4">
                <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600">

                    </div>

                </div>

            </div>
        )
    }
    if(doc===null){ 
        return (
        <div className="container mx-auto py-10 px-4">
            <div  className="max-w-2xl mx-auto text-center">
                <h1 className="text-2xl font-bold mb-4">Doc not found</h1>
                <p className="mb-6">The Doc you are looking for does not exist or has been removed</p>
            <Link 
            href="/"
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
            Return Home
            </Link>
            </div>

        </div>
    )}

    //Format upload date 
    const uploadDate = new Date(doc.uploadedAt).toLocaleString();

    // Check if doc has extracted data
    const hasExtractedData =!!(
        doc.taxPayerName||
        doc.tradeName||
        doc.tinNumber||
        doc.vatNumber
    )
  return (
    <div
    className="container mx-auto py-10 px-4"
    >
        <div className="mx-w-4xl mx-auto">
            <nav className="mb-6">
                    <Link
                    href="/docs"
                    className="text-blue-500 hover:underline flex items-center"
                    >
                        <ChevronLeft className="h-4 w-4 mr-1"/>
                        Back to the Docs
                    </Link>
            </nav>

            <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
                <div className="p-6">
                  {/* File information */}
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-bold text-gray-900 truncate">
                            {doc.fileDisplayName || doc.fileName}</h1>

                            <div className="flex items-center">
                                {doc.status ==="pending" ?(
                                    <div className="mr-2">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-800"></div>
                                    </div>
                                ):null}
                                <span
                                className={`px-3 py-1 rounded-full text-sm ${
                                    doc.status ==="pending"? "bg-yellow-100 text-yellow-800": doc.status ==="processed"?"bg-green-100 text-green-800":"bg-red-100 text-red-800" 
                                }`}
                                >
                                        {doc.status.charAt(0).toUpperCase()+ doc.status.slice(1)}
                                </span>

                            </div>

                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Informatino */}

                                <div className="space-y-4">
                                  {/* File info  */}
                                  {
                                            doc.taxPayerName&& (
                                                <div>
                                                    <p className="text-sm text-gray-500">Tax Payer Name</p>
                                                    <p className="font-medium">{doc.taxPayerName}</p>
                                                </div>
                                            )
                                        }
                                          {
                                            doc.tradeName && (
                                                <div>
                                                    <p className="text-sm text-gray-500">Trade Name</p>
                                                    <p className="font-medium">{doc.tradeName}</p>
                                                </div>
                                            )
                                        }

                                          {
                                            doc.tinNumber && (
                                                <div>
                                                    <p className="text-sm text-gray-500">TIN Number</p>
                                                    <p className="font-medium">{doc.tinNumber}</p>
                                                </div>
                                            )
                                        }
                                          {
                                            doc.vatNumber && (
                                                <div>
                                                    <p className="text-sm text-gray-500">VAT Number</p>
                                                    <p className="font-medium">{doc.vatNumber}</p>
                                                </div>
                                            )
                                        }
                                </div>

                                {/* Download */}
                                <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg">
                                    <div className="text-center">
                                        <FileText
                                        className="h-16 w-16 text-blue-500 mx-auto"
                                        />
                                        <p>PDF Preview</p>
                                        {
                                            downloadUrl&&(
                                                <a
                                                href={downloadUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="mt-4 px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 inline-block"
                                                >
                                                    View PDF
                                                </a>
                                            )
                                        }
                                    </div>

                                </div>
                    </div>

                    {/* Extracted Data */}
                    {
                        hasExtractedData && (

                            <div className="mt-8">
                               
                             <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
  {/* Merchant Details */}
  <div className="space-y-2 col-span-12 md:col-span-8">
    <div>
      <h3 className="text-sm font-medium text-gray-500">File Information</h3>
      <div className="mt-2 bg-gray-50 p-4 rounded-lg">
        <div className="grid grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Uploaded</p>
            <p className="font-medium">{uploadDate}</p>
          </div>
          <div>
            <p className="text-gray-500">Size</p>
            <p className="font-medium">{formatFileSize(doc.size)}</p>
          </div>
          <div>
            <p className="text-gray-500">Type</p>
            <p className="font-medium">{doc.mimeType}</p>
          </div>
          <div>
            <p className="text-gray-500">ID</p>
            <p className="font-medium truncate" title={doc._id}>{doc._id.slice(0,10)}...</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  {/* Transaction Details */}
  <div className=" border-t pt-6 col-span-12 md:col-span-4">
    <h3 className="text-sm font-medium text-gray-500 mb-4">Actions</h3>
    <div className="flex flex-wrap gap-3">
      <button
        className={`px-4 py-2 bg-white border border-gray-300 rounded text-sm text-gray-700 ${isLoadingDownload ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"}`}
        onClick={handleDownload}
        disabled={isLoadingDownload || !fileId}
      >
        {isLoadingDownload ? "Downloading..." : "Download PDF"}
      </button>
      <button
        className={`px-4 py-2 rounded text-sm ${
          isDeleting
            ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-red-50 border border-red-200 text-red-600 hover:bg-red-100"
        }`}
        onClick={handleDeleteDoc}
        disabled={isDeleting}
      >
        {isDeleting ? "Deleting" : "Delete Doc"}
      </button>
    </div>
  </div>
</div>

                                       
                            </div>
                        )
                    }
               
                    {/* End of section  */}

                </div>

            </div>
        </div>
    </div>
  )
}

export default Page

// Helper function to foormat the file size 


//    Helper function to format currency
