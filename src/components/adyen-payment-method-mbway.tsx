import { CreateAdyenSession } from "@/interfaces/Checkout";
import { useEffect, useRef, useState } from "react";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import AdyenCheckout from '@adyen/adyen-web'
import '@adyen/adyen-web/dist/adyen.css';
import { adyenCheckoutConfiguration, namespaces } from "@/lib/utils";
import { Button } from "./ui/button";
import { useLazyQuery, useMutation } from "@apollo/client";
import { ADYEN_PAYMENT_STATUS, SET_PAYMENT_METHOD_AND_PLACE_ORDER } from "@/graphql/checkout";
import CookieManager from "@/lib/CookieManager";
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert"
import { useNavigate } from "react-router-dom";
interface Props {
  adyenSession: CreateAdyenSession | undefined
  type: string
}

export default function AdyenPaymentMethodMbWay({ adyenSession, type }: Props) {
  const paymentContainer = useRef(null);
  const configuration = adyenCheckoutConfiguration;
  const [showPlaceOrder, setShowPlaceOrder] = useState<boolean>(false)
  const [telephoneNumber, setTelephoneNumber] = useState<string>();
  const cartId = CookieManager.getCookie(namespaces.checkout.cartId)
  const [setPaymentMethodAndPlaceOrder, { loading: loadingPlaceOrder, error: errorPlaceOrder }] = useMutation(SET_PAYMENT_METHOD_AND_PLACE_ORDER)
  const [adyenPaymentStatus, { loading: loadingAdyenPaymentStatus }] = useLazyQuery(ADYEN_PAYMENT_STATUS)
  const [showMbwayLoader, setShowMbwayLoader] = useState(false)
  const navigate = useNavigate();


  async function placeOrder() {

    const stateData = {
      clientStateDataIndicator: true,
      paymentMethod: {
        telephoneNumber: telephoneNumber,
        type: 'mbway'
      }
    }


    const { data: dataPlaceOrder } = await setPaymentMethodAndPlaceOrder({
      variables: {
        input: {
          cart_id: cartId,
          payment_method: {
            code: "adyen_hpp",
            adyen_additional_data_hpp: {
              brand_code: "mbway",
              stateData: JSON.stringify(stateData)
            }
          }
        }
      }
    })

    CookieManager.deleteCookie(namespaces.checkout.adyenSession)
    const orderId = dataPlaceOrder.setPaymentMethodAndPlaceOrder.order.order_id
    CookieManager.createCookie(namespaces.checkout.lastOrder, orderId, 1)
    const { data: dataAdyenPaymentStatus } = await adyenPaymentStatus({
      variables: {
        orderNumber: orderId,
        cartId: cartId
      }
    })
    const actionData = JSON.parse(dataAdyenPaymentStatus.adyenPaymentStatus.action);
    console.log(actionData);
    getStatusPayment(actionData.paymentData)
  }

  async function getStatusPayment(paymentData: string) {
    setShowMbwayLoader(true)
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
    } else if ("errorCode" in response) {
      console.log(response)
      setShowMbwayLoader(false)
    } else {
      navigate('/checkout/success')
    }
  }

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
          setTelephoneNumber(state.data.paymentMethod.telephoneNumber)
        }
        setShowPlaceOrder(state.isValid)
      }
    });

    if (paymentContainer.current) {
      checkout.create('mbway').mount(paymentContainer.current)
    }
  }


  useEffect(() => {
    if (typeof adyenSession != "undefined") {
      dropin(adyenSession)
    }
  })

  return (
    <div>
      {errorPlaceOrder && (
        <Alert variant="destructive" className="my-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error!</AlertTitle>
          <AlertDescription>
            {errorPlaceOrder.message}
          </AlertDescription>
        </Alert>
      )}
      <div ref={paymentContainer} id="mbway-container"></div>

      <div className="flex justify-end">
        <Button type="button" disabled={!showPlaceOrder} onClick={() => placeOrder()}>Place Order</Button>
      </div>

      {(loadingPlaceOrder || loadingAdyenPaymentStatus || showMbwayLoader) && (
        <div className="text-center">
          <p> Confirm your payment on th MB WAY app</p>
          <div className="mt-10 flex justify-center items-center">
            <Loader2 className={`mr-2 h-10 w-10 animate-spin`} />
            <p>Waiting for confirmation</p>
          </div>
        </div>
      )}
    </div>
  )

}