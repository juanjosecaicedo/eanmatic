import CookieManager from "@/lib/CookieManager";
import { Button } from "./ui/button";
import { namespaces } from "@/lib/utils";
import { useMutation } from "@apollo/client";
import { SET_PAYMENT_METHOD_AND_PLACE_ORDER } from "@/graphql/checkout";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";

export default function AdyenPaymentMethodMultibanco() {
  const [setPaymentMethodAndPlaceOrder, { loading: loadingPlaceOrder, error: errorPlaceOrder }] = useMutation(SET_PAYMENT_METHOD_AND_PLACE_ORDER)
  const navigate = useNavigate();
  const cartId = CookieManager.getCookie(namespaces.checkout.cartId)

  async function placeOrder() {
    const { data: dataPlaceOrder } = await setPaymentMethodAndPlaceOrder({
      variables: {
        input: {
          cart_id: cartId,
          payment_method: {
            code: "adyen_hpp",
            adyen_additional_data_hpp: {
              brand_code: "multibanco",
              stateData: "{\"paymentMethod\":{\"type\":\"multibanco\"},\"clientStateDataIndicator\":true}"
            }
          }
        }
      }
    })

    //Redirec with order
    const orderId = dataPlaceOrder.setPaymentMethodAndPlaceOrder.order.order_id    
    CookieManager.createCookie(namespaces.checkout.lastOrder, orderId, 1)
    navigate('/checkout/success')
  }

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
      <div className="flex justify-end mt-5">
        <Button type="button" onClick={() => placeOrder()} className="">Place Order</Button>
      </div>
    </div>
  )
}