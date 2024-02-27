import useDarkModeStore from '@/lib/context/theme'
import StyledComponentsRegistry from '@/lib/registry'
import GlobalStyles, { darkTheme, lightTheme } from '@/style/GlobalStyle'
import type { Metadata } from 'next'
import { ThemeProvider } from 'styled-components'
import "./global.css"
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
  const darkMode = useDarkModeStore(state => state.darkMode)

  return (
    <html lang="pt-BR">
      <ThemeProvider theme={darkMode === false ? lightTheme : darkTheme}>
        <GlobalStyles/>
        <body><StyledComponentsRegistry>{children}</StyledComponentsRegistry></body>
      </ThemeProvider>
    </html>
    
  )
}
