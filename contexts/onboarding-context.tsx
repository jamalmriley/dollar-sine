"use client";

import { createContext, useContext, useState } from "react";

type OnboardingContext = {
  orgLogo: File | undefined;
  setOrgLogo: React.Dispatch<React.SetStateAction<File | undefined>>;
  users: { emailAddress: string; role: string }[] | undefined;
  setUsers: React.Dispatch<
    React.SetStateAction<{ emailAddress: string; role: string }[] | undefined>
  >;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export const OnboardingContext = createContext<OnboardingContext | null>(null);

export default function OnboardingContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [orgLogo, setOrgLogo] = useState<File | undefined>();
  const [users, setUsers] = useState<
    { emailAddress: string; role: string }[] | undefined
  >();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <OnboardingContext.Provider
      value={{ orgLogo, setOrgLogo, users, setUsers, isLoading, setIsLoading }}
    >
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
