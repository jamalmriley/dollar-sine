"use client";

import { useContent } from "@/hooks/use-content";

export default function ContentClient({
  children,
}: {
  children: React.ReactNode;
}) {
  useContent();
  return <>{children}</>;
}
