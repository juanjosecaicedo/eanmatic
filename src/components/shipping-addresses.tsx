import { Button } from "@/components/ui/button"
import { CART, GET_ADYEN_PAYMEN_TMETHODS, SET_BILLING_ADDRESS_ON_CART, SET_GUEST_EMAIL_ON_CART, SET_PAYMENT_METHOD_ON_CART, SET_SHIPPING_ADDRESS_ON_CART, SET_SHIPPING_METHODS_ON_CART } from "@/graphql/checkout"
import { AdyenPaymentMethods, AvailableShippingMethod, PaymentMethod, SetShippingAddressesOnCart } from "@/interfaces/Checkout"
import { getCookie, namespaces } from "@/lib/utils"
import { useLazyQuery, useMutation } from "@apollo/client"
import { useState } from "react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Loader2 } from "lucide-react"
import { useDispatch } from "react-redux"
import { setCart } from "@/reducers/cart"

//Exomple
// Step 1: Require the parts of the module you want to use.
/*import { Client, CheckoutAPI } from "@adyen/api-library"

// Step 2: Initialize the client object.
const client = new Client({
  apiKey: 'AQEmhmfuXNWTK0Qc+iSGl2csqPayfLRhKqjJPi/QhiS/NCISKpxfdt4QwV1bDb7kfNy1WIxIIkxgBw==-OGvrtKthUEcKAN3IwnTKlLTGoxbaoeSuasQrKlpUMfw=-^jL?mV4tN*BTq~)E',
  environment: 'TEST'
})

// Step 3: Initialize the API object.
const checkoutApi = new CheckoutAPI(client);

const paymentRequest = {
  amount: {
    currency: "USD",
    value: 1000 // value in minor units
  },
  reference: "My first Adyen test payment with an API library/SDK",
  paymentMethod: {
    type: "scheme",
    encryptedCardNumber: "test_4111111111111111",
    encryptedExpiryMonth: "test_03",
    encryptedExpiryYear: "test_2030",
    encryptedSecurityCode: "test_737"
  },
  shopperReference: "YOUR_SHOPPER_REFERENCE",
  storePaymentMethod: true,
  shopperInteraction: "Ecommerce",
  recurringProcessingModel: "CardOnFile",
  returnUrl: "https://your-company.com/...",
  merchantAccount: "YOUR_MERCHANT_ACCOUNT"
};


// Step 5: Make a /payments request.
checkoutApi.payments(paymentRequest)
.then(paymentResponse => console.log(paymentResponse.pspReference))
.catch(error => console.log(error));
*/
const FormSchema = z.object({
  type: z.string({
    required_error: "You need to select a method.",
  }),
})

const FormSchemaPay = z.object({
  code: z.string({
    required_error: "You need to select a payment method.",
  }),
})



export default function ShippingAddresses() {
  const cartId = getCookie(namespaces.checkout.cartId);
  const [setShippingAddressesOnCart, { loading, error }] = useMutation(SET_SHIPPING_ADDRESS_ON_CART)
  const [setShippingMethodsOnCart, { loading: loadingMethodsOnCart }] = useMutation(SET_SHIPPING_METHODS_ON_CART)
  const [shipping, setShipping] = useState<null | SetShippingAddressesOnCart>(null);
  const [shippingMethodSelected, setShippingMethodSelected] = useState<AvailableShippingMethod | undefined | null>(null);
  const [getCart] = useLazyQuery(CART)
  const dispatch = useDispatch()
  
  

  const address = {
    firstname: "John",
    lastname: "Doe",
    company: "Company Name",
    street: ["3320 N Crescent Dr", "Beverly Hills"],
    city: "Los Angeles",
    region: "CA",
    region_id: 12,
    postcode: "90210",
    country_code: "US",
    telephone: "123-456-0000",
    save_in_address_book: false,
  }

  async function getCartData() {
    const { data: dataCart } = await getCart({
      variables: {
        cartId: cartId
      },
      fetchPolicy: 'network-only'
    })
    dispatch(setCart(dataCart.cart))
  }

  async function handleClick() {
    const { data: dataShipping } = await setShippingAddressesOnCart({
      variables: {
        input: {
          cart_id: cartId,
          shipping_addresses: [{
            address: address
          }]
        }
      }
    })

    setShipping(dataShipping.setShippingAddressesOnCart)
    getCartData()
  }

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  const formPay = useForm<z.infer<typeof FormSchemaPay>>({
    resolver: zodResolver(FormSchemaPay),
  })

  const [setGuestEmailOnCart] = useMutation(SET_GUEST_EMAIL_ON_CART)
  const [adyenPaymentMethods, { loading: loadingAdyenPaymentMethods }] = useLazyQuery(GET_ADYEN_PAYMEN_TMETHODS)
  const [adyenPayments, setAdyenPayments] = useState<AdyenPaymentMethods | null>(null)
  async function onSubmit(values: z.infer<typeof FormSchema>) {
    const shippingMethodSelect: AvailableShippingMethod | undefined = shipping?.cart.shipping_addresses[0].available_shipping_methods.find((method) => method.carrier_code == values.type)
    const { data: cart } = await setShippingMethodsOnCart({
      variables: {
        input: {
          cart_id: cartId,
          shipping_methods: [{
            carrier_code: shippingMethodSelect?.carrier_code,
            method_code: shippingMethodSelect?.method_code
          }]
        }
      }
    })

    setShippingMethodSelected(cart.setShippingMethodsOnCart.cart.shipping_addresses[0].selected_shipping_method)
    await setGuestEmailOnCart({
      variables: {
        input: {
          cart_id: cartId,
          email: 'guest@example.com'
        }
      }
    })

    const { data: payments } = await adyenPaymentMethods({
      variables: {
        cartId: cartId
      }
    })
    getCartData()
    setAdyenPayments(payments.adyenPaymentMethods)
  }

  const [setPaymentMethodOnCart, { loading: loadingSetPaymentMethodOnCart, error: errorSetPaymentMethodOnCart }] = useMutation(SET_PAYMENT_METHOD_ON_CART)
  const [setBillingAddressOnCart, { loading: loadingSetBillingAddressOnCart }] = useMutation(SET_BILLING_ADDRESS_ON_CART)
  async function onSubmitPay(values: z.infer<typeof FormSchemaPay>) {
    await setBillingAddressOnCart({
      variables: {
        input: {
          cart_id: cartId,
          billing_address: {
            address: address
          }
        }
      }
    })

    const { data: setPayment } = await setPaymentMethodOnCart({
      variables: {
        input: {
          cart_id: cartId,
          payment_method: {
            code: values.code
          }
        }
      }
    })
    console.log(setPayment);
  

  }


  return (
    <>
      {(loading || !shipping) && (
        <Button onClick={handleClick}>Next</Button>
      )}

      {error && (
        <p>Error! {error.message}</p>
      )}
      {(loading || loadingMethodsOnCart) && (
        <div className="mt-10 flex justify-center">
          <Loader2 className={`mr-2 h-10 w-10 animate-spin`} />
        </div>
      )}

      {(!loading && shipping && !shippingMethodSelected) && (
        <>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="my-5 space-y-6">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1">
                      <FormItem className="space-y-3">
                        {shipping?.cart.shipping_addresses[0].available_shipping_methods.map((shippingMethod: AvailableShippingMethod) => (
                          <FormItem className="flex items-center space-x-3 space-y-0 " key={shippingMethod.carrier_code}>
                            <FormControl>
                              <Label
                                htmlFor={shippingMethod.carrier_code}
                                className="flex w-full flex-col justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary">
                                <RadioGroupItem value={shippingMethod.carrier_code} id={shippingMethod.carrier_code} className="sr-only" />
                                <span>{shippingMethod.carrier_title}</span>
                                <div className="flex justify-between w-full">
                                  <div className="text-sm text-muted-foreground">
                                    {shippingMethod.method_title}
                                  </div>
                                  <div>{shippingMethod.amount.value}</div>
                                </div>
                              </Label>
                            </FormControl>
                          </FormItem>
                        ))}
                        <FormMessage />
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                )} />
              <Button type="submit" className="w-full">Continue</Button>
            </form>
          </Form>
        </>
      )}
      {shippingMethodSelected && (
        <div>Payment methods
          {(loadingAdyenPaymentMethods || loadingSetBillingAddressOnCart || loadingSetPaymentMethodOnCart) && (
            <div className="mt-10 flex justify-center">
              <Loader2 className={`mr-2 h-10 w-10 animate-spin`} />
            </div>
          )}
          {(!loadingAdyenPaymentMethods && adyenPayments) && (
            <Form {...formPay}>
              <form onSubmit={formPay.handleSubmit(onSubmitPay)} className="my-5 space-y-6">
                <FormField
                  control={formPay.control}
                  name="code"
                  render={({ field }) => (
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1">
                        <FormItem className="space-y-3">
                          {adyenPayments?.paymentMethodsResponse.paymentMethods.map((payment: PaymentMethod) => (
                            <FormItem className="flex items-center space-x-3 space-y-0 " key={payment.type}>
                              <FormControl>
                                <Label
                                  htmlFor={payment.type}
                                  className="flex w-full flex-col justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary">
                                  <RadioGroupItem value={payment.type} id={payment.type} className="sr-only" />
                                  <span>{payment.name}</span>
                                  <div className="flex justify-between w-full">

                                  </div>
                                </Label>
                              </FormControl>
                            </FormItem>
                          ))}
                          <FormMessage />
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                  )} />
                <Button type="submit" className="w-full">Continue</Button>
                {errorSetPaymentMethodOnCart && (
                  <p className="text-red-400">Error! {errorSetPaymentMethodOnCart.message}</p>
                )}
              </form>
            </Form>
          )}
        </div>
      )}
    </>
  )
}