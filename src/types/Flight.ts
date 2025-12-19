export interface Flight {
  id: string;
  planeNumber: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  totalSeats: number;
  soldTickets: number;
  next?: Flight | null;    // Ссылка на следующий рейс (может быть пустой)
}

export interface FlightNode {
  flight: Flight;
  next: FlightNode | null;
}