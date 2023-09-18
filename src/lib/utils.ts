import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import CookieManager from "@/lib/CookieManager"
import { httpLink } from "@/lib/ApolloConfig"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const namespaces = {
  checkout: {
    cartId: "CART_ID",
    lastOrder: 'LAST_ORDER',
    paymentType: 'PAYMENT_TYPE',
    cartData: 'CART_DATA',
    adyenSession: 'ADYEN_SESSION'
  },
  customer: {
    token: "CUSTOMER_TOKEN"
  },
  store: {
    storeCode: "STORE_CODE",
    storeConfig: "STORE_CONFIG"
  }
}

export function getStoreConfig() {
  const data = window.localStorage.getItem(namespaces.store.storeConfig)

  if (data && data != "undefined") {
    return JSON.parse(data)
  }
  return false;
}

export function getCurrencySymbol(locale: string, currency: string) {

  return (0).toLocaleString(
    locale,
    {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }
  ).replace(/\d/g, '').trim()
}

export function getStoreLocale(): string {
  let locale = 'en-US'
  const storeConfig = getStoreConfig();
  if (storeConfig) {
    locale = storeConfig.locale.replace('_', '-')
  }
  return locale
}

export function priceFormat(price: number) {
  const currency = getStoreConfig().base_currency_code

  return new Intl.NumberFormat(getStoreLocale(), { style: 'currency', currency }).format(price)
}

const apiKey = import.meta.env.VITE_API_KEY_ADYEN
export const adyenCheckoutConfiguration = {
  clientKey: apiKey,
  analytics: {
    enabled: false
  },
  session: {
    id: '',
    sessionData: ''
  },

  paymentMethodsConfiguration: {
    card: {
      hasHolderName: false,
      holderNameRequired: false,
      billingAddressRequired: false,
    }
  },

  environment: 'test',
  showPayButton: false
}


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function redirectCustomerToLogin(navigate: any) {
  CookieManager.deleteCookie(namespaces.customer.token)
  navigate('/customer/account/login')
}

export function setHeaderToken(token: string | null = null) {
  const headers = httpLink.options.headers
  if (!token && CookieManager.getCookie(namespaces.customer.token)) {
    token = CookieManager.getCookie(namespaces.customer.token)
  }

  if (token && headers) {
    Object.assign(headers, {
      "authorization": token ? `Bearer ${token}` : ""
    })
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function isLogged(callback: any, token: string) {
  setHeaderToken(token)
  const { data: customer } = await callback()
  if (customer) {
    return true
  }
  return false
}