import { z } from "zod";

interface CourseItem {
  id: string;
  name: string;
  number: number;
  description: string;
}

interface PricingItem extends CourseItem {
  fullPrice: number;
  activePrice: number;
  features: string[];
  addlUserMax: number;
  addlCurriculumMax: number;
}

export interface FirestoreDate {
  seconds: number;
  nanoseconds: number;
}

export interface Standard {
  id: string;
  name: string;
  description: string;
  code: string;
  gradeLevel: number;
}

interface Topic {
  id: string;
  name: string;
  subtopics: string[];
}

type Format = "Visual" | "Aural" | "Read/Write" | "Kinesthetic";

// —————————————————————————————————————————————————— //

interface Activity extends CourseItem {
  content: string;
  format: Format;
  type:
    | "Introduction"
    | "Lecture"
    | "Activity"
    | "Checkpoint"
    | "Practice"
    | "Quiz"
    | "Reflection";
  // description: string[]; // TODO: Change description in CourseItem to be of type string[] so that string is a separate paragraph when rendered.
}

interface ContentItem extends CourseItem {
  gradeLevels: number[];
  imageUrl: string;
  pathname: string;
  releaseDate: FirestoreDate;
  standards: Standard[] | null;
  topics: Topic[];
}

export interface Lesson extends ContentItem {
  activities: Activity[];
  courseId: string;
  courseName: string;
  chapterId: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  duration: number;
  extStandards: Standard[];
  learningObjectives: string[];
  nextLessonId: string | null;
  preStandards: Standard[];
  prevLessonId: string | null;
  type: "Lesson" | "Lab";
}

export interface Chapter extends ContentItem {
  courseId: string;
  lessons: Lesson[];
}

export interface Course extends ContentItem {
  genres: string[];
  pricing: PricingItem[];
}

// —————————————————————————————————————————————————— //

export const SELECTED_COURSE_SCHEMA = z.object({
  id: z.string(),
  name: z.string(),
  plan: z.string().optional(),
  // addOns: z.array(addOnSchema), // TODO
});

export type SelectedCourse = z.infer<typeof SELECTED_COURSE_SCHEMA>;
