import { Flight, FlightNode } from '../types/Flight';
import flightsData from '../data/flights.json';

const STORAGE_KEY = 'airport_system_flights_v1';

export class FlightLinkedList {
	private head: FlightNode | null = null;

	constructor() {
		// Prefer localStorage; fall back to bundled JSON
		if (!this.loadFromLocalStorage()) {
			this.loadFromJSONBundle();
			this.saveToLocalStorage();
		}
	}

	private loadFromJSONBundle(): void {
		const flights: Flight[] = flightsData as Flight[];
		for (let i = flights.length - 1; i >= 0; i--) {
			this.addFlight(flights[i], /*persist*/ false);
		}
	}

	private saveToLocalStorage(): void {
		const flights: Flight[] = this.getAllFlights();
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(flights));
		} catch (e) {
			// ignore storage errors silently
			// components should show UI messages if needed
		}
	}

	private loadFromLocalStorage(): boolean {
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (!raw) return false;
			const flights: Flight[] = JSON.parse(raw) as Flight[];
			// rebuild list
			this.head = null;
			for (let i = flights.length - 1; i >= 0; i--) {
				this.addFlight(flights[i], /*persist*/ false);
			}
			return true;
		} catch (e) {
			return false;
		}
	}

	/**
	 * Export all flights as JSON string
	 */
	exportToJSON(): string {
		return JSON.stringify(this.getAllFlights(), null, 2);
	}

	/**
	 * Import flights from a JSON string. Replaces current data.
	 */
	importFromJSON(json: string): boolean {
		try {
			const flights: Flight[] = JSON.parse(json) as Flight[];
			// simple validation
			if (!Array.isArray(flights)) return false;
			this.head = null;
			for (let i = flights.length - 1; i >= 0; i--) {
				this.addFlight(flights[i], /*persist*/ false);
			}
			this.saveToLocalStorage();
			return true;
		} catch (e) {
			return false;
		}
	}

	/**
	 * Clears all stored flights (in-memory and localStorage)
	 */
	clearAll(): void {
		this.head = null;
		try {
			localStorage.removeItem(STORAGE_KEY);
		} catch (e) {
			// ignore
		}
	}

	addFlight(flight: Flight, persist = true): void {
		const newNode: FlightNode = {
			flight: { ...flight, next: null },
			next: this.head,
		};
		this.head = newNode;
		if (persist) this.saveToLocalStorage();
	}

	getAllFlights(): Flight[] {
		const flights: Flight[] = [];
		let current = this.head;

		while (current !== null) {
			flights.push(current.flight);
			current = current.next;
		}

		return flights;
	}

	findFlightByPlaneNumber(planeNumber: string): Flight | null {
		let current = this.head;

		while (current !== null) {
			if (current.flight.planeNumber === planeNumber) {
				return current.flight;
			}
			current = current.next;
		}

		return null;
	}

	findFlightsByDestination(destination: string): Flight[] {
		const flights: Flight[] = [];
		let current = this.head;

		while (current !== null) {
			if (
				current.flight.destination
					.toLowerCase()
					.includes(destination.toLowerCase())
			) {
				flights.push(current.flight);
			}
			current = current.next;
		}

		return flights;
	}

	reserveTicket(planeNumber: string): boolean {
		let current = this.head;

		while (current !== null) {
			if (current.flight.planeNumber === planeNumber) {
				if (current.flight.soldTickets < current.flight.totalSeats) {
					current.flight.soldTickets++;
					return true;
				}
				return false;
			}
			current = current.next;
		}

		return false;
	}

	getAvailableSeats(flight: Flight): number {
		return flight.totalSeats - flight.soldTickets;
	}
}

export const formatDateTime = (dateTime: string): string => {
	const date = new Date(dateTime);
	return date.toLocaleString('ru-RU');
};

