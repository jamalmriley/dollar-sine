import { CourseData } from "@/app/api/courses/route";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";

export default function AddCourses() {
  const header = {
    title: "Browse and add courses.",
    description: "Select the courses you want to add for your organization.",
  };
  const [courses, setCourses] = useState<CourseData[]>([]);

  const getCourses = async (): Promise<any> => {
    const courses = await fetch("/api/courses", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((json) => {
        // console.log(json);
        return json;
      })
      .catch((err) => {
        console.error(err);
        return err;
      });

    return courses;
  };

  useEffect(() => {
    const fetchAndSetCourses = async () => {
      try {
        const courses = await getCourses();
        const data: CourseData[] = courses.data;
        setCourses(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchAndSetCourses();
  }, []);

  return (
    <div className="w-full h-full max-w-3xl flex flex-col md:border rounded-lg px-10 md:px-5 py-5 gap-4 md:bg-primary-foreground">
      <div className="flex flex-col">
        <h2 className="h2">{header.title}</h2>
        {header.description !== "" && (
          <span className="subtitle">{header.description}</span>
        )}
      </div>

      <div className="flex gap-5">
        {courses.map((course) => (
          <CourseCard
            key={course.id}
            title={course.title}
            description={course.description}
            imageUrl={course.imageUrl}
          />
        ))}
        <CourseCard
          title="More courses coming soon!"
          description="Stay tuned for updates on future courses!"
          imageUrl=""
        />
      </div>
    </div>
  );
}

function CourseCard({
  title,
  description,
  imageUrl,
}: {
  title: string;
  description?: string;
  imageUrl: string;
}): JSX.Element {
  return (
    <>
      <div
        className="w-48 aspect-[9/16] border rounded-lg overflow-hidden bg-scroll"
        style={{
          backgroundImage: `url(${
            imageUrl === ""
              ? "https://media.gettyimages.com/id/1472479627/video/classroom-learning-and-african-child-writing-notes-for-language-education-and-kindergarten.jpg?s=640x640&k=20&c=76xVk7jUdO531yG9MF-7E07eVNB06glfupkkBlKPwf8="
              : ""
          })`,
        }}
      >
        <div className="h-1/2 p-3 bg-gradient-to-b from-black/30 to-transparent">
          <h1 className="text-xl font-bold text-white">{title}</h1>
          <p className="text-xs text-white">{description}</p>
        </div>
      </div>
    </>
  );
}
