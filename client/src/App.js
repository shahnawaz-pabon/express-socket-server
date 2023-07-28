import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";

const socket = io("http://192.168.1.234:3001"); // Replace with your Socket.IO server URL

const App = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [socketId, setSocketId] = useState("0");

  useEffect(() => {
    // Socket.IO event listeners
    socket.on("connect", () => {
      console.log("Connected to Socket.IO server");
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    socket.on("client-connect", (data) => {
      setSocketId(data.id);
    });

    socket.on("message", (data) => {
      console.log("Received message:", data);
      // setSocketId(data.id);
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    // Clean up event listeners
    return () => {
      socket.off("connect");
      socket.off("message");
      socket.off("disconnect");
    };
  }, []);

  const sendMessage = () => {
    socket.emit("message", inputValue);
    setInputValue("");
  };

  const fetchApiData = async () => {
    try {
      const response = await axios.get("http://192.168.1.234:3001/api/data"); // Update the API endpoint
      console.log("API response:", response.data);
      // Process API response as needed
    } catch (error) {
      console.error("API request failed:", error);
    }
  };

  return (
    <div>
      <h1>Socket.IO and API Example</h1>

      {isConnected && <h1>Connected to the socket</h1>}
      {!isConnected && <h1>Not connected to the socket</h1>}
      <h2>
        SocketId: <span style={{ color: "#61dafb" }}>{socketId}</span>
      </h2>

      <div>
        <h2>Messages:</h2>
        <ul>
          {messages.map((message, index) => (
            <li key={index}>{message}</li>
          ))}
        </ul>
      </div>

      <div>
        <h2>Send Message:</h2>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>

      <div>
        <h2>Fetch API Data:</h2>
        <button onClick={fetchApiData}>Fetch</button>
      </div>
    </div>
  );
};

export default App;
