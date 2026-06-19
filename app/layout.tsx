import type { Metadata } from 'next'
import { Syne, DM_Sans, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import Providers from '@/components/Providers'
import Nav from '@/components/layout/Nav'
import PageTransition from '@/components/layout/PageTransition'
import { ArchiProvider } from '@/lib/context/ArchiContext'
import ArchiFromContext from '@/components/mascot/ArchiFromContext'

const syne = Syne({ subsets: ['latin'], weight: ['700', '800'], variable: '--font-syne', display: 'swap' })
const dmSans = DM_Sans({ subsets: ['latin'], weight: ['300', '400', '500'], variable: '--font-dm-sans', display: 'swap' })
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], weight: ['400'], variable: '--font-mono', display: 'swap' })
export const metadata: Metadata = {
  title: 'Archi.learn — Master System Design Through Play',
  description: 'An interactive, gamified platform for mastering system design concepts. Drag, connect, learn.',
  openGraph: {
    title: 'Archi.learn',
    description: 'Learn system design through interactive play, not articles.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={[syne.variable, dmSans.variable, jetbrainsMono.variable].join(' ')}>
      <body suppressHydrationWarning>
        <ArchiProvider>
            <Providers>
              <Nav />
              <PageTransition>
                {children}
              </PageTransition>
              <ArchiFromContext />
            </Providers>
          </ArchiProvider>
      </body>
    </html>
  )
}
