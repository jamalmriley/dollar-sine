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

interface ActivityContent {
  id: string;
  type: Format;
  content: string;
}

// —————————————————————————————————————————————————— //

interface Activity extends CourseItem {
  instructions: string[]; // Each string is a separate paragraph.
  formats: Format[];
  content: ActivityContent[];
}

interface ContentItem extends CourseItem {
  imageUrl: string;
  pathname: string;
  topics: Topic[];
  standards: Standard[] | null;
  gradeLevels: number[];
  releaseDate: FirestoreDate;
}

export interface Lesson extends ContentItem {
  courseId: string;
  courseName: string;
  chapterId: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  duration: number;
  learningObjectives: string[];
  activities: Activity[];
  preStandards: Standard[];
  extStandards: Standard[];
  prevLessonId: string | null;
  nextLessonId: string | null;
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
