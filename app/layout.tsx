import type { Metadata } from "next"
import { Inter, JetBrains_Mono, Playfair_Display } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"
import { SmoothScroll } from "@/components/providers/smooth-scroll"
import { ScrollProgress } from "@/components/magicui/scroll-progress"

const playfair = Playfair_Display({ variable: "--font-playfair", subsets: ["latin"] })
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] })
const jetbrains = JetBrains_Mono({ variable: "--font-jetbrains", subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Luminary — Find Your Next Obsession",
  description:
    "Guided discovery for movies, anime, manga, and books. One question at a time.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${playfair.variable} ${inter.variable} ${jetbrains.variable} antialiased`}
      >
        <Providers>
          <SmoothScroll>
            <ScrollProgress />
            <div className="noise-overlay" aria-hidden />
            {children}
          </SmoothScroll>
        </Providers>
      </body>
    </html>
  )
}
