/* ДЗ 2 - работа с массивами и объектами */

/*
 Задание 1:

 Напишите аналог встроенного метода forEach для работы с массивами
 Посмотрите как работает forEach и повторите это поведение для массива, который будет передан в параметре array
 */
const forEach = (array, fn) => {
    for (let i = 0; i < array.length; i++) {
        fn(array[i], i, array);
    }
} 

/*
 Задание 2:

 Напишите аналог встроенного метода map для работы с массивами
 Посмотрите как работает map и повторите это поведение для массива, который будет передан в параметре array
 */
const map = (array, fn) => {
    let result = [];

    for (let i = 0; i < array.length; i++) {
        result.push(fn(array[i], i, array));
    }

    return result;
}

/*
 Задание 3:

 Напишите аналог встроенного метода reduce для работы с массивами
 Посмотрите как работает reduce и повторите это поведение для массива, который будет передан в параметре array
 */
const reduce = (array, fn, initial) => {

    let [accumulator, i] = initial ? [initial, 0] : [array[0], 1];

    for (i; i < array.length; i++) {
        accumulator = fn(accumulator, array[i], i, array);
    }

    return accumulator;
}

/*
 Задание 4:

 Функция должна перебрать все свойства объекта, преобразовать их имена в верхний регистр и вернуть в виде массива

 Пример:
   upperProps({ name: 'Сергей', lastName: 'Петров' }) вернет ['NAME', 'LASTNAME']
 */
const upperProps = obj => [...Object.keys(obj)].map((item) => item.toUpperCase()); 

// function upperProps(obj) {
//     let result = []

//     for (let item in obj) {
//         if ({}.hasOwnProperty.call(obj, item)) {
//             result.push(item.toUpperCase());
//         }        
//     }

//     return result;
// }

/*
 Задание 5 *:

 Напишите аналог встроенного метода slice для работы с массивами
 Посмотрите как работает slice и повторите это поведение для массива, который будет передан в параметре array
 */
const slice = (array, from = 0, to = array.length) => {
    let result = [];

    if (from <= array.length && to !== 0) {
        let newFrom = null;

        if (from >= 0) {
            newFrom = from;
        } else {
            newFrom = (from <= -array.length) ? 0 : array.length + from;
        }

        let newTo = null;

        if (to > 0 && to <= array.length) {
            newTo = to;
        } else {
            newTo = (to > array.length) ? array.length : array.length + to;
        }

        for (let i = newFrom; i < newTo; i++) {
            result.push(array[i]);
        }
    }

    return result;
}

/*
 Задание 6 *:

 Функция принимает объект и должна вернуть Proxy для этого объекта
 Proxy должен перехватывать все попытки записи значений свойств и возводить это значение в квадрат
 */
const createProxy = (obj) => {
    let proxy = new Proxy(obj, {
        set(target, prop, value) {
            target[prop] = value * value;
            
            return true;
        }
    })

    return proxy;
}

export {
    forEach,
    map,
    reduce,
    upperProps,
    slice,
    createProxy
};
