import { auth } from "@/auth";
import CustomH1 from "@/components/CustomH1";

export default async function MyCourses() {
  const session = await auth();
  return (
    <div className="page-container">
      <CustomH1 text={`${session?.user?.name?.split(" ")[0]}'s Courses`}/>
    </div>
  );
}
