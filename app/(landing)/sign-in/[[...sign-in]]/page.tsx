"use client";

import { SignIn } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";

export default function SignInPage() {
  const searchParams = useSearchParams();
  const forceRedirectUrl = searchParams.get("redirect_url");

  return (
    <main className="flex justify-center">
      <SignIn forceRedirectUrl={forceRedirectUrl} />
    </main>
  );
}
