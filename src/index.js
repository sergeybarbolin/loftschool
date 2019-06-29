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
    return new ymaps.Clusterer({
        clusterDisableClickZoom: true,
        clusterOpenBalloonOnClick: true,
        clusterBalloonContentLayout: 'cluster#balloonCarousel',
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

const geocoder = coords => {
    const coordsStr = coords.slice().reverse().join(',');
    const url = `https://geocode-maps.yandex.ru/1.x/?apikey=963c3670-287a-487a-8c60-9f1d43c03028&format=json&results=1&geocode=${coordsStr}`;
    
    return fetch(url)
        .then(response => response.json())
        .then(response => response.response.GeoObjectCollection.featureMember[0].GeoObject.metaDataProperty.GeocoderMetaData.text)
}

ymaps.ready(() => {
    const map = init();
    const mapWrapper = document.querySelector('#map');
    
    const clusterer = createClusterer();
    const popup = document.querySelector('.popup');
    let coords = null;
    let address = null;

    map.geoObjects.add(clusterer);

    placemarksStorage.forAll((coords, address, review) => {
        const placemark = addNewPlacemark(coords, address, review);
        
        clusterer.add(placemark);
    });

    map.geoObjects.events.add('click', e => {
        const elementName = e.get('target').options._name;

        if (elementName === 'geoObject') {
            e.preventDefault();
        } else if (elementName === 'cluster') {
            console.log('sad');
        }
    });

    map.events.add('click', e => {
        coords = e.get('coords');
        const position = {
            x: e.get('domEvent').get('pageX'),
            y: e.get('domEvent').get('pageY')
        }

        popup.style.left = (position.x > mapWrapper.offsetWidth / 2) ?
            popup.style.left = position.x - popup.offsetWidth - 5 + 'px' :
            popup.style.left = position.x + 5 + 'px';

        popup.style.top = (position.y > mapWrapper.offsetHeight / 2) ?
            popup.style.top = position.y - popup.offsetHeight - 5 + 'px' :
            popup.style.top = position.y + 5 + 'px';

        geocoder(coords).then(response => {
            address = response;

            const specificReviews = placemarksStorage.getAll[deleteCharacters(address)].reviews;

            // console.log(specificReviews[0].review.firstName);
            specificReviews.forEach(item => {
                let reviewWrapper = document.createElement('p');
                let textReview = `Имя: ${item.review.firstName} Фамилия: ${item.review.secondName} Отзыв: ${item.review.review}`
            
                reviewWrapper.innerText = textReview; 
                popup.prepend(reviewWrapper);
            })
            popup.style.display = 'block';
        });
        
    });

    popup.addEventListener('click', e => {
        const formData = formHandler('.form');

        if (e.target.getAttribute('name') === 'send') {
            const placemark = addNewPlacemark(coords, address, formData);

            clusterer.add(placemark);
            placemarksStorage.add(coords, address, formData);
        }
        
    })

});

