import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"


const formSchema = z.object({
  firstname: z.string().min(1),
  lastname: z.string().min(1),
  company: z.string().min(1),
  street: z.string(),
  city: z.string().min(1),
  region: z.string().min(1),
  postcode: z.string().min(1),
  telephone: z.string().min(1),
  country: z.string().min(1),
})

export default function ShippingAddresses() {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      company: "",
      street: [],
      city: "",
      region: {
        code: "",
        label: ""
      },
      postcode: "",
      telephone: "",
      country: {
        code: "",
        label: ""
      }
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }

  

  return (
    <>
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="firstname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>firstname</FormLabel>
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
            <FormItem>
              <FormLabel>lastname</FormLabel>
              <FormControl>
                <Input placeholder="lastname" {...field} />
              </FormControl>       
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="firstname"
          render={({ field }) => (
            <FormItem>
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
          name="street"
          render={({ field }) => (
            <FormItem>
              <FormLabel>street</FormLabel>
              <FormControl>
                <Input placeholder="street" {...field} />
              </FormControl>           
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
    </>
  )
}