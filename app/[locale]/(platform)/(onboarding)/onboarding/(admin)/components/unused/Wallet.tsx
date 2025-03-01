import React from "react";
import UserPaymentCard from "./UserPaymentCard";
import UserIdCard from "./UserIdCard";
import UserSavingsCard from "./UserSavingsCard";
import UserRewardsCard from "./UserRewardsCard";

export default function Wallet() {
  const cards = [
    { id: 0, element: <UserPaymentCard /> },
    { id: 1, element: <UserIdCard /> },
    { id: 2, element: <UserSavingsCard /> },
    { id: 3, element: <UserRewardsCard /> },
  ];
  return (
    <div className="size-full flex justify-between items-center">
      {cards.reverse().map((card) => (
        // <div key={i} className={`card z-${40 - i * 10}`}>
        <div key={card.id} className="card">
          {card.element}
        </div>
      ))}
    </div>
  );
}
