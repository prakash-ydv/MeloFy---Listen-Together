import React from "react";
import LandingPage from "./components/home-page/HomePage";
import Loading from "./components/loading-page/Loading";
import RoomPage from "./components/room/RoomPage";
import { Route, Routes } from "react-router-dom";
import HomePage from "./components/home-page/HomePage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/loading" element={<Loading />} />
        <Route
          path="/room"
          element={
            <ProtectedRoute>
              <RoomPage />
            </ProtectedRoute>
          }
        />
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </div>
  );
}

export default App;
