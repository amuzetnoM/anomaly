import type React from "react"
import { Inter, Crimson_Text } from "next/font/google"
import "./globals.css"
import { RealityProvider } from "@/components/reality-provider"
import { BookSidebar } from "@/components/book-sidebar"
import { ThemeProvider } from "@/components/theme-provider"
import { AudioProvider } from "@/components/audio-provider"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const crimson = Crimson_Text({ weight: ["400", "600", "700"], subsets: ["latin"], variable: "--font-crimson" })

export const metadata = {
  title: "The Fractured Mind",
  description: "An interactive psychological thriller that bends reality",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className={`${inter.variable} ${crimson.variable} font-serif bg-black text-slate-200`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <AudioProvider>
            <RealityProvider>
              <div className="flex min-h-screen">
                <BookSidebar />
                <main className="flex-1 overflow-auto transition-all duration-500 ease-in-out">{children}</main>
              </div>
            </RealityProvider>
          </AudioProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
