import type { Metadata } from 'next'
import './globals.css'
import Providers from '@/components/Providers'
import Nav from '@/components/layout/Nav'
import PageTransition from '@/components/layout/PageTransition'

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
    <html lang="en">
      <body>
        <Providers>
          <Nav />
          <PageTransition>
            {children}
          </PageTransition>
        </Providers>
      </body>
    </html>
  )
}
