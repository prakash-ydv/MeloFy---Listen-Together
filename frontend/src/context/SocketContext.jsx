import React, { createContext, useRef, useContext } from "react";
import { io } from "socket.io-client";

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);

  const connectToServer = () => {
    if (!socketRef.current) {
      socketRef.current = io("http://localhost:3000");
    }
    return socketRef.current;
  };
  const disconnectToServer = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      
    }
  };

  const disconnectFromServer = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
  };

  const sendMessage = (event, data) => {
    if (socketRef.current) {
      socketRef.current.emit(event, data);
    }
  };

  const listenMessage = (event, callback) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback);
    }
  };

  const value = {
    connectToServer,
    disconnectFromServer,
    sendMessage,
    listenMessage,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

// Custom hook for easy access
export const useSocket = () => useContext(SocketContext);
