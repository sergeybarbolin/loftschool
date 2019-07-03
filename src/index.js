import { formHandler, deleteCharacters } from './scripts/helpers.js';

import { createMap, createClusterer } from './scripts/map/map.js';
import { addNewPlacemark } from './scripts/map/addNewPlacemark.js';
import { placemarksStorage } from './scripts/map/placemarksStorage.js';
import { geocoder } from './scripts/map/geocoder.js';

import { renderReviews } from './scripts/popup/renderReviews.js';
import { displayPopup } from './scripts/popup/displayPopup.js';

import moment from 'moment';

const init = () => {
    const map = createMap();
    const clusterer = createClusterer();
    const popup = document.querySelector('.popup');
    const mapWrapper = document.querySelector('#map');

    let coords = null;
    let address = null;

    map.geoObjects.add(clusterer);

    placemarksStorage.forAll((coords, address, review, date) => {
        const placemark = addNewPlacemark(coords, address, review, date);
        
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
            renderReviews(popup, address);
            displayPopup(popup, mapWrapper, position, map);

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
                renderReviews(popup, address);
                displayPopup(popup, mapWrapper, position, map);
            })
        
    });
    
    map.events.add('mousedown', () => {
        if (popup.classList.contains('popup--visible')) {
            popup.classList.remove('popup--visible');
        }
        return;
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

            clusterer.balloon.close();
            renderReviews(popup, e.target.innerText);
            displayPopup(popup, mapWrapper, position, map);
        }
        return;
    });

    popup.addEventListener('click', e => {
    
        if (e.target.getAttribute('name') === 'send') {
            const formData = formHandler('.form');
            const date = moment().format('DD.MM.YYYY') + ' ' + moment().format('h:mm a');
            const placemark = addNewPlacemark(coords, address, formData, date);

            clusterer.add(placemark);
            placemarksStorage.add(coords, address, formData, date);
            renderReviews(popup, address);
        }

        if (e.target.classList.contains('close')) {
            popup.classList.remove('popup--visible');
        }
        return;
        
    })
}

try {
    ymaps.ready(init);
} catch (e) {
    document.body.innerHTML = 'Что-то пошло не так..'
}