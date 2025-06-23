import { z } from "zod";

type PublishDate = { seconds: number; nanoseconds: number };

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

export interface Course {
  description: string;
  id: string;
  imageUrl: string;
  publishDate: PublishDate;
  title: string;
  topicsCount: number;
  pricing: Pricing[];
}

// const addOnSchema = z.object({
//   name: z.string(),
//   quantity: z.number(),
// });

export const SELECTED_COURSE_SCHEMA = z.object({
  id: z.string(),
  title: z.string(),
  plan: z.string().optional(),
  // addOns: z.array(addOnSchema), // TODO
});

export type SelectedCourse = z.infer<typeof SELECTED_COURSE_SCHEMA>;
