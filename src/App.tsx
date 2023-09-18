import { ThemeProvider } from "@/components/theme-provider"

import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom"

import Checkout from '@/pages/Checkout-index'
import CustomerAccountLogin from '@/pages/Customer-account-login'
import CustomerAccountCreate from '@/pages/Customer-account-create'
import CustomerAccount from '@/pages/Customer-account'
import { HeaderNavigationMenu } from '@/components/header'
import Home from '@/pages/Home'
import ProductView from "@/pages/Product-view"
import { useEffect } from "react"
import { useLazyQuery } from "@apollo/client"
import { CART } from "./graphql/checkout"
import { namespaces, setHeaderToken } from "@/lib/utils"
import { useDispatch } from "react-redux"
import { setCart } from "@/reducers/cart"
import CheckoutCart from "@/pages/Checkout-cart"
import CheckoutSuccess from "@/pages/Checkout-success"
import CookieManager from "@/lib/CookieManager"
import CheckoutFailed from "@/pages/Checkout-failed"
import CustomerAddress from "@/pages/Customer-address"
import CustomerAddressNew from "@/pages/Customer-address-new"

function App() {
  const cartId = CookieManager.getCookie(namespaces.checkout.cartId);
  const dispatch = useDispatch()  
  const [getCart] = useLazyQuery(CART)
  useEffect(() => {
    if (CookieManager.getCookie(namespaces.customer.token)) {
      setHeaderToken()
    }
    const fetchData = async () => {
      const {data: cartData} = await getCart({
        variables: {
          cartId: cartId
        }
      })
      if(cartData) {
        dispatch(setCart(cartData.cart))
      }      
    }

    fetchData()
    
  }, [getCart, cartId, dispatch])

  return (
    <Router>
      <ThemeProvider defaultTheme='light' storageKey="vite-ui-theme">
        <HeaderNavigationMenu />
        <div className='container mx-auto'>
          <Routes>
            <Route path="/" Component={Home} />            
            <Route path="/checkout" Component={Checkout} />
            <Route path="/checkout/success" Component={CheckoutSuccess} />
            <Route path="/checkout/failed" Component={CheckoutFailed} />
            <Route path="/checkout/cart" Component={CheckoutCart} />
            <Route path="/customer/account/login" Component={CustomerAccountLogin} />
            <Route path="/customer/account/create" Component={CustomerAccountCreate} />
            <Route path="/customer/account" Component={CustomerAccount} />
            <Route path="/product/id/:id/sku/:sku/url/:url" Component={ProductView} />
            <Route path="/customer/address" Component={CustomerAddress} />
            <Route path="/customer/address/new" Component={CustomerAddressNew} />
          </Routes>
        </div>
      </ThemeProvider>
    </Router>
  )
}

export default App
