import CookieManager from "@/lib/CookieManager"
import { namespaces } from "@/lib/utils";
import { CheckCircle } from "lucide-react";

export default function CheckoutSuccess() {
  //Delete cart id cookie
  CookieManager.deleteCookie(namespaces.checkout.cartId)
  window.localStorage.removeItem(namespaces.checkout.cartId)

  return (
    <div className="flex flex-col justify-center items-center min-h-[40vh] bg-slate-100 rounded-sm mt-5">
      <CheckCircle width={50} height={40} className="text-green-500" />
      <h2 className="mt-10 scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight transition-colors first:mt-0">
        Your payemnt was successfully created
      </h2>
      <p></p>
    </div>
  )
}