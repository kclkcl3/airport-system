import React, { useState } from 'react';
import { Flight } from '../types/Flight';

interface AddFlightProps {
	// onFlightAdd функция-колбэк
	onFlightAdd: (flight: Omit<Flight, 'id'>) => void;
	// Omit<Flight, 'id'> означает, что объект flight не будет содержать поле id, так как оно обычно генерируется автоматически при добавлении нового рейса и пользователю не нужно его указывать
}

/*
коллбэк — это функция, которая должна быть выполнена после того, как другая функция завершила выполнение

это функция, переданная в другую функцию в качестве аргумента, которая затем вызывается по завершению ...
*/

const AddFlight: React.FC<AddFlightProps> = ({ onFlightAdd }) => {
	// Объект состояния для хранения данных формы
	const [formData, setFormData] = useState({
		planeNumber: '', // номер самолета
		destination: '', // аэропорт назначения
		departureTime: '', // время вылета
		arrivalTime: '', // время прибытия
		totalSeats: '', // общее количество мест
		soldTickets: '', // количество проданных билетов
	});
	const [message, setMessage] = useState<{ // состояние для хранения сообщения об ошибке или успехе
		type: 'error' | 'success'; 
		text: string; // текст сообщения или null, если сообщения нет
	} | null>(null);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault(); // отменяет стандартное поведение (предотвращает перезагрузки страницы при отправке формы)

		// Валидация
		// если хотя бы одно из обязательных полей пустое, показываем ошибку и выходим из функции
		if (
			!formData.planeNumber ||
			!formData.destination ||
			!formData.departureTime ||
			!formData.arrivalTime ||
			!formData.totalSeats
		) {
			setMessage({ type: 'error', text: 'Заполните все обязательные поля' });
			return;
		}
		
		// Преобразование строковых значений в числа, потому что значения из input приходят в виде строк
		const totalSeats = parseInt(formData.totalSeats);
		const soldTickets = parseInt(formData.soldTickets || '0');

		// Дополнительная валидация числовых полей

		if (totalSeats <= 0) {
			setMessage({
				type: 'error',
				text: 'Общее количество мест должно быть положительным числом',
			});
			return; 
		}

		if (soldTickets < 0 || soldTickets > totalSeats) {
			setMessage({
				type: 'error',
				text: 'Количество проданных билетов должно быть от 0 до общего количества мест',
			});
			return;
		}

		const newFlight: Omit<Flight, 'id'> = {
			planeNumber: formData.planeNumber,
			destination: formData.destination,
			departureTime: formData.departureTime,
			arrivalTime: formData.arrivalTime,
			totalSeats: totalSeats,
			soldTickets: soldTickets,
		};

		// Вызов колбэка для добавления рейса
		// коллбэк это функция, которая передается в компонент через пропсы и вызывается внутри компонента для выполнения определенного действия. пропс - это способ передачи данных от родительского компонента к дочернему в React
		// колбэк это функция, которую передали из app.tsx в addflight.tsx через пропсы, и которая вызывается здесь для добавления нового рейса в список рейсов
		onFlightAdd(newFlight);

		// Сброс формы после успешного добавления рейса
		setFormData({
			planeNumber: '',
			destination: '',
			departureTime: '',
			arrivalTime: '',
			totalSeats: '',
			soldTickets: '',
		});

		setMessage({ type: 'success', text: 'Рейс успешно добавлен!' });
	};


	// Обработчик изменения полей формы
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { // событие изменения значения в input, обновляет состояние formData при вводе данных пользователем
		const { name, value } = e.target; // достаем имя и значение измененного поля из события
		setFormData((prev) => ({ 
			...prev, // оператор spread ...prev копирует все предыдущие значения из состояния formData
			[name]: value, // а затем обновляет только то поле, которое изменилось, используя вычисляемое имя свойства [name]
		}));
	};

/*
e: React.ChangeEvent<HTMLInputElement> - это тип события в TypeScript для React, который используется для типизации параметра e (события) в функциях-обработчиках событий для HTML-элементов <input>, например, при изменении значения поля ввода (onChange). React.ChangeEvent – это синтетическое событие React, а <HTMLInputElement> указывает, что это событие относится к элементу типа <input>, позволяя безопасно обращаться к его свойствам, таким как e.target.value (новое значение поля).
*/

	return (
		<div className='add-flight'>
			<h2>Добавление нового рейса</h2>
			{message && (
				<div
					className={
						message.type === 'error' ? 'message error' : 'message success'
					}
				>
					{message.text}
				</div>
			)}

			<form onSubmit={handleSubmit} className='flight-form'>
				<div className='form-group'>
					<label>Номер самолета *:</label>
					<input
						type='text'
						name='planeNumber' //имя поля (используется в handleChange)
						value={formData.planeNumber} // значение из состояния formData
						onChange={handleChange} // при изменении вызывается handleChange для обновления состояния
						required 
					/>
				</div>

				<div className='form-group'>
					<label>Аэропорт назначения *:</label>
					<input
						type='text'
						name='destination'
						value={formData.destination}
						onChange={handleChange}
						required
					/>
				</div>

				<div className='form-group'>
					<label>Время вылета *:</label>
					<input
						type='datetime-local'
						name='departureTime'
						value={formData.departureTime}
						onChange={handleChange}
						required
					/>
				</div>

				<div className='form-group'>
					<label>Время прибытия *:</label>
					<input
						type='datetime-local'
						name='arrivalTime'
						value={formData.arrivalTime}
						onChange={handleChange}
						required
					/>
				</div>

				<div className='form-group'>
					<label>Общее количество мест *:</label>
					<input
						type='number'
						name='totalSeats'
						value={formData.totalSeats}
						onChange={handleChange}
						min='1'
						required
					/>
				</div>

				<div className='form-group'>
					<label>Количество проданных билетов:</label>
					<input
						type='number'
						name='soldTickets'
						value={formData.soldTickets}
						onChange={handleChange}
						min='0'
					/>
				</div>

				<button type='submit' className='submit-button'>
					Добавить рейс
				</button>
			</form>
		</div>
	);
};

export default AddFlight;
