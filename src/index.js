import { resolve } from "url";

const addNewPlacemark = (coords, address, clusterer) => {
    let placemark = new ymaps.Placemark(coords, {
        balloonContentHeader: address,
        balloonContentBody: 'body',
        balloonContentFooter: 'Подвал',
        hintContent: 'footer',
    });

    clusterer.add(placemark);
    
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
        
        const key = address.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()\s]/g,'');
        
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
    // placemarksStorage.getAll.forEach(element => {
    //     const { coords, placemarkInfo } = element;

    //     addNewPlacemark(coords, placemarkInfo, clusterer);
    // });

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

