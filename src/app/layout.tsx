import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tarek Ben El Mekki | Engineering Portfolio",
  description:
    "Portfolio of Tarek Ben El Mekki, Biomedical and Embedded Systems Engineer working across robotics, medical technology, automation and software systems.",
  keywords: [
    "Tarek Ben El Mekki",
    "Biomedical Engineer",
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
      <body>{children}</body>
    </html>
  );
}