import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { RoomContextProvider } from "./context/RoomContext.jsx";
import { PlayerContextProvider } from "./context/PlayerContext.jsx";

import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <RoomContextProvider>
      <PlayerContextProvider>
        <ToastContainer />
        <App />
      </PlayerContextProvider>
    </RoomContextProvider>
  </BrowserRouter>
);
