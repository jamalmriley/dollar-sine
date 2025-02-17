"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

export default function ModeToggle() {
  const { setTheme } = useTheme();
  const { t } = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative inline-block group border-0"
        >
          {/* Back */}
          <span className="absolute inset-0 w-full h-full transition duration-200 ease-out transform translate-x-1 translate-y-1 group-hover:-translate-x-0 group-hover:-translate-y-0 rounded-md bg-black/75 dark:bg-emerald-400" />
          {/* Front */}
          <span className="absolute inset-0 w-full h-full rounded-md border border-default-color bg-primary-foreground group-hover:bg-emerald-100 group-hover:border-emerald-950" />
          {/* Text */}
          <span className="relative group-hover:text-emerald-950">
            <Sun className="size-5 mx-auto rotate-0 scale-100 transition-all dark:-rotate-90 dark:hidden" />
            <Moon className="size-5 mx-auto rotate-90 hidden transition-all dark:rotate-0 dark:block" />
            <span className="sr-only">Toggle theme</span>
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          {t("light")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          {t("dark")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          {t("system")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
