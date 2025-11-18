import React, { useState, useEffect } from 'react';
import './App.css';
import { FlightLinkedList } from './utils/flightUtils';
import { Flight } from './types/Flight';
import FlightList from './components/FlightList';
import FlightDetails from './components/FlightDetails';
import AirportSearch from './components/AirportSearch';
import Reservation from './components/Reservation';
import AddFlight from './components/AddFlight';

type MenuItem = 'all' | 'search' | 'airport' | 'reserve' | 'add';

const App: React.FC = () => {
  const [flightList] = useState(new FlightLinkedList());
  const [flights, setFlights] = useState<Flight[]>([]);
  const [activeMenu, setActiveMenu] = useState<MenuItem>('all');
  const [updateTrigger, setUpdateTrigger] = useState(0);

  useEffect(() => {
    setFlights(flightList.getAllFlights());
  }, [flightList, updateTrigger]);

  const handleFlightAdd = (newFlightData: Omit<Flight, 'id'>) => {
    const newFlight: Flight = {
      ...newFlightData,
      id: Date.now().toString()
    };
    
    flightList.addFlight(newFlight);
    setUpdateTrigger(prev => prev + 1);
  };

  const handleReservationUpdate = () => {
    setUpdateTrigger(prev => prev + 1);
  };

  const renderContent = () => {
    switch (activeMenu) {
      case 'all':
        return <FlightList flights={flights} />;
      case 'search':
        return <FlightDetails flightList={flightList} />;
      case 'airport':
        return <AirportSearch flightList={flightList} />;
      case 'reserve':
        return (
          <Reservation 
            flightList={flightList} 
            onReservationUpdate={handleReservationUpdate}
          />
        );
      case 'add':
        return <AddFlight onFlightAdd={handleFlightAdd} />;
      default:
        return <FlightList flights={flights} />;
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>Справочная система аэропорта</h1>
        <p>Управление рейсами и бронирование билетов</p>
      </header>

      <nav className="main-nav">
        <button 
          className={activeMenu === 'all' ? 'active' : ''}
          onClick={() => setActiveMenu('all')}
        >
          Все рейсы
        </button>
        <button 
          className={activeMenu === 'search' ? 'active' : ''}
          onClick={() => setActiveMenu('search')}
        >
          Поиск по номеру
        </button>
        <button 
          className={activeMenu === 'airport' ? 'active' : ''}
          onClick={() => setActiveMenu('airport')}
        >
          Поиск по аэропорту
        </button>
        <button 
          className={activeMenu === 'reserve' ? 'active' : ''}
          onClick={() => setActiveMenu('reserve')}
        >
          Бронирование
        </button>
        <button 
          className={activeMenu === 'add' ? 'active' : ''}
          onClick={() => setActiveMenu('add')}
        >
          Добавить рейс
        </button>
      </nav>

      <main className="main-content">
        {renderContent()}
      </main>

      <footer className="app-footer">
        <p>Курсовая работа - Справочная система аэропорта</p>
      </footer>
    </div>
  );
};

export default App;