import { useState } from 'react';
import { calcFare, formatRupiah, EXAMPLE_ROUTES, RATE_PER_KM } from '../lib/pangkalan';

export default function FareCalculator() {
  const [distanceInput, setDistanceInput] = useState('');
  const [error, setError] = useState('');

  const distance = parseFloat(distanceInput);
  const isValid = distanceInput !== '' && !isNaN(distance) && distance > 0;
  const fare = isValid ? calcFare(distance) : null;

  function handleChange(value: string) {
    setDistanceInput(value);
    const parsed = parseFloat(value);
    if (value !== '' && (isNaN(parsed) || parsed <= 0)) {
      setError('Masukkan jarak yang valid (lebih dari 0 km).');
    } else {
      setError('');
    }
  }

  return (
    <section className="card" aria-labelledby="fare-heading">
      <h2 id="fare-heading">💰 Kalkulator Tarif</h2>
      <p className="card-desc">
        Tarif resmi Rp&nbsp;{new Intl.NumberFormat('id-ID').format(RATE_PER_KM)}/km
        (Kepmenhub KP&nbsp;348/2019 Zona&nbsp;III)
      </p>

      <div className="fare-row">
        <label htmlFor="distance-input" className="sr-only">
          Jarak (km)
        </label>
        <input
          id="distance-input"
          className={`text-input${error ? ' input-error' : ''}`}
          type="number"
          min="0.1"
          step="0.1"
          placeholder="Jarak (km)"
          value={distanceInput}
          onChange={(e) => handleChange(e.target.value)}
          aria-describedby={error ? 'fare-error' : undefined}
        />
        <span className="unit-label">km</span>
      </div>

      {error && (
        <p id="fare-error" className="error-msg" role="alert">
          {error}
        </p>
      )}

      {fare !== null && (
        <div className="fare-result" role="status">
          <span className="fare-amount">{formatRupiah(fare)}</span>
        </div>
      )}

      <div className="example-routes">
        <p className="example-title">Contoh rute:</p>
        <ul className="route-list">
          {EXAMPLE_ROUTES.map((route) => (
            <li key={route.label} className="route-item">
              <button
                type="button"
                className="route-btn"
                onClick={() => handleChange(String(route.distanceKm))}
              >
                <span className="route-label">{route.label}</span>
                <span className="route-dist">{route.distanceKm}&nbsp;km</span>
                <span className="route-fare">{formatRupiah(calcFare(route.distanceKm))}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
