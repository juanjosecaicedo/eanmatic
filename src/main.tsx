import ReactDOM from 'react-dom/client'
import App from '@/App.tsx'
import './index.css'
import './globals.css'
import { ApolloProvider } from '@apollo/client';
import { Provider } from 'react-redux'
import { store } from '@/store.ts';
import { client } from '@/lib/ApolloConfig.ts';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ApolloProvider client={client}>
    <Provider store={store}>
      <App />
    </Provider>
  </ApolloProvider>
)
