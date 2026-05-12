'use client'

import { useMemo, useState } from 'react'
import airports from '../data/france-airports.json'

const inputStyle = {
  width: '100%',
  padding: '12px 14px',
  borderRadius: 12,
  border: '1px solid #d0d7de',
  fontSize: 16,
  background: '#fff'
}

const sectionTitleStyle = {
  margin: '0 0 16px',
  fontSize: 20
}

const chipStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  padding: '8px 10px',
  borderRadius: 999,
  border: '1px solid #d0d7de',
  background: '#f6f8fa',
  fontSize: 14
}

const initialFilters = {
  maxBudget: '',
  stops: 'any',
  cabinClass: 'economy',
  maxDuration: '',
  baggage: false,
  flexibleDates: true,
  sortBy: 'price'
}

export default function Home() {
  const [departure, setDeparture] = useState('')
  const [destination, setDestination] = useState('')
  const [month, setMonth] = useState('')
  const [filters, setFilters] = useState(initialFilters)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const departureOptions = useMemo(
    () => airports.map((airport) => `${airport.city} — ${airport.airport} (${airport.iata})`),
    []
  )

  function updateFilter(name, value) {
    setFilters((current) => ({ ...current, [name]: value }))
  }

  function resetFilters() {
    setFilters(initialFilters)
  }

  async function handleSearch(event) {
    event.preventDefault()
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ departure, destination, month, filters })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Recherche impossible pour le moment.')
      }

      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={{ minHeight: '100vh', padding: 40, fontFamily: 'Arial, sans-serif', background: '#f6f8fa' }}>
      <section style={{ maxWidth: 1080, margin: '0 auto' }}>
        <header style={{ marginBottom: 32 }}>
          <p style={{ margin: 0, color: '#57606a', fontWeight: 700 }}>Comparateur intelligent de vols</p>
          <h1 style={{ margin: '8px 0 12px', fontSize: 48, lineHeight: 1.05 }}>MetaFlight AI ✈️</h1>
          <p style={{ maxWidth: 720, color: '#57606a', fontSize: 18 }}>
            Recherchez une destination, choisissez un mois flexible et affinez les résultats avec des filtres de budget, durée, escales et bagages.
          </p>
        </header>

        <form onSubmit={handleSearch} style={{ background: '#fff', padding: 24, borderRadius: 24, boxShadow: '0 12px 40px rgba(27,31,36,.08)' }}>
          <h2 style={sectionTitleStyle}>Recherche</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            <label>
              <span style={{ display: 'block', marginBottom: 8, fontWeight: 700 }}>Départ</span>
              <input
                list="departure-options"
                value={departure}
                onChange={(event) => setDeparture(event.target.value)}
                placeholder="Paris, Nice..."
                style={inputStyle}
                required
              />
              <datalist id="departure-options">
                {departureOptions.map((option) => (
                  <option key={option} value={option} />
                ))}
              </datalist>
            </label>

            <label>
              <span style={{ display: 'block', marginBottom: 8, fontWeight: 700 }}>Destination</span>
              <input
                value={destination}
                onChange={(event) => setDestination(event.target.value)}
                placeholder="Tokyo, New York, Rome..."
                style={inputStyle}
                required
              />
            </label>

            <label>
              <span style={{ display: 'block', marginBottom: 8, fontWeight: 700 }}>Mois flexible</span>
              <input
                type="month"
                value={month}
                onChange={(event) => setMonth(event.target.value)}
                style={inputStyle}
                required
              />
            </label>
          </div>

          <section style={{ marginTop: 28, paddingTop: 24, borderTop: '1px solid #d8dee4' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ ...sectionTitleStyle, margin: 0 }}>Filtres</h2>
              <button
                type="button"
                onClick={resetFilters}
                style={{ border: '1px solid #d0d7de', background: '#fff', padding: '8px 12px', borderRadius: 10, cursor: 'pointer' }}
              >
                Réinitialiser
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 16 }}>
              <label>
                <span style={{ display: 'block', marginBottom: 8, fontWeight: 700 }}>Budget max</span>
                <input
                  type="number"
                  min="0"
                  value={filters.maxBudget}
                  onChange={(event) => updateFilter('maxBudget', event.target.value)}
                  placeholder="ex. 450 €"
                  style={inputStyle}
                />
              </label>

              <label>
                <span style={{ display: 'block', marginBottom: 8, fontWeight: 700 }}>Escales</span>
                <select
                  value={filters.stops}
                  onChange={(event) => updateFilter('stops', event.target.value)}
                  style={inputStyle}
                >
                  <option value="any">Toutes</option>
                  <option value="direct">Vol direct seulement</option>
                  <option value="one-stop">1 escale maximum</option>
                </select>
              </label>

              <label>
                <span style={{ display: 'block', marginBottom: 8, fontWeight: 700 }}>Classe</span>
                <select
                  value={filters.cabinClass}
                  onChange={(event) => updateFilter('cabinClass', event.target.value)}
                  style={inputStyle}
                >
                  <option value="economy">Économie</option>
                  <option value="premium">Premium economy</option>
                  <option value="business">Business</option>
                </select>
              </label>

              <label>
                <span style={{ display: 'block', marginBottom: 8, fontWeight: 700 }}>Durée max</span>
                <input
                  type="number"
                  min="1"
                  value={filters.maxDuration}
                  onChange={(event) => updateFilter('maxDuration', event.target.value)}
                  placeholder="ex. 8 h"
                  style={inputStyle}
                />
              </label>

              <label>
                <span style={{ display: 'block', marginBottom: 8, fontWeight: 700 }}>Trier par</span>
                <select
                  value={filters.sortBy}
                  onChange={(event) => updateFilter('sortBy', event.target.value)}
                  style={inputStyle}
                >
                  <option value="price">Prix le plus bas</option>
                  <option value="duration">Durée la plus courte</option>
                  <option value="best">Meilleur compromis</option>
                </select>
              </label>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 18 }}>
              <label style={chipStyle}>
                <input
                  type="checkbox"
                  checked={filters.baggage}
                  onChange={(event) => updateFilter('baggage', event.target.checked)}
                />
                Bagage inclus
              </label>

              <label style={chipStyle}>
                <input
                  type="checkbox"
                  checked={filters.flexibleDates}
                  onChange={(event) => updateFilter('flexibleDates', event.target.checked)}
                />
                Dates flexibles ± 3 jours
              </label>
            </div>
          </section>

          <button
            type="submit"
            disabled={loading}
            style={{ marginTop: 24, padding: '12px 18px', borderRadius: 12, border: 0, background: '#0969da', color: '#fff', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}
          >
            {loading ? 'Recherche...' : 'Rechercher'}
          </button>
        </form>

        {error && (
          <p style={{ marginTop: 20, padding: 16, borderRadius: 12, background: '#ffebe9', color: '#cf222e' }}>{error}</p>
        )}

        {result && (
          <section style={{ marginTop: 24, background: '#fff', padding: 24, borderRadius: 24, boxShadow: '0 12px 40px rgba(27,31,36,.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', alignItems: 'start' }}>
              <div>
                <h2 style={{ marginTop: 0 }}>Résultats de démonstration</h2>
                <p style={{ color: '#57606a', marginTop: -8 }}>{result.offers.length} offre(s) correspondant aux filtres.</p>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                <span style={chipStyle}>{result.search.month}</span>
                <span style={chipStyle}>{result.filters.cabinClass}</span>
                <span style={chipStyle}>{result.filters.stops === 'direct' ? 'Direct' : result.filters.stops === 'one-stop' ? '1 escale max' : 'Toutes escales'}</span>
              </div>
            </div>

            <div style={{ display: 'grid', gap: 14, marginTop: 16 }}>
              {result.offers.map((offer) => (
                <article key={offer.id} style={{ border: '1px solid #d8dee4', borderRadius: 18, padding: 18, display: 'grid', gridTemplateColumns: '1fr auto', gap: 16, alignItems: 'center' }}>
                  <div>
                    <h3 style={{ margin: '0 0 8px' }}>{offer.airline}</h3>
                    <p style={{ margin: '0 0 8px', color: '#57606a' }}>
                      {offer.departure} → {offer.destination} · {offer.durationHours} h · {offer.stops === 0 ? 'Direct' : `${offer.stops} escale${offer.stops > 1 ? 's' : ''}`}
                    </p>
                    <p style={{ margin: 0, color: '#57606a' }}>
                      {offer.baggageIncluded ? 'Bagage inclus' : 'Bagage en option'} · {offer.flexibleDateNote}
                    </p>
                  </div>
                  <strong style={{ fontSize: 28 }}>{offer.price} €</strong>
                </article>
              ))}
            </div>

            {result.offers.length === 0 && (
              <p style={{ padding: 16, borderRadius: 12, background: '#fff8c5', color: '#7d4e00' }}>
                Aucune offre de démonstration ne correspond à ces filtres. Augmentez le budget ou autorisez plus d'escales.
              </p>
            )}

            <p style={{ color: '#57606a', marginBottom: 0 }}>{result.message}</p>
          </section>
        )}
      </section>
    </main>
  )
}
