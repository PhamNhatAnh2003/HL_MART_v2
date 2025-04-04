import "./bootstrap";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/App";
import GlobalStyles from "./components/GlobalStyles";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { ToastContainer } from "react-toastify";

const app = ReactDOM.createRoot(document.getElementById("app"));
app.render(
    <React.StrictMode>
        <GlobalStyles>
            <AuthProvider>
                <CartProvider>
                    <ToastContainer />
                    <App />
                </CartProvider>
            </AuthProvider>
        </GlobalStyles>
    </React.StrictMode>
);
