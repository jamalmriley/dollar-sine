import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import {
  CalculatorIcon,
  Share2Icon,
  SmartphoneIcon,
  TrophyIcon,
  WalletIcon,
} from "lucide-react";
import UserCards from "./UserCards";
import DownloadApp from "./DownloadApp";
import Wallet from "./Wallet";
import Integrations from "./Integrations";

export default function FeaturesBentoGrid() {
  const features = [
    {
      Icon: TrophyIcon,
      name: "Learning, gamified",
      description: "Students can earn while they learn.",
      href: "#",
      cta: "Learn more",
      className: "col-span-3 lg:col-span-1",
      background: (
        <></>
        // <Marquee
        //   pauseOnHover
        //   className="absolute top-10 [--duration:20s] [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)] "
        // >
        //   {files.map((f, idx) => (
        //     <figure
        //       key={idx}
        //       className={cn(
        //         "relative w-32 cursor-pointer overflow-hidden rounded-xl border p-4",
        //         "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        //         "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
        //         "transform-gpu blur-[1px] transition-all duration-300 ease-out hover:blur-none"
        //       )}
        //     >
        //       <div className="flex flex-row items-center gap-2">
        //         <div className="flex flex-col">
        //           <figcaption className="text-sm font-medium dark:text-white ">
        //             {f.name}
        //           </figcaption>
        //         </div>
        //       </div>
        //       <blockquote className="mt-2 text-xs">{f.body}</blockquote>
        //     </figure>
        //   ))}
        // </Marquee>
      ),
    },
    {
      Icon: WalletIcon,
      name: "Your wallet",
      description:
        "Your virtual wallet with all the cards you need for Dollar Sine.",
      href: "#",
      cta: "Learn more",
      className: "col-span-3 lg:col-span-2",
      background: (
        // <UserCards />
        // <div className="size-full flex justify-center items-center"></div>
        <span className="size-full bg-emerald-400">
          <Wallet />
        </span>
        // <AnimatedListDemo className="absolute right-2 top-4 h-[300px] w-full border-none transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] group-hover:scale-105" />
      ),
    },
    {
      Icon: Share2Icon,
      name: "Our integrations",
      description: "Supports various integrations and counting.",
      href: "#",
      cta: "Learn more",
      className: "col-span-3 lg:col-span-2",
      background: (
        <Integrations />
      ),
    },
    {
      Icon: CalculatorIcon,
      name: "Teach with AI",
      description: "We're the best consumer math education platform, ever.",
      className: "col-span-3 lg:col-span-1",
      href: "#",
      cta: "Learn more",
      background: (
        <></>
        // <Calendar
        //   mode="single"
        //   selected={new Date(2022, 4, 11, 0, 0, 0)}
        //   className="absolute right-0 top-10 origin-top rounded-md border transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)] group-hover:scale-105"
        // />
      ),
    },
  ];
  const lastCard = {
    Icon: SmartphoneIcon,
    name: "Download the app",
    description:
      "Dollar Sine is available on web and iOS. Android coming soon!",
    className: "col-span-3",
    href: "#",
    cta: "App Store",
    background: (
      <DownloadApp />
      // <Calendar
      //   mode="single"
      //   selected={new Date(2022, 4, 11, 0, 0, 0)}
      //   className="absolute right-0 top-10 origin-top rounded-md border transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)] group-hover:scale-105"
      // />
    ),
  };

  return (
    <div className="h-full flex gap-4 justify-center">
      <BentoGrid className="w-1/2">
        {features.map((feature, idx) => (
          <BentoCard key={idx} {...feature} />
        ))}
      </BentoGrid>
      <BentoGrid className="w-1/4">
        <BentoCard {...lastCard} />
      </BentoGrid>
    </div>
  );
}
