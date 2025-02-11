"use client";

import Receipt from "./Receipt";
import HighFive from "@/assets/svg/undraw_high-five_w86k.svg";
import Image from "next/image";
import Link from "next/link";
import { IOS_APP_LINK } from "@/utils/app";
import StyledButton from "@/components/StyledButton";
import { MdComputer, MdSmartphone } from "react-icons/md";

// TODO: Put button that makes onboarding status set to done

export default function AdminOnboardingComplete() {
  return (
    <div className="size-full flex flex-col justify-between items-center">
      <h1 className="h1 text-center">Your onboarding is complete!</h1>

      {/* SVG and Receipt */}
      <div className="flex flex-col-reverse md:flex-row justify-center items-center gap-5 md:gap-20">
        {/* SVG Image */}
        <Image
          src={HighFive}
          alt="Onboarding completed"
          className="object-contain max-w-48 md:max-w-xs lg:max-w-lg hidden md:block"
        />

        {/* Component */}
        <div className="h-96">
          <Receipt amount="1" />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col md:flex-row md:justify-around gap-5 md:gap-20 mb-1">
        <StyledButton>
          <Link
            href={IOS_APP_LINK}
            target="_blank"
            className="flex justify-center items-center gap-2"
          >
            <MdSmartphone />
            Download our app
          </Link>
        </StyledButton>

        <StyledButton>
          <Link
            href="/dashboard"
            className="flex justify-center items-center gap-2"
          >
            <MdComputer />
            Go to dashboard
          </Link>
        </StyledButton>
      </div>
    </div>
  );
}
