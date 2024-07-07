import { CardWrapper } from "./card-wrapper";
import { MdErrorOutline } from "react-icons/md";

export const ErrorCard = () => {
  return (
    <CardWrapper
      headerLabel="Uh-oh, something went wrong!"
      backButtonHref="/login"
      backButtonLabel="Back to login"
    >
      <div className="w-full flex justify-center items-center">
        <MdErrorOutline className="text-destructive w-10 h-10" />
      </div>
    </CardWrapper>
  );
};
