import { useMutation } from "@apollo/client"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { AdyenPaymentMethods, PaymentMethod } from "@/interfaces/Checkout"
import { SET_BILLING_ADDRESS_ON_CART, SET_GUEST_EMAIL_ON_CART } from "@/graphql/checkout"
import CookieManager from "@/lib/CookieManager"
import { namespaces } from "@/lib/utils"
import { ShippingAddressCart } from "@/interfaces/Address"
import { RadioGroup } from "@radix-ui/react-radio-group"
import { Label } from "@radix-ui/react-label"
import { RadioGroupItem } from "./ui/radio-group"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { useState } from "react"
import AdyenPaymentMethodCreditCart from "@/components/adyen-payment-method-credit-cart"
import AdyenPaymentMethodklarnaAccount from "@/components/adyen-payment-method-klarna-account"
import AdyenPaymentMethodMultibanco from "./adyen-payment-method-multibanco"

const FormSchemaPay = z.object({
  code: z.string({
    required_error: "You need to select a payment method.",
  }),
})

interface Props {
  loadingAdyenPaymentMethods: boolean
  adyenPayments: AdyenPaymentMethods | null
  address: ShippingAddressCart | undefined
  email: string | undefined
}

export default function AdyenPaymentsList({ loadingAdyenPaymentMethods, adyenPayments, address, email }: Props) {
  const cartId = CookieManager.getCookie(namespaces.checkout.cartId)

  const formPay = useForm<z.infer<typeof FormSchemaPay>>({
    resolver: zodResolver(FormSchemaPay),
  })

  console.log(adyenPayments);
  
  //const [setPaymentMethodOnCart, { loading: loadingSetPaymentMethodOnCart, error: errorSetPaymentMethodOnCart }] = useMutation(SET_PAYMENT_METHOD_ON_CART)
  const [setBillingAddressOnCart, { loading: loadingSetBillingAddressOnCart }] = useMutation(SET_BILLING_ADDRESS_ON_CART)

  async function onSubmitPay(values: z.infer<typeof FormSchemaPay>) {
    //set Payment Code: adyen_hpp
    console.log(values);
    
  }

  const [selectMentod, setSeletedMethod] = useState<string | null>(null)


  const [ setGuestEmailOnCart, {loading: loadingSetGuestEmailOnCart} ] = useMutation(SET_GUEST_EMAIL_ON_CART)
  async function setBillingAddress(type: string) {
    setSeletedMethod(type)
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

    await setGuestEmailOnCart({
      variables: {
        input: {
          email,
          cart_id: cartId
        }
      }
    })
  }

  return (
    <div>
      <div>Payment methods
        {(loadingAdyenPaymentMethods || loadingSetBillingAddressOnCart || loadingSetGuestEmailOnCart) && (
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
                                <RadioGroupItem value={payment.type} id={payment.type} onClick={() => setBillingAddress(payment.type)} className="sr-only" />
                                <span>{payment.name}</span>
                                {(selectMentod == payment.type) && (
                                  <div className="w-full">                                    
                                    {(selectMentod == 'scheme') && (
                                      <AdyenPaymentMethodCreditCart />
                                    )}

                                    {(selectMentod == 'klarna_account') && (
                                      <AdyenPaymentMethodklarnaAccount email={email} />
                                    )}

                                    {(selectMentod == "multibanco") && (
                                      <AdyenPaymentMethodMultibanco />
                                    )}
                                  </div>
                                )}
                              </Label>
                            </FormControl>
                          </FormItem>
                        ))}
                        <FormMessage />
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                )} />              
            </form>
          </Form>
        )}
      </div>
    </div>
  )
}