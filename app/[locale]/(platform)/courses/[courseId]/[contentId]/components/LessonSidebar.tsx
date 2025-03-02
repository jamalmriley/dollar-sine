"use client";

import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { GiRunningShoe } from "react-icons/gi";
import {
  LuClipboardCheck,
  LuGamepad2,
  LuHeadphones,
  LuPencilRuler,
} from "react-icons/lu";
import { MdOutlineQuiz } from "react-icons/md";
import { PiFlagCheckeredFill } from "react-icons/pi";
import { TbZoomCheck } from "react-icons/tb";

export default function LessonSidebar() {
  const { t } = useTranslation();
  const [open, setOpen] = useState<boolean>(false);
  const [currStep, setCurrStep] = useState<number>(0);

  const links = [
    {
      // label: "Prereq Check",
      label: t("intro"),
      //   href: "#intro",
      href: "#",
      icon: <LuClipboardCheck className="sidebar-item" />,
    },
    {
      label: t("lecture"),
      //   href: "#lecture",
      href: "#",
      icon: <LuHeadphones className="sidebar-item" />,
    },
    {
      label: t("activity-1"),
      //   href: "#activity-1",
      href: "#",
      icon: <LuPencilRuler className="sidebar-item" />,
    },
    {
      label: t("checkpoint"),
      //   href: "#checkpoint",
      href: "#",
      icon: <TbZoomCheck className="sidebar-item" />,
    },
    {
      label: t("activity-2"),
      //   href: "#activity-2",
      href: "#",
      icon: <LuGamepad2 className="sidebar-item" />,
    },
    {
      label: t("practice"),
      //   href: "#practice",
      href: "#",
      icon: <GiRunningShoe className="sidebar-item" />,
    },
    {
      label: t("quiz"),
      //   href: "#quiz",
      href: "#",
      icon: <MdOutlineQuiz className="sidebar-item" />,
    },
    {
      label: t("wrapping-up"),
      //   href: "#wrapping-up",
      href: "#",
      icon: <PiFlagCheckeredFill className="sidebar-item" />,
    },
  ];

  return (
    <Sidebar open={open} setOpen={setOpen}>
      <SidebarBody className="justify-between gap-10 bg-givry-50 dark:bg-emerald-950">
        <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          <div className="mt-8 flex flex-col gap-2">
            {links.map((link, i) => (
              <span
                key={i}
                className={`${
                  i === currStep
                    ? "text-primary"
                    : "text-neutral-700 dark:text-emerald-100"
                }`}
                onClick={() => setCurrStep(i)}
              >
                <SidebarLink link={link} />
              </span>
            ))}
          </div>
        </div>
      </SidebarBody>
    </Sidebar>
  );
}
