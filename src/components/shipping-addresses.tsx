/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Button } from "@/components/ui/button"
import {
  CART,
  COUNTRIES,
  GET_ADYEN_PAYMEN_TMETHODS,
  SET_GUEST_EMAIL_ON_CART,
  SET_SHIPPING_ADDRESS_ON_CART,
  SET_SHIPPING_METHODS_ON_CART
} from "@/graphql/checkout"
import { AvailableShippingMethod, PaymentMethod, SetShippingAddressesOnCart } from "@/interfaces/Checkout"
import { namespaces, setHeaderToken } from "@/lib/utils"
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
import { CheckCircle, Loader2 } from "lucide-react"
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
import { useNavigate } from "react-router-dom"
import CookieManager from "@/lib/CookieManager"
import AdyenPaymentsList from "./adyen-payment-list"
import { GET_CUSTOMER } from "@/graphql/customer"
import { Address, Customer } from "@/interfaces/Customer"
import AddressRender from "./address-render"

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


export default function ShippingAddresses() {
  const cartId = CookieManager.getCookie(namespaces.checkout.cartId);
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
  const [address, setAddress] = useState<ShippingAddressCart | undefined>()
  const [email, setEmail] = useState<string>()
  const [regions, setRegions] = useState<AvailableRegion[] | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null)
  const token = CookieManager.getCookie(namespaces.customer.token)
  if (token) {
    setHeaderToken(token)
  }

  async function getCartData() {
    const { data: dataCart } = await getCart({
      variables: {
        cartId: cartId
      },
      fetchPolicy: 'network-only'
    })
    dispatch(setCart(dataCart.cart))
    localStorage.setItem(namespaces.checkout.cartData, JSON.stringify(dataCart.cart))
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

    if (!regions) {
      Object.assign(_address, { region: _address['region_id'] })

      // @ts-ignore
      delete _address['region_id']
    }

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


  const [setGuestEmailOnCart] = useMutation(SET_GUEST_EMAIL_ON_CART)
  const [adyenPaymentMethods, { loading: loadingAdyenPaymentMethods }] = useLazyQuery(GET_ADYEN_PAYMEN_TMETHODS)
  const [adyenPayments, setAdyenPayments] = useState<PaymentMethod[] | null>(null)
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
    if (!customer) {
      await setGuestEmailOnCart({
        variables: {
          input: {
            cart_id: cartId,
            email: email
          }
        }
      })
    }

    const { data: payments } = await adyenPaymentMethods({
      variables: {
        cartId: cartId
      }
    })
    getCartData()
    setAdyenPayments(payments.adyenPaymentMethods)
  }

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

  const [getCustomer, { loading: loadingCustomer }] = useLazyQuery(GET_CUSTOMER)

  useEffect(() => {
    if (!loadingCountries && dataCountries) {
      const country = dataCountries.countries.find((country: Country) => country.id == form.getValues('country_code'))
      if (country) {
        setRegions(country.available_regions)
      }
    }
    //get customer is logged

    async function getCustomerData() {
      const { data: customerData } = await getCustomer()
      if (customerData) {
        setCustomer(customerData.customer)
      }else {
        CookieManager.deleteCookie(namespaces.customer.token)
      }
    }

    if (token) {
      getCustomerData()
    }
  }, [loadingCountries, dataCountries, form, token, getCustomer, setCustomer])

  const [addressId, setAddressId] = useState('')
  console.log(addressId);
  async function handleAddress(seletedAddress: Address) {
    setAddressId(seletedAddress.id.toString())    
    const shippingAddress: ShippingAddressCart = {
      city: seletedAddress.city,
      company: seletedAddress.company,
      country_code: seletedAddress.country_code,
      firstname: seletedAddress.firstname,
      lastname: seletedAddress.lastname,
      postcode: seletedAddress.postcode,
      region_id: seletedAddress.region?.region_id.toString(),
      street: seletedAddress.street,
      save_in_address_book: false,
      telephone: seletedAddress.telephone
    }
    //validate is region_id in seletedAddress.region
    setAddress(shippingAddress)
    if (customer) {
      setEmail(customer.email)
      const { data: dataShipping } = await setShippingAddressesOnCart({
        variables: {
          input: {
            cart_id: cartId,
            shipping_addresses: [{
              address: shippingAddress
            }]
          }
        }
      })

      setShipping(dataShipping.setShippingAddressesOnCart)
      getCartData()
    }
  }


  return (
    <>

      {(token && customer && customer.addresses && !shipping) ? (
        <>
          {loadingCustomer && (
            <div className="mt-10 flex justify-center">
              <Loader2 className={`mr-2 h-10 w-10 animate-spin`} />
            </div>
          )}
          {(!loadingCustomer && customer) && (
            <RadioGroup defaultValue={addressId}

              className="grid grid-cols-3 gap-4">
              {customer.addresses.map((address: Address) => (
                <div className="flex items-center" key={address.id}>
                  <RadioGroupItem
                    value={address.id.toString()}
                    id={address.id.toString()}
                    className="peer sr-only"
                    onClick={() => handleAddress(address)}
                  />
                  <Label
                    htmlFor={address.id.toString()}
                    className={`relative rounded-md border-2 border-muted bg-popover px-4 py-6 hover:bg-accent hover:text-accent-foreground ${(addressId == address.id.toString()) ? 'border-gray-300' : ''}`}
                  >
                    {(addressId == address.id.toString()) && (
                      <div className="absolute right-[5px] top-[5px]">
                        <CheckCircle className="text-gray-400" />
                      </div>
                    )}
                    <AddressRender address={address} />
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}
        </>
      ) :
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
          )}
        </>
      }

      {
        error && (
          <p>Error! {error.message}</p>
        )
      }

      {(loading || loadingMethodsOnCart) && (
        <div className="mt-10 flex justify-center">
          <Loader2 className={`mr-2 h-10 w-10 animate-spin`} />
        </div>
      )}

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
      {shippingMethodSelected && (
        <AdyenPaymentsList loadingAdyenPaymentMethods={loadingAdyenPaymentMethods} adyenPayments={adyenPayments} address={address} email={email} />
      )}
    </>
  )
}