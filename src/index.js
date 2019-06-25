import { resolve } from "url";

const addNewPlacemark = (coords, geoObject, clusterer) => {
    let placemark = new ymaps.Placemark(coords, {
        balloonContentHeader: geoObject.name,
        balloonContentBody: geoObject.description,
        balloonContentFooter: 'Подвал',
        hintContent: coords[0] + coords[1],
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
    add: function(coords, placemark) {
        const placemarkInfo = {
            name: placemark.name,
            description: placemark.description,
        }

        const key = (placemark.name + placemark.description).replace(/[.,\/#!$%\^&\*;:{}=\-_`~()\s]/g,"")
        
        this._placemarks[key] = this._placemarks[key] ? this._placemarks[key] : [];
        
        this._placemarks[key].push( { coords, placemarkInfo } );
        
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
            console.log(res);

            const responseData = res.GeoObjectCollection.featureMember[0].GeoObject;

            addNewPlacemark(coords, responseData, clusterer);
            placemarksStorage.add(coords, responseData);

        }, function (err) {
            // Обработка ошибки.
        });
    });

});

