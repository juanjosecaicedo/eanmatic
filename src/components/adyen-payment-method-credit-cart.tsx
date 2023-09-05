import { SET_PAYMENT_METHOD_AND_PLACE_ORDER } from "@/graphql/checkout"
import CookieManager from "@/lib/CookieManager"
import { adyenCheckoutConfiguration, namespaces } from "@/lib/utils"
import { useMutation } from "@apollo/client"
import { AlertCircle, Loader2 } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Alert, AlertDescription, AlertTitle } from "./ui/alert"
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import AdyenCheckout from '@adyen/adyen-web'
import '@adyen/adyen-web/dist/adyen.css';
import { CreateAdyenSession } from "@/interfaces/Checkout"
import { Button } from "./ui/button"

interface Props {
  adyenSession: CreateAdyenSession | undefined
  type: string
}

export default function AdyenPaymentMethodCreditCart({ adyenSession, type }: Props) {
  const paymentContainer = useRef(null);
  const [setPaymentMethodAndPlaceOrder, { loading: loadingPlaceOrder, error: errorPlaceOrder }] = useMutation(SET_PAYMENT_METHOD_AND_PLACE_ORDER)
  const cartId = CookieManager.getCookie(namespaces.checkout.cartId)
  const navigate = useNavigate();
  const [showPlaceOrder, setShowPlaceOrder] = useState<boolean>(false)

  async function placeOrder() {
    const encryptedCard = localStorage.getItem('encryptedCard')
    if (!encryptedCard) {
      return;
    }
    
    const { data: dataPlaceOrder } = await setPaymentMethodAndPlaceOrder({
      variables: {
        input: {
          cart_id: cartId,
          payment_method: {
            code: "adyen_cc",
            adyen_additional_data_cc: {
              cc_type: "VI",
              stateData: encryptedCard
            }
          }
        }
      }
    })

    CookieManager.deleteCookie(namespaces.checkout.adyenSession)
    const orderId = dataPlaceOrder.setPaymentMethodAndPlaceOrder.order.order_id
    CookieManager.createCookie(namespaces.checkout.lastOrder, orderId, 1)
    navigate('/checkout/success')
  }

  const configuration = adyenCheckoutConfiguration;  

  async function dropin(adyenSession: CreateAdyenSession) {   
    Object.assign(configuration, {
      session: {
        id: adyenSession?.id,
        sessionData: adyenSession?.sessionData
      }
    })

    const checkout = await AdyenCheckout({
      ...configuration,
      type: type,

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onChange: function (state: any) {
        if (state.isValid) {
          const data = JSON.stringify(state.data)
          localStorage.setItem('encryptedCard', data)
        }

        setShowPlaceOrder(state.isValid)
      }
    });

    if (paymentContainer.current) {
      checkout.create('card').mount(paymentContainer.current)
    }
  }

  useEffect(() => {
    if (typeof adyenSession != "undefined") {
      dropin(adyenSession)
    }
  })


  return (
    <div>
      {(loadingPlaceOrder) && (
        <div className="mt-10 flex justify-center">
          <Loader2 className={`mr-2 h-10 w-10 animate-spin`} />
        </div>
      )}
      {errorPlaceOrder && (
        <Alert variant="destructive" className="my-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error!</AlertTitle>
          <AlertDescription>
            {errorPlaceOrder.message}
          </AlertDescription>
        </Alert>
      )}
      <div ref={paymentContainer} id="card-container"></div>

      <div className="flex justify-end mt-2">
        <Button type="button" disabled={!showPlaceOrder} onClick={() => placeOrder()}>Place Order</Button>
      </div>
    </div>
  )
}