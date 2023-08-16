import { useState } from "react"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { Link } from "react-router-dom"
import { ModeToggle } from '@/components/mode-toggle'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import MiniCart from "@/components/checkout-mini-cart"
import CustomerAccountLinks from "./customer-account-links"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { useQuery } from "@apollo/client"
import { GET_ALL_STORES, GET_STORE_CONFIG } from "@/graphql/store"
import { Button } from "./ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { Check } from "lucide-react"
import { crearCookie, getCookie, namespaces } from "@/lib/utils"

const FormSchema = z.object({
  storeCode: z.string({
    required_error: "Please select an sore to display.",
  })
})

export function HeaderNavigationMenu() {
  const { data, loading, error } = useQuery(GET_ALL_STORES, {
    context: {
      headers: {
        'store': getCookie(namespaces.store.storeCode) ?? 'default'
      }
    }
  })

  const [showAlert, setShowAlert] = useState<boolean>(false)
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  function onSubmit(values: z.infer<typeof FormSchema>) {
    setShowAlert(true)
    crearCookie(namespaces.store.storeCode, values.storeCode, 5)
    localStorage.setItem(namespaces.store.storeCode, values.storeCode)
    setTimeout(() => setShowAlert(false), 2000)
    setTimeout(() => window.location.reload(), 3000)
  }

  const selected = getCookie(namespaces.store.storeCode)
  const { data: dataSore, loading: loadingStore } = useQuery(GET_STORE_CONFIG, {
    context: {
      headers: {
        'store': selected
      }
    }
  })

  let storeData
  if (!loadingStore) {
    storeData = dataSore
    localStorage.setItem(namespaces.store.storeConfig, JSON.stringify(storeData?.storeConfig))
  }

  return (
    <NavigationMenu className="w-full shadow-sm max-w-full py-5">
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link to="/">Home</Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Dialog>
            <DialogTrigger className="ml-5">Stores | {storeData?.storeConfig.store_name.replace('View', '')}</DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Select or change stores</DialogTitle>
                <DialogDescription>
                  The default store is default in case you do not find a store
                </DialogDescription>
                {loading && (
                  <p>Loading</p>
                )}

                {error ? (<>Error! {error.message}</>) : (
                  <>
                    {showAlert && (
                      <div className="my-5">
                        <Alert variant={"success"}>
                          <Check className="h-4 w-4" />
                          <AlertTitle>Store changed!</AlertTitle>
                          <AlertDescription>
                            The store was successfully changed
                          </AlertDescription>
                        </Alert>
                      </div>
                    )}

                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
                        <FormField
                          control={form.control}
                          name="storeCode"
                          render={({ field }) => (
                            <FormItem>
                              <Select value={(selected)? selected : "default"} onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a store" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectLabel>Stores</SelectLabel>
                                    {data.getAllStores.map((store: { id: number, store_name: string, code: string }) => (
                                      <SelectItem value={store.code} key={store.id}>{store.store_name.replace('View', '')}</SelectItem>
                                    ))}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="submit">Submit</Button>
                      </form>
                    </Form>
                  </>
                )}
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <CustomerAccountLinks />
        </NavigationMenuItem>
        <NavigationMenuItem>
          <MiniCart />
        </NavigationMenuItem>
        <NavigationMenuItem>
          <ModeToggle />
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}
