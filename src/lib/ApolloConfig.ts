import CookieManager from "@/lib/CookieManager";
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

if (!CookieManager.getCookie("STORE_CODE")) {
  CookieManager.createCookie("STORE_CODE", 'default', 1)
}

export const httpLink = new HttpLink({
  uri: import.meta.env.VITE_URL_ENDPOINT,
  headers: {
    store: CookieManager.getCookie("STORE_CODE") ?? 'default'
  }
})

export const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache()
})