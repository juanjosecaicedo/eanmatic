import { ADYEN_PAYMENT_STATUS } from "@/graphql/checkout";
import CookieManager from "@/lib/CookieManager"
import { namespaces } from "@/lib/utils";
import { useQuery } from "@apollo/client";
import { CheckCircle, Loader2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button"
import PaymentSusccesMultibanco from "@/components/payment-success-multibanco";
import { Link } from "react-router-dom";

export default function CheckoutSuccess() {

  const skip = !(CookieManager.getCookie(namespaces.checkout.paymentType) == "adyen_hpp");
  const { data: dataAdyenPaymentStatus, loading: loadingAdyenPaymentStatus } = useQuery(ADYEN_PAYMENT_STATUS, {
    variables: {
      orderNumber: CookieManager.getCookie(namespaces.checkout.lastOrder), //5000000072
      cartId: CookieManager.getCookie(namespaces.checkout.cartId) // 'scFzvMkci9t3ZnpFVyhl6LsN5fkLDc4B'
    },
    skip: skip
  })



  let actionData = null;
  if (!loadingAdyenPaymentStatus && dataAdyenPaymentStatus) {
    actionData = JSON.parse(dataAdyenPaymentStatus.adyenPaymentStatus.action);
    console.log(actionData, dataAdyenPaymentStatus);

    //Delete cart id cookie
    CookieManager.deleteCookie(namespaces.checkout.cartId)
    window.localStorage.removeItem(namespaces.checkout.cartId)
  }




  return (
    <div>
      <div className="flex flex-col justify-center items-center min-h-[40vh] bg-slate-100 rounded-sm mt-5 p-10">
        <CheckCircle width={50} height={40} className="text-green-500" />
        <h2 className="mt-10 scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight transition-colors first:mt-0">
          Your payemnt was successfully created
        </h2>
        {loadingAdyenPaymentStatus && (
          <div className="mt-10 flex justify-center">
            <Loader2 className={`mr-2 h-10 w-10 animate-spin`} />
          </div>
        )}

        {(!loadingAdyenPaymentStatus && dataAdyenPaymentStatus) && (
          <div className="w-full">
            {(actionData.paymentMethodType == "multibanco") && (
              <div>
                <PaymentSusccesMultibanco action={dataAdyenPaymentStatus.adyenPaymentStatus.action} />
              </div>
            )}
          </div>
        )}
      </div>
      <div className="mt-5">
        <Link to="/" className={buttonVariants({ variant: "default" })}>Continue Shopping</Link>
      </div>
    </div>
  )
}