"use server";

import { clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

interface Response {
  status: number;
  success: boolean;
  message?: {
    title: string;
    description: string;
  };
}

interface ClerkError {
  message: string;
  long_message: string;
  code: string;
  meta: any;
  clerk_trace_id: string;
}

export interface ClerkErrorResponse {
  errors: ClerkError[];
  meta: any;
  clerk_trace_id: string;
}

// Update user public metadata
export async function updateUserMetadata(data: FormData) {
  const userId = data.get("userId") as string;
  const publicMetadata = JSON.parse(data.get("publicMetadata") as string);
  const resTitle = data.get("resTitle") as string | null;
  const resDesc = data.get("resDesc") as string | null;
  const path = data.get("path") as string | null;

  const client = await clerkClient();

  const update: Response = await client.users
    .updateUserMetadata(userId, {
      publicMetadata,
    })
    .then(() => {
      const t = resTitle ? resTitle : "Profile successfully updated ✅";
      const d = resDesc ? resDesc : "";

      return {
        status: 200,
        success: true,
        message: { title: t, description: d },
      };
    })
    .catch((err: ClerkErrorResponse) => {
      const error = err.errors[0];
      return {
        status: 400,
        success: false,
        message: {
          title: error.message,
          description: error.long_message,
        },
      };
    });

  if (path) revalidatePath(path);

  return update;
}

// add/update organization (add to metadata too)

// buy course (add courses to metadata upon successful purchase)

// step 1 progress userProfile, organization, courses
// export async function getOnboardingProgress(userId: string) {}

// step 2 progress

// step 3 progress

// use classes to manipulate the data and return it in a suitable state.
// use server functions to tap into apis and handle server-side logic

/*
for handling if a step in the onbaording is completed:
each step should be in an object with a prop called step

ex:
[{ step: 1, content: <Profile /> }, ...]

detecting editing state:

make a context variable called currOnboardingStep. it'll be a tuple: [step: number, isEditing; boolean] ✅
when you click the editing button, it sets it to true. this will handle the apperance logic for what displays (narrow finished cards vs editing wide cards)
going to another step (if possible) will override the tuple, so there's should be an alert asking if they're sure, but only if they're editing bc unsaved changes will be lost. see if shadcn/ui has an alert component.

detecting finished state:

make a prop in metadata called lastOnboardingStepCompleted. if the currentOnboardingStep is <= lastOnboardingStepCompleted, the user may move to the next step. this will handle the button logic for going from step to currentOnboardingStep. if the step is > lastOnboardingStepCompleted (only possible if you're on a step you haven't completed yet), you shouldn't have the option to toggle out of editing mode or see "editing/updating" vocabulary.
*/
