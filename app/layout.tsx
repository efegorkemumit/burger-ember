import type { Metadata } from "next";
import { Space_Grotesk, Space_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Burger Ember — Live-Fire Cooked",
  description:
    "180g of 100% beef, cooked over live fire. Explore Burger Ember's cheeseburger, ingredient by ingredient.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${spaceMono.variable} h-full`}
    >
      <body className="min-h-full bg-iron text-plaster antialiased">
        {/* Seven full-height scroll sections stand between page load and the
            one interactive element on the site — a keyboard user shouldn't
            have to tab through all of them to reach it. */}
        <a
          href="#menu"
          className="fixed top-4 left-4 z-50 -translate-y-20 border border-ember bg-iron px-4 py-2 font-mono text-sm tracking-[0.15em] text-plaster transition-transform duration-150 focus:translate-y-0"
        >
          Skip to menu
        </a>
        {children}
      </body>
    </html>
  );
}
