import { ADYEN_PAYMENT_STATUS } from "@/graphql/checkout";
import CookieManager from "@/lib/CookieManager"
import { namespaces } from "@/lib/utils";
import { useLazyQuery } from "@apollo/client";
import { CheckCircle, Loader2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button"
import PaymentSusccesMultibanco from "@/components/payment-success-multibanco";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { setCart } from "@/reducers/cart";
import { useDispatch } from "react-redux";

export default function CheckoutSuccess() {

  const isAdyen = (CookieManager.getCookie(namespaces.checkout.paymentType) == "adyen_hpp")
  const dispatch = useDispatch()
  const [adyenPaymentStatus, { data: dataAdyenPaymentStatus, loading: loadingAdyenPaymentStatus }] = useLazyQuery(ADYEN_PAYMENT_STATUS)
  const [actionData, setactionData] = useState<object | null>(null)

  useEffect(() => {
    if (isAdyen && CookieManager.getCookie(namespaces.checkout.cartId)) {
      const getDataAdyen = async () => {
        const { data: adyenPaymentStatusData } = await adyenPaymentStatus({
          variables: {
            orderNumber: CookieManager.getCookie(namespaces.checkout.lastOrder),
            cartId: CookieManager.getCookie(namespaces.checkout.cartId)
          }
        })
        if (adyenPaymentStatusData) {
          console.log(adyenPaymentStatusData, "Entro");
          const action = JSON.parse(adyenPaymentStatusData.adyenPaymentStatus.action);
          setactionData(action)
          if (action) {
            console.log(action);
          }
        }
        CookieManager.deleteCookie(namespaces.checkout.cartId)
        dispatch(setCart(null))
      }
      getDataAdyen()
    }

  }, [adyenPaymentStatus, isAdyen, dispatch])

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
            {(actionData && "paymentMethodType" in actionData && actionData.paymentMethodType == "multibanco") && (
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