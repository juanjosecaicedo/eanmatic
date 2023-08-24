import { Button } from "@/components/ui/button"
import { 
  CART, 
  COUNTRIES, 
  GET_ADYEN_KLARNA_DETAILS, 
  GET_ADYEN_PAYMEN_TMETHODS, 
  SET_BILLING_ADDRESS_ON_CART, 
  SET_GUEST_EMAIL_ON_CART, 
  SET_PAYMENT_METHOD_ON_CART, 
  SET_SHIPPING_ADDRESS_ON_CART, 
  SET_SHIPPING_METHODS_ON_CART 
} from "@/graphql/checkout"
import { AdyenPaymentMethods, AvailableShippingMethod, PaymentMethod, SetShippingAddressesOnCart } from "@/interfaces/Checkout"
import { getCookie, namespaces } from "@/lib/utils"
import { useLazyQuery, useMutation, useQuery } from "@apollo/client"
import { useEffect, useState } from "react"
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
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Loader2 } from "lucide-react"
import { useDispatch } from "react-redux"
import { setCart } from "@/reducers/cart"
import { Input } from "./ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SelectGroup, SelectLabel } from "@radix-ui/react-select"
import { AvailableRegion, Country } from "@/interfaces/Countries"
import { ShippingAddressCart } from "@/interfaces/Address"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"


const formSchema = z.object({
  firstname: z.string(),
  lastname: z.string(),
  company: z.string(),
  city: z.string(),
  street1: z.string(),
  street2: z.string(),
  region_id: z.string(),
  postcode: z.string(),
  country_code: z.string(),
  telephone: z.string(),
  email: z.string().email(),
  save_in_address_book: z.boolean()
})

const FormSchemaShippingMethod = z.object({
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
  const navigate = useNavigate();

  useEffect(() => {
    if (!cartId) {
      navigate('/checkout/cart')
    }
  }, [cartId, navigate])  

  const [setShippingAddressesOnCart, { loading, error }] = useMutation(SET_SHIPPING_ADDRESS_ON_CART)
  const [setShippingMethodsOnCart, { loading: loadingMethodsOnCart }] = useMutation(SET_SHIPPING_METHODS_ON_CART)
  const [shipping, setShipping] = useState<null | SetShippingAddressesOnCart>(null);
  const [shippingMethodSelected, setShippingMethodSelected] = useState<AvailableShippingMethod | undefined | null>(null);
  const { data: dataCountries, loading: loadingCountries } = useQuery(COUNTRIES)
  const [getCart] = useLazyQuery(CART)
  const dispatch = useDispatch()
  const [address, setAddress] = useState<ShippingAddressCart | undefined>();
  const [email, setEmail] = useState<string>()


  async function getCartData() {
    const { data: dataCart } = await getCart({
      variables: {
        cartId: cartId
      },
      fetchPolicy: 'network-only'
    })
    dispatch(setCart(dataCart.cart))
  }


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstname: "Test",
      lastname: "Person-pt",
      company: "",
      street1: "3320 N Crescent Dr",
      street2: "",
      region_id: '1023',
      postcode: "1990-094",
      country_code: "PT",
      telephone: "+351212162265",
      city: 'Lisboa',
      email: 'customer@email.pt',
      save_in_address_book: false
    },
  })

  async function onSubmitShippingAddress(values: z.infer<typeof formSchema>) {
    const _address: ShippingAddressCart = {
      firstname: values.firstname,
      lastname: values.lastname,
      company: values.company,
      street: [values.street1, values.street2],
      city: values.city,
      region_id: values.region_id,
      postcode: values.postcode,
      country_code: values.country_code,
      telephone: values.telephone,      
      save_in_address_book: values.save_in_address_book
    }

    setEmail(values.email)

    setAddress(_address)
    const { data: dataShipping } = await setShippingAddressesOnCart({
      variables: {
        input: {
          cart_id: cartId,
          shipping_addresses: [{
            address: _address
          }]
        }
      }
    })

    setShipping(dataShipping.setShippingAddressesOnCart)
    getCartData()
  }

  const formShippingMethod = useForm<z.infer<typeof FormSchemaShippingMethod>>({
    resolver: zodResolver(FormSchemaShippingMethod),
  })

  const formPay = useForm<z.infer<typeof FormSchemaPay>>({
    resolver: zodResolver(FormSchemaPay),
  })

  const [setGuestEmailOnCart] = useMutation(SET_GUEST_EMAIL_ON_CART)
  const [adyenPaymentMethods, { loading: loadingAdyenPaymentMethods }] = useLazyQuery(GET_ADYEN_PAYMEN_TMETHODS)
  const [adyenPayments, setAdyenPayments] = useState<AdyenPaymentMethods | null>(null)
  async function onSubmit(values: z.infer<typeof FormSchemaShippingMethod>) {
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
          email: email
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
  const [getAdyenKlarnaDetails, {loading: loadingGetAdyenKlarnaDetails}] = useLazyQuery(GET_ADYEN_KLARNA_DETAILS)
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

    //set Payment Code: adyen_hpp
    const payment = adyenPayments?.paymentMethodsResponse.paymentMethods.find((payment: PaymentMethod) => payment.type == values.code)
    let code = values.code
    if (typeof payment !== "undefined") {
      code = "adyen_hpp"
    }       

    const { data: setPayment } = await setPaymentMethodOnCart({
      variables: {
        input: {
          cart_id: cartId,
          payment_method: {
            code
          }
        }
      }
    })

    // Set payment with klarna_account
    if(setPayment.setPaymentMethodOnCart && values.code == "klarna_account") {      
      const _email = email?.length ? email : 'customer@email.pt'
      
      const {data: klarnaDetails } = await getAdyenKlarnaDetails({
        variables: {
          cartId: cartId,
          email: _email
        }
      })

      console.log(klarnaDetails.getAdyenKlarnaDetails?.action);
      if(klarnaDetails.getAdyenKlarnaDetails?.action.type == "redirect") {        
        window.location.href = klarnaDetails.getAdyenKlarnaDetails?.action.url
      }      
    }
  }

  const [regions, setRegions] = useState<AvailableRegion[] | null>(null);

  async function handleClickContry(open: boolean) {
    if (!open) {
      const trigger = await form.trigger('country_code')
      if (trigger) {
        const id = form.getValues('country_code')
        const country = dataCountries.countries.find((country: Country) => country.id == id)
        setRegions(country.available_regions)
      }
    }
  }

  useEffect(() => {
    if (!loadingCountries && dataCountries) {
      const country = dataCountries.countries.find((country: Country) => country.id == form.getValues('country_code'))
      if (country) {
        setRegions(country.available_regions)
      }
    }
  }, [loadingCountries, dataCountries, form])

  return (
    <>
      {(loading || !shipping) && (
        <>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitShippingAddress)} className="space-y-8">
              
              <div className="grid md:grid-cols-2 gap-4">
              <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="firstname"
                  render={({ field }) => (
                    <FormItem className="col-span-1">
                      <FormLabel>Firstname</FormLabel>
                      <FormControl>
                        <Input placeholder="firstname" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastname"
                  render={({ field }) => (
                    <FormItem className="col-span-1">
                      <FormLabel>Lastname</FormLabel>
                      <FormControl>
                        <Input placeholder="lastname" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem className="col-span-1">
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="City" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="street1"
                  render={({ field }) => (
                    <FormItem className="col-span-1">
                      <FormLabel>Street line 1</FormLabel>
                      <FormControl>
                        <Input placeholder="Street line 1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="street2"
                  render={({ field }) => (
                    <FormItem className="col-span-1">
                      <FormLabel>Street line 2</FormLabel>
                      <FormControl>
                        <Input placeholder="Street line 2" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="country_code"
                  render={({ field }) => (
                    <FormItem className="col-span-1">
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value} onOpenChange={(open: boolean) => handleClickContry(open)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a Country" />
                          </SelectTrigger>
                          <SelectContent className="">
                            <SelectGroup className="max-h-96 scroll-auto">
                              <SelectLabel>Country</SelectLabel>
                              {(!loadingCountries && dataCountries) && (
                                dataCountries.countries.map((country: Country) => (
                                  <SelectItem key={country.id} value={country.id}>{country.full_name_locale}</SelectItem>
                                ))
                              )}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="region_id"
                  render={({ field }) => (
                    <FormItem className="col-span-1">
                      <FormLabel>Region</FormLabel>
                      {regions?.length ? (
                        <>
                          <FormControl>
                            <Select onValueChange={field.onChange} defaultValue={field.value} >
                              <SelectTrigger>
                                <SelectValue placeholder="Select a Region" />
                              </SelectTrigger>
                              <SelectContent className="">
                                <SelectGroup className="max-h-96 scroll-auto">
                                  <SelectLabel>Region</SelectLabel>
                                  {regions?.map((region: AvailableRegion) => (
                                    <SelectItem key={region.id} value={`${region.id}`}>{region.name}</SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </FormControl>
                        </>
                      ) : (
                        <>
                          <FormControl>
                            <Input placeholder="Region" {...field} />
                          </FormControl>
                          <FormMessage />
                        </>
                      )}
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="telephone"
                  render={({ field }) => (
                    <FormItem className="col-span-1">
                      <FormLabel>telephone</FormLabel>
                      <FormControl>
                        <Input placeholder="telephone" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem className="col-span-1">
                      <FormLabel>company</FormLabel>
                      <FormControl>
                        <Input placeholder="company" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="postcode"
                  render={({ field }) => (
                    <FormItem className="col-span-1">
                      <FormLabel>postcode</FormLabel>
                      <FormControl>
                        <Input placeholder="postcode" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit">Submit</Button>
            </form>
          </Form>

        </>
      )
      }

      {
        error && (
          <p>Error! {error.message}</p>
        )
      }
      {
        (loading || loadingMethodsOnCart) && (
          <div className="mt-10 flex justify-center">
            <Loader2 className={`mr-2 h-10 w-10 animate-spin`} />
          </div>
        )
      }

      {
        (!loading && shipping && !shippingMethodSelected) && (
          <>
            <Form {...formShippingMethod}>
              <form onSubmit={formShippingMethod.handleSubmit(onSubmit)} className="my-5 space-y-6">
                <FormField
                  control={formShippingMethod.control}
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
        )
      }
      {
        shippingMethodSelected && (
          <div>Payment methods
            {(loadingAdyenPaymentMethods || loadingSetBillingAddressOnCart || loadingSetPaymentMethodOnCart || loadingGetAdyenKlarnaDetails) && (
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
                </form>
              </Form>
            )}
          </div>
        )
      }
    </>
  )
}