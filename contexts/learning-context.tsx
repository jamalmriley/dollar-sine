"use client";

import { Course } from "@/types/course";
import { Organization } from "@clerk/nextjs/server";
import { createContext, useContext, useState } from "react";

type LearningContext = {
  activityId: string;
  setActivityId: React.Dispatch<React.SetStateAction<string>>;
  allCourses: Course[] | undefined;
  setAllCourses: React.Dispatch<React.SetStateAction<Course[] | undefined>>;
  enrolledCourses: Course[] | undefined;
  setEnrolledCourses: React.Dispatch<
    React.SetStateAction<Course[] | undefined>
  >;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  org: Organization | undefined;
  setOrg: React.Dispatch<React.SetStateAction<Organization | undefined>>;
};

export const LearningContext = createContext<LearningContext | null>(null);

export default function LearningContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activityId, setActivityId] = useState("");
  const [allCourses, setAllCourses] = useState<Course[] | undefined>();
  const [enrolledCourses, setEnrolledCourses] = useState<
    Course[] | undefined
  >();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [org, setOrg] = useState<Organization>();
  return (
    <LearningContext.Provider
      value={{
        activityId,
        setActivityId,
        allCourses,
        setAllCourses,
        enrolledCourses,
        setEnrolledCourses,
        isLoading,
        setIsLoading,
        org,
        setOrg,
      }}
    >
      {children}
    </LearningContext.Provider>
  );
}

export function useLearningContext() {
  const context = useContext(LearningContext);
  if (!context) {
    throw new Error(
      "useLearningContext must be used within a LearningContextProvider."
    );
  }
  return context;
}
