import React from 'react';
import { Flight } from '../types/Flight';
import { formatDateTime } from '../utils/flightUtils';

interface FlightListProps {
  flights: Flight[];
  title?: string;
}

const FlightList: React.FC<FlightListProps> = ({ flights, title = "Все рейсы" }) => {
  if (flights.length === 0) {
    return <div className="no-flights">Рейсы не найдены</div>;
  }

  return (
    <div className="flight-list">
      <h2>{title}</h2>
      <div className="flights-container">
        {flights.map((flight) => (
          <div key={flight.id} className="flight-card">
            <div className="flight-header">
              <h3>Рейс {flight.planeNumber}</h3>
              <span className="destination">{flight.destination}</span>
            </div>
            <div className="flight-details">
              <div className="detail">
                <label>Вылет:</label>
                <span>{formatDateTime(flight.departureTime)}</span>
              </div>
              <div className="detail">
                <label>Прибытие:</label>
                <span>{formatDateTime(flight.arrivalTime)}</span>
              </div>
              <div className="detail">
                <label>Места:</label>
                <span>{flight.soldTickets} / {flight.totalSeats}</span>
              </div>
              <div className="detail">
                <label>Свободно:</label>
                <span className="available-seats">
                  {flight.totalSeats - flight.soldTickets}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlightList;