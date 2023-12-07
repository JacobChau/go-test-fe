import { Provider } from 'react-redux';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { BrowserRouter } from 'react-router-dom';
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import store from "@/stores/store.ts";


ReactDOM.createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
        <GoogleOAuthProvider clientId="140786564180-uggpl6p6s3sdhkcq5u07d0uqk4j52sh7.apps.googleusercontent.com">
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </GoogleOAuthProvider>
    </Provider>
);
