import { doc, setDoc } from "firebase/firestore";
import { promises as fs } from "fs";
import { db } from "@/utils/firebase";

const subcollections = {
  content: "content",
  search: "search",
  standards: "standards",
};

async function updateContent(fileName: string, subcollection: string) {
  const file = await fs.readFile(
    process.cwd() + `/data/${fileName}.json`,
    "utf8"
  );

  const content = JSON.parse(file);
  const courses = content.courses;

  for (const course of courses) {
    const [
      title,
      courseId,
      description,
      imageUrl,
      publishDate,
      chapters,
      topicsCount,
      pricing,
    ] = [
      course.title,
      course.id,
      course.description,
      course.imageUrl,
      course.publishDate,
      course.chapters,
      course.topicsCount,
      course.pricing,
    ];

    await setDoc(doc(db, "courses", courseId), {
      title,
      id: courseId,
      description,
      imageUrl,
      publishDate: new Date(publishDate),
      topicsCount,
      pricing,
    })
      .then(() => {
        console.log(`${title}: Course successfully updated in Firebase!`);
      })
      .catch((error: any) => {
        console.error("Error updating course:", error);
      });

    for (const chapter of chapters) {
      const [chapterId, title, description, difficulty, topicsCount, lessons] =
        [
          chapter.id,
          chapter.title,
          chapter.description,
          chapter.difficulty,
          chapter.topicsCount,
          chapter.lessons,
        ];

      await setDoc(
        doc(db, `courses/${courseId}/${subcollection}`, `chapter-${chapterId}`),
        {
          id: chapterId,
          title,
          description,
          difficulty,
          topicsCount,
        }
      )
        .then(() => {
          console.log(
            `Chapter ${chapterId}: Successfully updated in Firebase!`
          );
        })
        .catch((error: any) => {
          console.error("Error updating chapter:", error);
        });

      for (const lesson of lessons) {
        const [
          lessonId,
          chapter,
          title,
          description,
          learningObjectives,
          topics,
          prevCCSS,
          currCCSS,
          nextCCSS,
          pathname,
          prevLesson,
          nextLesson,
          isUnlocked,
          content,
          accommodations,
        ] = [
          lesson.id,
          lesson.chapter,
          lesson.title,
          lesson.description,
          lesson.learningObjectives,
          lesson.topics,
          lesson.prevCCSS,
          lesson.currCCSS,
          lesson.nextCCSS,
          lesson.pathname,
          lesson.prevLesson,
          lesson.nextLesson,
          lesson.isUnlocked,
          lesson.content,
          lesson.accommodations,
        ];

        await setDoc(
          doc(
            db,
            `courses/${courseId}/${subcollection}/chapter-${chapterId}/lessons`,
            `lesson-${lessonId}`
          ),
          {
            id: lessonId,
            chapter,
            title,
            description,
            learningObjectives,
            topics,
            prevCCSS,
            currCCSS,
            nextCCSS,
            pathname,
            prevLesson,
            nextLesson,
            isUnlocked,
            content,
            accommodations,
          }
        )
          .then(() => {
            console.log(
              `Lesson ${lessonId}: Successfully updated in Firebase!`
            );
          })
          .catch((error: any) => {
            console.error("Error updating lesson:", error);
          });
      }
    }
  }
}

async function updateSearch(fileName: string, subcollection: string) {
  const file = await fs.readFile(
    process.cwd() + `/data/${fileName}.json`,
    "utf8"
  );

  const lessons = JSON.parse(file);
  for (const lesson of lessons) {
    const [
      courseName,
      courseId,
      lessonId,
      name,
      fullName,
      description,
      topics,
      standards,
      pathname,
    ] = [
      lesson.courseName,
      lesson.courseId,
      lesson.lessonId,
      lesson.name,
      lesson.fullName,
      lesson.description,
      lesson.topics,
      lesson.standards,
      lesson.pathname,
    ];

    await setDoc(
      doc(db, `courses/${courseId}/${subcollection}`, `lesson-${lessonId}`),
      {
        courseName,
        courseId,
        lessonId,
        name,
        fullName,
        description,
        topics,
        standards,
        pathname,
      }
    )
      .then(() => {
        console.log(
          `${lessonId}: Lesson successfully updated in Firebase! (Course search)`
        );
      })
      .catch((error: any) => {
        console.error("Error updating lesson:", error);
      });

    await setDoc(doc(db, "global-search", `${courseId}-lesson-${lessonId}`), {
      courseName,
      courseId,
      lessonId,
      name,
      fullName,
      description,
      topics,
      standards,
      pathname,
    })
      .then(() => {
        console.log(
          `${lessonId}: Lesson successfully updated in Firebase! (Global search)`
        );
      })
      .catch((error: any) => {
        console.error("Error updating lesson:", error);
      });
  }
}

async function updateStandards(fileName: string, subcollection: string) {
  const file = await fs.readFile(
    process.cwd() + `/data/${fileName}.json`,
    "utf8"
  );

  const standards = JSON.parse(file);
  for (const standard of standards) {
    const [
      courseName,
      courseId,
      standardId,
      gradeLevel,
      domainCode,
      domainName,
      description,
    ] = [
      standard.courseName,
      standard.courseId,
      standard.standardId,
      standard.gradeLevel,
      standard.domainCode,
      standard.domainName,
      standard.description,
    ];

    await setDoc(doc(db, `courses/${courseId}/${subcollection}`, standardId), {
      courseName,
      courseId,
      standardId,
      gradeLevel,
      domainCode,
      domainName,
      description,
    })
      .then(() => {
        console.log(
          `${standardId}: Standard successfully updated in Firebase!`
        );
      })
      .catch((error: any) => {
        console.error("Error updating standard:", error);
      });
  }
}

(async function () {
  await updateContent("content-data", subcollections.content);
  await updateSearch("search-data", subcollections.search);
  await updateStandards("standards-data", subcollections.standards);
})();

// Run "npm run data" to execute the async function in this file.
