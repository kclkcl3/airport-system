import { Flight, FlightNode } from '../types/Flight';
import flightsData from '../data/flights.json';

export class FlightLinkedList {
  private head: FlightNode | null = null;

  constructor() {
    this.loadFromJSON();
  }

  private loadFromJSON(): void {
    const flights: Flight[] = flightsData as Flight[];
    
    // Создаем связный список из JSON данных
    for (let i = flights.length - 1; i >= 0; i--) {
      this.addFlight(flights[i]);
    }
  }

  addFlight(flight: Flight): void {
    const newNode: FlightNode = {
      flight: { ...flight, next: null },
      next: this.head
    };
    this.head = newNode;
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
      if (current.flight.destination.toLowerCase().includes(destination.toLowerCase())) {
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