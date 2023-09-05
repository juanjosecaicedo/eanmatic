import { ADYEN_PAYMENT_STATUS } from "@/graphql/checkout";
import CookieManager from "@/lib/CookieManager"
import { namespaces } from "@/lib/utils";
import { useQuery } from "@apollo/client";
import { CheckCircle, Loader2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button"
import PaymentSusccesMultibanco from "@/components/payment-success-multibanco";
import { Link } from "react-router-dom";
import { useEffect } from "react";

export default function CheckoutSuccess() {

  const skip = !(CookieManager.getCookie(namespaces.checkout.paymentType) == "adyen_hpp");
  const { data: dataAdyenPaymentStatus, loading: loadingAdyenPaymentStatus } = useQuery(ADYEN_PAYMENT_STATUS, {
    variables: {
      orderNumber: CookieManager.getCookie(namespaces.checkout.lastOrder), //5000000093,
      cartId: localStorage.getItem(namespaces.checkout.cartId)  //'9sHmdEGb9ma4bD1UpvenaJRtTiRSnFB8'
    },
    skip: skip
  })



  let actionData = null;
  if (!loadingAdyenPaymentStatus && dataAdyenPaymentStatus) {
    actionData = JSON.parse(dataAdyenPaymentStatus.adyenPaymentStatus.action);
    if(actionData) {
      getStatusPayment(actionData.paymentData)
    }
  }

  async function getStatusPayment(paymentData: string) {
    const response = await fetch('https://checkoutshopper-test.adyen.com/checkoutshopper/services/PaymentInitiation/v1/status?clientKey=test_3Z2WQBPYTRDVNDFXX2J5G6I7ZUXS6TKO', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ paymentData })
    }).then(response => response.json())

    console.log(response);
    if ("authorised" in response && "type" in response && response.type != "complete") {
      getStatusPayment(paymentData)
    }    
  }
    
  
    

  //Delete cart id cookie
  useEffect(() => {
    if (dataAdyenPaymentStatus?.adyenPaymentStatus) {

      CookieManager.deleteCookie(namespaces.checkout.cartId)
      //window.localStorage.removeItem(namespaces.checkout.cartId)
    }
  })

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
            {(actionData && actionData.paymentMethodType == "multibanco") && (
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