import React, { useState } from 'react';
import { FlightLinkedList } from '../utils/flightUtils';
import { formatDateTime } from '../utils/flightUtils';

interface FlightDetailsProps {
  flightList: FlightLinkedList;
}

const FlightDetails: React.FC<FlightDetailsProps> = ({ flightList }) => {
  const [planeNumber, setPlaneNumber] = useState('');
  const [flight, setFlight] = useState<any>(null);
  const [error, setError] = useState('');

  const handleSearch = () => {
    setError('');
    setFlight(null);

    if (!planeNumber.trim()) {
      setError('Введите номер самолета');
      return;
    }

    const foundFlight = flightList.findFlightByPlaneNumber(planeNumber.trim());
    
    if (foundFlight) {
      setFlight(foundFlight);
    } else {
      setError('Рейс с указанным номером не найден');
    }
  };

  return (
    <div className="flight-details-component">
      <h2>Поиск рейса по номеру самолета</h2>
      
      <div className="search-form">
        <input
          type="text"
          value={planeNumber}
          onChange={(e) => setPlaneNumber(e.target.value)}
          placeholder="Введите номер самолета (например, SU-1001)"
          className="search-input"
        />
        <button onClick={handleSearch} className="search-button">
          Найти
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {flight && (
        <div className="flight-details-card">
          <h3>Данные о рейсе</h3>
          <div className="flight-info">
            <div className="info-row">
              <label>Номер самолета:</label>
              <span>{flight.planeNumber}</span>
            </div>
            <div className="info-row">
              <label>Аэропорт назначения:</label>
              <span>{flight.destination}</span>
            </div>
            <div className="info-row">
              <label>Время вылета:</label>
              <span>{formatDateTime(flight.departureTime)}</span>
            </div>
            <div className="info-row">
              <label>Время прибытия:</label>
              <span>{formatDateTime(flight.arrivalTime)}</span>
            </div>
            <div className="info-row">
              <label>Общее количество мест:</label>
              <span>{flight.totalSeats}</span>
            </div>
            <div className="info-row">
              <label>Проданные билеты:</label>
              <span>{flight.soldTickets}</span>
            </div>
            <div className="info-row">
              <label>Свободные места:</label>
              <span className="available">{flightList.getAvailableSeats(flight)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlightDetails;