"use client";

import { useUser } from "@clerk/nextjs";
import { LiveMap } from "@liveblocks/client";
import {
  LiveblocksProvider,
  ClientSideSuspense,
  RoomProvider,
} from "@liveblocks/react/suspense";

export default function Room({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser();

  if (!user || !isLoaded) return null;
  return (
    <LiveblocksProvider
      publicApiKey={process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY as string}
    >
      <RoomProvider
        id={user.id}
        initialPresence={{ cursor: null }}
        initialStorage={{ records: new LiveMap() }}
        autoConnect={true}
      >
        <ClientSideSuspense
          fallback={
            <div className="size-full flex justify-center items-center">
              Loading the room…
            </div>
          }
        >
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
