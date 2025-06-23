import { SignedIn, UserButton } from "@clerk/nextjs";
import { StyledDropdownIconButtonNoText } from "./StyledButtons";

export default function StyledUserButton() {
  return (
    <SignedIn>
      <StyledDropdownIconButtonNoText>
        <UserButton
          appearance={{
            elements: {
              userButtonAvatarBox: "size-full rounded-none",
              userButtonAvatarBox__open: "size-full rounded-none",
            },
            layout: { shimmer: false },
          }}
        />
      </StyledDropdownIconButtonNoText>
    </SignedIn>
  );
}
