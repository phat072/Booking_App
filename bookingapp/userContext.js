import React, { createContext, useState, useEffect } from 'react';

export const UserType = createContext();

export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState(null);

  const updateUser = (userData) => {
    setUser(userData);
  };

  return (
    <UserType.Provider value={{ userId, setUserId, user, updateUser }}>
      {children}
    </UserType.Provider>
  );
};
