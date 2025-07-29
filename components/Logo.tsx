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
    <span className="flex gap-3 items-center select-none pointer-events-none">
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
      <h1
        className={`text-${textSize} font-extrabold text-woodsmoke-950 dark:text-woodsmoke-100`}
      >
        dollar
        <span className={`${loraItalic.className} text-foreground`}> sine</span>
      </h1>
    </span>
  );
}

export function SquareLogo({ size = 10 }: { size?: number }) {
  return (
    <span className="select-none pointer-events-none">
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
      <div className="hidden md:block">
        <FullLogo />
      </div>
      <div className="block md:hidden">
        <SquareLogo />
      </div>
    </>
  );
}
