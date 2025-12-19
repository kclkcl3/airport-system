import { Flight, FlightNode } from '../types/Flight';

const STORAGE_KEY = 'airport_system_flights_v1';

export class FlightLinkedList {
	private head: FlightNode | null = null;

	constructor() {
		// Load only from localStorage. If there's no data, start with empty list.
		this.loadFromLocalStorage();
	}

	// Метод сохранения текущего списка рейсов в localStorage
	private saveToLocalStorage(): void {
		const flights: Flight[] = this.getAllFlights();
		try { // может выбросить исключение, если storage недоступен
			localStorage.setItem(STORAGE_KEY, JSON.stringify(flights)); // Сохраняем массив рейсов как JSON строку
		} catch (e) {
			// ignore storage errors silently
			// components should show UI messages if needed
		}
	}

	private loadFromLocalStorage(): boolean {
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (!raw) return false;
			const flights: Flight[] = JSON.parse(raw) as Flight[];
			// rebuild list
			this.head = null;
			for (let i = flights.length - 1; i >= 0; i--) {
				this.addFlight(flights[i], false);
			}
			return true;
		} catch (e) {
			return false;
		}
	}

	exportToJSON(): string {
		return JSON.stringify(this.getAllFlights(), null, 2);
	}
	importFromJSON(json: string): boolean {
		try {
			const flights: Flight[] = JSON.parse(json) as Flight[];
			// simple validation
			if (!Array.isArray(flights)) return false;
			this.head = null;
			for (let i = flights.length - 1; i >= 0; i--) {
				this.addFlight(flights[i], false);
			}
			this.saveToLocalStorage();
			return true;
		} catch (e) {
			return false;
		}
	}
	clearAll(): void {
		this.head = null;
		try {
			localStorage.removeItem(STORAGE_KEY);
		} catch (e) {
			// ignore
		}
	}

	// Метод добавления рейса в начало списка
	addFlight(flight: Flight, persist = true): void { 
		const newNode: FlightNode = {
			flight: { ...flight, next: null }, // Значит: возьми ВСЕ поля из flight и скопируй сюда
			next: this.head, 
		};
		this.head = newNode;
		if (persist) this.saveToLocalStorage();
		console.log('Flight added:', this.head);
	}

	// Метод получения всех рейсов в виде массива
	getAllFlights(): Flight[] { 
		const flights: Flight[] = []; 
		let current = this.head; // Начинаем с головы списка

		while (current !== null) { 
			flights.push(current.flight); 
			current = current.next;
		}

		return flights;
	}

	findFlightByPlaneNumber(planeNumber: string): Flight | null {
		let current = this.head;

		while (current !== null) {
			if (current.flight.planeNumber === planeNumber) {
				return current.flight;
			}
			current = current.next;
		}

		return null;
	}

	// Метод поиска рейсов по аэропорту назначения, возвращает массив найденных рейсов(массивом является переменная flights(?не факт))
	//Важно: Всегда возвращается массив, даже если он пустой!
	/*
	flights — это массив!

	const flights: Flight[] = [];
	//    ↑         ↑         ↑
	//  название   тип    пустой массив
	*/
	findFlightsByDestination(destination: string): Flight[] {
		const flights: Flight[] = []; // массив для хранения найденных рейсов
		let current = this.head; // начинаем с головы списка, текущий узел, current - указатель на текущий узел в связном списке, this.head - голова списка, где this значит текущий экземпляр класса FlightLinkedList

		while (current !== null) { // пока текущий узел не null (то есть пока не достигнут конец списка)
			// сравниваем аэропорт назначения текущего рейса с введенным пользователем аэропортом назначения, используя toLowerCase() для нечувствительного к регистру сравнения и includes() для проверки наличия подстроки
			if (
				current.flight.destination 
					.toLowerCase()
					.includes(destination.toLowerCase())
			) {
				flights.push(current.flight); // если совпадение найдено, добавляем рейс в массив найденных рейсов в конец массива
			}
			current = current.next; // переходим к следующему узлу в списке и повторяем процесс
		}

		return flights; // возвращаем массив найденных рейсов
	}

/*
Состояние:
flights = []  ← Пустой массив
current = head → [SU123, Москва]  ← Указывает на первый узел

Шаг 2: Первая итерация цикла

Проверка условия:
current.flight.destination      // "Москва"
  .toLowerCase()                 // "москва"
  .includes(destination.toLowerCase())  // includes("москва")
  
// "москва".includes("москва") → TRUE ✅

Действие:
flights.push(current.flight);

Состояние после:
flights = [
  { id: "1", planeNumber: "SU123", destination: "Москва", ... }
]  ← Добавили первый рейс!

current = current.next;  ← Переходим к следующему узлу
current → [SU456, Казань]

Шаг 3: Вторая итерация
Проверка условия:
current.flight.destination      // "Казань"
  .toLowerCase()                 // "казань"
  .includes("москва")            // "казань".includes("москва")
  
// "казань".includes("москва") → FALSE ❌

Действие:
// if НЕ выполнился, flights.push() НЕ вызвался
// Переходим к следующему узлу
current = current.next;

Состояние после:
flights = [
  { id: "1", planeNumber: "SU123", destination: "Москва", ... }
]  ← НЕ изменился

current → [SU789, Москва]
Шаг 4: Третья итерация
Проверка условия:
current.flight.destination      // "Москва"
  .toLowerCase()                 // "москва"
  .includes("москва")
  
// "москва".includes("москва") → TRUE ✅
Действие:
flights.push(current.flight);
Состояние после:
flights = [
  { id: "1", planeNumber: "SU123", destination: "Москва", ... },
  { id: "3", planeNumber: "SU789", destination: "Москва", ... }
]  ← Добавили второй рейс!

current = current.next;
current → null  ← Достигли конца списка
Шаг 5: Выход из цикла
while (current !== null) {  // current === null → НЕ входим в цикл
Цикл завершается.

Шаг 6: Возврат результата
return flights;
Что возвращается:
[
  { id: "1", planeNumber: "SU123", destination: "Москва", ... },
  { id: "3", planeNumber: "SU789", destination: "Москва", ... }
]
Это массив из 2 элементов!



// ВХОД: строка
findFlightsByDestination("Москва")

// ПРОЦЕСС:
1. Создаём пустой массив flights = []
2. Проходим по связному списку
3. Для каждого рейса проверяем destination
4. Если содержит "Москва" → добавляем в массив
5. Переходим к следующему узлу
6. Повторяем, пока не достигнем конца (null)

// ВЫХОД: массив объектов
return [
  { id: "1", planeNumber: "SU123", destination: "Москва", ... },
  { id: "3", planeNumber: "SU789", destination: "Москва", ... }
]
*/



/*
💡 КАК ЭТО ИСПОЛЬЗУЕТСЯ В КОДЕ
В компоненте AirportSearch.tsx:
tsx
const handleSearch = () => {
  const foundFlights = flightList.findFlightsByDestination("Москва");
  //    ↑
  //  foundFlights — это МАССИВ
  
  setFlights(foundFlights);
  //         ↑
  //    Сохраняем массив в state
};
Потом в JSX:
tsx
{flights.length > 0 ? (
  <FlightList flights={flights} />
  //                   ↑
  //            Передаём массив в компонент
) : (
  <div>Не найдено</div>
)}
В компоненте FlightList.tsx:
tsx
{flights.map((flight) => (
  //     ↑
  // Перебираем массив и создаём карточки
  <div key={flight.id}>...</div>
))}
*/


	reserveTicket(planeNumber: string): boolean {
		let current = this.head;

		while (current !== null) {
			if (current.flight.planeNumber === planeNumber) {
				if (current.flight.soldTickets < current.flight.totalSeats) {
					current.flight.soldTickets++;
					return true;
				}
				return false;
			}
			current = current.next;
		}

		return false;
	}

	getAvailableSeats(flight: Flight): number {
		return flight.totalSeats - flight.soldTickets;
	}
}

export const formatDateTime = (dateTime: string): string => {
	const date = new Date(dateTime);
	return date.toLocaleString('ru-RU');
};

