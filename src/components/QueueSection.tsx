import { useState } from 'react';
import type { Driver } from '../lib/pangkalan';

interface Props {
  drivers: Driver[];
  onAddDriver: (name: string) => void;
  onRemoveDriver: (id: string) => void;
  onStartTrip: () => void;
}

export default function QueueSection({
  drivers,
  onAddDriver,
  onRemoveDriver,
  onStartTrip,
}: Props) {
  const [input, setInput] = useState('');

  function handleAdd() {
    const trimmed = input.trim();
    if (!trimmed) return;
    onAddDriver(trimmed);
    setInput('');
  }

  const next = drivers[0] ?? null;

  return (
    <section className="card" aria-labelledby="queue-heading">
      <h2 id="queue-heading">🏍️ Antrean Pengemudi</h2>

      {/* Next turn banner */}
      {next ? (
        <div className="next-banner">
          <span className="next-label">Giliran Berikutnya</span>
          <span className="next-name">{next.name}</span>
          <button
            type="button"
            className="btn btn-primary"
            onClick={onStartTrip}
          >
            Mulai Trip
          </button>
        </div>
      ) : (
        <p className="empty-hint">Belum ada pengemudi dalam antrean.</p>
      )}

      {/* Add driver form */}
      <div className="add-row">
        <input
          className="text-input"
          type="text"
          placeholder="Nama pengemudi…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          aria-label="Nama pengemudi baru"
        />
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleAdd}
          disabled={!input.trim()}
        >
          Tambah
        </button>
      </div>

      {/* Queue list */}
      {drivers.length > 0 && (
        <ol className="driver-list">
          {drivers.map((driver, index) => (
            <li key={driver.id} className="driver-item">
              <span className="driver-pos">{index + 1}</span>
              <span className="driver-name">{driver.name}</span>
              <button
                type="button"
                className="btn btn-danger-sm"
                onClick={() => onRemoveDriver(driver.id)}
                aria-label={`Hapus ${driver.name} dari antrean`}
              >
                ✕
              </button>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
