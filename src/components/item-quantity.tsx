import { Minus, Plus } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { useRef, useState } from "react"
import CookieManager from "@/lib/CookieManager"
import { namespaces } from "@/lib/utils"
import { useMutation } from "@apollo/client"
import { UPDATE_cART_ITEMS } from "@/graphql/checkout"
import { useDispatch } from "react-redux"
import { setCart } from "@/reducers/cart"

interface Props {
  quantity: number
  uid: string
}

export default function ItemqQantity({ quantity, uid }: Props) {
  const cartId = CookieManager.getCookie(namespaces.checkout.cartId)
  const dispatch = useDispatch()
  const [updateCartItems, { error }] = useMutation(UPDATE_cART_ITEMS)
  const ref = useRef<HTMLInputElement>(null);
  const [showUpdate, setshowUpdate] = useState<boolean>(false)
  function setValueQty(action: string) {

    if (!ref.current) {
      return
    }

    if (action == "increment") {
      ref.current.value = (parseInt(ref.current.value) + 1).toString()
    }

    if (ref.current && action == "decrement") {
      const value = parseInt(ref.current.value) - 1
      value < 1 ? ref.current.value = "1" : ref.current.value = value.toString()
    }

    setshowUpdate(parseInt(ref.current.value) != quantity)

  }
  async function updateQuantity() {
    if (ref.current) {
      const { data: updateCartItemsData } = await updateCartItems({
        variables: {
          input: {
            cart_id: cartId,
            cart_items: [{
              cart_item_uid: uid,
              quantity: ref.current.value
            }]
          }
        }
      })
      if (updateCartItemsData) {
        dispatch(setCart(updateCartItemsData.updateCartItems.cart))
      }
    }
  }

  return (
    <div>
      <div className="flex gap-2 items-center my-2">
        <div className="flex">
          <Button variant="secondary" className="px-2 rounded-none" onClick={() => setValueQty("decrement")}>
            <Minus width={14} />
          </Button>
          <Input ref={ref} className="rounded-none focus-visible:ring-0 w-10" defaultValue={quantity} />
          <Button variant="secondary" className="px-2 rounded-none" onClick={() => setValueQty("increment")}>
            <Plus width={14} />
          </Button>
        </div>
        {showUpdate && (
          <Button variant="outline" onClick={updateQuantity}>Update</Button>
        )}
      </div>
      {error && (
        <p className="text-red-500">{error.message}</p>
      )}
    </div>
  )
}