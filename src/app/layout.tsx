import "~/styles/globals.css";

import { type Metadata } from "next";
import { Header } from "~/components";
import { Inter as FontSans } from "next/font/google";
import { cn } from "~/lib/utils";

export const metadata: Metadata = {
  title: "Game of Life",
  description: "Game of life",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <Header />
        {children}
      </body>
    </html>
  );
}
