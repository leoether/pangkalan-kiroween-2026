# Pangkalan — Requirements

## Introduction
Pangkalan is a digital motorcycle-taxi base station (ojek pangkalan) app for Indonesia.
It revives the traditional pangkalan queue system — drivers waiting in fair rotation at a
physical base — as an offline-first web app. Category: **Resurrection** (Kiroween 2026).
Built with Kiro (spec-driven development), Vite + React + TypeScript. UI in Bahasa Indonesia.

## Glossary
- **Pangkalan**: a motorcycle-taxi base station where drivers queue for passengers.
- **Antrean (queue)**: the fair-rotation waiting line of drivers at the pangkalan.
- **Giliran (turn)**: the next driver in line to take an order.
- **Trip**: one passenger ride (driver, destination, distance, fare, time).
- **Tarif**: fare, computed from the government ceiling rate.

## Requirements

### Requirement 1: Fair rotation queue
**User Story:** As a driver at the pangkalan, I want to join the queue and see my position,
so that orders are distributed fairly in rotation.

#### Acceptance Criteria
1. WHEN a driver name is added THEN the system SHALL append the driver to the end of the queue.
2. WHEN the queue is non-empty THEN the system SHALL show the driver at the front as the next turn ("Giliran Berikutnya").
3. WHEN a trip is started for the front driver THEN the system SHALL remove that driver from the front of the queue.
4. WHEN a trip is finished THEN the system SHALL append the driver back to the end of the queue (rotation).
5. WHEN the queue is displayed THEN the system SHALL show each driver's position number and name.
6. WHEN a driver is removed manually THEN the system SHALL remove them from the queue without affecting other positions.

### Requirement 2: Fare calculator (Kepmenhub KP 348/2019 Zona III)
**User Story:** As a driver, I want to calculate the fare from the trip distance,
so that I charge the official government ceiling rate.

#### Acceptance Criteria
1. WHEN a distance in km is entered THEN the system SHALL compute fare = distance x Rp 2.600.
2. WHEN the distance is 12.5 km THEN the system SHALL show Rp 32.500 (Sambaliung–Bandara example).
3. WHEN the distance is 0 or negative or not a number THEN the system SHALL show a validation message and no fare.
4. WHEN a fare is computed THEN the system SHALL format it as Indonesian Rupiah (Rp, thousand separators).

### Requirement 3: Trip log (offline-first)
**User Story:** As a driver, I want every trip recorded and stored on the device,
so that the pangkalan has a daily record even without internet.

#### Acceptance Criteria
1. WHEN a trip is completed THEN the system SHALL record driver, destination, distance, fare, and timestamp.
2. WHEN the app reloads THEN the system SHALL restore the queue and trip log from localStorage.
3. WHEN the daily summary is shown THEN the system SHALL show today's trip count and total pangkalan revenue.
4. WHEN a trip is deleted THEN the system SHALL remove it from the log and update the summary.

### Requirement 4: Mobile-first Indonesian UI
**User Story:** As an ojek driver using a phone, I want a simple Indonesian interface,
so that I can use the app quickly while working.

#### Acceptance Criteria
1. WHEN the app loads on a phone-width screen THEN the system SHALL lay out all sections in a single readable column.
2. WHEN any label or button is shown THEN the system SHALL use Bahasa Indonesia.
3. WHEN the app is used THEN the system SHALL work fully without a network connection after first load (localStorage only, no backend calls).
