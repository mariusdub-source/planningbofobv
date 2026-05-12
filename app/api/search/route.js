import airports from '../../../data/france-airports.json'

export async function POST(request) {
  const { departure, destination, month } = await request.json().catch(() => ({}))

  if (!departure || !destination || !month) {
    return Response.json(
      { error: 'Départ, destination et mois sont obligatoires.' },
      { status: 400 }
    )
  }

  const normalizedDeparture = departure.toLowerCase()
  const knownDeparture = airports.find((airport) =>
    normalizedDeparture.includes(airport.iata.toLowerCase()) ||
    normalizedDeparture.includes(airport.city.toLowerCase())
  )

  return Response.json({
    status: 'ok',
    search: {
      departure,
      departureAirport: knownDeparture || null,
      destination,
      month
    },
    message: 'API connectée. Branchez ici votre fournisseur de données vols pour retourner les prix réels.'
  })
}
