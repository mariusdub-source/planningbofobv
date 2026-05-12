'use client'

import { useMemo, useState } from 'react'
import airports from '../data/france-airports.json'

const inputStyle = {
  width: '100%',
  padding: '12px 14px',
  borderRadius: 12,
  border: '1px solid #d0d7de',
  fontSize: 16
}

export default function Home() {
  const [departure, setDeparture] = useState('')
  const [destination, setDestination] = useState('')
  const [month, setMonth] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const departureOptions = useMemo(
    () => airports.map((airport) => `${airport.city} — ${airport.airport} (${airport.iata})`),
    []
  )

  async function handleSearch(event) {
    event.preventDefault()
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ departure, destination, month })
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
      <section style={{ maxWidth: 960, margin: '0 auto' }}>
        <header style={{ marginBottom: 32 }}>
          <p style={{ margin: 0, color: '#57606a', fontWeight: 700 }}>Comparateur intelligent de vols</p>
          <h1 style={{ margin: '8px 0 12px', fontSize: 48, lineHeight: 1.05 }}>MetaFlight AI ✈️</h1>
          <p style={{ maxWidth: 680, color: '#57606a', fontSize: 18 }}>
            Recherchez une destination, choisissez un mois flexible et préparez votre prochain voyage depuis les principaux aéroports français.
          </p>
        </header>

        <form onSubmit={handleSearch} style={{ background: '#fff', padding: 24, borderRadius: 24, boxShadow: '0 12px 40px rgba(27,31,36,.08)' }}>
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

          <button
            type="submit"
            disabled={loading}
            style={{ marginTop: 20, padding: '12px 18px', borderRadius: 12, border: 0, background: '#0969da', color: '#fff', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}
          >
            {loading ? 'Recherche...' : 'Rechercher'}
          </button>
        </form>

        {error && (
          <p style={{ marginTop: 20, padding: 16, borderRadius: 12, background: '#ffebe9', color: '#cf222e' }}>{error}</p>
        )}

        {result && (
          <section style={{ marginTop: 24, background: '#fff', padding: 24, borderRadius: 24, boxShadow: '0 12px 40px rgba(27,31,36,.06)' }}>
            <h2 style={{ marginTop: 0 }}>Résultat de démonstration</h2>
            <p><strong>Départ :</strong> {result.search.departure}</p>
            <p><strong>Destination :</strong> {result.search.destination}</p>
            <p><strong>Mois :</strong> {result.search.month}</p>
            <p style={{ color: '#57606a' }}>{result.message}</p>
          </section>
        )}
      </section>
    </main>
  )
}
