import { SET_PAYMENT_METHOD_AND_PLACE_ORDER } from "@/graphql/checkout"
import CookieManager from "@/lib/CookieManager"
import { namespaces } from "@/lib/utils"
import { useMutation } from "@apollo/client"
import { AlertCircle, Loader2 } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Alert, AlertDescription, AlertTitle } from "./ui/alert"
// eslint-disable-next-line
import  AdyenCheckout from '@adyen/adyen-web'
import '@adyen/adyen-web/dist/adyen.css';
import { CreateAdyenSession } from "@/interfaces/Checkout"

interface Props {
  adyenSession: CreateAdyenSession | undefined
}

export default function AdyenPaymentMethodCreditCart({ adyenSession }: Props) {


  const paymentContainer = useRef(null);
  const [setPaymentMethodAndPlaceOrder, { loading: loadingPlaceOrder, error: errorPlaceOrder }] = useMutation(SET_PAYMENT_METHOD_AND_PLACE_ORDER)
  const cartId = CookieManager.getCookie(namespaces.checkout.cartId)
  const navigate = useNavigate();
  const [dataPyament, setDataPayment] = useState<string>()

  async function placeOrder(encryptedCard: string) {
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

    const orderId = dataPlaceOrder.setPaymentMethodAndPlaceOrder.order.order_id
    CookieManager.createCookie(namespaces.checkout.lastOrder, orderId, 1)
    navigate('/checkout/success')
  }

  let cartData;
  const cart = localStorage.getItem(namespaces.checkout.cartData)
  if (cart) {
    cartData = JSON.parse(cart)
  }


  const apiKey = import.meta.env.VITE_API_KEY_ADYEN
  const configuration = {

    clientKey: apiKey,
    analytics: {
      enabled: true
    },
    session: {
      id: '',
      sessionData: ''
    },

    paymentMethodsConfiguration: {
      card: {
        hasHolderName: false,
        holderNameRequired: false,
        billingAddressRequired: false,
        amount: {
          value: cartData.prices.grand_total.value,
          currency: cartData.prices.grand_total.currency
        }
      }
    },

    environment: 'test',
    showPayButton: true
  };

  async function dropin(adyenSession: CreateAdyenSession) {
    configuration.session.id = adyenSession.id
    configuration.session.sessionData = adyenSession.sessionData
    const checkout = await AdyenCheckout({
      ...configuration,

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onChange: function (state: any, component: any) {
        if (state.isValid) {
          const data = JSON.stringify(state.data)
          setDataPayment(data)
          localStorage.setItem('encryptedCard', data)
          const btn = component._node.querySelector('.adyen-checkout__button.adyen-checkout__button--pay')
          if (btn) {
            btn.addEventListener('click', function () {
              component.submit()
            })
          }
        }
      },

      onPaymentCompleted: function (result: object) {
        console.log(result);
        if ('resultCode' in result && result.resultCode == "Authorised") {
          console.log(dataPyament);
          localStorage.getItem('encryptedCard')

          if (typeof dataPyament != "undefined") {
            placeOrder(dataPyament)
          }

          const encryptedCard = localStorage.getItem('encryptedCard');
          if(typeof dataPyament == "undefined" && encryptedCard){
            placeOrder(encryptedCard)
          }

          CookieManager.deleteCookie(namespaces.checkout.adyenSession)
        }
      },

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
    </div>
  )
}