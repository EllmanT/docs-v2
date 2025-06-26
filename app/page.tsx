import PDFDropzone from "@/components/PDFDropzone";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { ArrowRight , Check, Download, PhoneCall, Radar, RocketIcon, Search, Sparkles, Upload } from "lucide-react";
import Link from "next/link";

export default async function Home() {
  return (
   <div className="flex flex-col min-h-screen">
      {/* Hero */}
      <section>
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-sans font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
              Smart AI Verification
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
“Save money now — let AI scan, analyse and extract data from your documents in seconds ⚡ &quot;
            </p>
          </div>
          <div className="space-x-4">
             <SignedIn>
            <Link href="/docs">
<Button className="bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 hover:from-purple-500 hover:via-pink-500 hover:to-red-500 text-white shadow-lg hover:shadow-xl hover:cursor-pointer transition duration-300 ease-in-out">
  Try Now <ArrowRight className="ml-2 h-4 w-4"/>
  </Button>
            </Link>
</SignedIn>
             <SignedOut>
                <SignInButton mode="modal">
<Button 
className="bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 hover:from-purple-500 hover:via-pink-500 hover:to-red-500 text-white shadow-lg hover:shadow-xl hover:cursor-pointer transition duration-300 ease-in-out">
                        Get Started Free<ArrowRight className="ml-2 h-4 w-4"/>
                    </Button>
                </SignInButton>
            </SignedOut>
            <Link href="https://documenter.getpostman.com/view/31082195/2sB2x6jqzA" target="_blank">
            
<Button
  variant="outline"
  className="hover:bg-gradient-to-r hover:from-gray-500 hover:via-gray-600 hover:to-gray-800 hover:text-white transition-colors duration-300 hover:border-transparent hover:cursor-pointer"
>
  API Docs
</Button>



            </Link>

          </div>
        </div>
        </div>
        {/* PDF dropzone */}
        <div className="mt-6 flex justify-center">
          <div className="relative w-full max-w-3xl rounded-lg border border-gray-200 bg-white shadow-lg overflow-hidden dark:border-gray-800 dark:bg-gray-950 ">
            <div className="p-6 md:p-8 relative">
                <PDFDropzone/>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 md:py-24  ">

        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Powerful Features
              </h2>
              <p>Our AI powered platform changes the way you handle documents and tranking information</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              {/* Feature 1 */}

              <div className="flex flex-col items-center space-y-2 border border-gray-200 rounded-lg p-6 dark:border-gray-800">
                <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                  <Upload className="h-6 w-6 text-blue-500 dark:text-blue-400"/>
                </div>
                <h3 className="text-xl font-bold">Easy Uploads</h3>
                <p className="text-gray-500 dark:text-gray-400 text-center">Drag and drop PDF for instant scanning and processing</p>
              </div>
               {/* Feature 2 */}

               <div className="flex flex-col items-center space-y-2 border border-gray-200 rounded-lg p-6 dark:border-gray-800">
                <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
                  <Search className="h-6 w-6 text-green-500 dark:text-green-400"/>
                </div>
                <h3 className="text-xl font-bold">AI Analysis</h3>
                <p className="text-gray-500 dark:text-gray-400 text-center">
                 Automatically extract and categorize data with super AI
                  </p>
              </div>
               {/* Feature 3 */}

               <div className="flex flex-col items-center space-y-2 border border-gray-200 rounded-lg p-6 dark:border-gray-800">
                <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
                  <RocketIcon className="h-6 w-6 text-purple-500 dark:text-purple-400"/>
                </div>
                <h3 className="text-xl font-bold">Lightning Fast</h3>
                <p className="text-gray-500 dark:text-gray-400 text-center">Key values and details extracted within seconds</p>
              </div>
            </div>
            
          </div>

        </div>
 
      </section>

      {/* Pricing */}
      <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900">
        <div
        className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl"> Pricing </h2>
              <p className="max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">Choose the plan that works best for your needs</p>
            </div>

          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 max-w-5xl mx-auto">
            {/* Free Tier */}
            <div className="flex flex-col p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-800 dark:bg-gray-950">
              <div className="space-y-2 ">
                <h3 className="text-2xl font-bold">Basic</h3>
                <p className="text-gray-500 dark:text-gray-400">Test now for free!</p>
              </div>
              <div className="mt-4 flex">
                <p className="text-4xl font-bold">$0.00</p>
                <p className="text-gray-500 dark:text-gray-400 m-1"><Badge  variant={"outline"}>month</Badge></p>

              </div>
              <ul className="mt-6 space-y-2 flex-1">
                <li className="flex items-center">
                  <Check className="text-green-500 h-5 w-5 mr-2"/>
                  <span>20 Scans per month </span>
                </li>
                <li className="flex items-center">
                  <Check className="text-green-500 h-5 w-5 mr-2"/>
                  <span>Basic data extraction </span>
                </li>
                <li className="flex items-center">
                  <Check className="text-green-500 h-5 w-5 mr-2"/>
                  <span>7 day history </span>
                </li>

              </ul>
              <div className="mt-3">
                <Link href="/manage-plan">
                <Button 
                
  className="w-full hover:bg-gradient-to-r hover:from-gray-500 hover:via-gray-600 hover:to-gray-800 hover:text-white transition-colors duration-300 hover:border-transparent hover:cursor-pointer"
                
                variant="outline">
                  Sign Up Free
                </Button>
                </Link>
              </div>

            </div>
            {/* Pro Tier */}
               <div className="flex flex-col p-6 bg-blue-50 border border-blue-200 rounded-lg shadow-sm relative dark:border-blue-800 dark:bg-blue-900/20">
                <div className="absolute -top-3 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">Popular</div>
              <div className="space-y-2 ">
                <h3 className="text-2xl font-bold">Business</h3>
                <p className="text-gray-500 dark:text-gray-400">Full access to premium features</p>
              </div>
              <div className="mt-4 flex">
                <p className="text-4xl font-bold">$60.00</p>
                <p className="text-gray-500 dark:text-gray-400 m-1"><Badge  variant={"outline"}>month</Badge></p>

              </div>
              <ul className="mt-6 space-y-2 flex-1">
                <li className="flex items-center">
                  <Check className="text-green-500 h-5 w-5 mr-2"/>
                  <span>Up to 100 Scans per month </span>
                </li>
                <li className="flex items-center">
                  <Check className="text-green-500 h-5 w-5 mr-2"/>
                  <span>Enhanced data extraction </span>
                </li>
                <li className="flex items-center">
                  <Check className="text-green-500 h-5 w-5 mr-2"/>
                  <span>Unlimited history </span>
                </li>
                <li className="flex items-center">
                  <Download className="text-green-500 h-5 w-5 mr-2"/>
                  <span>Enhanced export options </span>
                </li>
                <li className="flex items-center">
                  <Sparkles className="text-blue-500 h-5 w-5 mr-2"/>
                  <span>AI Summaries </span>
                </li>
               

              </ul>
              <div className="mt-6">
                             <SignedIn>

                <Link href="/manage-plan">
                <Button 
  className="w-full hover:bg-gradient-to-r hover:from-gray-500 hover:via-gray-600 hover:to-gray-800 hover:text-white transition-colors duration-300 hover:border-transparent hover:cursor-pointer"
                variant="outline">
                  Choose plan
                </Button>
                </Link>
                </SignedIn>
                 <SignedOut>
                <SignInButton mode="modal">
<Button 
  className="w-full hover:bg-gradient-to-r hover:from-gray-500 hover:via-gray-600 hover:to-gray-800 hover:text-white transition-colors duration-300 hover:border-transparent hover:cursor-pointer"
>
                        Choose plan<ArrowRight className="ml-2 h-4 w-4"/>
                    </Button>
                </SignInButton>
            </SignedOut>
              </div>

            </div>
             {/* Starter Tier */}
             <div className="flex flex-col p-6 bg-orange-200 border border-gray-200 rounded-lg shadow-sm dark:border-gray-800 dark:bg-gray-950">
              <div className="space-y-2 ">
                <h3 className="text-2xl font-bold">Enterprice</h3>
                <p className="text-gray-500 dark:text-gray-400">All premium features and more!</p>
              </div>
              <div className="mt-8">
                <p className="text-4xl font-bold">Custom</p>

              </div>
              <ul className="mt-6 space-y-2 flex-1">
                <li className="flex items-center">
                  <Check className="text-green-500 h-5 w-5 mr-2"/>
                  <span>100+ Scans per month </span>
                </li>
               
                <li className="flex items-center">
                  <Sparkles className="text-orange-500 h-5 w-5 mr-2"/>
                  <span >Advanced AI Summaries </span>
                </li>
               

              </ul>
              <div className="mt-6">
                <Link href="#contact" scroll={true}>
                <Button 
  className="w-full hover:bg-gradient-to-r hover:from-gray-500 hover:via-gray-600 hover:to-gray-800 hover:text-white transition-colors duration-300 hover:border-transparent hover:cursor-pointer"
                variant="outline">
                  <PhoneCall/>
                 Call us Today! 
                </Button>
                </Link>
              </div>

            </div>
               

          </div>
        </div>

      </section>

      {/* Info */}
      <section  className="py-8 md:py-12">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="space-y-2 "> 
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Start Scanning today!
              </h2>

              <p>Trusted by 100+ of users </p>
            </div>

          </div>

        </div>

      </section>

      {/* Footer */}
     <footer id="contact" className="border-t border-gray-200 dark:border-gray-800">
      <div className="container px-4 md:px-6 py-8 mx-auto">
       <div className="flex flex-col md:flex-row justify-between items-center">
  <div className="flex items-center space-x-1">
    <Radar className="h-6 w-6 text-blue-600 animate-pulse" />
    <span>FiscalLens &copy;</span>
  </div>
  <div className="mt-4 md:mt-0">
    <p className="text-sm text-gray-500 dark:text-gray-400">
      📞 +263 778 115 084 &nbsp;|&nbsp; 📧 tmuranda1@gmail.com
    </p>
  </div>
</div>

      </div>

     </footer>
   </div>
  );
}


