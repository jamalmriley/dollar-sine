import { CardStack } from "@/components/ui/card-stack";
import UserIdCard from "./UserIdCard";
import UserPaymentCard from "./UserPaymentCard";

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
    <div className="w-full h-0 flex justify-center items-center">
      <CardStack items={cards} />
    </div>
  );
}
