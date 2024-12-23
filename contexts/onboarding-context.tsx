"use client";

import { createContext, useContext, useState } from "react";

type OnboardingContext = {
  orgLogo: File | undefined;
  setOrgLogo: React.Dispatch<React.SetStateAction<File | undefined>>;
};

export const OnboardingContext = createContext<OnboardingContext | null>(null);

export default function OnboardingContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [orgLogo, setOrgLogo] = useState<File | undefined>();
  return (
    <OnboardingContext.Provider value={{ orgLogo, setOrgLogo }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboardingContext() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error(
      "useOnboardingContext must be used within a OnboardingContextProvider."
    );
  }
  return context;
}
