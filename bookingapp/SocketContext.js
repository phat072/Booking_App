import {createContext, useContext, useEffect, useState} from 'react';
import io from 'socket.io-client';
import { UserType } from './userContext';

const SocketContext = createContext();

export const useSocketContext = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({children}) => {
  const [socket, setSocket] = useState(null);
  const {authUser, userId} = useContext(UserType);

  // console.log('auth', authUser)
  // console.log('BABE', authUser);
  useEffect(() => {
    if (authUser) {
      const socket = io('http://localhost:3000', {
        query: {
          userId: userId,
        },
      });

      setSocket(socket);

      return () => socket.close();
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, []);

  return (
    <SocketContext.Provider value={{socket, setSocket}}>
      {children}
    </SocketContext.Provider>
  );
};


// import { createContext, useContext, useEffect, useState } from "react";
// import io from "socket.io-client";
// import { UserType } from "./userContext";
// const ENDPOINT = "http://localhost:3001";
// const SocketContext = createContext();

// export const useSocketContext = () => {
//   return useContext(SocketContext);
// };

// export const SocketContextProvider = ({ children }) => {
//   const [socket, setSocket] = useState(null);
//   const { authUser, userId } = useContext(UserType);

//   useEffect(() => {
//     if (authUser) {
//       // const socket = io("http://localhost:3000", {  // Use the backend port here
//       //   query: {
//       //     userId: userId,
//       //   },
//       // });
//       const socket = io(ENDPOINT, {
//         transports: ['websocket'],
//         query: {
//           userId: userId,
//         },
//      });

//       socket.on("connect", () => {
//         console.log("Connected to socket server with id:", socket.id);
//       });

//       socket.on("connect_error", (error) => {
//         console.error("Connection failed:", error);
//       });

//       setSocket(socket);

//       return () => {
//         socket.close();
//         console.log("Socket closed");
//       };
//     } else {
//       if (socket) {
//         socket.close();
//         setSocket(null);
//       }
//     }
//   }, [authUser, userId]);

//   return (
//     <SocketContext.Provider value={{ socket, setSocket }}>
//       {children}
//     </SocketContext.Provider>
//   );
// };
