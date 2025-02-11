import React from "react";
import UserPaymentCard from "./UserPaymentCard";
import UserIdCard from "./UserIdCard";
import UserSavingsCard from "./UserSavingsCard";
import UserRewardsCard from "./UserRewardsCard";

export default function Wallet() {
  const cards = [
    <UserPaymentCard />,
    <UserIdCard />,
    <UserSavingsCard />,
    <UserRewardsCard />,
  ];
  return (
    <div className="size-full flex justify-between items-center">
      {cards.reverse().map((card, i) => (
        // <div key={i} className={`card z-${40 - i * 10}`}>
        <div key={i} className="card">
          {card}
        </div>
      ))}
    </div>
  );
}
