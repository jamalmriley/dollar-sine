"use client";

import { SelectedCourse, Course } from "@/types/course";
import { UserMetadata } from "@/types/user";
import { Organization, User } from "@clerk/nextjs/server";
import { createContext, useContext, useState } from "react";

type OnboardingStep = {
  step: number;
  isEditing: boolean;
};

export const PRONOUN_KEYS = [
  "he",
  "she",
  "they",
  "ey",
  "xe",
  "ze",
  "PNTS",
] as const;
export type PronounKey = (typeof PRONOUN_KEYS)[number];

type OnboardingContext = {
  userData: User | undefined;
  setUserData: React.Dispatch<React.SetStateAction<User | undefined>>;
  userMetadata: UserMetadata | undefined;
  setUserMetadata: React.Dispatch<
    React.SetStateAction<UserMetadata | undefined>
  >;
  selectedPronouns: PronounKey[];
  setSelectedPronouns: React.Dispatch<React.SetStateAction<PronounKey[]>>;
  profilePic: File | undefined;
  setProfilePic: React.Dispatch<React.SetStateAction<File | undefined>>;
  studentId: string;
  setStudentId: React.Dispatch<React.SetStateAction<string>>;
  studentFirst: string;
  setStudentFirst: React.Dispatch<React.SetStateAction<string>>;
  studentLast: string;
  setStudentLast: React.Dispatch<React.SetStateAction<string>>;
  studentEmail: string;
  setStudentEmail: React.Dispatch<React.SetStateAction<string>>;
  studentGradeLevel: string;
  setStudentGradeLevel: React.Dispatch<React.SetStateAction<string>>;
  org: Organization | undefined;
  setOrg: React.Dispatch<React.SetStateAction<Organization | undefined>>;
  showOrgResults: boolean;
  setShowOrgResults: React.Dispatch<React.SetStateAction<boolean>>;
  orgLogo: File | undefined;
  setOrgLogo: React.Dispatch<React.SetStateAction<File | undefined>>;
  orgSearch: string;
  setOrgSearch: React.Dispatch<React.SetStateAction<string>>;
  courses: Course[];
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  purchasedCourses: SelectedCourse[] | undefined;
  setPurchasedCourses: React.Dispatch<
    React.SetStateAction<SelectedCourse[] | undefined>
  >;
  canPurchaseCourses: boolean;
  setCanPurchaseCourses: React.Dispatch<React.SetStateAction<boolean>>;
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
  const [userData, setUserData] = useState<User | undefined>();
  const [userMetadata, setUserMetadata] = useState<UserMetadata | undefined>();

  const [selectedPronouns, setSelectedPronouns] = useState<PronounKey[]>([]);
  const [profilePic, setProfilePic] = useState<File | undefined>();
  const [studentId, setStudentId] = useState<string>("");
  const [studentFirst, setStudentFirst] = useState<string>("");
  const [studentLast, setStudentLast] = useState<string>("");
  const [studentEmail, setStudentEmail] = useState<string>("");
  const [studentGradeLevel, setStudentGradeLevel] = useState<string>("");

  const [org, setOrg] = useState<Organization>();
  const [showOrgResults, setShowOrgResults] = useState<boolean>(false);
  const [orgLogo, setOrgLogo] = useState<File | undefined>();
  const [orgSearch, setOrgSearch] = useState<string>("");

  const [courses, setCourses] = useState<Course[]>([]);
  const [purchasedCourses, setPurchasedCourses] = useState<
    SelectedCourse[] | undefined
  >([]);
  const [canPurchaseCourses, setCanPurchaseCourses] = useState<boolean>(false);
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
        userData,
        setUserData,
        userMetadata,
        setUserMetadata,
        selectedPronouns,
        setSelectedPronouns,
        profilePic,
        setProfilePic,
        studentId,
        setStudentId,
        studentFirst,
        setStudentFirst,
        studentLast,
        setStudentLast,
        studentEmail,
        setStudentEmail,
        studentGradeLevel,
        setStudentGradeLevel,
        org,
        setOrg,
        showOrgResults,
        setShowOrgResults,
        orgLogo,
        setOrgLogo,
        orgSearch,
        setOrgSearch,
        courses,
        setCourses,
        purchasedCourses,
        setPurchasedCourses,
        canPurchaseCourses,
        setCanPurchaseCourses,
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
