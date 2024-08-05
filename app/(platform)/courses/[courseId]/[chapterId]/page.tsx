import CustomH1 from "@/components/CustomH1";
import { Button } from "@/components/ui/button";
import { promises as fs } from "fs";
import Link from "next/link";

export default async function ChapterPage({ params }: { params: any }) {
  const [courseId, chapterId] = [params.courseId, params.chapterId];
  const file = await fs.readFile(
    process.cwd() + "/data/test-lesson-data.json",
    "utf8"
  );
  const data = JSON.parse(file);
  const courses: any[] = data.courses;
  const course = courses.filter((course) => course.id === courseId)[0];
  const chapter = course.chapters.filter(
    (chapter: any) => `chapter-${chapter.id}` === chapterId
  )[0];

  return (
    <div className="page-container">
      <div className="flex justify-between items-center">
        <div>
          <CustomH1
            text={`Chapter ${chapter.id}: ${chapter.title}`}
            isPaddingEnabled={false}
          />
          <h2 className="h2">{chapter.description}</h2>
        </div>

        <Button variant="outline" asChild className="rounded-lg h-10">
          <Link href={`/courses/${courseId}`}>Back to chapters</Link>
        </Button>
      </div>

      <div>{chapterId}</div>
    </div>
  );
}
