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
    <div className="flex flex-col size-full bg-emerald-400 text-woodsmoke-950 select-none overflow-hidden">
      {/* Card Stripe */}
      <div className="w-full h-5 mt-3 bg-woodsmoke-950" />

      {/* Card Content */}
      <div className="h-full flex flex-col justify-between p-3">
        {/* Signature and CVV */}
        <div className="h-6 flex gap-3">
          {/* Signature */}
          <span
            className={`${cedarvilleCursive.className} text-sm flex justify-center items-center w-2/3 bg-woodsmoke-100 dark:bg-white text-woodsmoke-950`}
          >
            {user.fullName}
          </span>

          {/* CVV */}
          <div className="flex flex-col justify-center items-center border border-woodsmoke-950 w-1/6 px-1 py-0.5">
            <span className="text-2xs font-bold">123</span>
            <span className="text-3xs font-semibold uppercase">CVV</span>
          </div>

          <LuNfc className="w-1/6 h-full py-0.5" />
        </div>

        {/* Card Number */}
        <div className="flex gap-2">
          {testCardNumberGroups.map((group) => (
            <span key={group} className="text-xs font-semibold">
              {group}
            </span>
          ))}
        </div>

        {/* Cardholder Name and Expiration Date */}
        <div className="flex justify-between items-end">
          <p className="text-xs font-bold uppercase">{user.fullName}</p>

          {/* Expiration Date */}
          <div className="flex gap-2 items-center">
            <div className="flex flex-col text-[0.4rem] font-semibold uppercase">
              <span>Valid</span>
              <span>Thru</span>
            </div>
            <span className="text-xs font-semibold">12/25</span>
          </div>
        </div>
      </div>
    </div>
  );
}
