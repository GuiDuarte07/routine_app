"use client"
import StyledComponentsRegistry from '@/lib/registry'
import GlobalStyles from '@/style/GlobalStyle'
import type { Metadata } from 'next'
/* import { Inter } from 'next/font/google' */

/* const inter = Inter({ subsets: ['latin'] }) */

export const metadata: Metadata = {
  title: 'Routine App',
  description: 'Aplicativo para controlar rotina semanal',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <GlobalStyles/>
      <body><StyledComponentsRegistry>{children}</StyledComponentsRegistry></body>
    </html>
  )
}
