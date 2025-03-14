import { z } from "zod";

export interface Pricing {
  name: string;
  price: number;
  description: string;
  features: string[];
  addOns: {
    userLimit: number | string;
    teacherToolsLimit: number | string;
    edTechLimit: number | string;
  };
}

export interface CourseData {
  description: string;
  id: string;
  imageUrl: string;
  publishDate: { seconds: number; nanoseconds: number };
  title: string;
  topicsCount: number;
  pricing: Pricing[];
}

// const addOnSchema = z.object({
//   name: z.string(),
//   quantity: z.number(),
// });

export const COURSE_SCHEMA = z.object({
  id: z.string(),
  title: z.string(),
  plan: z.string().optional(),
  // addOns: z.array(addOnSchema), // TODO
});

export type Course = z.infer<typeof COURSE_SCHEMA>;
