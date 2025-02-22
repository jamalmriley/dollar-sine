import { useOnboardingContext } from "@/contexts/onboarding-context";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";

export async function saveOnboardingProgress(userId: string, link: string) {
  await fetch(`/api/onboarding?user_id=${userId}&onboarding_link=${link}`, {
    method: "POST",
  })
    .then((res) => res.json())
    .then((json) => {
      toast({
        variant: "default",
        title: "Onboarding progress saved ✅",
      });
      // console.log(json);
    })
    .catch((error) => {
      toast({
        variant: "destructive",
        title: "Error saving onboarding progress",
      });
      console.error(error);
    });
}

export async function completeOnboardingProgress(
  userId: string,
  paymentIntent: string,
  locale: string
) {
  const {
    setTransactionTotal,
    setTransactionDate,
    setTransactionCode,
    setIsOnboardingComplete,
  } = useOnboardingContext();

  function formatConfirmationCode(code: string): string {
    const strStart = 3;
    const strLength = 6;
    let first6Chars = code
      .substring(strStart, strStart + strLength)
      .toUpperCase();
    return `C-${first6Chars}`;
  }

  // Get transaction info from the payment intent.
  fetch(`/api/create-payment-intent?clientSecret=${paymentIntent}`, {
    method: "GET",
  })
    .then((res) => res.json())
    .then((data) => {
      const paymentIntent = data.paymentIntent;
      setTransactionTotal(paymentIntent.amount);
      setTransactionDate(
        format(
          new Date(paymentIntent.created * 1000),
          "MM/dd/yyyy 'at' h:mm a"
          // , { locale: es } // TODO: Add locale functionality
        )
      );
      setTransactionCode(formatConfirmationCode(paymentIntent.id));
    });

  // Update the user's onboarding status to complete.
  fetch(`/api/onboarding-complete?user_id=${userId}&locale=${locale}`, {
    method: "POST",
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) setIsOnboardingComplete(data.success);
    });
}

export function generateDisplayName(
  prefix: string,
  displayName: string,
  isPrefixIncluded: boolean
) {
  return `${
    isPrefixIncluded && prefix !== "" ? `${prefix} ` : ""
  }${displayName}`;
}
