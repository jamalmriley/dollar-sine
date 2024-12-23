"use client";

import { useActiveUserContext } from "@/contexts/active-user-context";
import { useUser } from "@clerk/nextjs";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import Prefix from "./(prompt-1)/Prefix";
import { Separator } from "@/components/ui/separator";
import Pronouns from "./(prompt-1)/Pronouns";
import JobTitle from "./(prompt-1)/JobTitle";
import DisplayName from "./(prompt-1)/DisplayName";
import ProfileImageUpload from "./(prompt-1)/ProfileImageUpload";
import CreateOrJoinOrg from "./(prompt-1)/CreateOrJoinOrg";
import { saveOnboardingProgress } from "@/utils/onboarding";
import UserCards from "./(prompt-1)/UserCards";
import SkinTone from "./(prompt-1)/SkinTone";
import Iphone from "./(prompt-1)/iPhone";

export default function Prompt1() {
  const pathname = usePathname();
  const params = useParams();
  const searchParams = useSearchParams();
  const { isLoaded, isSignedIn, user } = useUser();
  const { hasClickedOrTyped } = useActiveUserContext();

  const promptSections = [
    // Prefixes, Pronouns, and Job Title
    {
      title: "Finish setting up your profile.",
      description: "",
      content: (
        <div className="flex flex-col md:flex-row lg:flex-col gap-4">
          <div className="w-full md:w-1/2 lg:w-full flex flex-col gap-4">
            <Prefix />
            <Separator decorative />
            <DisplayName />
          </div>

          {/* Responsive Separator */}
          <div>
            <span className="w-full sm:block md:hidden lg:block">
              <Separator decorative orientation="horizontal" />
            </span>

            <span className="h-full sm:hidden md:block lg:hidden">
              <Separator decorative orientation="vertical" />
            </span>
          </div>

          <div className="w-full md:w-1/2 lg:w-full flex flex-col gap-4">
            <JobTitle />
            <Separator decorative />
            <Pronouns />
            <Separator decorative />
            <SkinTone />
          </div>
        </div>
      ),
    },
    // Profile Picture Upload
    {
      title: "Set your profile picture.",
      description: "",
      content: <ProfileImageUpload />,
    },
    // Org
    {
      title: "Create or join your organization.",
      description: "",
      content: <CreateOrJoinOrg />,
    },
  ];

  const [section1, section2, section3] = [
    promptSections[0],
    promptSections[1],
    promptSections[2],
  ];

  // Save the onboarding progress once the user stops typing for at least 3 seconds.
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const userId = user?.id;
      if (hasClickedOrTyped && userId) {
        const fullPathname = `/${
          params.locale
        }${pathname}?${searchParams.toString()}`;
        const alteredFullPathname = fullPathname.replaceAll("&", ">"); // Replaces "&" with ">" so that the full pathname is saved to the user's metadata.
        // console.log(fullPathname);
        saveOnboardingProgress(userId, alteredFullPathname);
      }
    }, 3000);
    return () => clearTimeout(timeoutId);
  }, [searchParams]);

  if (!isLoaded || !isSignedIn) return null;
  return (
    <div className="flex flex-col lg:flex-row gap-5 w-full h-full">
      {/* Section 1 */}
      <div className="w-full lg:w-1/3 h-full flex flex-col border rounded-t-3xl rounded-b-lg lg:rounded-l-3xl lg:rounded-r-lg p-5 bg-primary-foreground">
        <h2 className="h2">{section1.title}</h2>
        {section1.description !== "" && (
          <span className="subtitle">{section1.description}</span>
        )}
        {section1.content}
      </div>

      {/* Sections 2 & 3 */}
      <div className="w-full lg:w-1/3 h-full flex flex-col md:flex-row lg:flex-col gap-5">
        {/* Section 2 */}
        <div className="w-full md:w-1/2 lg:w-full h-1/2 md:h-full lg:h-1/2 p-5 border rounded-lg bg-primary-foreground">
          <h2 className="h2">{section2.title}</h2>
          <span className="subtitle">{section2.description}</span>
          {section2.content}
        </div>

        {/* Section 3 */}
        <div className="w-full md:w-1/2 lg:w-full h-1/2 md:h-full lg:h-1/2 p-5 border rounded-lg bg-primary-foreground">
          <h2 className="h2">{section3.title}</h2>
          <span className="subtitle">{section3.description}</span>
          {section3.content}
        </div>
      </div>

      {/* <Separator orientation="vertical" /> */}

      {/* Section 4 */}
      <div className="w-full lg:w-1/3 h-full flex flex-col md:flex-row lg:flex-col gap-5">
        {/* Virtual ID */}
        <div className="w-full md:w-1/2 lg:w-full h-1/2 md:h-full lg:h-1/2 min-h-96 lg:min-h-min flex flex-col p-5 border rounded-lg md:rounded-bl-3xl lg:rounded-lg lg:rounded-tr-3xl bg-primary-foreground">
          <h2 className="h2">Here are your cards.</h2>
          <div className="h-0 mt-5 flex items-center justify-center w-full">
            <UserCards />
          </div>
        </div>

        {/* Example Notifications */}
        <div className="w-full md:w-1/2 lg:w-full h-1/2 md:h-full lg:h-1/2 min-h-80 lg:min-h-min flex flex-col pt-5 border rounded-t-lg rounded-b-3xl md:rounded-lg md:rounded-br-3xl bg-primary-foreground justify-between">
          <h2 className="h2 px-5">And this is how others see you.</h2>

          <div className="relative size-full overflow-y-hidden">
            <div className="absolute left-1/2">
              <div className="relative -left-1/2">
                <Iphone />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
