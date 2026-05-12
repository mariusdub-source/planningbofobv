export const metadata = {
  title: 'MetaFlight AI',
  description: 'Comparateur intelligent de vols avec recherche flexible.'
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
