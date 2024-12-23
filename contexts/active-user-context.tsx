"use client";

import { createContext, useContext, useState } from "react";

type ActiveUserContext = {
  hasClickedOrTyped: boolean;
  setHasClickedOrTyped: React.Dispatch<React.SetStateAction<boolean>>;
};

export const ActiveUserContext = createContext<ActiveUserContext | null>(null);

export default function ActiveUserContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [hasClickedOrTyped, setHasClickedOrTyped] = useState(false);
  return (
    <ActiveUserContext.Provider
      value={{ hasClickedOrTyped, setHasClickedOrTyped }}
    >
      {children}
    </ActiveUserContext.Provider>
  );
}

export function useActiveUserContext() {
  const context = useContext(ActiveUserContext);
  if (!context) {
    throw new Error(
      "useActiveUserContext must be used within a ActiveUserContextProvider."
    );
  }
  return context;
}
