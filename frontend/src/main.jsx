import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { RoomContextProvider } from "./context/RoomContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <RoomContextProvider>
      <App />
    </RoomContextProvider>
  </BrowserRouter>
);
