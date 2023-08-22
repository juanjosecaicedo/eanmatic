
import { Cart } from "@/interfaces/Cart"
import { RootState } from "@/store"
import { useSelector } from "react-redux"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getCurrencySymbol, getStoreLocale } from "@/lib/utils"
import ItemsCart from "./items-cart"


export default function Summary() {

  const cart: Cart | null | object = useSelector((state: RootState) => state.cart.value)
  const locale = getStoreLocale()

  return (
    <div>
      {cart && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Summary</CardTitle>
            <CardDescription>
              Summary of your purchase
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-1">
            <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Cart Subtotal	</p>
                <p className="text-sm text-muted-foreground">
                  {'prices' in cart && (
                    <>
                      {getCurrencySymbol(locale, cart.prices.subtotal_excluding_tax.currency)} {cart.prices.subtotal_excluding_tax.value}
                    </>
                  )}
                </p>
              </div>
            </div>
            <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Order Total	</p>
                <p className="text-sm text-muted-foreground">
                  {'prices' in cart && (
                    <>
                      {getCurrencySymbol(locale, cart.prices.grand_total.currency)} {cart.prices.grand_total.value}
                    </>
                  )}
                </p>
              </div>
            </div>
            <div className="my-2 border border-gray-100">
              {'items' in cart && (
                <>
                  <p className="mb-3 px-2">Items: {cart.items.length}</p>
                  <ItemsCart locale={locale} items={cart.items} />
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}