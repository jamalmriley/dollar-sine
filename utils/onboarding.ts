import { toast } from "@/hooks/use-toast";

export type ProfileMetadata = {
  prefix: string;
  displayName: string;
  displayNameFormat: string;
  jobTitle: string;
  pronouns: string;
  skinTone: string;
};

export async function saveOnboardingProgress(userId: string, link: string) {
  await fetch(
    `http://localhost:3000/api/onboarding?user_id=${userId}&onboarding_link=${link}`,
    {
      method: "POST",
    }
  )
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

export function generateDisplayName(
  prefix: string,
  displayName: string,
  isPrefixIncluded: boolean
) {
  return `${
    isPrefixIncluded && prefix !== "" ? `${prefix} ` : ""
  }${displayName}`;
}
