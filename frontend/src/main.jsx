import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { Provider } from "react-redux";
import { store } from "./store/store";
import './index.css'
import { ModalProvider } from '../src/context/ModalContext';

ReactDOM.createRoot(document.getElementById('root')).render(
    <Provider store={store} >
      <ModalProvider>
        <App />
      </ModalProvider>
    </Provider>
)