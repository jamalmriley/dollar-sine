import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { inter } from "../fonts";
import "../globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import Banner from "@/components/Banner";
import { bannerMessages } from "@/lib/banner-messages";
import { i18nConfig } from "@/i18nConfig";
import { dir } from "i18next";
import TranslationsProvider from "@/components/ui/translations-provider";
import initTranslations from "../i18n";

export const metadata: Metadata = {
  title: "Dollar Sine",
  description: "Generated by create next app",
  /* icons: {
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
  }, */
};
const i18nNamespaces = ["layout"];

export function generateStaticParams() {
  return i18nConfig.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { resources } = await initTranslations(locale, i18nNamespaces);
  const bannerObj = bannerMessages[bannerMessages.length - 1];
  const [header, text, publishDate] = [
    bannerObj.header,
    bannerObj.text,
    bannerObj.publishDate,
  ];
  return (
    <ClerkProvider>
      <html lang={locale} dir={dir(locale)}>
        <body
          className={`bg-[#fff] dark:bg-[#121212] ${inter.className} site-container text-woodsmoke-950 dark:text-woodsmoke-50`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <TranslationsProvider
              namespaces={i18nNamespaces}
              locale={locale}
              resources={resources}
            >
              {/* <Toaster /> */}
              <div className="page-content flex-col">
                <Banner header={header} text={text} publishDate={publishDate} />
                {children}
              </div>
            </TranslationsProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}