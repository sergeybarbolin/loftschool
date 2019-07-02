import { resolve } from 'url';

import { deleteCharacters, formHandler, formClear } from './scripts/helpers.js';

import { init } from './scripts/map/init.js';
import { clusterer } from './scripts/map/createClusterer.js';
import { addNewPlacemark } from './scripts/map/addNewPlacemark.js';
import { placemarksStorage } from './scripts/map/placemarksStorage.js';
import { geocoder } from './scripts/map/geocoder.js';


const renderReviews = (popup, address) => {
    const key = deleteCharacters(address);
    const dataItem = placemarksStorage.getItem(key);
    const reviews = dataItem ? dataItem.reviews : [];
    const reviewWrapper = popup.querySelector('.reviews');

    formClear('.form');
    reviewWrapper.innerHTML = '';

    reviews.forEach(item => {
        let reviewItem = document.createElement('p');
        let textReview = `Имя: ${item.review.firstName} Фамилия: ${item.review.secondName} Отзыв: ${item.review.review}`;
        
        reviewItem.innerText = textReview; 
        reviewWrapper.prepend(reviewItem);
    });
}

const displayPopup = (popup, mapWrapper, position, map) => {
    
    const positionCenter = map.getGlobalPixelCenter();

    const offsetTop = position.y + popup.offsetHeight - window.innerHeight;
    const offsetRight = position.x + popup.offsetWidth - window.innerWidth;
    let newPositionY = (offsetTop > 0) ? positionCenter[1] + 20 + offsetTop : positionCenter[1];
    let newPositionX = (offsetRight > 0) ? positionCenter[0] + 20 + offsetRight : positionCenter[0]

    console.log(position.y, offsetTop);
    popup.style.top = (offsetTop > 0) ? position.y - offsetTop - 25 + 'px' : position.y + 5 + 'px';
    popup.style.left = (offsetRight > 0) ? position.x - offsetRight - 25 + 'px' : position.x + 5 + 'px';

    map.setGlobalPixelCenter([newPositionX, newPositionY]);
    popup.classList.add('popup--visible');

    return true;
}

ymaps.ready(() => {
    const map = init();
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
        coords = e.get('coords');

        clusterer.balloon.close();

        if (elementName === 'geoObject') {
            e.preventDefault();

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

        geocoder(coords).then(response => {
            address = response;
            displayPopup(popup, mapWrapper, position, map);
            renderReviews(popup, address);
        });
        
    });

    const popup = document.querySelector('.popup');
    const mapWrapper = document.querySelector('#map');

    popup.addEventListener('click', e => {
        const formData = formHandler('.form');

        if (e.target.getAttribute('name') === 'send') {
            const placemark = addNewPlacemark(coords, address, formData);

            clusterer.add(placemark);
            placemarksStorage.add(coords, address, formData);
            renderReviews(popup, address);
        }
        
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

            // console.log(position);
            clusterer.balloon.close();
            displayPopup(popup, mapWrapper, position, map);
            renderReviews(popup, e.target.innerText);
        }
        
    });

});

