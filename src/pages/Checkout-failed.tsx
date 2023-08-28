import { XCircle } from "lucide-react";

export default function CheckoutFailed() {
  return (
    <div className="flex flex-col justify-center items-center min-h-[40vh] bg-red-100 rounded-sm mt-5">
      <XCircle width={50} height={40} className="text-red-500" />      
      <h2 className="mt-10 text-red-500 scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight transition-colors first:mt-0">
        Your payment failed, Please try again later
      </h2>
      <p></p>
    </div>
  )
}