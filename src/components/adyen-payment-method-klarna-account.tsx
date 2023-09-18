import { useLazyQuery, useMutation } from "@apollo/client";
import { Button } from "@/components/ui/button";
import { GET_ADYEN_KLARNA_DETAILS, SET_PAYMENT_METHOD_AND_PLACE_ORDER_2 } from "@/graphql/checkout";
import CookieManager from "@/lib/CookieManager";
import { namespaces } from "@/lib/utils";
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface Props {
  email: string | undefined
  type?: string
}

export default function AdyenPaymentMethodklarnaAccount({ email }: Props) {
  const [setPaymentMethodAndPlaceOrder, { loading: loadingPlaceOrder, error: errorPlaceOrder }] = useMutation(SET_PAYMENT_METHOD_AND_PLACE_ORDER_2)
  const [getAdyenKlarnaDetails, { loading: loadingGetAdyenKlarnaDetails }] = useLazyQuery(GET_ADYEN_KLARNA_DETAILS)

  const cartId = CookieManager.getCookie(namespaces.checkout.cartId)

  async function placeOrder() {
    const { data: setPayment } = await setPaymentMethodAndPlaceOrder({
      variables: {
        input1: {
          cart_id: cartId,
          payment_method: {
            code: 'adyen_hpp',
            adyen_additional_data_hpp: {
              brand_code: "klarna_account",
              stateData: "{\"paymentMethod\":{\"type\":\"klarna_account\"},\"clientStateDataIndicator\":true}"
            }
          }
        },
        input2: {
          cart_id: cartId
        }
      }
    })

    if (setPayment.setPaymentMethodOnCart) {
      const _email = email?.length ? email : 'customer@email.pt'

      const { data: klarnaDetails } = await getAdyenKlarnaDetails({
        variables: {
          cartId: cartId,
          email: _email
        }
      })
      console.log(setPayment);
      

      const orderId = setPayment.placeOrder.order.order_number
      CookieManager.createCookie(namespaces.checkout.lastOrder, orderId, 1)

      if (klarnaDetails.getAdyenKlarnaDetails?.action.type == "redirect") {
        window.location.href = klarnaDetails.getAdyenKlarnaDetails?.action.url
      }
    }
  }

  return (
    <div>
      {(loadingPlaceOrder || loadingGetAdyenKlarnaDetails) && (
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
      <div className="flex justify-end mt-5">
        <Button type="button" onClick={() => placeOrder()} className="">Place Order</Button>
      </div>
    </div>
  )
}