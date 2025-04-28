import StyledButton from "@/components/StyledButton";
import { setTitle } from "@/utils/ui";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = setTitle("Uh-oh");
export default function NotFound() {
  return (
    <main className="flex justify-center items-center">
      <h1 className="h1">It's not you. It's us.</h1>
      <Link href={"/"}>
        <StyledButton>Back to dashboard</StyledButton>
      </Link>
    </main>
  );
}
