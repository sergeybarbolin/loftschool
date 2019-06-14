/*
 Страница должна предварительно загрузить список городов из
 https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 и отсортировать в алфавитном порядке.

 При вводе в текстовое поле, под ним должен появляться список тех городов,
 в названии которых, хотя бы частично, есть введенное значение.
 Регистр символов учитываться не должен, то есть "Moscow" и "moscow" - одинаковые названия.

 Во время загрузки городов, на странице должна быть надпись "Загрузка..."
 После окончания загрузки городов, надпись исчезает и появляется текстовое поле.

 Разметку смотрите в файле towns-content.hbs

 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер

 *** Часть со звездочкой ***
 Если загрузка городов не удалась (например, отключился интернет или сервер вернул ошибку),
 то необходимо показать надпись "Не удалось загрузить города" и кнопку "Повторить".
 При клике на кнопку, процесс загрузки повторяется заново
 */

/*
 homeworkContainer - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то добавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */
const homeworkContainer = document.querySelector('#homework-container');

/*
 Функция должна вернуть Promise, который должен быть разрешен с массивом городов в качестве значения

 Массив городов пожно получить отправив асинхронный запрос по адресу
 https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 */

const loadTowns = () => {
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
              reject(this.status + ' ' + this.statusText + '1');
          }
      } catch (e) {
          reject(e.message);
      }
    }

    request.onerror = function() {
        reject(this.status + " " + this.statusText + '1');
    };

    request.send();

  })
}

/*
 Функция должна проверять встречается ли подстрока chunk в строке full
 Проверка должна происходить без учета регистра символов

 Пример:
   isMatching('Moscow', 'moscow') // true
   isMatching('Moscow', 'mosc') // true
   isMatching('Moscow', 'cow') // true
   isMatching('Moscow', 'SCO') // true
   isMatching('Moscow', 'Moscov') // false
 */
const isMatching = (full, chunk) => String(full).toLowerCase().indexOf(String(chunk).toLowerCase()) === -1 ? false : true;


/* Блок с надписью "Загрузка" */
const loadingBlock = homeworkContainer.querySelector('#loading-block');
/* Блок с текстовым полем и результатом поиска */
const filterBlock = homeworkContainer.querySelector('#filter-block');
/* Текстовое поле для поиска по городам */
const filterInput = homeworkContainer.querySelector('#filter-input');
/* Блок с результатами поиска */
const filterResult = homeworkContainer.querySelector('#filter-result');

const loadComplete = (towns) => {

    loadingBlock.style.display = 'none';
    filterBlock.style.display = 'block';

    const resultItems = document.createDocumentFragment();

    filterInput.addEventListener('keyup', e => {

        const filterTows = towns.filter(item => (filterInput.value.length !== 0) ? isMatching(item.name, filterInput.value) : false);

        if (filterTows.length > 0) {

            filterTows.forEach(town => {
                let resultItem = document.createElement('P');

                resultItem.innerText = town.name;
                resultItems.append(resultItem);
            });

            filterResult.innerHTML = '';
            filterResult.append(resultItems);
            filterResult.style.display = 'block';   

        } else {

            filterResult.style.display = 'none';
            filterResult.innerHTML = '';

        };

    });

}

const loadError = (err) => {
    const errorBlock = document.createElement('div');
    const errorMessage = document.createElement('p');
    const resetBtn = document.createElement('button');

    errorMessage.innerText = 'Не удалось загрузить города';
    resetBtn.innerText = 'Повторить';
    errorBlock.append(errorMessage, resetBtn);

    loadingBlock.style.display = 'none';
    document.body.prepend(errorBlock);

    resetBtn.addEventListener('click', () => {
        errorBlock.remove();
        loadingBlock.style.display = 'block';
        loadTowns().then(loadComplete, loadError)
    });

    // console.log(err);
}


loadTowns().then(loadComplete, loadError)






export {
    loadTowns,
    isMatching
};
