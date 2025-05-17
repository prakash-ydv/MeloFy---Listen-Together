import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { RoomContextProvider } from "./context/RoomContext.jsx";
import { PlayerContextProvider } from "./context/PlayerContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <RoomContextProvider>
      <PlayerContextProvider>
        <App />
      </PlayerContextProvider>
    </RoomContextProvider>
  </BrowserRouter>
);
