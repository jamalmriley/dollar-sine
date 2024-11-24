"use client";

import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import Link from "next/link";
import { lora, loraItalic } from "@/app/fonts";
import { Button } from "@/components/ui/button";
import { IoVolumeMedium } from "react-icons/io5";
import { useTranslation } from "react-i18next";

export default function Home3DCard() {
  const { t } = useTranslation();
  const definitions = [
    "a website that teaches students about consumer math and financial literacy.",
    "a cool project made by just a STEM teacher.",
    "proof that with hard work, anything is possible.",
  ];

  return (
    <div className="">
      <CardContainer className="inter-var bg-gray-400 w-[350px] md:w-[550px] aspect-[8.48/11.09] md:aspect-[11.09/8.48] rounded-3xl flex justify-center items-center">
        <CardBody className="relative w-[99.5%] h-[99.5%] p-5 rounded-3xl border-black bg-white dark:bg-slate-950 border-[15px] aspect-[11.09/8.48] flex flex-col justify-around">
          <CardItem
            translateZ="50"
            className="text-2xl md:text-4xl font-bold inter-var"
          >
            <div className="flex items-center gap-3">
              <p>
                dol·lar
                <span className={`${loraItalic.className}`}> sine</span>
              </p>

              {/* TODO: Make this play a recording of students saying the phrase. */}
              <Button
                variant="outline"
                size="icon"
                className="w-8 h-8 rounded-full"
                onClick={() => {}}
              >
                <IoVolumeMedium className="w-5 h-5" />
              </Button>
            </div>
          </CardItem>
          <CardItem as="p" translateZ="60" className="text-xl">
            <span className="block md:text-xl">
              &#91; <span className="font-bold">dol</span>
              -er sahyn &#93;
            </span>
            <span className={`block ${lora.className} md:text-xl font-bold`}>
              {t("noun")}
            </span>
          </CardItem>
          <CardItem translateZ="100" className="w-full mt-4">
            {definitions.map((definition, i) => (
              <div
                key={i}
                className={`flex gap-3 ${
                  i === definitions.length - 1 ? "mb-0" : "mb-3"
                } text-sm`}
              >
                <span
                  className={`w-5 text-neutral-500 font-bold ${lora.className}`}
                >
                  {i + 1}
                </span>
                <span>{definition}</span>
              </div>
            ))}
          </CardItem>
          <div className="flex justify-between items-center mt-20">
            <CardItem
              translateZ={20}
              as={Link}
              href="/"
              target="__blank"
              className="px-4 py-2 rounded-xl text-xs font-normal dark:text-white"
            >
              {t("try-now")} →
            </CardItem>
            <CardItem translateZ={20} as={Button} className="text-xs">
              <Link href="/sign-up">{t("get-started")}</Link>
            </CardItem>
          </div>
        </CardBody>
      </CardContainer>
    </div>
  );
}
