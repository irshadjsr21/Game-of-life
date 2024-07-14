import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { Header } from "~/components";

export const metadata: Metadata = {
  title: "Game of Life",
  description: "Game of life",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable} bg-background text-text`}>
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
