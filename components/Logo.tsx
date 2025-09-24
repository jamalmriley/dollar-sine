import Image from "next/image";
import LightLogo from "@/assets/images/dollar_sine/ds_logo_black.png";
import DarkLogo from "@/assets/images/dollar_sine/ds_logo_color.png";
import { loraItalic } from "@/app/fonts";

export function FullLogo({
  size = 10,
  textSize = "2xl",
}: {
  size?: number;
  textSize?: string;
}) {
  return (
    <span className="flex gap-3 items-center  text-woodsmoke-950 dark:text-woodsmoke-100">
      <Image
        src={LightLogo}
        alt="Logo"
        className={`object-contain size-${size} block dark:hidden`}
      />

      <Image
        src={DarkLogo}
        alt="Logo"
        className={`object-contain size-${size} hidden dark:block`}
      />
      <h1 className={`text-${textSize} font-extrabold`}>
        dollar <span className={`${loraItalic.className}`}>sine</span>
      </h1>
    </span>
  );
}

export function SquareLogo({ size = 10 }: { size?: number }) {
  return (
    <span className="select-none">
      <Image
        src={LightLogo}
        alt="Logo"
        className={`object-contain size-${size} block dark:hidden`}
      />

      <Image
        src={DarkLogo}
        alt="Logo"
        className={`object-contain size-${size} hidden dark:block`}
      />
    </span>
  );
}

export function ResponsiveLogo() {
  return (
    <>
      <div className="block md:hidden">
        <FullLogo />
      </div>
      <div className="hidden md:block">
        <SquareLogo />
      </div>
    </>
  );
}
