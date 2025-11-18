import React, { useState } from 'react';
import { Flight } from '../types/Flight';

interface AddFlightProps {
  onFlightAdd: (flight: Omit<Flight, 'id'>) => void;
}

const AddFlight: React.FC<AddFlightProps> = ({ onFlightAdd }) => {
  const [formData, setFormData] = useState({
    planeNumber: '',
    destination: '',
    departureTime: '',
    arrivalTime: '',
    totalSeats: '',
    soldTickets: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Валидация
    if (!formData.planeNumber || !formData.destination || !formData.departureTime || 
        !formData.arrivalTime || !formData.totalSeats) {
      alert('Заполните все обязательные поля');
      return;
    }

    const totalSeats = parseInt(formData.totalSeats);
    const soldTickets = parseInt(formData.soldTickets || '0');

    if (totalSeats <= 0) {
      alert('Общее количество мест должно быть положительным числом');
      return;
    }

    if (soldTickets < 0 || soldTickets > totalSeats) {
      alert('Количество проданных билетов должно быть от 0 до общего количества мест');
      return;
    }

    const newFlight: Omit<Flight, 'id'> = {
      planeNumber: formData.planeNumber,
      destination: formData.destination,
      departureTime: formData.departureTime,
      arrivalTime: formData.arrivalTime,
      totalSeats: totalSeats,
      soldTickets: soldTickets
    };

    onFlightAdd(newFlight);
    
    // Сброс формы
    setFormData({
      planeNumber: '',
      destination: '',
      departureTime: '',
      arrivalTime: '',
      totalSeats: '',
      soldTickets: ''
    });

    alert('Рейс успешно добавлен!');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="add-flight">
      <h2>Добавление нового рейса</h2>
      
      <form onSubmit={handleSubmit} className="flight-form">
        <div className="form-group">
          <label>Номер самолета *:</label>
          <input
            type="text"
            name="planeNumber"
            value={formData.planeNumber}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Аэропорт назначения *:</label>
          <input
            type="text"
            name="destination"
            value={formData.destination}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Время вылета *:</label>
          <input
            type="datetime-local"
            name="departureTime"
            value={formData.departureTime}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Время прибытия *:</label>
          <input
            type="datetime-local"
            name="arrivalTime"
            value={formData.arrivalTime}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Общее количество мест *:</label>
          <input
            type="number"
            name="totalSeats"
            value={formData.totalSeats}
            onChange={handleChange}
            min="1"
            required
          />
        </div>

        <div className="form-group">
          <label>Количество проданных билетов:</label>
          <input
            type="number"
            name="soldTickets"
            value={formData.soldTickets}
            onChange={handleChange}
            min="0"
          />
        </div>

        <button type="submit" className="submit-button">
          Добавить рейс
        </button>
      </form>
    </div>
  );
};

export default AddFlight;