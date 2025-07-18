import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/utils/general";
import { useUser } from "@clerk/nextjs";
import { FaCheck } from "react-icons/fa";
import handleConfetti from "./ui/confetti";

export default function Receipt({
  transactionTotal,
  transactionDate,
  transactionCode,
}: {
  transactionTotal: number;
  transactionDate: string;
  transactionCode: string;
}) {
  const { user, isLoaded, isSignedIn } = useUser();

  if (!user || !isLoaded || !isSignedIn) return;
  return (
    <div className="receipt">
      <Button
        size="icon"
        className="bg-emerald-400 rounded-full hover:animate-hover-tada shadow-none"
        onClick={handleConfetti}
      >
        <FaCheck className="size-full" />
      </Button>

      {/* Transaction Header */}
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

      {/* Transaction Summary */}
      <div className="w-full flex flex-col gap-1.5 text-xs">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Purchase Total</span>
          <span className="font-semibold">
            {formatCurrency(transactionTotal / 100)}
          </span>
        </div>
        <Separator />
        <div className="flex justify-between">
          <span className="text-muted-foreground">Purchase Date</span>
          <span className="font-semibold">{transactionDate}</span>
        </div>
        <Separator />
        <div className="flex justify-between">
          <span className="text-muted-foreground">Confirmation Code</span>
          <span className="font-semibold">{transactionCode}</span>
        </div>
      </div>

      {/* Transaction Message */}
      <p className="text-xs text-muted-foreground">
        Welcome to Dollar Sine, {user.firstName}!
      </p>

      {/* TODO: CTA Button */}
      <div className="flex grow">
        {/* <div className="mb-4">
        <StyledButton>
          <MdFileDownload />
          Download receipt
        </StyledButton>
      </div> */}
      </div>
    </div>
  );
}
