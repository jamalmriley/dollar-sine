import { StyledButton } from "@/components/StyledButton";
import { setTitle } from "@/utils/ui";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ErrorLogo from "@/assets/images/dollar_sine/ds_logo_error.png";

export const metadata: Metadata = setTitle("Uh-oh");
export default function NotFound() {
  return (
    <div className="size-full flex flex-col justify-center items-center gap-5">
      <h1 className="h1">Uh-oh.</h1>
      <h2 className="h2">
        We couldn&apos;t find that page. It&apos;s not you. It&apos;s us.
      </h2>
      <Image src={ErrorLogo} alt="Error" width={368} />
      <SignedIn>
        <Link href={"/dashboard"}>
          <StyledButton>Back to dashboard</StyledButton>
        </Link>
      </SignedIn>
      <SignedOut>
        <Link href={"/"}>
          <StyledButton>Back to home</StyledButton>
        </Link>
      </SignedOut>
    </div>
  );
}
