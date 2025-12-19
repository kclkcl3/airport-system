import React, { useState } from 'react';
import { FlightLinkedList } from '../utils/flightUtils';
import { formatDateTime } from '../utils/flightUtils';

interface FlightDetailsProps { // пропсы компонента FlightDetails
  flightList: FlightLinkedList; // связный список рейсов(для поиска рейса по номеру самолета)
}

// Компонент для поиска и отображения деталей рейса по номеру самолета
const FlightDetails: React.FC<FlightDetailsProps> = ({ flightList }) => {
  const [planeNumber, setPlaneNumber] = useState(''); // состояние для хранения введенного номера самолета(например, SU-1001), где planeNumber - вводит пользователь, а setPlaneNumber - функция для обновления этого состояния
  const [flight, setFlight] = useState<any>(null); // состояние для хранения найденного рейса, изначально null. flight - найденный рейс, setFlight - функция для обновления этого состояния(например, после поиска)
  const [error, setError] = useState(''); // состояние для хранения сообщений об ошибках, изначально пустая строка. error - сообщение об ошибке, setError - функция для обновления этого состояния

  // Сброс поиска и ошибок при новом поиске, чтобы не показывать старые данные
  const handleSearch = () => {
    setError(''); // Сброс предыдущих ошибок перед новым поиском
    setFlight(null); // Сброс предыдущего найденного рейса перед новым поиском

    if (!planeNumber.trim()) { // если поле ввода пустое (не введен номер самолета) или содержит только пробелы, устанавливаем сообщение об ошибке. .trim() удаляет пробелы в начале и конце строки
      setError('Введите номер самолета');
      return;
    }

    // Поиск рейса по номеру самолета в связном списке
    const foundFlight = flightList.findFlightByPlaneNumber(planeNumber.trim()); //foundFlight - найденный рейс, flightList - связный список рейсов, findFlightByPlaneNumber - метод для поиска рейса по номеру самолета, planeNumber.trim() - введенный номер самолета без пробелов в начале и конце, findFlightByPlaneNumber возвращает рейс или null, если не найден, задан в файле flightUtils.ts
    
    if (foundFlight) { // если рейс найден (foundFlight не null), обновляем состояние flight и сохраняем найденный рейс в state. state - состояние компонента
      setFlight(foundFlight); // обновление состояния найденного рейса, setFlight - функция для обновления состояния flight
    } else {
      setError('Рейс с указанным номером не найден');
    }
  };

  // возвращаем JSX для рендеринга компонента, то есть разметку и логику отображения, включая форму поиска и отображение деталей рейса и ошибок
  return (
    <div className="flight-details-component"> // основной контейнер компонента FlightDetails, flight-details-component - CSS класс для стилизации компонента
      <h2>Поиск рейса по номеру самолета</h2> // заголовок компонента
      
      <div className="search-form"> // контейнер для формы поиска рейса по номеру самолета, search-form - CSS класс для стилизации формы
        <input
          type="text" // текстовое поле для ввода номера самолета
          value={planeNumber} // значение поля ввода, привязанное к состоянию planeNumber, чтобы отображать текущее значение, берется из состояния компонента
          onChange={(e) => setPlaneNumber(e.target.value)} // обработчик события изменения значения поля ввода, обновляет состояние planeNumber при вводе пользователем, e - объект события, e.target.value - текущее значение поля ввода, setPlaneNumber - функция для обновления состояния planeNumber, вызывается при каждом изменении текста в поле ввода, onChange - событие изменения
          placeholder="Введите номер самолета (например, SU-1001)"
          className="search-input"
        />
        <button onClick={handleSearch} className="search-button"> // кнопка для запуска поиска рейса по номеру самолета, при клике вызывается функция handleSearch из компонента FlightDetails
          Найти
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}
      // error && - если есть сообщение об ошибке (error не пустая строка), отображаем его в div с классом error-message для стилизации
      
      /* 
      Логика &&:
      true && "показать"   // "показать"
      false && "показать"  // false (ничего не покажет)
      "текст" && <div/>    // <div/> (покажет)
      "" && <div/>         // "" (пустая строка = false)
      */

      {flight && ( // flight && - если рейс найден (flight не null), отображаем детали рейса внутри div с классом flight-details-card для стилизации, Если flight null → ничего не покажет, flight - найденный рейс
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

/*
Поток работы FlightDetails:
1. Пользователь вводит "SU123"
   ↓
2. onChange → setPlaneNumber("SU123")
   ↓
3. State обновляется
   ↓
4. Пользователь нажимает "Найти"
   ↓
5. handleSearch()
   ↓
6. flightList.findFlightByPlaneNumber("SU123")
   ↓
7. Поиск в связном списке
   ↓
8а. Нашли → setFlight(foundFlight)
8б. Не нашли → setError("Не найден")
   ↓
9. Компонент перерисовывается
   ↓
10. Показывается результат или ошибка
*/