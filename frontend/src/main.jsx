import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { SocketProvider } from "./context/SocketContext.jsx";
import { RoomContextProvider } from "./context/RoomContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <RoomContextProvider>
      <SocketProvider>
        <App />
      </SocketProvider>
    </RoomContextProvider>
  </BrowserRouter>
);
