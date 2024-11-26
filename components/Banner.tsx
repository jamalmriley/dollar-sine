"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { IoMdClose } from "react-icons/io";
import { CiBullhorn } from "react-icons/ci";
import { useTranslation } from "react-i18next";
import CustomButton from "./CustomButton";

export default function Banner({
  header = "banner-header-1",
  text,
  publishDate,
  buttonText,
  buttonHref,
}: {
  header: string;
  text: string;
  publishDate: Date;
  buttonText?: string;
  buttonHref?: string;
}) {
  const { t } = useTranslation();
  const [now, setNow] = useState(new Date());
  const [showBanner, setShowBanner] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleCloseBanner = () => {
    setShowBanner(false);
    localStorage.setItem("lastDismissal", now.toUTCString()); // Store dismissal in local storage
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
    <>
      {showBanner && isLoaded && (
        <div className="flex justify-between items-center w-full h-20 px-10 py-5 bg-emerald-50 dark:bg-emerald-950 border-b">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-emerald-500 dark:bg-emerald-400 rounded-full flex items-center justify-center">
              <CiBullhorn className="w-5 h-5 text-emerald-50 dark:text-emerald-950" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-lg font-bold text-emerald-950 dark:text-emerald-50">
                {t(header)}
              </span>
              <span className="text-xs font-medium text-emerald-800 dark:text-emerald-100">
                {t(text)}
              </span>
            </div>
          </div>

          {buttonText !== undefined && buttonHref !== undefined ? (
            <CustomButton
              text={t(buttonText)}
              href={buttonHref}
              className="border bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-100 dark:border-emerald-800"
            />
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
    </>
  );
}
