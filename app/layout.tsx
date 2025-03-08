import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Jegue Rei - O Jogo',
  description: 'Jegue Rei - O Jogo',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-br">
      <body>{children}</body>
    </html>
  )
}
