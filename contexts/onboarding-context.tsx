"use client";

import { createContext, useContext, useState } from "react";

type OnboardingContext = {
  profilePic: File | undefined;
  setProfilePic: React.Dispatch<React.SetStateAction<File | undefined>>;
  orgLogo: File | undefined;
  setOrgLogo: React.Dispatch<React.SetStateAction<File | undefined>>;
  isUpdatingProfile: boolean;
  setIsUpdatingProfile: React.Dispatch<React.SetStateAction<boolean>>;
  isUpdatingOrg: boolean;
  setIsUpdatingOrg: React.Dispatch<React.SetStateAction<boolean>>;
  users: { emailAddress: string; role: string }[] | undefined;
  setUsers: React.Dispatch<
    React.SetStateAction<{ emailAddress: string; role: string }[] | undefined>
  >;
  hasInvitedUsers: boolean;
  setHasInvitedUsers: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export const OnboardingContext = createContext<OnboardingContext | null>(null);

export default function OnboardingContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [profilePic, setProfilePic] = useState<File | undefined>();
  const [orgLogo, setOrgLogo] = useState<File | undefined>();
  const [isUpdatingProfile, setIsUpdatingProfile] = useState<boolean>(false);
  const [isUpdatingOrg, setIsUpdatingOrg] = useState<boolean>(false);
  const [users, setUsers] = useState<
    { emailAddress: string; role: string }[] | undefined
  >();
  const [hasInvitedUsers, setHasInvitedUsers] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <OnboardingContext.Provider
      value={{
        profilePic,
        setProfilePic,
        orgLogo,
        setOrgLogo,
        isUpdatingProfile,
        setIsUpdatingProfile,
        isUpdatingOrg,
        setIsUpdatingOrg,
        users,
        setUsers,
        hasInvitedUsers,
        setHasInvitedUsers,
        isLoading,
        setIsLoading,
      }}
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
