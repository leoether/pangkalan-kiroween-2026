// Pure domain logic — no React imports

export interface Driver {
  id: string;
  name: string;
  joinedAt: number; // epoch ms
}

export interface Trip {
  id: string;
  driverId: string;
  driverName: string;
  destination: string;
  distanceKm: number;
  fare: number;       // rupiah
  finishedAt: number; // epoch ms
}

export interface PangkalanState {
  drivers: Driver[];
  trips: Trip[];
}

export const EMPTY_STATE: PangkalanState = { drivers: [], trips: [] };

// Fare ceiling per Kepmenhub KP 348/2019 Zona III
export const RATE_PER_KM = 2600;

export function calcFare(distanceKm: number): number {
  return Math.round(distanceKm * RATE_PER_KM);
}

export function formatRupiah(amount: number): string {
  return 'Rp\u00a0' + new Intl.NumberFormat('id-ID').format(amount);
}

// Queue helpers

export function addDriver(drivers: Driver[], name: string): Driver[] {
  const trimmed = name.trim();
  if (!trimmed) return drivers;
  const driver: Driver = {
    id: crypto.randomUUID(),
    name: trimmed,
    joinedAt: Date.now(),
  };
  return [...drivers, driver];
}

export function removeDriver(drivers: Driver[], id: string): Driver[] {
  return drivers.filter((d) => d.id !== id);
}

/** Remove the front driver when a trip starts; returns [updatedQueue, driverOrNull]. */
export function startTrip(drivers: Driver[]): [Driver[], Driver | null] {
  if (drivers.length === 0) return [drivers, null];
  const [front, ...rest] = drivers;
  return [rest, front];
}

/** Append driver back to end of queue when a trip finishes. */
export function returnDriver(drivers: Driver[], driver: Driver): Driver[] {
  return [...drivers, driver];
}

// Trip log helpers

export function addTrip(trips: Trip[], trip: Trip): Trip[] {
  return [...trips, trip];
}

export function deleteTrip(trips: Trip[], id: string): Trip[] {
  return trips.filter((t) => t.id !== id);
}

/** Today's trips (local calendar day). */
export function todaysTrips(trips: Trip[]): Trip[] {
  const now = new Date();
  const startOfDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  ).getTime();
  const endOfDay = startOfDay + 86_400_000;
  return trips.filter((t) => t.finishedAt >= startOfDay && t.finishedAt < endOfDay);
}

export interface DailySummary {
  tripCount: number;
  totalFare: number;
}

export function dailySummary(trips: Trip[]): DailySummary {
  const today = todaysTrips(trips);
  return {
    tripCount: today.length,
    totalFare: today.reduce((sum, t) => sum + t.fare, 0),
  };
}

// localStorage persistence

const STORAGE_KEY = 'pangkalan-state-v1';

export function loadState(): PangkalanState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_STATE;
    return JSON.parse(raw) as PangkalanState;
  } catch {
    return EMPTY_STATE;
  }
}

export function saveState(state: PangkalanState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// Example routes for the fare calculator
export const EXAMPLE_ROUTES: { label: string; distanceKm: number }[] = [
  { label: 'Sambaliung – Bandara', distanceKm: 12.5 },
  { label: 'Pasar Barito – RSUD', distanceKm: 5 },
  { label: 'Terminal – Pelabuhan', distanceKm: 8 },
];
