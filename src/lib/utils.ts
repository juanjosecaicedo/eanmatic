import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const namespaces = {
  checkout: {
    cartId: "CART_ID"
  },
  customer: {
    token: "CUSTOMER_TOKEN"
  },
  store: {
    storeCode: "STORE_CODE",
    storeConfig: "STORE_CONFIG"
  }
}

export function crearCookie(name: string, value: string | number, daysExpiration: number) {
  const expirationDate = new Date();
  expirationDate.setTime(expirationDate.getTime() + (daysExpiration * 24 * 60 * 60 * 1000));
  const expiration = "expires=" + expirationDate.toUTCString();
  document.cookie = name + "=" + value + ";" + expiration + ";path=/";
}

export function getCookie(name: string) {
  const cookies = document.cookie.split("; ");
  for (let i = 0; i < cookies.length; i++) {
    const cookieParts = cookies[i].split("=");
    const nameCookie = decodeURIComponent(cookieParts[0]);
    const valueCookie = decodeURIComponent(cookieParts[1]);

    if (nameCookie === name) {
      return valueCookie;
    }
  }

  return null; // Retorna null si no se encuentra la cookie
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