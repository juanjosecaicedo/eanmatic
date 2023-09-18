import { Product } from "@/interfaces/Product";
import { useQuery, useMutation, useLazyQuery } from "@apollo/client";
import { Loader2 } from "lucide-react";
import { useParams } from "react-router-dom";
import ProductViewGellery from "./Product-view-gellery";
import ProductVariations from "@/components/product-variations";
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useForm } from "react-hook-form"
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
import { GET_PRODUCT_DETAILS } from "@/graphql/product";
import { ADD_CONFIGURABLE_PRODUCTS_TO_CART, ADD_SIMPLE_PRODUCTS_TO_CART, CART, CREATE_EMPTY_CART_GUEST } from "@/graphql/checkout";
import { AlertCircle, Check } from "lucide-react"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { isLogged, namespaces, priceFormat } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setCart } from "@/reducers/cart";
import CookieManager from "@/lib/CookieManager";
import { CUSTOMER_CART, GET_CUSTOMER } from "@/graphql/customer";

const formSchema = z.object({
  parentSku: z.string().min(1),
  sku: z.string().min(1),
  quantity: z.string()
})

interface Loading {
  className?: string
}
function Loading({ className }: Loading) {
  if (!className) {
    className = 'mr-2 h-10 w-10';
  }
  return (
    <div className="mt-10 flex justify-center">
      <Loader2 className={`${className} animate-spin`} />
    </div>
  )
}

interface AlertDestructive {
  message: string
  variant?: Variant | null | undefined
}

enum Variant {
  default = "default",
  destructive = "destructive",
  success = "success"
}

function AlertDestructive({ message, variant }: AlertDestructive) {
  if (!variant) {
    variant = Variant.default
  }
  return (
    <>
      <Alert variant={variant}>
        {variant == "destructive" ? (<AlertCircle className="h-4 w-4" />) : (<Check className="h-4 w-4" />)}
        {variant != "destructive" ? (<AlertTitle>Success</AlertTitle>) : (<AlertTitle>Error</AlertTitle>)}
        <AlertDescription>
          {message}
        </AlertDescription>
      </Alert>
    </>
  )
}

export default function ProductView() {
  const { id, sku, url, } = useParams()
  const token = CookieManager.getCookie(namespaces.customer.token)
  const [getCustomer] = useLazyQuery(GET_CUSTOMER)
  const [customerIsLogged, setCustomerIsLogged] = useState<boolean>(false)
  const [customerCart] = useLazyQuery(CUSTOMER_CART)


  useEffect(() => {
    if (token) {
      const customer = async () => {
        const d = await isLogged(getCustomer, token)
        setCustomerIsLogged(d)

        if (d) {
          console.log(d);
        }
      }
      customer()
    }
  }, [token, getCustomer, customerCart])


  const { data, loading, error } = useQuery(GET_PRODUCT_DETAILS, {
    variables: {
      filter: {
        sku: {
          eq: sku
        },
        url_key: {
          eq: url
        }
      }
    }
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      parentSku: sku,
      sku: "",
      quantity: "1"
    },
  })

  const [getEmptyCart, { loading: loadingCart, error: errorCart }] = useMutation(CREATE_EMPTY_CART_GUEST)
  const [addConfigurableProductsToCart, { loading: loadingToCartConfigurable, error: errorToCartConfigurable }] = useMutation(ADD_CONFIGURABLE_PRODUCTS_TO_CART)
  const [showAlert, setShowAlert] = useState(false)
  const [getCart] = useLazyQuery(CART)
  const dispatch = useDispatch()

  async function getCartData(cartId: string) {
    const { data: dataCart } = await getCart({
      variables: {
        cartId: cartId
      },
      fetchPolicy: 'network-only'
    })
    dispatch(setCart(dataCart.cart))
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const cartId = CookieManager.getCookie(namespaces.checkout.cartId);

    let cart = null
    /*if (httpLink.options.headers && "authorization" in httpLink.options.headers) {
      httpLink.options.headers['authorization'] = ''
    }*/
    if (!cartId) {

      cart = await getEmptyCart();
      CookieManager.createCookie(namespaces.checkout.cartId, cart.data.createEmptyCart, 1);
      window.localStorage.setItem(namespaces.checkout.cartId, cart.data.createEmptyCart)
    } else {
      const { data: addToCart } = await addConfigurableProductsToCart({
        variables: {
          input: {
            cart_id: cartId,
            cart_items: [{
              parent_sku: values.parentSku,
              data: {
                quantity: values.quantity,
                sku: values.sku
              }
            }]
          }
        }
      })

      if (addToCart.addConfigurableProductsToCart.cart) {
        setShowAlert(true)
        getCartData(cartId)
        setTimeout(() => setShowAlert(false), 5000)
      }
    }

    if (cart && "data" in cart) {
      //add to cart 
      const { data: addToCart } = await addConfigurableProductsToCart({
        variables: {
          input: {
            cart_id: cart.data.createEmptyCart,
            cart_items: [{
              parent_sku: values.parentSku,
              data: {
                quantity: values.quantity,
                sku: values.sku
              }
            }]
          }
        }
      })

      if (addToCart.addConfigurableProductsToCart.cart && cart.data.createEmptyCart) {
        setShowAlert(true)
        getCartData(cart.data.createEmptyCart)
        setTimeout(() => setShowAlert(false), 5000)
      }
    }
  }

  const [qty, setQty] = useState<number | string>(1)

  const [addSimpleProductsToCart, { loading: loadingCartSimple, error: errorToCartSimple }] = useMutation(ADD_SIMPLE_PRODUCTS_TO_CART)
  async function handleSimpleToCart() {
    const cartId = CookieManager.getCookie(namespaces.checkout.cartId);

    if (customerIsLogged) {
      console.log(customerIsLogged);
    }

    let cart = null
    /*if (httpLink.options.headers && "authorization" in httpLink.options.headers) {
      httpLink.options.headers['authorization'] = ''
    }*/

    if (!cartId) {     
      cart = await getEmptyCart();
      CookieManager.createCookie(namespaces.checkout.cartId, cart.data.createEmptyCart, 1);
      window.localStorage.setItem(namespaces.checkout.cartId, cart.data.createEmptyCart)
    }
    if (cart && "data" in cart) {

      const { data: addToCart } = await addSimpleProductsToCart({
        variables: {
          input: {
            cart_id: cart.data.createEmptyCart,
            cart_items: [{
              data: {
                quantity: qty,
                sku: sku
              }
            }]
          }
        }
      })
      if (addToCart.addSimpleProductsToCart && cart.data.createEmptyCart) {
        setShowAlert(true);
        getCartData(cart.data.createEmptyCart)
      }
    }
    if (cartId) {
      const { data: addToCart } = await addSimpleProductsToCart({
        variables: {
          input: {
            cart_id: cartId,
            cart_items: [{
              data: {
                quantity: qty,
                sku: sku
              }
            }]
          }
        }
      })
      if (addToCart.addSimpleProductsToCart) {
        setShowAlert(true)
        getCartData(cartId)
      }
    }
  }


  if (loading) {
    return (
      <Loading />
    )
  }

  if (error) {
    return (
      <AlertDestructive message={error.message} variant={Variant.destructive} />
    )
  }

  const product: Product = data.products.items.find((item: Product) => item.id == id);

  return (
    <>
      {(!loading && !error) && (
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="p-2 col-span-1">
            <ProductViewGellery mediaGallery={product.media_gallery} />
          </div>
          <div className="p-2 col-span-1">
            <div className="my-3">
              {showAlert && (<AlertDestructive variant={Variant.success} message="Product added successfully" />)}
            </div>
            <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
              {product.name}
            </h3>
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
              <span>{priceFormat(product.price_range.maximum_price.final_price.value)}</span>
            </h4>
            {CookieManager.getCookie(namespaces.checkout.cartId)}

            {errorCart && (<AlertDestructive variant={Variant.destructive} message={errorCart.message} />)}
            {errorToCartConfigurable && (<AlertDestructive variant={Variant.destructive} message={errorToCartConfigurable.message} />)}
            {errorToCartSimple && (<AlertDestructive variant={Variant.destructive} message={errorToCartSimple.message} />)}
            {product.__typename === "ConfigurableProduct" && (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-0 mt-5">
                  <FormField
                    control={form.control}
                    name="parentSku"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input type="hidden" placeholder="sku" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sku"
                    render={({ field }) => (
                      <ProductVariations showLabels={true} configurableOptions={product.configurable_options} variants={product.variants} field={field} />
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem className="my-5">
                        <FormLabel>Qty:</FormLabel>
                        <FormControl>
                          <Input type="number" className="max-w-[60px]" min={1} placeholder="quantity" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div>
                    <Button type="submit" className="mt-2">Add to cart</Button>
                  </div>
                </form>
              </Form>
            )}

            {product.__typename == "SimpleProduct" && (
              <div className="mt-5">
                <Input type="number" placeholder="Qty" className="max-w-[60px]" min={1} value={qty} onChange={e => setQty(e.target.value)} />
                <Button type="button" onClick={handleSimpleToCart} className="mt-2">Add to cart</Button>
              </div>
            )}

            {loadingCart || loadingToCartConfigurable || loadingCartSimple && (
              <>
                <Loading />
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}