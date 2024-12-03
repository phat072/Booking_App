import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import  jwt_decode  from "jwt-decode";
export const UserType = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState('');

  const updateUser = (userData) => {
    setUser(userData);
  };
  const [token, setToken] = useState('');
  const [userId, setUserId] = useState('');
  const [authUser, setAuthUser] = useState(
    AsyncStorage.getItem('authToken') || null,
  );
  // console.log("BABE AU",authUser)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        // console.log("Fetched Token:", token); // Log token value
        if (token) {
          setAuthUser(token);
          const decodedToken = jwt_decode(token);
          // console.log("Decoded Token:", decodedToken); // Log decoded token
          setUserId(decodedToken.userId);
          setToken(token);
        } else {
          setAuthUser(null); 
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
  
    fetchUser();
  }, []);  
  return (
    <UserType.Provider value={{ userId, setUserId, user, updateUser, token, setToken, authUser, setAuthUser }}>
      {children}
    </UserType.Provider>
  );
};
