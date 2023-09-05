import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

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