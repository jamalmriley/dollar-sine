"use client";

import { useContent } from "@/hooks/use-content";

export default function PlatformClient({
  children,
}: {
  children: React.ReactNode;
}) {
  useContent();
  return <>{children}</>;
}
