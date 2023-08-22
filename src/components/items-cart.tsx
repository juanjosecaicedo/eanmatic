

import { Item } from "@/interfaces/Cart"
import { getCurrencySymbol, } from "@/lib/utils"

interface ItemsCartI {
  items: Item[]
  locale: string
}

export default function ItemsCart({ items, locale }: ItemsCartI) {
  return (
    items.map((item: Item) => (
      <div className="flex gap-2 mb-2 border border-gray-100" key={item.id}>
        <img src={item.product.image.url} alt="" width={60} />
        <div className="flex flex-col">
          <span className="font-bold text-sm">{item.product.name}</span>
          <span className="text-[12px] text-muted-foreground">Qty: <span className="font-bold">{item.quantity}</span></span>
          <span className="text-[12px] text-muted-foreground">SKU: <span className="font-bold">{item.product.sku}</span></span>
          <span className="text-[12px]">{getCurrencySymbol(locale, item.prices.price.currency)} {item.prices.price.value}</span>
        </div>
      </div>
    ))
  )
}