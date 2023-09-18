import { Item } from "@/interfaces/Cart"
import { namespaces, priceFormat, } from "@/lib/utils"
import { Button } from "./ui/button"
import { Trash2 } from "lucide-react"
import { useMutation } from "@apollo/client"
import { REMOVE_ITEM_FROM_CART } from "@/graphql/checkout"
import CookieManager from "@/lib/CookieManager"
import { useDispatch } from "react-redux"
import { setCart } from "@/reducers/cart"
import ItemqQantity from "./item-quantity"

interface ItemsCartI {
  items: Item[]
}

export default function ItemsCart({ items }: ItemsCartI) {
  const [removeItemFromCart] = useMutation(REMOVE_ITEM_FROM_CART)
  const cartId = CookieManager.getCookie(namespaces.checkout.cartId)
  const dispatch = useDispatch()
  async function removeItem(uid: string) {
    console.log(uid);
    const { data: removeItemFromCartData } = await removeItemFromCart({
      variables: {
        input: {
          cart_id: cartId,
          cart_item_uid: uid
        }
      }
    })
    if (removeItemFromCartData) {
      dispatch(setCart(removeItemFromCartData.cart))
    }
  }


  return (
    items.map((item: Item) => (
      <div className="flex gap-2 mb-2 border border-gray-100" key={item.id}>
        <img src={item.product.image.url} alt="" width={60} />
        <div className="flex flex-col">
          <span className="font-bold text-sm">{item.product.name}</span>
          <span className="text-[12px] text-muted-foreground">Qty: <span className="font-bold">{item.quantity}</span></span>
          <span className="text-[12px] text-muted-foreground">SKU: <span className="font-bold">{item.product.sku}</span></span>
          <ItemqQantity quantity={item.quantity} uid={item.uid}/>
          <span className="text-[12px]">{priceFormat(item.prices.price.value)}</span>
        </div>
        <div className="ml-auto">
          <Button variant="outline" className="p-2 border-0" onClick={() => removeItem(item.uid)}>
            <Trash2 className="text-gray-400" />
          </Button>
        </div>
      </div>
    ))
  )
}