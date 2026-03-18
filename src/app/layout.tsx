import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { SmoothScrollProvider } from '../components/providers/SmoothScrollProvider'
import { VineEngine } from '../components/visuals/VineEngine'
import { GlobalBackground } from '../components/visuals/GlobalBackground'
import { LoadingOverlay } from '../components/visuals/LoadingOverlay'
import { LocaleProvider } from '../context/LocaleContext'
import { HeaderNav } from '../components/layout/HeaderNav'
import { ZyraWidget } from '../components/zyra/ZyraWidget'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'BODLIZ STUDIO | Custom Website Creator & Izdelava Spletnih Strani',
  description: 'Need a website? BODLIZ STUDIO specializes in creating high-performance websites worldwide. Rešite se počasnih predlog – vrhunsko ustvarjanje spletnih strani (Slovenija).',
  keywords: ['bodliz studio', 'website creator', 'spletne strani', 'spletna stran', 'bodliz', 'ustvarjanje spletnih strani', 'spletne strani slovenija', 'creating website', 'websites', 'I need a website'],
  icons: {
    icon: '/slike/logo.png',
  },
  verification: {
    google: '2k8ci7Wr5NOJu1bD4VL3Et1LMRvfTYl5kctNb6OnsVE',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${inter.className} bg-obsidian text-white selection:bg-bioluminescence/30`}>
        <SmoothScrollProvider>
          <LocaleProvider>
            <LoadingOverlay>
              <div className="relative w-full min-h-screen">
                <HeaderNav />
                <GlobalBackground />
                <VineEngine />
                <div className="relative z-10">
                  {children}
                </div>
                <ZyraWidget />
              </div>
          </LoadingOverlay>
          </LocaleProvider>
        </SmoothScrollProvider>
      </body>
    </html>
  )
}
