import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { ChakraProvider } from "@chakra-ui/react";
import system from "./theme/config";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ChakraProvider value={system}>
      <BrowserRouter>
        <AuthProvider>
          <App />
          <ToastContainer position="top-center" autoClose={3000}/>
        </AuthProvider>
      </BrowserRouter>
    </ChakraProvider>
  </StrictMode>,
);
