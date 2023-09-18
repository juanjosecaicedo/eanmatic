import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from "@/components/ui/card"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { useForm } from "react-hook-form"
import { useMutation } from "@apollo/client"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { useEffect, useState } from "react"
import { CREATE_CUSTOMER, GENERATE_CUSTOMER_TOKEN } from "@/graphql/customer"
import { namespaces, setHeaderToken } from "@/lib/utils"
import CookieManager from "@/lib/CookieManager"
import { useNavigate } from "react-router-dom"

const messagePasswordError = 'Minimum of different classes of characters in password is %1. Classes of characters: Lower Case, Upper Case, Digits, Special Characters.';
const minPassword = 8;
const objectMessagePassword = {
  message: messagePasswordError.replace('%1', '' + minPassword)
}

const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{3,}$/;

const formSchema = z.object({
  firstname: z.string().min(3),
  lastname: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(minPassword, objectMessagePassword).regex(new RegExp(regex), objectMessagePassword),
  confirmPassword: z.string().min(minPassword),
  is_subscribed: z.boolean().default(false).optional()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

export default function CustomerAccountCreate() {
  const navigate = useNavigate()
  useEffect(() => {
    if (CookieManager.getCookie(namespaces.customer.token)) {
      navigate('/customer/account')
    }
  }, [navigate])
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      confirmPassword: "",
      is_subscribed: false,
    }
  })

  const [createCustomer] = useMutation(CREATE_CUSTOMER)
  const [generateCustomerToken] = useMutation(GENERATE_CUSTOMER_TOKEN)
  const [error, setError] = useState<boolean | string>(false)

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setError(false)
      const { data } = await createCustomer({
        variables: {
          input: {
            firstname: values.firstname,
            lastname: values.lastname,
            email: values.email,
            password: values.password,
            is_subscribed: values.is_subscribed
          }
        }
      })
      
      if (data.createCustomer) {
        //Get get token        
        try {
          const { data } = await generateCustomerToken({
            variables: {
              email: values.email,
              password: values.password
            }
          })
          const token = data.generateCustomerToken.token
          CookieManager.createCookie(namespaces.customer.token, token, 1)
          window.localStorage.setItem(namespaces.customer.token, token)
          setHeaderToken(token)
          navigate('/customer/account')
        } catch (error) {
          if (error instanceof Error) {
            setError(error.message)
          }          
        }
      }

    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
        setTimeout(function () {
          setError(false)
        }, 8000)
      }      
    }
  }

  return (
    <>
      <div className="max-w-2xl mx-auto mt-10">
        {error &&
          <Alert variant="destructive" className="mb-5">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Heads up!</AlertTitle>
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        }

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Sign up</CardTitle>
                <CardDescription>Personal information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-5">
                  <div className="grid gap-2 flex-auto">
                    <FormField
                      control={form.control}
                      name="firstname"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Firstname</FormLabel>
                          <FormControl>
                            <Input type="text" placeholder="Joe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid gap-2 flex-auto">
                    <FormField
                      control={form.control}
                      name="lastname"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Lastname</FormLabel>
                          <FormControl>
                            <Input type="text" placeholder="Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="m@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="is_subscribed"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 my-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Subscribe to the newsletter
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
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
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
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
                <Button type="submit">Submit</Button>
              </CardFooter>
            </Card>
          </form>
        </Form>
      </div>
    </>
  )
}