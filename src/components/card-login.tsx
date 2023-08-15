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
import { useMutation } from "@apollo/client"
import { useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { GENERATE_CUSTOMER_TOKEN } from "@/graphql/customer"
import { crearCookie, getCookie, namespaces } from "@/lib/utils"

const formSchema = z.object({
  email: z.string().email({
    message: "The email is invalid"
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters."
  })
})



export function CardAccountLogin() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  })

  const [generateCustomerToken] = useMutation(GENERATE_CUSTOMER_TOKEN)

  const [error, setError] = useState<boolean | string>(false)

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
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
        window.localStorage.setItem(namespaces.customer.token, token);
        crearCookie(namespaces.customer.token, token, 1);
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
        setTimeout(() => {
          setError(false)
        }, 8000)
      }
      console.error(error)
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

      {getCookie(namespaces.customer.token) && (
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