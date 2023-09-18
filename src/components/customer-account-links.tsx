import { Button, buttonVariants } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import CookieManager from "@/lib/CookieManager"
import { namespaces, redirectCustomerToLogin } from "@/lib/utils"
import { setCart } from "@/reducers/cart"
import { User } from "lucide-react"
import { useDispatch } from "react-redux"
import { Link, useNavigate } from "react-router-dom"

export default function CustomerAccountLinks() {
  //Poner parametro en magento Klarna  
  const token = CookieManager.getCookie(namespaces.customer.token)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const logout = () => {
    if (CookieManager.getCookie(namespaces.checkout.cartId)) {
      CookieManager.deleteCookie(namespaces.checkout.cartId)
      dispatch(setCart(null))
    }
    redirectCustomerToLogin(navigate)
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="border-0">
          <User className="h-4 w-4" />
          <span className="ml-2">My account</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {!token && (
          <>
            <DropdownMenuItem>
              <Link to="/customer/account/login" className={buttonVariants({ variant: "link" }) + " w-full"}>Login</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link to="/customer/account/create" className={buttonVariants({ variant: "link" }) + " w-full"}>Register</Link>
            </DropdownMenuItem>
          </>
        )}
        {token && (
          <>
            <DropdownMenuItem>
              <Link to="/customer/account" className={buttonVariants({ variant: "link" }) + " w-full"}>Account</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Button variant="link" className="w-full" onClick={logout}>Log out</Button>
            </DropdownMenuItem>
          </>
        )}

      </DropdownMenuContent>
    </DropdownMenu>
  )
}
