import LandingNavbar from "@/components/LandingNavbar";
import Footer from "@/components/Footer";
import { navHeight } from "@/lib/ui";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // <div className="flex flex-col h-dvh">
    <div className="flex flex-col h-dvh w-full dark:bg-dot-white/[0.2] bg-dot-black/[0.2] relative">
      <div className={`h-[${navHeight}px]`}>
        <LandingNavbar />
      </div>
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}