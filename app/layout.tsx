import Providers from "./providers";
import FloatingButtons from "./FloatingButtons";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Stud House Elite",
  description:
    "Premium fashion jewellery including studs, earrings, necklaces and bracelets.",
  icons: {
    icon: "/images/logo/studlogo.png",
    shortcut: "/images/logo/studlogo.png",
    apple: "/images/logo/studlogo.png",
  },
};

export default function RootLayout({
  children,
}: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Providers>
          {children}

          <FloatingButtons />
        </Providers>
      </body>
    </html>
  );
}