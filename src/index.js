import { formHandler, deleteCharacters } from './scripts/helpers.js';

import { createMap, createClusterer } from './scripts/map/map.js';
import { addNewPlacemark } from './scripts/map/addNewPlacemark.js';
import { placemarksStorage } from './scripts/map/placemarksStorage.js';
import { geocoder } from './scripts/map/geocoder.js';

import { renderReviews } from './scripts/popup/renderReviews.js';
import { displayPopup } from './scripts/popup/displayPopup.js';

const init = () => {
    const map = createMap();
    const clusterer = createClusterer();
    const popup = document.querySelector('.popup');
    const mapWrapper = document.querySelector('#map');

    let coords = null;
    let address = null;

    map.geoObjects.add(clusterer);

    placemarksStorage.forAll((coords, address, review) => {
        const placemark = addNewPlacemark(coords, address, review);
        
        clusterer.add(placemark);
    });

    map.geoObjects.events.add('click', e => {
        const elementName = e.get('target').options._name;
        const position = {
            x: e.get('domEvent').get('pageX'),
            y: e.get('domEvent').get('pageY')
        }

        address = e.get('target').properties.get('balloonContentHeader');

        clusterer.balloon.close();

        if (elementName === 'geoObject') {
            e.preventDefault();
            coords = e.get('coords');
            displayPopup(popup, mapWrapper, position, map);
            renderReviews(popup, address);

        } else if (elementName === 'cluster') {
            popup.classList.remove('popup--visible');
        }
    });

    map.events.add('click', e => {
        const position = {
            x: e.get('domEvent').get('pageX'),
            y: e.get('domEvent').get('pageY')
        }

        coords = e.get('coords');

        clusterer.balloon.close();

        geocoder(coords)
            .then(response => {
                address = response;
                displayPopup(popup, mapWrapper, position, map);
                renderReviews(popup, address);
            })
            .catch(() => {
                throw new Error('Ошибка при получении данных...')
            })
        
    });

    mapWrapper.addEventListener('click', e => {
        e.preventDefault();

        if (e.target.nodeName === 'A') {
            const position = {
                x: e.clientX,
                y: e.clientY
            }
            const key = deleteCharacters(e.target.innerText);
            const dataItem = placemarksStorage.getItem(key);

            coords = dataItem.reviews[0].coords;
            address = e.target.innerText;

            console.log(coords, address);
            clusterer.balloon.close();
            displayPopup(popup, mapWrapper, position, map);
            renderReviews(popup, e.target.innerText);
        }
        
    });

    popup.addEventListener('click', e => {
        const formData = formHandler('.form');

        if (e.target.getAttribute('name') === 'send') {
            const placemark = addNewPlacemark(coords, address, formData);

            clusterer.add(placemark);
            placemarksStorage.add(coords, address, formData);
            renderReviews(popup, address);
        }
        
    })
}

try {
    ymaps.ready(init);
} catch (e) {
    document.body.innerHTML = 'Что-то пошло не так..'
}