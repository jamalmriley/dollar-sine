import StyledButton from "@/components/StyledButton";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/utils/general";
import { useUser } from "@clerk/nextjs";
import confetti from "canvas-confetti";
import { FaCheck } from "react-icons/fa";
import { MdFileDownload } from "react-icons/md";

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

export function handleConfetti() {
  const end = Date.now() + 3 * 1000; // 3 seconds
  const colors = ["#16db93", "#59c2ff"];

  const frame = () => {
    if (Date.now() > end) return;

    confetti({
      particleCount: 2,
      angle: 60,
      spread: 55,
      startVelocity: 60,
      origin: { x: 0, y: 0.5 },
      colors: colors,
    });
    confetti({
      particleCount: 2,
      angle: 120,
      spread: 55,
      startVelocity: 60,
      origin: { x: 1, y: 0.5 },
      colors: colors,
    });

    requestAnimationFrame(frame);
  };

  frame();
}
