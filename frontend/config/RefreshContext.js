import React, { createContext, useState, useContext } from 'react';

const RefreshContext = createContext();

export const RefreshProvider = ({ children }) => {
  const [refreshNeeded, setRefreshNeeded] = useState(false);

  return (
    <RefreshContext.Provider value={{ refreshNeeded, setRefreshNeeded }}>
      {children}
    </RefreshContext.Provider>
  );
};

export const useRefresh = () => useContext(RefreshContext);
