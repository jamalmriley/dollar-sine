import { toast } from "@/hooks/use-toast";
import { PostResponse } from "./api";

export async function saveOnboardingProgress(userId: string, link: string) {
  await fetch(`/api/onboarding?user_id=${userId}&onboarding_link=${link}`, {
    method: "POST",
  })
    .then((res) => res.json())
    .then((json: PostResponse) => {
      // console.log(json);
      toast({
        variant: json.success ? "default" : "destructive",
        title: json.message.title,
      });
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
