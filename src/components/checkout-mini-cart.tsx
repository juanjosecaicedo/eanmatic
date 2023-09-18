import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button, buttonVariants } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { useSelector } from "react-redux"
import { RootState } from "@/store"
import { Cart } from "@/interfaces/Cart"
import { Link } from "react-router-dom"
import { priceFormat } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import ItemsCart from "@/components/items-cart"

export default function MiniCart() {
  const cart: Cart | null | object = useSelector((state: RootState) => state.cart.value)  
  
  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="border-0">
            <ShoppingCart className="h-4 w-4" />
            {(cart && "items" in cart) && (
              <Badge className="ml-2">{cart.items.length}</Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            {(cart && 'items' in cart) ? (
              <div>Items: {cart.items.length}</div>
            ) : (
              <SheetTitle>Minicart</SheetTitle>
            )}
            {!cart && (
              <SheetDescription>
                You cart is empty
              </SheetDescription>
            )}
          </SheetHeader>
          <div className="min-h-[73vh]">
            {cart && (
              <div className="my-2">
                {'items' in cart && (
                  <ItemsCart items={cart.items} />
                )}
              </div>
            )}
          </div>
          {(cart && 'items' in cart) && (
            <SheetFooter className="">
              <div className="w-full">
                {'prices' in cart && (
                  <div>
                    <div className="flex justify-between mb-2 text-sm ">
                      <div className="text-muted-foreground">Cart Subtotal:</div>
                      <div className="font-bold">{priceFormat(cart.prices.subtotal_excluding_tax.value)}</div>
                    </div>
                    <div className="flex justify-between mb-4 text-lg">
                      <div className="text-muted-foreground">Cart Total:</div>
                      <div className="font-bold">{priceFormat(cart.prices.grand_total.value)}</div>
                    </div>
                  </div>
                )}
                <SheetClose asChild>
                  <div className="flex flex-col gap-3">
                    <Link to="/checkout/cart" className={buttonVariants({ variant: "outline" })}>view cart</Link>
                    <Link to="/checkout" className={buttonVariants({ variant: "default" })}>Proceed to Checkout</Link>
                  </div>
                </SheetClose>
              </div>
            </SheetFooter>
          )}
        </SheetContent>
      </Sheet >
    </>
  )
}