import { namespaces } from "@/lib/utils"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useQuery } from "@apollo/client"
import { CART } from "@/graphql/checkout"
import { Loader2 } from "lucide-react"
import { Item } from "@/interfaces/Cart"
import Summary from "@/components/summary"
import CookieManager from "@/lib/CookieManager"
import { Link } from "react-router-dom"
import { buttonVariants } from "@/components/ui/button"

export default function CheckoutCart() {
  const cartId = CookieManager.getCookie(namespaces.checkout.cartId)
  const { data, loading } = useQuery(CART, {
    skip: !cartId ? true : false,
    variables: {
      cartId: cartId
    }
  })

  return (
    <div className="mt-5">
      {!cartId ? (
        <div className="min-h-[50vh] flex justify-center items-center">
          <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
            Your car is empty
          </h2>
        </div>
      ) : (
        <div>
          <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0 mb-5">
            Shopping Cart
          </h2>

          {loading && (
            <div className="mt-10 flex justify-center">
              <Loader2 className={`mr-2 h-10 w-10 animate-spin`} />
            </div>
          )}

          {(!loading && data) && (
            <div className="flex flex-row gap-5 justify-between">
              <div className="basis-4/6">
                <Table>
                  <TableCaption>A list of your recent add product to cart.</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Qty</TableHead>
                      <TableHead className="text-right">Subtotal</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.cart.items.map((item: Item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          <div className="flex gap-2">
                            <img src={item.product.image.url} alt="" width={60} />
                            <div className="flex flex-col">
                              <span className="font-bold text-sm">{item.product.name}</span>
                              <span className="text-[12px] text-muted-foreground">SKU: <span className="font-bold">{item.product.sku}</span></span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{item.product.price_range.maximum_price.final_price.value}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell className="text-right">{item.prices.price.value * item.quantity}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="flex justify-end mt-5">
                  <Link to="/checkout" className={buttonVariants({ variant: "default" })}>Proceed to Checkout</Link>
                </div>
              </div>
              <div className="p-2 basis-1/3">
                <Summary />
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  )
}
