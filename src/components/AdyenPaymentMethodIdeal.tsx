import { CreateAdyenSession } from "@/interfaces/Checkout"
import { adyenCheckoutConfiguration, namespaces } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import AdyenCheckout from '@adyen/adyen-web'
import { useLazyQuery, useMutation } from "@apollo/client";
import { ADYEN_PAYMENT_STATUS, SET_PAYMENT_METHOD_AND_PLACE_ORDER_2 } from "@/graphql/checkout";
import CookieManager from "@/lib/CookieManager";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";

interface Props {
  adyenSession: CreateAdyenSession | undefined
  type: string
}

export default function AdyenPaymentMethodIdeal({ adyenSession, type }: Props) {
  const paymentContainer = useRef(null)
  const configuration = adyenCheckoutConfiguration;
  const [showPlaceOrder, setShowPlaceOrder] = useState<boolean>(false)
  const [setPaymentMethodAndPlaceOrder, { loading: loadingPlaceOrder, error: errorPlaceOrder }] = useMutation(SET_PAYMENT_METHOD_AND_PLACE_ORDER_2)
  const [adyenPaymentStatus, { loading: loadingAdyenPaymentStatus }] = useLazyQuery(ADYEN_PAYMENT_STATUS)
  const [stateData, setStateData] = useState<string | null>(null)
  const cartId = CookieManager.getCookie(namespaces.checkout.cartId)
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
          setStateData(JSON.stringify(state.data))
        } else {
          setStateData(null)
        }
        setShowPlaceOrder(state.isValid)
      }
    });

    if (paymentContainer.current) {
      checkout.create('ideal').mount(paymentContainer.current)
    }
  }

  async function placeOrder() {
    if (!stateData) return
    const { data: dataPlaceOrder } = await setPaymentMethodAndPlaceOrder({
      variables: {
        input1: {
          cart_id: cartId,
          payment_method: {
            code: "adyen_hpp",
            adyen_additional_data_hpp: {
              brand_code: "ideal",
              stateData: stateData
            }
          }
        },
        input2: {
          cart_id: cartId
        }
      }
    })

    CookieManager.deleteCookie(namespaces.checkout.adyenSession)
    const orderId = dataPlaceOrder.placeOrder.order.order_number
    CookieManager.createCookie(namespaces.checkout.lastOrder, orderId, 1)
    const { data: dataAdyenPaymentStatus } = await adyenPaymentStatus({
      variables: {
        orderNumber: orderId,
        cartId: cartId
      }
    })

    const actionData = JSON.parse(dataAdyenPaymentStatus.adyenPaymentStatus.action);    
    if ('type' in actionData && actionData.type == 'redirect') {
      window.location.href = actionData.url
    }
  }

  useEffect(() => {
    if (typeof adyenSession != "undefined") {
      dropin(adyenSession)
    }
  })

  return (
    <div className="mt-3">
      {errorPlaceOrder && (
        <Alert variant="destructive" className="my-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error!</AlertTitle>
          <AlertDescription>
            {errorPlaceOrder.message}
          </AlertDescription>
        </Alert>
      )}
      <div ref={paymentContainer} id="ideal-container"></div>
      <div className="flex justify-end mt-2">
        <Button type="button" disabled={!showPlaceOrder} onClick={() => placeOrder()}>Place Order</Button>
      </div>
      {(loadingPlaceOrder || loadingAdyenPaymentStatus) && (
        <div className="mt-10 flex justify-center items-center">
          <Loader2 className={`mr-2 h-10 w-10 animate-spin`} />
        </div>
      )}
    </div>
  )
}