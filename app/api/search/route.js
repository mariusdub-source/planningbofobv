import airports from '../../../data/france-airports.json'

const demoOffers = [
  {
    id: 'mf-001',
    airline: 'Meta Airways',
    price: 189,
    durationHours: 2.2,
    stops: 0,
    baggageIncluded: false,
    cabinClass: 'economy',
    flexibleDateNote: 'Meilleur prix le mardi'
  },
  {
    id: 'mf-002',
    airline: 'Sky Demo',
    price: 245,
    durationHours: 3.5,
    stops: 1,
    baggageIncluded: true,
    cabinClass: 'economy',
    flexibleDateNote: 'Prix stable sur 3 jours'
  },
  {
    id: 'mf-003',
    airline: 'Cloud Express',
    price: 420,
    durationHours: 5.1,
    stops: 1,
    baggageIncluded: true,
    cabinClass: 'premium',
    flexibleDateNote: 'Départ conseillé en milieu de semaine'
  },
  {
    id: 'mf-004',
    airline: 'Business Sample',
    price: 890,
    durationHours: 4.7,
    stops: 0,
    baggageIncluded: true,
    cabinClass: 'business',
    flexibleDateNote: 'Tarif flexible disponible'
  }
]

function normalizeNumber(value) {
  if (value === '' || value === null || value === undefined) return null
  const number = Number(value)
  return Number.isFinite(number) ? number : null
}

function sortOffers(offers, sortBy) {
  return [...offers].sort((a, b) => {
    if (sortBy === 'duration') return a.durationHours - b.durationHours
    if (sortBy === 'best') return a.price + a.durationHours * 25 + a.stops * 40 - (b.price + b.durationHours * 25 + b.stops * 40)
    return a.price - b.price
  })
}

export async function POST(request) {
  const { departure, destination, month, filters = {} } = await request.json().catch(() => ({}))

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

  const maxBudget = normalizeNumber(filters.maxBudget)
  const maxDuration = normalizeNumber(filters.maxDuration)
  const cabinClass = filters.cabinClass || 'economy'
  const stops = filters.stops || 'any'

  let offers = demoOffers
    .filter((offer) => offer.cabinClass === cabinClass)
    .filter((offer) => (maxBudget === null ? true : offer.price <= maxBudget))
    .filter((offer) => (maxDuration === null ? true : offer.durationHours <= maxDuration))
    .filter((offer) => (filters.baggage ? offer.baggageIncluded : true))
    .filter((offer) => {
      if (stops === 'direct') return offer.stops === 0
      if (stops === 'one-stop') return offer.stops <= 1
      return true
    })
    .map((offer) => ({
      ...offer,
      departure: knownDeparture ? `${knownDeparture.city} (${knownDeparture.iata})` : departure,
      destination
    }))

  offers = sortOffers(offers, filters.sortBy)

  return Response.json({
    status: 'ok',
    search: {
      departure,
      departureAirport: knownDeparture || null,
      destination,
      month
    },
    filters: {
      maxBudget,
      stops,
      cabinClass,
      maxDuration,
      baggage: Boolean(filters.baggage),
      flexibleDates: filters.flexibleDates !== false,
      sortBy: filters.sortBy || 'price'
    },
    offers,
    message: 'Filtres connectés à l’API de démonstration. Branchez ensuite un fournisseur de données vols pour retourner les prix réels.'
  })
}
