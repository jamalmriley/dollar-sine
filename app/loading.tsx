// "use client";

import { cookies } from "next/headers";
import initTranslations from "./i18n";
// import WaveLoader from "@/components/WaveLoader";

// import { useEffect, useState } from "react";
// import SyncLoader from "react-spinners/SyncLoader";

export default async function Loading() {
  const cookieStore = await cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value || "en";
  const { t } = await initTranslations(locale, ["layout"]);

  return (
    <div className="page-container flex flex-col justify-center items-center gap-3 select-none">
      <h1 className="text-5xl font-extrabold">{t("loading")}...</h1>
      <p className="font-medium">Thanos was right...</p>
      {/* <WaveLoader /> */}
    </div>
  );
}
