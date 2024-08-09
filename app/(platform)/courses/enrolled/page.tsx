import { auth } from "@/auth";
import CustomH1 from "@/components/CustomH1";

export default async function MyCourses() {
  const session = await auth();
  const firstName = session?.user?.name?.split(" ")[0];
  const lastLetter = firstName?.split("").reverse()[0];
  const endsWithS: boolean = lastLetter?.toLowerCase() === "s";

  return (
    <div className="page-container">
      <CustomH1
        text={`${firstName}'${endsWithS ? "" : "s"} Courses`}
        isPaddingEnabled
      />
    </div>
  );
}
