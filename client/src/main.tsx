import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./context/AuthContext";

// Use import.meta.env for Vite or process.env if configured (sticking to existing pattern for now but checking)
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || process.env.REACT_APP_GOOGLE_CLIENT_ID;

createRoot(document.getElementById("root")!).render(
    <GoogleOAuthProvider clientId={clientId}>
        <AuthProvider>
            <App />
        </AuthProvider>
    </GoogleOAuthProvider>
);
