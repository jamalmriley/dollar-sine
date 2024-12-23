"use client";

import { cedarvilleCursive } from "@/app/fonts";
import { useUser } from "@clerk/nextjs";
import { LuNfc } from "react-icons/lu";

export default function UserPaymentCard() {
  const { isLoaded, user } = useUser();
  const testCardNumber = "3141-5926-5358-9783";
  const testCardNumberGroups = testCardNumber.split("-");

  if (!isLoaded || !user) return null;
  return (
    <div className="flex flex-col w-full aspect-[3.375/2.125] bg-emerald-400 dark:bg-emerald-950 select-none overflow-hidden">
      {/* Card Stripe */}
      <div className="w-full h-7 mt-5 bg-woodsmoke-950 dark:bg-woodsmoke-900" />
      {/* Card Content */}
      <div className="h-full flex flex-col justify-between p-5">
        {/* Signature and CVV */}
        <div className="h-9 flex gap-3">
          {/* Signature */}
          <span
            className={`${cedarvilleCursive.className} flex items-center w-1/2 pl-3 bg-woodsmoke-100 dark:bg-white text-woodsmoke-950`}
          >
            {user.fullName}
          </span>
          {/* CVV */}
          <div className="flex flex-col justify-center items-center border border-woodsmoke-950 w-14 px-1 py-0.5">
            <span className="text-sm font-bold">123</span>
            <span className="text-2xs font-semibold uppercase">CVV</span>
          </div>

          <LuNfc className="w-8 h-8" />
        </div>

        {/* Card Number */}
        <div className="flex gap-3">
          {testCardNumberGroups.map((group) => (
            <span key={group} className="font-semibold">
              {group}
            </span>
          ))}
        </div>

        {/* Expiration Date */}
        <div className="flex gap-3 items-center">
          <div className="flex flex-col text-[0.4rem] font-semibold uppercase">
            <span>Valid</span>
            <span>Thru</span>
          </div>
          <span className="font-semibold">12/25</span>
        </div>

        {/* Cardholder Name */}
        <p className="font-bold uppercase">{user.fullName}</p>
      </div>
    </div>
  );
}
