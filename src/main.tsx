import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './globals.css'
import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink } from '@apollo/client';
import { Provider } from 'react-redux'
import { store } from '@/store.ts';
import { getCookie, namespaces } from './lib/utils.ts';


const client = new ApolloClient({
  link: new HttpLink({
    uri: import.meta.env.VITE_URL_ENDPOINT,
    headers: {
      'Content-Type': 'application/json',
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept': '*/*',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'store': getCookie(namespaces.store.storeCode) ?? 'default'
    }
  }),

  cache: new InMemoryCache()
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ApolloProvider client={client}>
    <Provider store={store}>
      <App />
    </Provider>
  </ApolloProvider>,
)
