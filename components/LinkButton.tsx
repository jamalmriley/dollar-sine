import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LinkButton({
  text,
  href,
}: {
  text: string;
  href: string;
}) {
  return (
    <Button variant="outline" asChild className="rounded-lg h-10">
      <Link href={href}>{text}</Link>
    </Button>
  );
}
