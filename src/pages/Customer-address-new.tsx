import { SidebarNav } from "@/components/sidebar-nav"
import { CREATE_CUSTOMER_ADDRESS, GET_CUSTOMER } from "@/graphql/customer"
import { useMutation, useQuery } from "@apollo/client"
import { Separator } from "@radix-ui/react-select"
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
//import { Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SelectGroup, SelectLabel } from "@radix-ui/react-select"
import { AvailableRegion, Country } from "@/interfaces/Countries"
import { COUNTRIES } from "@/graphql/checkout"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { redirectCustomerToLogin } from "@/lib/utils"
import { Loader2 } from "lucide-react"

const formSchema = z.object({
  firstname: z.string().min(3),
  lastname: z.string().min(3),
  company: z.string(),
  city: z.string().min(1),
  street1: z.string(),
  street2: z.string(),
  region_id: z.string(),
  postcode: z.string(),
  country_code: z.string().min(2),
  telephone: z.string(),
})

export default function CustomerAddressNew() {
  const navigate = useNavigate();
  const { data: customerData, loading: loadingCustomer } = useQuery(GET_CUSTOMER)

  if (!loadingCustomer && !customerData) {
    redirectCustomerToLogin(navigate)
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstname: customerData ? customerData.customer.firstname : "",
      lastname: customerData ? customerData.customer.lastname : "",
      company: "",
      street1: "",
      street2: "",
      region_id: '',
      postcode: "",
      country_code: "",
      telephone: "",
      city: ''
    }
  })

  const { data: dataCountries, loading: loadingCountries } = useQuery(COUNTRIES)
  const [regions, setRegions] = useState<AvailableRegion[] | null>(null);
  async function handleClickContry(open: boolean) {
    if (!open) {
      const trigger = await form.trigger('country_code')
      if (trigger) {
        const id = form.getValues('country_code')
        const country = dataCountries.countries.find((country: Country) => country.id == id)
        if (country) {
          console.log(country);

          setRegions(country.available_regions)
        } else {
          setRegions([])
        }
      }
    }
  }
  const [createCustomerAddress, { loading: loadingAddress }] = useMutation(CREATE_CUSTOMER_ADDRESS)

  async function onSubmitAddress(values: z.infer<typeof formSchema>) {
    console.log(values, regions);

    const { data } = await createCustomerAddress({
      variables: {
        input: {
          region: regions?.length ? { region_id: values.region_id } : { region: values.region_id },
          country_code: values.country_code,
          street: [values.street1, values.street2],
          telephone: values.telephone,
          postcode: values.postcode,
          city: values.city,
          firstname: values.firstname,
          lastname: values.city,
          default_shipping: false,
          default_billing: false
        }
      }
    })
    console.log(data);
    if (data.createCustomerAddress) {
      navigate('/customer/address')
    }
  }

  return (
    <>
      <div className="hidden space-y-6 p-10 pb-16 md:block">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Customer</h2>
          <p className="text-muted-foreground">
            Manage your account settings and set e-mail preferences.
          </p>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/5">
            <SidebarNav />
          </aside>
          <div className="flex-1 lg:max-w-4xl">

            {(!loadingCustomer && customerData.customer) && (
              <>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmitAddress)} className="space-y-8">
                    <div className="grid md:grid-cols-2 gap-4 md:gap-20">
                      <div className="">
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
                      </div>
                      <div>
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
                                      <SelectItem value="">Country</SelectItem>
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
                    </div>
                    <Button type="submit">Submit</Button>
                  </form>
                </Form>
                {loadingAddress && (
                  <div className="mt-10 flex justify-center">
                    <Loader2 className={`mr-2 h-10 w-10 animate-spin`} />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}