import { CardStack } from "@/components/ui/card-stack";
import UserIdCard from "./UserIdCard";
import UserPaymentCard from "./UserPaymentCard";
import UserRewardsCard from "./UserRewardsCard";

export default function UserCards() {
  const cards = [
    {
      id: 0,
      content: <UserIdCard />,
    },
    {
      id: 1,
      content: <UserPaymentCard />,
    },
    // {
    //   id: 2,
    //   content: <UserRewardsCard />,
    // },
  ];
  return (
    <div className="h-[40rem] flex items-center justify-center w-full">
      <CardStack items={cards} />
    </div>
  );
}
