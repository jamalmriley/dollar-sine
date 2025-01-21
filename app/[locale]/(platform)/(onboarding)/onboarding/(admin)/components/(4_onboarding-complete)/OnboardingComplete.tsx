import UserCards from "./UserCards";
import Iphone from "./iPhone";

export default function OnboardingComplete() {
  return (
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
  );
}
