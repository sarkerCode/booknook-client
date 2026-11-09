import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const dMSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dmsans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BookNook",
  description: "A platform for book lovers to discover, share, and discuss their favorite reads.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${playfairDisplay.variable} ${dMSans.variable} h-full scroll-smooth`}
    >
      <body className="flex min-h-full flex-col bg-paper font-sans text-body antialiased">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
