import { db } from "@/utils/firebase";
import { collection, getDocs, query } from "firebase/firestore";
import { NextResponse } from "next/server";

export type Pricing = {
  name: string;
  price: number;
  description: string;
  features: string[];
  addOns: {
    userLimit: number | string;
    teacherToolsLimit: number | string;
    edTechLimit: number | string;
  };
};

export type CourseData = {
  description: string;
  id: string;
  imageUrl: string;
  publishDate: { seconds: number; nanoseconds: number };
  title: string;
  topicsCount: number;
  pricing: Pricing[];
};

export async function GET() {
  const q = query(
    collection(db, "courses")
    // where("publishDate", ">=", new Date()) // TODO
  );

  const result: CourseData[] = [];

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    const data = doc.data() as CourseData;
    result.push(data);
  });

  return NextResponse.json({
    status: 200,
    success: true,
    data: result,
  });
}
