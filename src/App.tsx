import { useState } from 'react';
import {
  loadState,
  saveState,
  addDriver,
  removeDriver,
  startTrip,
  returnDriver,
  addTrip,
  deleteTrip,
  calcFare,
} from './lib/pangkalan';
import type { Driver, PangkalanState, Trip } from './lib/pangkalan';
import QueueSection from './components/QueueSection';
import FareCalculator from './components/FareCalculator';
import TripLog from './components/TripLog';
import './App.css';

function App() {
  const [state, setState] = useState<PangkalanState>(loadState);
  // Driver currently on an active trip (not in queue)
  const [activeDriver, setActiveDriver] = useState<Driver | null>(null);

  function update(next: PangkalanState) {
    setState(next);
    saveState(next);
  }

  function handleAddDriver(name: string) {
    update({ ...state, drivers: addDriver(state.drivers, name) });
  }

  function handleRemoveDriver(id: string) {
    update({ ...state, drivers: removeDriver(state.drivers, id) });
  }

  function handleStartTrip() {
    const [nextQueue, driver] = startTrip(state.drivers);
    if (!driver) return;
    setActiveDriver(driver);
    update({ ...state, drivers: nextQueue });
  }

  function handleFinishTrip(destination: string, distanceKm: number) {
    if (!activeDriver) return;
    const trip: Trip = {
      id: crypto.randomUUID(),
      driverId: activeDriver.id,
      driverName: activeDriver.name,
      destination,
      distanceKm,
      fare: calcFare(distanceKm),
      finishedAt: Date.now(),
    };
    const nextDrivers = returnDriver(state.drivers, activeDriver);
    const nextTrips = addTrip(state.trips, trip);
    setActiveDriver(null);
    update({ drivers: nextDrivers, trips: nextTrips });
  }

  function handleDeleteTrip(id: string) {
    update({ ...state, trips: deleteTrip(state.trips, id) });
  }

  return (
    <div id="app">
      <header className="app-header">
        <h1>🏍️ Pangkalan</h1>
        <p className="app-tagline">Sistem antrean ojek pangkalan — adil &amp; tercatat</p>
      </header>

      <main className="app-main">
        <QueueSection
          drivers={state.drivers}
          onAddDriver={handleAddDriver}
          onRemoveDriver={handleRemoveDriver}
          onStartTrip={handleStartTrip}
        />
        <FareCalculator />
        <TripLog
          activeDriver={activeDriver}
          trips={state.trips}
          onFinishTrip={handleFinishTrip}
          onDeleteTrip={handleDeleteTrip}
        />
      </main>

      <footer className="app-footer">
        <p>Pangkalan · Kiroween 2026 · Data tersimpan di perangkat</p>
      </footer>
    </div>
  );
}

export default App;
