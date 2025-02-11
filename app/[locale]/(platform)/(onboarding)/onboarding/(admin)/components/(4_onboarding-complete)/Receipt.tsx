import StyledButton from "@/components/StyledButton";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/utils/general";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { FaCheckCircle } from "react-icons/fa";
import { MdFileDownload } from "react-icons/md";

export default function Receipt({ amount }: { amount: string }) {
  const { user, isLoaded, isSignedIn } = useUser();
  if (!user || !isLoaded || !isSignedIn) return;
  return (
    <div className="receipt">
      <FaCheckCircle className="size-10 text-emerald-400" />

      {/* Purchase Header */}
      <div className="text-center">
        <h1 className="text-lg font-bold">Thanks, {user.firstName}!</h1>
        <p className="text-sm text-muted-foreground">
          A digital receipt has been sent to{" "}
          <span className="font-semibold">
            {user.primaryEmailAddress?.emailAddress}
          </span>
          .
        </p>
      </div>

      {/* Purchase Summary */}
      <div className="w-full flex flex-col gap-1.5 text-xs">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Purchase Total</span>
          <span className="font-semibold">
            {formatCurrency(parseInt(amount))}
          </span>
        </div>
        <Separator />
        <div className="flex justify-between">
          <span className="text-muted-foreground">Purchase Date</span>
          <span className="font-semibold">new Date()</span>
        </div>
        <Separator />
        <div className="flex justify-between">
          <span className="text-muted-foreground">Confirmation Code</span>
          <span className="font-semibold">#WBYCEIYDBO</span>
        </div>
      </div>

      {/* Purchase Message */}
      <p className="text-xs text-muted-foreground">
        Welcome to Dollar Sine, {user.firstName}!
      </p>

      {/* CTA Button */}
      <div className="mb-4">
        <StyledButton>
          <MdFileDownload />
          Download receipt
        </StyledButton>
      </div>
    </div>
  );
}
