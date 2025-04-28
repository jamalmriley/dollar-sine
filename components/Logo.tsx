import Image from "next/image";
import LightLogo from "@/assets/images/logos/dollar_sine/ds_logo_black.png";
import DarkLogo from "@/assets/images/logos/dollar_sine/ds_logo_dark.png";
import { loraItalic } from "@/app/fonts";

export function FullLogo({
  dimensions = 10,
  textSize = "2xl",
}: {
  dimensions?: number;
  textSize?: string;
}) {
  return (
    <div className="flex gap-3 items-center">
      <Image
        src={LightLogo}
        alt="Logo"
        className={`object-contain h-${dimensions} w-${dimensions} block dark:hidden`}
      />

      <Image
        src={DarkLogo}
        alt="Logo"
        className={`object-contain h-${dimensions} w-${dimensions} hidden dark:block`}
      />
      <h1
        className={`text-${textSize} font-extrabold select-none text-antique-brass-950 dark:text-antique-brass-100`}
      >
        dollar
        <span className={`${loraItalic.className} text-foreground`}> sine</span>
      </h1>
    </div>
  );
}

export function SquareLogo({ dimensions = 10 }: { dimensions?: number }) {
  return (
    <>
      <Image
        src={LightLogo}
        alt="Logo"
        className={`object-contain h-${dimensions} w-${dimensions} block dark:hidden`}
      />

      <Image
        src={DarkLogo}
        alt="Logo"
        className={`object-contain h-${dimensions} w-${dimensions} hidden dark:block`}
      />
    </>
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
