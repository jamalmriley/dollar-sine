"use client";

import { CourseData } from "@/app/api/courses/route";
import { createContext, useContext, useState } from "react";

type OnboardingContext = {
  isHeSelected: boolean;
  setIsHeSelected: React.Dispatch<React.SetStateAction<boolean>>;
  isSheSelected: boolean;
  setIsSheSelected: React.Dispatch<React.SetStateAction<boolean>>;
  isTheySelected: boolean;
  setIsTheySelected: React.Dispatch<React.SetStateAction<boolean>>;
  profilePic: File | undefined;
  setProfilePic: React.Dispatch<React.SetStateAction<File | undefined>>;
  orgLogo: File | undefined;
  setOrgLogo: React.Dispatch<React.SetStateAction<File | undefined>>;
  isUpdatingProfile: boolean;
  setIsUpdatingProfile: React.Dispatch<React.SetStateAction<boolean>>;
  isUpdatingOrg: boolean;
  setIsUpdatingOrg: React.Dispatch<React.SetStateAction<boolean>>;
  courses: CourseData[];
  setCourses: React.Dispatch<React.SetStateAction<CourseData[]>>;
  lastUpdated: string;
  setLastUpdated: React.Dispatch<React.SetStateAction<string>>;
  users: { emailAddress: string; role: string }[] | undefined;
  setUsers: React.Dispatch<
    React.SetStateAction<{ emailAddress: string; role: string }[] | undefined>
  >;
  hasInvitedUsers: boolean;
  setHasInvitedUsers: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  transactionTotal: string;
  setTransactionTotal: React.Dispatch<React.SetStateAction<string>>;
  transactionDate: string;
  setTransactionDate: React.Dispatch<React.SetStateAction<string>>;
  transactionCode: string;
  setTransactionCode: React.Dispatch<React.SetStateAction<string>>;
  isOnboardingComplete: boolean;
  setIsOnboardingComplete: React.Dispatch<React.SetStateAction<boolean>>;
};

export const OnboardingContext = createContext<OnboardingContext | null>(null);

export default function OnboardingContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isHeSelected, setIsHeSelected] = useState<boolean>(false);
  const [isSheSelected, setIsSheSelected] = useState<boolean>(false);
  const [isTheySelected, setIsTheySelected] = useState<boolean>(false);
  const [profilePic, setProfilePic] = useState<File | undefined>();
  const [orgLogo, setOrgLogo] = useState<File | undefined>();
  const [isUpdatingProfile, setIsUpdatingProfile] = useState<boolean>(false);
  const [isUpdatingOrg, setIsUpdatingOrg] = useState<boolean>(false);
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [users, setUsers] = useState<
    { emailAddress: string; role: string }[] | undefined
  >();
  const [hasInvitedUsers, setHasInvitedUsers] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [transactionTotal, setTransactionTotal] = useState<string>("");
  const [transactionDate, setTransactionDate] = useState<string>("");
  const [transactionCode, setTransactionCode] = useState<string>("");
  const [isOnboardingComplete, setIsOnboardingComplete] =
    useState<boolean>(false);

  return (
    <OnboardingContext.Provider
      value={{
        isHeSelected,
        setIsHeSelected,
        isSheSelected,
        setIsSheSelected,
        isTheySelected,
        setIsTheySelected,
        profilePic,
        setProfilePic,
        orgLogo,
        setOrgLogo,
        isUpdatingProfile,
        setIsUpdatingProfile,
        isUpdatingOrg,
        setIsUpdatingOrg,
        courses,
        setCourses,
        lastUpdated,
        setLastUpdated,
        users,
        setUsers,
        hasInvitedUsers,
        setHasInvitedUsers,
        isLoading,
        setIsLoading,
        transactionTotal,
        setTransactionTotal,
        transactionDate,
        setTransactionDate,
        transactionCode,
        setTransactionCode,
        isOnboardingComplete,
        setIsOnboardingComplete,
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
