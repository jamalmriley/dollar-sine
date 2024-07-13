"use client";

import { usePathname } from "next/navigation";
import { useCurrentUser } from "@/hooks/use-current-user";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { LogoutButton } from "./logout-button";
import { FaUserCircle } from "react-icons/fa";
import { IoIosLogOut, IoMdSettings } from "react-icons/io";
import { Separator } from "../ui/separator";

export const UserButton = () => {
  const user = useCurrentUser();
  const pathname = usePathname();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className="w-10 h-10">
          <AvatarImage src={user?.image || ""} alt={user?.email || ""} />
          <AvatarFallback>
            <span className="font-semibold">
              {user?.name ? user.name[0] : ""}
            </span>
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40" align="end">
        <p className="font-semibold px-2 py-1">{user?.name}</p>
        <Separator />

        <DropdownMenuItem>
          <FaUserCircle className="h-4 w-4 mr-2" />
          <Link href="/profile">My Profile</Link>
        </DropdownMenuItem>

        <DropdownMenuItem>
          <IoMdSettings className="h-4 w-4 mr-2" />
          <Link href="/settings">Settings</Link>
        </DropdownMenuItem>

        <LogoutButton>
          <DropdownMenuItem>
            <IoIosLogOut className="h-4 w-4 mr-2" /> Log out
          </DropdownMenuItem>
        </LogoutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
