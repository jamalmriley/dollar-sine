import { SignedIn, UserButton } from "@clerk/nextjs";
import { StyledButton } from "./StyledButton";

export default function StyledUserButton() {
  return (
    <SignedIn>
      <StyledButton isIconButton={true}>
        <UserButton
          appearance={{
            elements: {
              userButtonAvatarBox: "size-full rounded-none",
              userButtonAvatarBox__open: "size-full rounded-none",
            },
            layout: { shimmer: false },
          }}
        />
      </StyledButton>
    </SignedIn>
  );
}
