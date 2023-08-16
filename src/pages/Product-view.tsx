import { Product } from "@/interfaces/Product";
import { useQuery, useMutation } from "@apollo/client";
import { Loader2 } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import ProductViewGellery from "./Product-view-gellery";
import ProductVariations from "@/components/product-variations";
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useForm } from "react-hook-form"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { GET_PRODUCT_DETAILS } from "@/graphql/product";
import { ADD_CONFIGURABLE_PRODUCTS_TO_CART, ADD_SIMPLE_PRODUCTS_TO_CART, CREATE_EMPTY_CART_GUEST } from "@/graphql/checkout";
import { AlertCircle, Check } from "lucide-react"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { crearCookie, getCookie, getCurrencySymbol, namespaces } from "@/lib/utils";
import { useState } from "react";

const formSchema = z.object({
  parentSku: z.string().min(1),
  sku: z.string().min(1)
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
      sku: ""
    },
  })

  const [getEmptyCart, { loading: loadingCart, error: errorCart }] = useMutation(CREATE_EMPTY_CART_GUEST)
  const [addConfigurableProductsToCart, { loading: loadingToCartConfigurable, error: errorToCartConfigurable }] = useMutation(ADD_CONFIGURABLE_PRODUCTS_TO_CART)
  const [showAlert, setShowAler] = useState(false)
  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!getCookie(namespaces.checkout.cartId)) {
      const cart = await getEmptyCart();
      crearCookie(namespaces.checkout.cartId, cart.data.createEmptyCart, 1);
      window.localStorage.setItem(namespaces.checkout.cartId, cart.data.createEmptyCart)
    }
    const cartId = getCookie(namespaces.checkout.cartId);
    if (cartId) {
      //add to cart
      const { data: addToCart } = await addConfigurableProductsToCart({
        variables: {
          input: {
            cart_id: cartId,
            cart_items: [{
              parent_sku: values.parentSku,
              data: {
                quantity: 1,
                sku: values.sku
              }
            }]
          }
        }
      })

      if (addToCart.addConfigurableProductsToCart.cart) {
        setShowAler(true);
      }
    }
  }

  const [addSimpleProductsToCart, { loading: loadingCartSimple, error: errorToCartSimple }] = useMutation(ADD_SIMPLE_PRODUCTS_TO_CART)
  async function handleSimpleToCart() {
    if (!getCookie(namespaces.checkout.cartId)) {
      const cart = await getEmptyCart();
      crearCookie(namespaces.checkout.cartId, cart.data.createEmptyCart, 1);
      window.localStorage.setItem(namespaces.checkout.cartId, cart.data.createEmptyCart)
    }

    const cartId = getCookie(namespaces.checkout.cartId);
    const { data: addToCart } = await addSimpleProductsToCart({
      variables: {
        input: {
          cart_id: cartId,
          cart_items: [{
            data: {
              quantity: 1,
              sku: sku
            }
          }]
        }
      }
    })
    if (addToCart.addSimpleProductsToCart) {
      setShowAler(true);
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
  const storedValue = localStorage.getItem(namespaces.store.storeConfig);
  let storeConfig;
  if (storedValue) {
    storeConfig = JSON.parse(storedValue);
  }


  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="p-2 col-span-1">
          <ProductViewGellery mediaGallery={product.media_gallery} />
        </div>
        <div className="p-2 col-span-1">
          <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            {product.name}
          </h3>
          <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
            <span>{getCurrencySymbol(storeConfig.locale.replace('_', '-'), product.price_range.maximum_price.final_price.currency)} {product.price_range.maximum_price.final_price.value} </span>
          </h4>

          {errorCart && (<AlertDestructive variant={Variant.destructive} message={errorCart.message} />)}
          {errorToCartConfigurable && (<AlertDestructive variant={Variant.destructive} message={errorToCartConfigurable.message} />)}
          {errorToCartSimple && (<AlertDestructive variant={Variant.destructive} message={errorToCartSimple.message} />)}
          {showAlert && (<AlertDestructive variant={Variant.success} message="Product added successfully" />)}
          {product.__typename === "ConfigurableProduct" && (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-0">
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

                <div>
                  <Button type="submit" className="mt-2">Add to cart</Button>
                </div>
              </form>
            </Form>
          )}

          {product.__typename == "SimpleProduct" && (
            <div>
              <Button type="button" onClick={handleSimpleToCart} className="mt-2">Add to cart</Button>
            </div>
          )}

          {loadingCart || loadingToCartConfigurable || loadingCartSimple && (
            <>
              <Loading />
            </>
          )}
          {showAlert && (
            <div className="mt-5">
              <Link to="/checkout" className={buttonVariants({ variant: "link" })}>Process to checkout</Link>
            </div>
          )}
        </div>
      </div>
    </>
  )
}