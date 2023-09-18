import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useLazyQuery, useMutation } from "@apollo/client"
import { useEffect, useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { CUSTOMER_CART, GENERATE_CUSTOMER_TOKEN, MERGE_CARTS } from "@/graphql/customer"
import { namespaces, setHeaderToken } from "@/lib/utils"
import CookieManager from "@/lib/CookieManager"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { setToken } from "@/reducers/token"

const formSchema = z.object({
  email: z.string().email({
    message: "The email is invalid"
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters."
  })
})

export function CardAccountLogin() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  useEffect(() => {
    if (CookieManager.getCookie(namespaces.customer.token)) {
      navigate('/')
    }

  }, [navigate])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  })

  const [generateCustomerToken] = useMutation(GENERATE_CUSTOMER_TOKEN)
  const [error, setError] = useState<boolean | string>(false)
  const cartId = CookieManager.getCookie(namespaces.checkout.cartId)
  const [customerCart] = useLazyQuery(CUSTOMER_CART)
  const [mergeCarts] = useMutation(MERGE_CARTS)


  async function onSubmit(values: z.infer<typeof formSchema>) {
    setError(false)
    try {
      const { data } = await generateCustomerToken({
        variables: {
          email: values.email,
          password: values.password
        }
      })

      if (data.generateCustomerToken) {
        const { token } = data.generateCustomerToken;
        setHeaderToken(token)

        if (cartId) {
          const { data: customerCartData } = await customerCart()
          CookieManager.createCookie(namespaces.checkout.cartId, customerCartData.customerCart.id, 1)
          if (customerCartData && customerCartData.customerCart.id != cartId) {
            await mergeCarts({
              variables: {
                source_cart_id: cartId,
                destination_cart_id: customerCartData.customerCart.id
              }
            })
          }
        }

        window.localStorage.setItem(namespaces.customer.token, token);
        CookieManager.createCookie(namespaces.customer.token, token, 1);
        dispatch(setToken(token))

        navigate('/customer/account')
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
        setTimeout(() => {
          setError(false)
        }, 8000)
      }
    }
  }

  return (
    <>
      {error &&
        <Alert variant="destructive" className="mb-5">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      }

      {!CookieManager.getCookie(namespaces.customer.token) && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card>
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl">Login an account</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="m@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full">Login</Button>
              </CardFooter>
            </Card>
          </form>
        </Form>
      )}
    </>
  )
}