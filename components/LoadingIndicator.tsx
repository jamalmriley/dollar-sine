"use client";

import { useEffect, useState } from "react";
import { WaveLoader } from "./Loaders";

export default function LoadingIndicator() {
  const loadingMessages: string[] = [
    "Swapping time and space...",
    "We need a new fuse...",
    "Checking the gravitational constant in your locale...",
    "We're testing your patience...",
    "(Insert quarter)",
    "Have you been working out?",
    "It's not you. It's me.",
    "Counting backwards from Infinity...",
    "Don't panic...",
    "Creating time-loop inversion field...",
    "Looking for exact change...",
    "Adjusting flux capacitor...",
    "I swear it's almost done...",
    "Spinning the hamster...",
    "Well, this is embarrassing...",
    "We’re going to need a bigger boat.",
    "Cracking military-grade encryption...",
    "Twiddling thumbs...",
    "Searching for plot device...",
    "Whatever you do, don't look behind you...",
    'While you wait, spell "ICUP".',
    "Initializing the initializer...",
    "Hopped up out the bed, turn my swag on...",
    "You seem like a nice person...",
    "TODO: Insert elevator music...",
    "Grabbing extra minions...",
    "You are number 14,000,605 in the queue...",
    "Feeding unicorns...",
    "Converging tachyon pulses...",
    "1 Mississippi, 2 Mississippi, 3 Mississippi...",
    'I don\'t know what "skibidi" means...',
  ];

  const [randNumber, setRandNumber] = useState<number | undefined>();

  useEffect(() => {
    setRandNumber(Math.floor(Math.random() * loadingMessages.length));
  }, [loadingMessages.length]);

  if (!randNumber) return;
  return (
    <div className="flex flex-col items-center gap-1">
      <WaveLoader />
      <div className="flex items-baseline gap-1">
        <p className="max-w-sm text-center text-sm text-muted-foreground">
          {loadingMessages[randNumber]}
        </p>
        {/* <PulsatingDots /> */}
      </div>
    </div>
  );
}
