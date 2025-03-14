// "use client";

import { cookies } from "next/headers";
import initTranslations from "../i18n";
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

/* export default function Loading() {
  const loadingMessages: string[] = [
    "Reticulating splines...",
    "Swapping time and space...",
    "We need a new fuse...",
    "The architects are still drafting",
    "Would you prefer chicken, steak, or tofu?",
    "Would you like fries with that?",
    "Checking the gravitational constant in your locale...",
    "The server is powered by orange soda and a dream.",
    "We're testing your patience.",
    "(Insert quarter)",
    "Have you been working out?",
    "It's not you. It's me.",
    "Counting backwards from Infinity",
    "Don't panic...",
    "Embiggening Prototypes",
    "So... do you come here often?",
    "Warning: Don't set yourself on fire.",
    "Creating time-loop inversion field",
    "Spinning the wheel of fortune...",
    "Looking for exact change",
    "Adjusting flux capacitor...",
    "Please wait until the sloth starts moving.",
    "I swear it's almost done.",
    "Spinning the hamster…",
    "Your left thumb points to the right and your right thumb points to the left.",
    "Computing the secret to life, the universe, and everything.",
    "Adults are just taller kids with money.",
    "Well, this is embarrassing.",
    "We’re going to need a bigger boat.",
    "Cracking military-grade encryption...",
    "Simulating traveling salesman...",
    "Twiddling thumbs...",
    "Searching for plot device...",
    "Thanos was lowkey right...",
    "Whatever you do, don't look behind you...",
    "While you wait, spell ICUP.",
    "Initializing the initializer...",
    "Hopped up out the bed, turn my swag on...",
    "Running with scissors...",
    "You seem like a nice person...",
    "Discovering new ways of making you wait...",
    "TODO: Insert elevator music",
    "Grabbing extra minions",
    "You are number 14,000,605 in the queue",
    "Feeding unicorns...",
    "Converging tachyon pulses",
    "Bypassing control of the matter-antimatter integrator",
    "1 Mississippi, 2 Mississippi, 3 Mississippi...",
    "Everything in this universe is either a potato or not a potato.",
    'I don\'t know what "skibidi" means...',
  ];
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [currMsg, setCurrMsg] = useState<string>(
    loadingMessages[Math.floor(Math.random() * loadingMessages.length)]
  );

  useEffect(() => {
    setIsLoaded(true);
    const interval = setInterval(() => {
      const randInt = Math.floor(Math.random() * loadingMessages.length);
      setCurrMsg(loadingMessages[randInt]);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  if (isLoaded) {
    return (
      <div className="page-container flex flex-col justify-center items-center gap-3">
        <div className="flex items-baseline gap-2">
          <h1 className="text-5xl font-extrabold select-none">Loading</h1>

          <div className="block dark:hidden">
            <SyncLoader color="#0e0e10" />
          </div>
          <div className="hidden dark:block">
            <SyncLoader color="#f7f7f8" />
          </div>
        </div>
        <p className="font-medium select-none">{currMsg}</p>
      </div>
    );
  }

  return (
    <div className="page-container flex flex-col justify-center items-center gap-3" />
  );
}
 */
