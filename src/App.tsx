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
import { HeaderNavigationMenu } from './components/header'
import Home from '@/pages/Home'
import ProductView from "./pages/Product-view"

function App() {
  return (
    <Router>
      <ThemeProvider defaultTheme='light' storageKey="vite-ui-theme">
        <HeaderNavigationMenu />
        <div className='container mx-auto'>
          <Routes>
            <Route path="/" Component={Home} />
            <Route path="/checkout" Component={Checkout} />
            <Route path="/customer-account-login" Component={CustomerAccountLogin} />
            <Route path="/customer-account-create" Component={CustomerAccountCreate} />
            <Route path="/customer-account" Component={CustomerAccount} />
            <Route path="/product/id/:id/sku/:sku" Component={ProductView} />
          </Routes>
        </div>
      </ThemeProvider>
    </Router>
  )
}

export default App
