/* Задание со звездочкой */

/*
 Создайте страницу с кнопкой.
 При нажатии на кнопку должен создаваться div со случайными размерами, цветом и позицией на экране
 Необходимо предоставить возможность перетаскивать созданные div при помощи drag and drop
 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 */

/*
 homeworkContainer - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то дабавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */
const homeworkContainer = document.querySelector('#homework-container');

/*
 Функция должна создавать и возвращать новый div с классом draggable-div и случайными размерами/цветом/позицией
 Функция должна только создавать элемент и задвать ему случайные размер/позицию/цвет
 Функция НЕ должна добавлять элемент на страницу. На страницу элемент добавляется отдельно

 Пример:
   const newDiv = createDiv();
   homeworkContainer.appendChild(newDiv);
 */

const getRandomInt = (min = 0, max = 100) => Math.floor(Math.random() * (max - min)) + min;

const getRandomColor = () => {
    const randomColor = Math.floor(Math.random() * (256));
    const [r, g, b] = [randomColor, randomColor, randomColor];
    
    return `RGB(${r}, ${g}, ${b})`;
}

const createDiv = () => {
    const div = document.createElement('DIV');

    div.classList.add('draggable-div');
    div.setAttribute('draggable', true);
    div.setAttribute('style', `
                                width:${getRandomInt(0, 20)}%;
                                height:${getRandomInt(0, 20)}%; 
                                position:absolute; 
                                left:${getRandomInt()}%; 
                                top:${getRandomInt()}%; 
                                background-color:${getRandomColor()};
                                cursor: move;
                              `
    );

    return div;
}

/*
 Функция должна добавлять обработчики событий для перетаскивания элемента при помощи drag and drop

 Пример:
   const newDiv = createDiv();
   homeworkContainer.appendChild(newDiv);
   addListeners(newDiv);
 */
function addListeners(target) {
    target.addEventListener('dragstart', (e) => {
        if (e.target.getAttribute('draggable')) {
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.dropEffect = 'cut';
            e.dataTransfer.setData('Text', e.pageX);
            
        }

        return;
    });

    target.addEventListener('dragenter', () => {
        event.preventDefault();

        return true;
    });

    target.addEventListener('dragover', () => {
        event.preventDefault();
    });

    target.addEventListener('drop', (e) => {
        
        if (e.target.getAttribute('draggable')) {
            
            e.stopPropagation();
        }

    });

    target.addEventListener('dragend', () => {
        // console.log(e.dataTransfer.getData('Text'));

        return;
    });

}

let addDivButton = homeworkContainer.querySelector('#addDiv');

addDivButton.addEventListener('click', function() {
    // создать новый div

    const div = createDiv();

    // добавить на страницу
    homeworkContainer.appendChild(div);
    // назначить обработчики событий мыши для реализации D&D
    addListeners(homeworkContainer);
    // можно не назначать обработчики событий каждому div в отдельности, а использовать делегирование
    // или использовать HTML5 D&D - https://www.html5rocks.com/ru/tutorials/dnd/basics/
});

export {
    createDiv
};
