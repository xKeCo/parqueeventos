import { createContext, useEffect, useState } from "react";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { app } from "../config/firebase";

export const Context = createContext({});

export const AppContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const handleUser = (user) => {
    if (user) {
      setUser(user);
      setLoadingUser(false);
    } else {
      setUser(null);
      setLoadingUser(false);
    }
  };

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, handleUser);

    return () => unsubscribe();
  }, []);

  return (
    <Context.Provider value={{ user, loadingUser }}>
      {children}
    </Context.Provider>
  );
};
