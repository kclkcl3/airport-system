import React, { useState } from 'react';
import { FlightLinkedList } from '../utils/flightUtils';

interface ReservationProps {
  flightList: FlightLinkedList;
  onReservationUpdate: () => void;
}

const Reservation: React.FC<ReservationProps> = ({ flightList, onReservationUpdate }) => {
  const [planeNumber, setPlaneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  const handleReservation = () => {
    setMessage('');

    if (!planeNumber.trim()) {
      setMessage('Введите номер самолета');
      setMessageType('error');
      return;
    }

    const success = flightList.reserveTicket(planeNumber.trim());
    
    if (success) {
      setMessage('Билет успешно забронирован!');
      setMessageType('success');
      setPlaneNumber('');
      onReservationUpdate();
    } else {
      setMessage('Не удалось забронировать билет. Возможно, рейс не найден или нет свободных мест.');
      setMessageType('error');
    }
  };

  return (
    <div className="reservation">
      <h2>Бронирование билетов</h2>
      
      <div className="reservation-form">
        <input
          type="text"
          value={planeNumber}
          onChange={(e) => setPlaneNumber(e.target.value)}
          placeholder="Введите номер самолета для бронирования"
          className="reservation-input"
        />
        <button onClick={handleReservation} className="reservation-button">
          Забронировать билет
        </button>
      </div>

      {message && (
        <div className={`message ${messageType}`}>
          {message}
        </div>
      )}

      <div className="reservation-info">
        <h3>Информация о бронировании:</h3>
        <ul>
          <li>Введите номер самолета для бронирования билета</li>
          <li>Система проверит наличие свободных мест</li>
          <li>При успешном бронировании количество проданных билетов увеличится на 1</li>
        </ul>
      </div>
    </div>
  );
};

export default Reservation;