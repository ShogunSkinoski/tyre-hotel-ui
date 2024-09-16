'use client'
import React, { createContext, useState, useContext } from 'react';

type HeaderContextType = {
  headerText: string;
  setHeaderText: (text: string) => void;
};

const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

export const HeaderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [headerText, setHeaderText] = useState('Lastikler');

  return (
    <HeaderContext.Provider value={{ headerText, setHeaderText }}>
      {children}
    </HeaderContext.Provider>
  );
};

export const useHeader = () => {
  const context = useContext(HeaderContext);
  if (context === undefined) {
    throw new Error('useHeader must be used within a HeaderProvider');
  }
  return context;
};