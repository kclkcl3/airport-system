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
	const [message, setMessage] = useState<{
		type: 'error' | 'success';
		text: string;
	} | null>(null);
	const fileInputRef = React.useRef<HTMLInputElement | null>(null);

	// Выполняется при первой загрузке и при изменении flightList или updateTrigger
	// Вызывает getAllFlights и обновляет состояние flights через setFlights
	// Синхронизирует связный список с массивом рейсов для отображения
	useEffect(() => {
		setFlights(flightList.getAllFlights());
	}, [flightList, updateTrigger]);

/*
Пример
// 1. Пользователь добавляет рейс
handleFlightAdd(newFlight);
  ↓
// 2. Рейс добавляется в связный список
flightList.addFlight(newFlight);
  ↓
// 3. Увеличиваем updateTrigger
setUpdateTrigger(prev => prev + 1);  // 0 → 1
  ↓
// 4. useEffect замечает изменение updateTrigger
useEffect(() => {
  setFlights(flightList.getAllFlights());  // Обновляем массив
}, [flightList, updateTrigger]);
  ↓
// 5. flights обновляется
  ↓
// 6. Компонент перерисовывается с новыми данными
*/

	const handleFlightAdd = (newFlightData: Omit<Flight, 'id'>) => {
		const newFlight: Flight = {
			...newFlightData,
			id: Date.now().toString(),
		};

		flightList.addFlight(newFlight);
		setUpdateTrigger((prev) => prev + 1);
	};

	const handleReservationUpdate = () => {
		setUpdateTrigger((prev) => prev + 1);
	};

	const handleExport = () => {
		try {
			const json = flightList.exportToJSON();
			const blob = new Blob([json], { type: 'application/json' });
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = 'flights_export.json';
			a.click();
			URL.revokeObjectURL(url);
			setMessage({
				type: 'success',
				text: 'Данные экспортированы в flights_export.json',
			});
		} catch (e) {
			setMessage({ type: 'error', text: 'Ошибка при экспорте данных' });
		}
	};

	const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files && e.target.files[0];
		if (!file) return;
		try {
			const text = await file.text();
			const ok = flightList.importFromJSON(text);
			if (ok) {
				setUpdateTrigger((prev) => prev + 1);
				setMessage({ type: 'success', text: 'Данные успешно импортированы' });
			} else {
				setMessage({ type: 'error', text: 'Неверный формат JSON' });
			}
		} catch (err) {
			setMessage({ type: 'error', text: 'Ошибка при чтении файла' });
		} finally {
			// reset input so same file can be selected again
			if (fileInputRef.current) fileInputRef.current.value = '';
		}
	};

	const handleClearData = () => {
		flightList.clearAll();
		setUpdateTrigger((prev) => prev + 1);
		setMessage({ type: 'success', text: 'Данные очищены' });
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
		<div className='App'>
			<header className='app-header'>
				<b>Справочная система аэропорта</b>
				<p>Управление рейсами и бронирование билетов</p>
			</header>

			<nav className='main-nav'>
				<button
					className={activeMenu === 'all' ? 'active' : ''} // условие: если activeMenu равно 'all', добавляем класс 'active'
					onClick={() => setActiveMenu('all')} // при клике меняем activeMenu на 'all'
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

			<div className='data-controls'>
				<button onClick={handleExport}>Export JSON</button>
				<label className='import-label'>
					Import JSON
					<input
						type='file'
						accept='application/json,.json'
						ref={fileInputRef}
						onChange={handleImportFile}
						style={{ display: 'inline-block', marginLeft: 8 }}
					/>
				</label>
				<button onClick={handleClearData}>Clear Data</button>
				{message && (
					<div
						className={
							message.type === 'error' ? 'message error' : 'message success'
						}
					>
						{message.text}
					</div>
				)}
			</div>
			// {renderContent()} — вызов функции, которая возвращает JSX для отображения в зависимости от activeMenu
			<main className='main-content'>{renderContent()}</main>
		</div>
	);
};

export default App;

