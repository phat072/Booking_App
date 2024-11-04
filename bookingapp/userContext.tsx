
import React, { createContext, useState } from "react";



const UserContext = createContext(null);



const UserProvider: React.FC = ({ children }) => {

  const [user, setUser] = useState(null);

  const [userId, setUserId] = useState(null);



  const updateUser = (userData: any) => {

    setUser(userData);

  };



  return (

    <UserContext.Provider value={{ user, setUser, userId, setUserId, updateUser }}>

      {children}

    </UserContext.Provider>

  );

};



export { UserContext, UserProvider };
