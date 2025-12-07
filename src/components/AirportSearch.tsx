import React, { useState } from 'react';
import { FlightLinkedList } from '../utils/flightUtils';
import FlightList from './FlightList';

interface AirportSearchProps {
	flightList: FlightLinkedList;
}

const AirportSearch: React.FC<AirportSearchProps> = ({ flightList }) => {
	const [destination, setDestination] = useState('');
	const [flights, setFlights] = useState<any[]>([]);
	const [searched, setSearched] = useState(false);
	const [message, setMessage] = useState<string | null>(null);

	const handleSearch = () => {
		if (!destination.trim()) {
			setMessage('Введите название аэропорта назначения');
			return;
		}
		setMessage(null);
		const foundFlights = flightList.findFlightsByDestination(
			destination.trim()
		);
		setFlights(foundFlights);
		setSearched(true);
	};

	return (
		<div className='airport-search'>
			<h2>Поиск рейсов по аэропорту назначения</h2>

			<div className='search-form'>
				<input
					type='text'
					value={destination}
					onChange={(e) => setDestination(e.target.value)}
					placeholder='Введите аэропорт назначения (например, Лондон)'
					className='search-input'
				/>
				<button onClick={handleSearch} className='search-button'>
					Найти
				</button>
			</div>
			{message && <div className='message error'>{message}</div>}

			{searched && (
				<div className='search-results'>
					<h3>Рейсы в {destination}:</h3>
					{flights.length > 0 ? (
						<FlightList flights={flights} title={`Рейсы в ${destination}`} />
					) : (
						<div className='no-results'>
							Рейсы в указанный аэропорт не найдены
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default AirportSearch;
