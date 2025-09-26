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
    <div
      className={`h-${size} flex gap-3 items-center  text-woodsmoke-950 dark:text-woodsmoke-100`}
    >
      <SquareLogo size={size} />
      <h1 className={`text-${textSize} font-extrabold`}>
        dollar <span className={`${loraItalic.className}`}>sine</span>
      </h1>
    </div>
  );
}

export function SquareLogo({ size = 10 }: { size?: number }) {
  return (
    <div className={`h-${size} flex items-center select-none`}>
      <Image
        src={LightLogo}
        alt="Logo"
        width={size * 4}
        height={size * 4}
        className={`object-contain block dark:hidden`}
      />

      <Image
        src={DarkLogo}
        alt="Logo"
        width={size * 4}
        height={size * 4}
        className={`object-contain hidden dark:block`}
      />
    </div>
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
