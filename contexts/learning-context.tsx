"use client";

import { createContext, useContext, useState } from "react";

type LearningContext = {
  courseId: string;
  setCourseId: React.Dispatch<React.SetStateAction<string>>;
  chapterId: string;
  setChapterId: React.Dispatch<React.SetStateAction<string>>;
  lessonId: string;
  setLessonId: React.Dispatch<React.SetStateAction<string>>;
  activityId: string;
  setActivityId: React.Dispatch<React.SetStateAction<string>>;
  showCanvasTools: boolean;
  setShowCanvasTools: React.Dispatch<React.SetStateAction<boolean>>;
};

export const LearningContext = createContext<LearningContext | null>(null);

export default function LearningContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [courseId, setCourseId] = useState("");
  const [chapterId, setChapterId] = useState("");
  const [lessonId, setLessonId] = useState("");
  const [activityId, setActivityId] = useState("");
  const [showCanvasTools, setShowCanvasTools] = useState(true);
  return (
    <LearningContext.Provider
      value={{
        courseId,
        setCourseId,
        chapterId,
        setChapterId,
        lessonId,
        setLessonId,
        activityId,
        setActivityId,
        showCanvasTools,
        setShowCanvasTools,
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
