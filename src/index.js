import { resolve } from 'url';

const deleteCharacters = str => str.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()\s]/g, '');

const addNewPlacemark = (coords, address, review = {}) => {
    let placemark = new ymaps.Placemark(coords, {
        balloonContentHeader: address,
        balloonContentBody: `Имя: ${review.firstName} Фамилия: ${review.secondName} Отзыв: ${review.review}`,
        balloonContentFooter: 'Подвал',
        hintContent: 'footer',
    });

    return placemark;
};

const createClusterer = () => {
    const customClusterBalloonContent = ymaps.templateLayoutFactory.createClass(
        `
            <div class="balloon">
                <a href="#">{{ properties.balloonContentHeader|raw }}</a>
                <div class="balloon__body">{{ properties.balloonContentBody|raw }}</div>
                <div class="balloon__footer">{{ properties.balloonContentFooter|raw }}</div>
            </div>
        `
    );

    return new ymaps.Clusterer({
        clusterDisableClickZoom: true,
        clusterOpenBalloonOnClick: true,
        clusterBalloonContentLayout: 'cluster#balloonCarousel',
        clusterBalloonItemContentLayout: customClusterBalloonContent,
        clusterBalloonPanelMaxMapArea: 0,
        clusterBalloonContentLayoutWidth: 200,
        clusterBalloonContentLayoutHeight: 130,
        clusterBalloonPagerSize: 100,
    });
}

const placemarksStorage = {
    _placemarks: localStorage.getItem('placemarks') ? JSON.parse(localStorage.getItem('placemarks')) : {},
    add: function(coords, address, review) {
        
        const key = deleteCharacters(address);
        
        if (!this._placemarks[key]) {
            this._placemarks[key] = {};
            this._placemarks[key].address = address;
            this._placemarks[key].reviews = []
        }
        
        this._placemarks[key].reviews.push( { coords, review } );
        
        localStorage.setItem('placemarks', JSON.stringify(this._placemarks));
    },
    get getAll() {
        return this._placemarks;
    },
    getItem: function(key) {
        return this._placemarks[key];
    },
    forAll: function(fn) {
        const existingPlacemarks = this.getAll;

        // eslint-disable-next-line guard-for-in
        for (let prop in existingPlacemarks) {
            
            const address = existingPlacemarks[prop].address;

            existingPlacemarks[prop].reviews.forEach(item => {
                fn(item.coords, address, item.review);
            })
        }
    }
}

const init = () => {
    const map = new ymaps.Map('map', {
        center: [59.938892, 30.315221],
        zoom: 15,
    })

    return map;
}

const formHandler = formIdentifier => {
    const form = document.querySelector(formIdentifier);
    const data = {};

    for (const el of form.children) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            data[el.getAttribute('name')] = el.value
        } 
    }
    
    return data;
}

const formClear = formIdentifier => {
    const form = document.querySelector(formIdentifier);

    for (const el of form.children) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            el.value = '';
        } 
    }
}

const geocoder = coords => {
    const coordsStr = coords.slice().reverse().join(',');
    const url = `https://geocode-maps.yandex.ru/1.x/?apikey=963c3670-287a-487a-8c60-9f1d43c03028&format=json&results=1&geocode=${coordsStr}`;
    
    return fetch(url)
        .then(response => response.json())
        .then(response => response.response.GeoObjectCollection.featureMember[0].GeoObject.metaDataProperty.GeocoderMetaData.text)
}

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

    popup.style.left = position.x - popup.offsetWidth - 5 + 'px'
    popup.style.top = position.y - popup.offsetHeight - 5 + 'px';
    map.setGlobalPixelCenter([positionCenter[0], positionCenter[1] - popup.offsetHeight + 5]);

    // if (position.x > mapWrapper.offsetWidth / 2) {
    //     popup.style.left = position.x - popup.offsetWidth - 5 + 'px'
    //     // map.setGlobalPixelCenter([positionCenter[0] + popup.offsetWidth + 5, positionCenter[1]]);
    // } else {
    //     popup.style.left = position.x + 5 + 'px';
    //     // map.setGlobalPixelCenter([positionCenter[0] - popup.offsetWidth - 5, positionCenter[1]]);
    // }

    // if (position.y > mapWrapper.offsetHeight / 2) {
    //     popup.style.top = position.y - popup.offsetHeight - 5 + 'px';
    //     map.setGlobalPixelCenter([positionCenter[0] - popup.offsetWidth - 5, positionCenter[1] + popup.offsetHeight + 5]);
    // } else {
    //     popup.style.top = position.y + 5 + 'px';
    //     map.setGlobalPixelCenter([positionCenter[0], positionCenter[1] - popup.offsetHeight - 5]);
    // }

    popup.classList.add('popup--visible');



    return true;
}

ymaps.ready(() => {
    const map = init();
    const clusterer = createClusterer();
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

            // console.log(position);
            clusterer.balloon.close();
            displayPopup(popup, mapWrapper, position, map);
            renderReviews(popup, e.target.innerText);
        }
        
    });

});

