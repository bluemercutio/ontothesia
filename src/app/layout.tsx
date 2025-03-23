import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Geist_Mono } from "next/font/google";
import { Kanit } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import NavbarWrapper from "@/components/NavbarWrapper";
import NavigationButton from "@/components/NavigationButton";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const kanit = Kanit({
  weight: "100",
  subsets: ["latin"],
  variable: "--font-kanit",
});

export const metadata: Metadata = {
  title: "Ontothesia",
  description:
    "An infinite cinema to experience the world's stories as imagined hyperobjects",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${kanit.variable}`}
    >
      <body>
        <Providers>
          <NavbarWrapper />
          {children}
          <NavigationButton />
        </Providers>
      </body>
    </html>
  );
}
