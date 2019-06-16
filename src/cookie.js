/*
 ДЗ 7 - Создать редактор cookie с возможностью фильтрации

 7.1: На странице должна быть таблица со списком имеющихся cookie. Таблица должна иметь следующие столбцы:
   - имя
   - значение
   - удалить (при нажатии на кнопку, выбранная cookie удаляется из браузера и таблицы)

 7.2: На странице должна быть форма для добавления новой cookie. Форма должна содержать следующие поля:
   - имя
   - значение
   - добавить (при нажатии на кнопку, в браузер и таблицу добавляется новая cookie с указанным именем и значением)

 Если добавляется cookie с именем уже существующей cookie, то ее значение в браузере и таблице должно быть обновлено

 7.3: На странице должно быть текстовое поле для фильтрации cookie
 В таблице должны быть только те cookie, в имени или значении которых, хотя бы частично, есть введенное значение
 Если в поле фильтра пусто, то должны выводиться все доступные cookie
 Если добавляемая cookie не соответсвует фильтру, то она должна быть добавлена только в браузер, но не в таблицу
 Если добавляется cookie, с именем уже существующей cookie и ее новое значение не соответствует фильтру,
 то ее значение должно быть обновлено в браузере, а из таблицы cookie должна быть удалена

 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 */

/*
 homeworkContainer - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то добавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */
const homeworkContainer = document.querySelector('#homework-container');
// текстовое поле для фильтрации cookie
const filterNameInput = homeworkContainer.querySelector('#filter-name-input');
// текстовое поле с именем cookie
const addNameInput = homeworkContainer.querySelector('#add-name-input');
// текстовое поле со значением cookie
const addValueInput = homeworkContainer.querySelector('#add-value-input');
// кнопка "добавить cookie"
const addButton = homeworkContainer.querySelector('#add-button');
// таблица со списком cookie
const listTable = homeworkContainer.querySelector('#list-table tbody');

document.cookie = 'test1=Hello';
document.cookie = 'test2=World';

const getAllCookie = strCookie => {
    try {
        if (!strCookie) {
            throw new Error('invalid str');  
        }

        let arrCookies = strCookie.split('; ');

        arrCookies = arrCookies.map(cookieItem => {
            let cookieItemArr = cookieItem.split('=');
            let cookieItemObj = {
                name: cookieItemArr[0],
                value: cookieItemArr[1]
            }

            return cookieItemObj;
        });

        return arrCookies;
    } catch (error) {
        return false;
    }

}

const addCookie = (name, value) => {
    document.cookie = `${name}=${value}`;
    allCookie = getAllCookie(document.cookie);
    renderTable(allCookie, listTable);
}

const deleteCookie = el => {
    const date = new Date();

    date.setTime(date.getTime() - 1000)

    // console.log(date);
    document.cookie = `${el.getAttribute('data-cookie-name')}=; expires=Thu, 01 Jan 1970 00:00:00 UTC`;
}

const addTableTr = (name, value) => {
    const tr = document.createElement('tr');
    const td = document.createElement('td');

    const tdName = td.cloneNode(false);
    const tdValue = td.cloneNode(false);

    const tdBtnDelete = td.cloneNode(false);
    const btnDelete = document.createElement('BUTTON');
    
    tdName.innerText = name;
    tdValue.innerText = value;
    btnDelete.innerText = 'Удалить';
    btnDelete.setAttribute('data-cookie-name', name);
    tdBtnDelete.append(btnDelete);

    tr.append(tdName, tdValue, tdBtnDelete);
    
    return tr;
}

const renderTable = (data, where, filterValue) => {
    try {
        const newWhere = document.createDocumentFragment();

        let filterData = String(filterValue) ? data.filter(item => isMatching(item.name, filterNameInput.value)) : null;
        
        const currentData = filterData || data;

        currentData.forEach(element => {
            let tr = addTableTr(element.name, element.value);

            newWhere.append(tr);
        });

        if (JSON.stringify(renderTable.data) === JSON.stringify(currentData)) {
            // eslint-disable-next-line no-undef
            throw new UnwantedRender('Data has not changed');
        }

        where.innerHTML = '';
        where.append(newWhere);
        renderTable.data = currentData;

        return true;
    } catch (error) {
        // console.log(error.message);
        return false;
    }
}

const isMatching = (full, chunk) => {
    return String(full).toLowerCase().indexOf(String(chunk).toLowerCase()) === -1 ? false : true;
};

let allCookie = getAllCookie(document.cookie);

renderTable(allCookie, listTable);

filterNameInput.addEventListener('keyup', () => {
    renderTable(allCookie, listTable, filterNameInput.value);
});

addButton.addEventListener('click', () => {
    if (addNameInput.value && addValueInput.value) {
        addCookie(addNameInput.value, addValueInput.value);
        addNameInput.value = '';
        addValueInput.value = '';
    }
});

listTable.addEventListener('click', event => {
    if (event.target.nodeName === 'BUTTON') {
        deleteCookie(event.target);
        event.target.parentElement.parentElement.remove();
    }
});