import Link from "next/link";
import Image from "next/image";
import { ModeToggle } from "@/components/ModeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import SearchBar from "./SearchBar";
import LightLogo from "@/assets/images/ds_logo_light.png";
import DarkLogo from "@/assets/images/ds_logo_dark.png";
import { signOut } from "@/auth";

export default function DashNavbar() {
  return (
    <nav className="sticky top-0 z-10 w-dvw backdrop-blur-md">
      <div className="flex border-b border-black/10 dark:border-white/10 justify-between px-10 py-2">
        {/* Logo Placeholder */}
        <div className="h-10 w-40 flex">
          <Link href="/dashboard">
            <Image
              src={LightLogo}
              alt="Logo"
              className="object-contain h-10 w-10"
            />
            {/* <Image src={DarkLogo} alt="Logo" className="object-contain h-10 w-10" /> */}
          </Link>
        </div>

        <SearchBar />

        {/* Right Side */}
        <div className="flex w-40 justify-end items-center gap-3">
          <form
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <button type="submit" className="text-sm">
              Log out
            </button>
          </form>
          <Avatar className="w-10 h-10">
            <AvatarImage
              src="https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
              alt="@username"
            />
            <AvatarFallback>JR</AvatarFallback>
          </Avatar>

          <ModeToggle />
          {/* <LanguageToggle /> */}
          <div className="flex md:hidden">{/* <MenuToggle /> */}</div>
        </div>
      </div>
    </nav>
  );
}
