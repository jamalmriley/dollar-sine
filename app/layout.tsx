import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { inter } from "./fonts";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Dollar Sine",
  description: "Generated by create next app",
  icons: {
    icon: [
      {
        rel: "icon",
        type: "image/png",
        url: "../assets/images/favicon-light.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        rel: "icon",
        type: "image/png",
        url: "../assets/images/favicon-dark.png",
        media: "(prefers-color-scheme: dark)",
      },
    ],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <SessionProvider session={session}>
      <html lang="en">
        <body
          className={`bg-[#f5f5f5] dark:bg-[#121212] ${inter.className} site-container`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Toaster />
            <div className="page-content flex-col">{children}</div>
          </ThemeProvider>
        </body>
      </html>
    </SessionProvider>
  );
}
