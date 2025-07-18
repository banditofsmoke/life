import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'dont waste life',
  description: 'Momento Mori',
  generator: 'Sledge',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
