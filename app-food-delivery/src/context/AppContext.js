import { createContext, useState, useContext } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);

  return (
    <AppContext.Provider value={{ cart, setCart, user, setUser }}>
      {children}
    </AppContext.Provider>
  );
};

// Hook personalizado para acessar o contexto
export const useAppContext = () => useContext(AppContext);
