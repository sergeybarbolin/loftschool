/* ДЗ 6 - Асинхронность и работа с сетью */

/*
 Задание 1:

 Функция должна возвращать Promise, который должен быть разрешен через указанное количество секунду

 Пример:
   delayPromise(3) // вернет promise, который будет разрешен через 3 секунды
 */
const delayPromise = seconds => new Promise((resolve, reject) => setTimeout(() => resolve(), seconds * 1000));


/*
 Задание 2:

 2.1: Функция должна вернуть Promise, который должен быть разрешен с массивом городов в качестве значения

 Массив городов можно получить отправив асинхронный запрос по адресу
 https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json

 2.2: Элементы полученного массива должны быть отсортированы по имени города

 Пример:
   loadAndSortTowns().then(towns => console.log(towns)) // должна вывести в консоль отсортированный массив городов
 */
const loadAndSortTowns = () => {
	return new Promise((resolve, reject) => {
		const request = new XMLHttpRequest ();
		request.open('GET', 'https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json');
		request.onload = function() {
			try {
				if (this.status === 200) {
					let arr = JSON.parse(this.response);
					let arrSort = arr.sort((a, b) => (a.name > b.name) ? 1 : (a.name < b.name) ? -1 : 0)

					resolve(arrSort);
				} else {
					reject(this.status + ' ' + this.statusText);
				}
			} catch (e) {
				reject(e.message);
			}
		}

		request.send();

	})
}

export {
    delayPromise,
    loadAndSortTowns
};
