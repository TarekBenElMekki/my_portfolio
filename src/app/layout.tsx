import type { Metadata } from "next";
import "./globals.css";

import { SiteLoader } from "@/components/SiteLoader";
import { CvRequestModal } from "@/components/CvRequestModal";

export const metadata: Metadata = {
  title: "Tarek Ben El Mekki | Engineering Portfolio",
  description:
    "Portfolio of Tarek Ben El Mekki, Biomedical and Embedded Systems Master Graduate working across robotics, medical technology, automation and software systems.",
  keywords: [
    "Tarek Ben El Mekki",
    "Biomedical Master Graduate",
    "Embedded Systems",
    "ROS2",
    "Robotics",
    "Medical Technology",
    "Automation",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <SiteLoader />
        <CvRequestModal />
        {children}
      </body>
    </html>
  );
}