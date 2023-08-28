import { useLazyQuery, useMutation } from "@apollo/client";
import { Button } from "./ui/button";
import { GET_ADYEN_KLARNA_DETAILS, SET_PAYMENT_METHOD_ON_CART } from "@/graphql/checkout";
import CookieManager from "@/lib/CookieManager";
import { namespaces } from "@/lib/utils";
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

interface Props {
  email: string | undefined
}

export default function AdyenPaymentMethodklarnaAccount({ email }: Props) {
  const [setPaymentMethodOnCart, { loading: loadingSetPaymentMethodOnCart, error: errorSetPaymentMethodOnCart }] = useMutation(SET_PAYMENT_METHOD_ON_CART)
  const [getAdyenKlarnaDetails, { loading: loadingGetAdyenKlarnaDetails }] = useLazyQuery(GET_ADYEN_KLARNA_DETAILS)

  const cartId = CookieManager.getCookie(namespaces.checkout.cartId)

  async function placeOrder() {
    const { data: setPayment } = await setPaymentMethodOnCart({
      variables: {
        input: {
          cart_id: cartId,
          payment_method: {
            code: 'adyen_hpp'
          }
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

      if (klarnaDetails.getAdyenKlarnaDetails?.action.type == "redirect") {
        window.location.href = klarnaDetails.getAdyenKlarnaDetails?.action.url
      }
    }

  }

  return (
    <div>
      {(loadingSetPaymentMethodOnCart || loadingGetAdyenKlarnaDetails) && (
        <div className="mt-10 flex justify-center">
          <Loader2 className={`mr-2 h-10 w-10 animate-spin`} />
        </div>
      )}

      {errorSetPaymentMethodOnCart && (
        <Alert variant="destructive" className="my-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error!</AlertTitle>
          <AlertDescription>
            {errorSetPaymentMethodOnCart.message}
          </AlertDescription>
        </Alert>
      )}
      <div className="flex justify-end mt-5">
        <Button type="button" onClick={() => placeOrder()} className="">Place Order</Button>
      </div>
    </div>
  )
}