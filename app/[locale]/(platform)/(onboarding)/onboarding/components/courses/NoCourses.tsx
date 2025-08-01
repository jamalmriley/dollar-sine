import { StyledIconDestructiveButton } from "@/components/StyledButtons";
import { useOnboardingContext } from "@/contexts/onboarding-context";
import { VscDebugRestart } from "react-icons/vsc";

export default function NoCourses() {
  const { setLastUpdated } = useOnboardingContext();
  return (
    <div className="flex border border-default-color rounded-lg overflow-hidden expandable-content">
      {/* CourseTile */}
      <div
        className="w-48 min-w-48 aspect-[9/16] rounded-none bg-scroll flex flex-col justify-between"
        style={{
          backgroundImage: "url()",
        }}
      >
        <div className="h-1/2 flex flex-col justify-start p-3 bg-gradient-to-b from-black/50 to-transparent">
          <h1 className="text-lg font-extrabold text-white">Uh-oh. 😬</h1>
          <p className="text-2xs text-white">
            There was an issue loading our courses. Please refresh and try
            again.
          </p>
        </div>

        <div className="h-1/2 flex flex-col justify-end p-3 bg-gradient-to-t from-black/50 to-transparent">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs font-bold text-white">Error Code</p>
              <h1 className="text-lg font-extrabold text-white">500</h1>
            </div>
            <StyledIconDestructiveButton
              onClick={() => {
                setLastUpdated(new Date().toString()); // Triggers re-render.
              }}
            >
              <VscDebugRestart />
            </StyledIconDestructiveButton>
          </div>
        </div>
      </div>
    </div>
  );
}
