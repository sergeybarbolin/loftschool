import { resolve } from 'url';

const deleteCharacters = str => str.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()\s]/g, '');

const addNewPlacemark = (coords, address, clusterer) => {
    let placemark = new ymaps.Placemark(coords, {
        balloonContentHeader: address,
        balloonContentBody: 'body',
        balloonContentFooter: 'Подвал',
        hintContent: 'footer',
    });

    clusterer.add(placemark);
    // console.log(clusterer);

    return true;
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
    add: function(coords, address) {
        
        const key = deleteCharacters(address);
        
        if (!this._placemarks[key]) {
            this._placemarks[key] = {};
            this._placemarks[key].address = address;
            this._placemarks[key].reviews = []
        }
        
        this._placemarks[key].reviews.push( { coords, review: 'отзыв' } );
        
        localStorage.setItem('placemarks', JSON.stringify(this._placemarks));
    },
    get getAll() {
        return this._placemarks;
    },
    forAll: function(fn) {
        const existingPlacemarks = this.getAll;

        // eslint-disable-next-line guard-for-in
        for (let item in existingPlacemarks) {
            
            const address = existingPlacemarks[item].address;

            existingPlacemarks[item].reviews.forEach(review => {
                fn(review.coords, address);
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

ymaps.ready(() => {
    const map = init();
    const clusterer = createClusterer();

    map.geoObjects.add(clusterer);

    placemarksStorage.forAll((coords, address) => {
        addNewPlacemark(coords, address, clusterer);
    });

    // console.log(clusterer);

    map.geoObjects.events.add('click', e => {
        const elementName = e.get('target').options._name;

        if (elementName === 'geoObject') {
            e.preventDefault();
        } else if (elementName === 'cluster') {
            console.log('sad');
        }
    });

    map.events.add('click', e => {
        const coords = e.get('coords');
        const myGeocoder = ymaps.geocode(coords, {
            results: 1,
            json: true
        });
        
        myGeocoder.then(function (res) {
            const address = res.GeoObjectCollection.featureMember[0].GeoObject.metaDataProperty.GeocoderMetaData.text;

            addNewPlacemark(coords, address, clusterer);
            placemarksStorage.add(coords, address);

        }, function (err) {
            // Обработка ошибки.
        });
    });

});

