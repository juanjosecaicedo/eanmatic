import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { gql, useLazyQuery, ApolloClient } from "@apollo/client"
import { useState } from "react"


const CREATE_EMPTY_CART = gql`
  mutation {
    createEmptyCart
  }
`
interface AddTocart {
  parentSku: string
}


const formSchema = z.object({
  parentSku: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
})

export default function AddTocart({ parentSku }: AddTocart) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      parentSku: parentSku,
    },
  })

  let cardIdStore = localStorage.getItem("CART_ID")
  const [cartId, setIdCart] = useState<string | null>(cardIdStore)


  //const [getCartId, { data, loading, error }] = useLazyQuery(CREATE_EMPTY_CART);

  function onSubmit(values: z.infer<typeof formSchema>) {
    //getCartId();
    console.log(values)
  
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="parentSku"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} value={parentSku} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Add to cart</Button>
        </form>
      </Form>
    </>
  )
}

/*export default function AddTocart({ parentSku }) {
  const cardId = localStorage.getItem('CART_ID');
  const [idCart, setIdCart] = useState(false);



  if (!cardId) {
    //const { data, error } = useQuery(CREATE_EMPTY_CART);
    setIdCart(true)
  } else {
    setIdCart(true)
  }


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      parentSku: parentSku,
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="parentSku"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} value={parentSku} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Add to cart</Button>
        </form>
      </Form>
    </>
  )
}*/