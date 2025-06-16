"use client";

import { SelectedCourse, Course } from "@/types/course";
import { createContext, useContext, useState } from "react";

type OnboardingStep = {
  step: number;
  isEditing: boolean;
};

type OnboardingContext = {
  isHeSelected: boolean; // TODO: remove?
  setIsHeSelected: React.Dispatch<React.SetStateAction<boolean>>;
  isSheSelected: boolean; // TODO: remove?
  setIsSheSelected: React.Dispatch<React.SetStateAction<boolean>>;
  isTheySelected: boolean; // TODO: remove?
  setIsTheySelected: React.Dispatch<React.SetStateAction<boolean>>;
  isEySelected: boolean; // TODO: remove?
  setIsEySelected: React.Dispatch<React.SetStateAction<boolean>>;
  isXeSelected: boolean; // TODO: remove?
  setIsXeSelected: React.Dispatch<React.SetStateAction<boolean>>;
  isZeSelected: boolean; // TODO: remove?
  setIsZeSelected: React.Dispatch<React.SetStateAction<boolean>>;
  preferNotToSay: boolean; // TODO: remove?
  setPreferNotToSay: React.Dispatch<React.SetStateAction<boolean>>;
  profilePic: File | undefined;
  setProfilePic: React.Dispatch<React.SetStateAction<File | undefined>>;
  showOrgResults: boolean;
  setShowOrgResults: React.Dispatch<React.SetStateAction<boolean>>;
  orgLogo: File | undefined;
  setOrgLogo: React.Dispatch<React.SetStateAction<File | undefined>>;
  isUpdatingProfile: boolean;
  setIsUpdatingProfile: React.Dispatch<React.SetStateAction<boolean>>;
  isUpdatingOrg: boolean;
  setIsUpdatingOrg: React.Dispatch<React.SetStateAction<boolean>>;
  organizationId: string | undefined;
  setOrganizationId: React.Dispatch<React.SetStateAction<string | undefined>>;
  orgSearch: string;
  setOrgSearch: React.Dispatch<React.SetStateAction<string>>;
  hasInvitations: boolean;
  setHasInvitations: React.Dispatch<React.SetStateAction<boolean>>;
  courses: Course[];
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  activeCourse: SelectedCourse | undefined;
  setActiveCourse: React.Dispatch<
    React.SetStateAction<SelectedCourse | undefined>
  >;
  lastUpdated: string;
  setLastUpdated: React.Dispatch<React.SetStateAction<string>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  transactionTotal: number;
  setTransactionTotal: React.Dispatch<React.SetStateAction<number>>;
  transactionDate: string;
  setTransactionDate: React.Dispatch<React.SetStateAction<string>>;
  transactionCode: string;
  setTransactionCode: React.Dispatch<React.SetStateAction<string>>;
  isOnboardingComplete: boolean; // TODO: remove?
  setIsOnboardingComplete: React.Dispatch<React.SetStateAction<boolean>>;
  currOnboardingStep: OnboardingStep;
  setCurrOnboardingStep: React.Dispatch<React.SetStateAction<OnboardingStep>>;
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
  const [isEySelected, setIsEySelected] = useState<boolean>(false);
  const [isXeSelected, setIsXeSelected] = useState<boolean>(false);
  const [isZeSelected, setIsZeSelected] = useState<boolean>(false);
  const [preferNotToSay, setPreferNotToSay] = useState<boolean>(false);

  const [profilePic, setProfilePic] = useState<File | undefined>();
  const [showOrgResults, setShowOrgResults] = useState<boolean>(false);
  const [orgLogo, setOrgLogo] = useState<File | undefined>();
  const [isUpdatingProfile, setIsUpdatingProfile] = useState<boolean>(false);
  const [isUpdatingOrg, setIsUpdatingOrg] = useState<boolean>(false);
  const [organizationId, setOrganizationId] = useState<string | undefined>();
  const [orgSearch, setOrgSearch] = useState<string>("");
  const [hasInvitations, setHasInvitations] = useState<boolean>(false);

  const [courses, setCourses] = useState<Course[]>([]);
  const [activeCourse, setActiveCourse] = useState<SelectedCourse>();
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [transactionTotal, setTransactionTotal] = useState<number>(0);
  const [transactionDate, setTransactionDate] = useState<string>("");
  const [transactionCode, setTransactionCode] = useState<string>("");
  const [isOnboardingComplete, setIsOnboardingComplete] =
    useState<boolean>(false);
  const [currOnboardingStep, setCurrOnboardingStep] = useState<OnboardingStep>({
    step: 1,
    isEditing: false,
  });

  return (
    <OnboardingContext.Provider
      value={{
        isHeSelected,
        setIsHeSelected,
        isSheSelected,
        setIsSheSelected,
        isTheySelected,
        setIsTheySelected,
        isEySelected,
        setIsEySelected,
        isXeSelected,
        setIsXeSelected,
        isZeSelected,
        setIsZeSelected,
        preferNotToSay,
        setPreferNotToSay,
        profilePic,
        setProfilePic,
        showOrgResults,
        setShowOrgResults,
        orgLogo,
        setOrgLogo,
        isUpdatingProfile,
        setIsUpdatingProfile,
        isUpdatingOrg,
        setIsUpdatingOrg,
        organizationId,
        setOrganizationId,
        orgSearch,
        setOrgSearch,
        hasInvitations,
        setHasInvitations,
        courses,
        setCourses,
        activeCourse,
        setActiveCourse,
        lastUpdated,
        setLastUpdated,
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
        currOnboardingStep,
        setCurrOnboardingStep,
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
