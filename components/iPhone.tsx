// import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";
import { StyledButton } from "@/components/StyledButtons";
import Link from "next/link";
import { IOS_APP_LINK } from "@/utils/app";
import { MdComputer, MdSmartphone } from "react-icons/md";
import { NotificationDemo } from "./NotificationDemo";

export default function Iphone() {
  return (
    <div className="relative w-72 aspect-[9/19.5] rounded-[45px] shadow-[0_0_2px_2px_rgba(255,255,255,0.1)] border-8 border-zinc-900 ml-1">
      {/* Dynamic Island */}
      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-[90px] h-[22px] bg-zinc-900 rounded-full z-20 hover:scale-105 transition ease-out duration-200" />

      <div className="absolute -inset-[1px] border-[3px] border-zinc-700 border-opacity-40 rounded-[37px] pointer-events-none" />

      {/* Screen Content */}
      <div className="relative w-full h-full rounded-[37px] overflow-hidden flex justify-center bg-muted-foreground">
        {/* <BackgroundGradientAnimation> */}
        <div className="absolute z-50 inset-0 flex justify-center">
          <NotificationDemo />
        </div>

        <div className="flex flex-col gap-5 md:hidden">
          <div className="size-32 mt-32 mb-10 bg-white rounded-lg shadow-md mx-auto" />
          <Link
            href={IOS_APP_LINK}
            className="flex justify-center items-center"
          >
            <StyledButton>
              <MdSmartphone />
              Download our app
            </StyledButton>
          </Link>

          <Link href="/dashboard" className="flex justify-center items-center">
            <StyledButton>
              <MdComputer />
              Go to dashboard
            </StyledButton>
          </Link>
        </div>
        {/* </BackgroundGradientAnimation> */}
      </div>

      {/* Left Side Buttons */}
      <>
        {/* Silent Switch */}
        <div className="absolute left-[-12px] top-20 w-[6px] h-8 bg-zinc-900 rounded-l-md shadow-md hover:scale-x-150 transition ease-out duration-200" />

        {/* Volume Up */}
        <div className="absolute left-[-12px] top-36 w-[6px] h-12 bg-zinc-900 rounded-l-md shadow-md hover:scale-x-150 transition ease-out duration-200" />

        {/* Volume Down */}
        <div className="absolute left-[-12px] top-52 w-[6px] h-12 bg-zinc-900 rounded-l-md shadow-md hover:scale-x-150 transition ease-out duration-200" />
      </>

      {/* Right Side Button (Power) */}
      <div className="absolute right-[-12px] top-36 w-[6px] h-16 bg-zinc-900 rounded-r-md shadow-md hover:scale-x-150 transition ease-out duration-200" />
    </div>
  );
}
