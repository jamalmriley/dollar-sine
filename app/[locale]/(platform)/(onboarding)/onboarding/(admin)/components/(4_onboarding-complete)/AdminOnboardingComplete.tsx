"use client";

import Receipt from "./Receipt";
import HighFive from "@/assets/svg/undraw_high-five_w86k.svg";
import Image from "next/image";
import Link from "next/link";
import { IOS_APP_LINK } from "@/utils/app";
import StyledButton from "@/components/StyledButton";
import { MdComputer, MdSmartphone } from "react-icons/md";
import { useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import { format } from "date-fns";

// TODO: Put button that makes onboarding status set to done

export default function AdminOnboardingComplete() {
  const [paymentIntent] = useQueryState("payment_intent", {
    defaultValue: "",
  });

  const [total, setTotal] = useState<string>("0");
  const [date, setDate] = useState<string>("");
  const [code, setCode] = useState<string>("");

  useEffect(() => {
    fetch(`/api/create-payment-intent?clientSecret=${paymentIntent}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        const paymentIntent = data.paymentIntent;
        setTotal(paymentIntent.amount);
        setDate(
          format(
            new Date(paymentIntent.created * 1000),
            "MM/dd/yyyy 'at' h:mm a"
            // , { locale: es } // TODO: Add locale functionality
          )
        );
        setCode(formatConfirmationCode(paymentIntent.id));
      });
  }, []);

  function formatConfirmationCode(code: string): string {
    const strStart = 3;
    const strLength = 6;
    let first6Chars = code
      .substring(strStart, strStart + strLength)
      .toUpperCase();
    return `C-${first6Chars}`;
  }

  return (
    <div className="size-full flex flex-col justify-between items-center">
      <h1 className="h1 text-center">Your onboarding is complete!</h1>

      {/* SVG and Receipt */}
      <div className="flex flex-col-reverse md:flex-row justify-center items-center gap-5 md:gap-20">
        {/* SVG Image */}
        <Image
          src={HighFive}
          alt="Onboarding completed"
          className="object-contain max-w-48 md:max-w-xs lg:max-w-lg hidden md:block"
        />

        {/* Component */}
        <div className="h-96">
          <Receipt
            purchaseTotal={total}
            purchaseDate={date}
            confirmationCode={code}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col md:flex-row md:justify-around gap-5 md:gap-20 mb-1">
        <StyledButton>
          <Link
            href={IOS_APP_LINK}
            target="_blank"
            className="flex justify-center items-center gap-2"
          >
            <MdSmartphone />
            Download our app
          </Link>
        </StyledButton>

        <StyledButton>
          <Link
            href="/dashboard"
            className="flex justify-center items-center gap-2"
          >
            <MdComputer />
            Go to dashboard
          </Link>
        </StyledButton>
      </div>
    </div>
  );
}
