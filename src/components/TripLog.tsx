import { useState } from 'react';
import type { Driver, Trip } from '../lib/pangkalan';
import { calcFare, formatRupiah, dailySummary, EXAMPLE_ROUTES } from '../lib/pangkalan';

interface Props {
  activeDriver: Driver | null; // driver currently on a trip
  trips: Trip[];
  onFinishTrip: (destination: string, distanceKm: number) => void;
  onDeleteTrip: (id: string) => void;
}

export default function TripLog({ activeDriver, trips, onFinishTrip, onDeleteTrip }: Props) {
  const [destination, setDestination] = useState('');
  const [distanceInput, setDistanceInput] = useState('');
  const [distError, setDistError] = useState('');

  const distance = parseFloat(distanceInput);
  const isValid =
    destination.trim() !== '' &&
    distanceInput !== '' &&
    !isNaN(distance) &&
    distance > 0;

  const fare = isValid ? calcFare(distance) : null;

  function handleDistChange(value: string) {
    setDistanceInput(value);
    const parsed = parseFloat(value);
    if (value !== '' && (isNaN(parsed) || parsed <= 0)) {
      setDistError('Jarak harus lebih dari 0 km.');
    } else {
      setDistError('');
    }
  }

  function handleFinish() {
    if (!isValid) return;
    onFinishTrip(destination.trim(), distance);
    setDestination('');
    setDistanceInput('');
    setDistError('');
  }

  const summary = dailySummary(trips);

  function formatTime(epochMs: number): string {
    return new Date(epochMs).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  function formatDate(epochMs: number): string {
    return new Date(epochMs).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
    });
  }

  return (
    <section className="card" aria-labelledby="triplog-heading">
      <h2 id="triplog-heading">📋 Catatan Trip</h2>

      {/* Daily summary */}
      <div className="summary-box" aria-label="Ringkasan hari ini">
        <div className="summary-item">
          <span className="summary-label">Trip hari ini</span>
          <span className="summary-value">{summary.tripCount}</span>
        </div>
        <div className="summary-divider" />
        <div className="summary-item">
          <span className="summary-label">Total pendapatan</span>
          <span className="summary-value">{formatRupiah(summary.totalFare)}</span>
        </div>
      </div>

      {/* Finish trip form */}
      {activeDriver ? (
        <div className="finish-form">
          <p className="finish-driver">
            Pengemudi aktif: <strong>{activeDriver.name}</strong>
          </p>
          <input
            className="text-input"
            type="text"
            placeholder="Tujuan…"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            aria-label="Tujuan trip"
          />

          {/* Quick-pick route buttons */}
          <div className="quick-routes">
            {EXAMPLE_ROUTES.map((r) => (
              <button
                key={r.label}
                type="button"
                className="route-btn-sm"
                onClick={() => {
                  setDestination(r.label.split('–')[1]?.trim() ?? r.label);
                  handleDistChange(String(r.distanceKm));
                }}
              >
                {r.label.split('–')[1]?.trim() ?? r.label} ({r.distanceKm}&nbsp;km)
              </button>
            ))}
          </div>

          <div className="fare-row">
            <input
              className={`text-input${distError ? ' input-error' : ''}`}
              type="number"
              min="0.1"
              step="0.1"
              placeholder="Jarak (km)"
              value={distanceInput}
              onChange={(e) => handleDistChange(e.target.value)}
              aria-label="Jarak trip"
            />
            <span className="unit-label">km</span>
          </div>
          {distError && (
            <p className="error-msg" role="alert">
              {distError}
            </p>
          )}
          {fare !== null && (
            <p className="fare-preview">
              Tarif: <strong>{formatRupiah(fare)}</strong>
            </p>
          )}
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleFinish}
            disabled={!isValid}
          >
            Selesai Trip
          </button>
        </div>
      ) : (
        <p className="empty-hint">Tidak ada trip aktif. Mulai trip dari antrean.</p>
      )}

      {/* Trip list */}
      {trips.length > 0 ? (
        <ul className="trip-list" aria-label="Daftar trip">
          {[...trips].reverse().map((trip) => (
            <li key={trip.id} className="trip-item">
              <div className="trip-info">
                <span className="trip-driver">{trip.driverName}</span>
                <span className="trip-dest">→ {trip.destination}</span>
                <span className="trip-meta">
                  {trip.distanceKm}&nbsp;km · {formatRupiah(trip.fare)} ·{' '}
                  {formatDate(trip.finishedAt)} {formatTime(trip.finishedAt)}
                </span>
              </div>
              <button
                type="button"
                className="btn btn-danger-sm"
                onClick={() => onDeleteTrip(trip.id)}
                aria-label={`Hapus trip ${trip.driverName} ke ${trip.destination}`}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="empty-hint trip-empty">Belum ada trip hari ini.</p>
      )}
    </section>
  );
}
