"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { IoMdClose } from "react-icons/io";
import { CiBullhorn } from "react-icons/ci";
import { useTranslation } from "react-i18next";
import { SignedIn } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import StyledButton from "./StyledButton";
import Link from "next/link";

export default function Banner({
  requiresSignIn,
  renderCondition = true,
  type,
  icon,
  header,
  text,
  publishDate,
  buttonText,
  buttonHref,
  buttonAction,
  renderExclusionList,
}: {
  requiresSignIn: boolean;
  renderCondition?: boolean;
  type: "default" | "warning";
  icon?: React.ReactNode;
  header: string;
  text: string;
  publishDate: Date;
  buttonText?: string;
  buttonHref?: string;
  buttonAction?: any;
  renderExclusionList?: string[];
}) {
  const { t } = useTranslation();
  const pathname = usePathname();
  const [now, setNow] = useState(new Date());
  const [showBanner, setShowBanner] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const [
    bgTailwindProps,
    text1TailwindProps,
    text2TailwindProps,
    iconBgTailwindProps,
    iconTextTailwindProps,
    borderTailwindProps,
  ] =
    type === "warning"
      ? [
          "bg-selective-yellow-50 dark:bg-selective-yellow-950",
          "text-selective-yellow-950 dark:text-selective-yellow-50",
          "text-selective-yellow-800 dark:text-selective-yellow-100",
          "bg-selective-yellow-500 dark:bg-selective-yellow-400",
          "text-selective-yellow-50 dark:text-selective-yellow-950",
          "border-selective-yellow-300 dark:border-selective-yellow-800",
        ]
      : [
          "bg-emerald-50 dark:bg-emerald-950",
          "text-emerald-950 dark:text-emerald-50",
          "text-emerald-800 dark:text-emerald-100",
          "bg-emerald-500 dark:bg-emerald-400",
          "text-emerald-50 dark:text-emerald-950",
          "border-emerald-300 dark:border-emerald-800",
        ];

  const handleCloseBanner = () => {
    setShowBanner(false);
    localStorage.setItem("lastDismissal", now.toUTCString()); // Store dismissal in local storage
  };

  const isExcludedPathname = (arr: string[] | undefined) => {
    if (!arr || arr === undefined) return true;

    for (const el of arr) {
      if (pathname.includes(el)) return true;
    }

    return false;
  };

  /* The banner will only display under the following conditions:
  (The user last pressed the "X" button before the most recent message's publish date.
  OR
  The user has never pressed the "X" button.)
  AND (&&)
  (The publish date has passed.) */
  useEffect(() => {
    setIsLoaded(true);
    const interval = setInterval(() => {
      const now = new Date();
      setNow(now);
      const lastDismissal = localStorage.getItem("lastDismissal");
      const lastDismissalDate = new Date(lastDismissal ? lastDismissal : 0);

      if (lastDismissalDate <= publishDate && now >= publishDate) {
        setShowBanner(true);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <BannerContainer requiresSignIn={requiresSignIn}>
      {renderCondition && showBanner && isLoaded && (
        <div
          className={`${
            isExcludedPathname(renderExclusionList) ? "hidden" : "flex"
          } justify-between items-center w-full md:h-20 px-5 md:px-10 py-5 border-b border-default-color gap-3 ${bgTailwindProps}`}
        >
          {/* Icon and Text */}
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 min-w-9 min-h-9 rounded-full flex items-center justify-center ${iconBgTailwindProps}`}
            >
              <div className={`w-5 h-5 ${iconTextTailwindProps}`}>
                {icon ? icon : <CiBullhorn className="w-full h-full" />}
              </div>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className={`md:text-lg font-bold ${text1TailwindProps}`}>
                {t(header)}
              </span>
              <span
                className={`hidden md:inline-block text-xs font-medium ${text2TailwindProps}`}
              >
                {t(text)}
              </span>
            </div>
          </div>

          {/* Button */}
          {buttonText !== undefined ? (
            <>
              {buttonHref !== undefined && (
                <Link href={buttonHref}>
                  <StyledButton>{t(buttonText)}</StyledButton>
                </Link>
              )}
              {buttonAction !== undefined && (
                <StyledButton
                  onClick={async () => {
                    await buttonAction();
                  }}
                  className={`border ${bgTailwindProps} ${text2TailwindProps} ${borderTailwindProps} text-xs md:text-sm`}
                >
                  {t(buttonText)}
                </StyledButton>
              )}
            </>
          ) : (
            <Button
              type="submit"
              variant="ghost"
              size="icon"
              className="rounded-full min-w-7 w-7 h-7"
              onClick={() => handleCloseBanner()}
            >
              <IoMdClose />
            </Button>
          )}
        </div>
      )}
    </BannerContainer>
  );
}

function BannerContainer({
  children,
  requiresSignIn,
}: {
  children: React.ReactNode;
  requiresSignIn: boolean;
}) {
  return (
    <>{requiresSignIn ? <SignedIn>{children}</SignedIn> : <>{children}</>}</>
  );
}
