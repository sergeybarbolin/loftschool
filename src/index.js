import { resolve } from "url";

const addNewPlacemark = (coords, geoObject, map, clusterer) => {
    let placemark = new ymaps.Placemark(coords, {
        balloonContentHeader: geoObject.name,
        balloonContentBody: geoObject.description,
        balloonContentFooter: 'Подвал',
        hintContent: 'Хинт метки'
    });

    placemark.events.add('click', event => {
        event.preventDefault();
    });
    
    clusterer.add(placemark);
    map.geoObjects.add(clusterer);

    return true;
};

// const geocoder = coords => {
//     const coordsStr = coords.reverse().join(',');
//     const url = `https://geocode-maps.yandex.ru/1.x/?apikey=963c3670-287a-487a-8c60-9f1d43c03028&format=json&results=1&geocode=${coordsStr}`;
    
//     return fetch(url).then(response => response.json()).then(response => response.response);
// }

const saveInLocalStorage = (key, arr) => {
    localStorage.setItem(key, JSON.stringify(arr));
}

const init = existingPlacemarks => {
    const map = new ymaps.Map('map', {
        center: [59.938892, 30.315221],
        zoom: 15,
    })

    const clusterer = new ymaps.Clusterer({
        clusterDisableClickZoom: true,
        clusterOpenBalloonOnClick: true,
        clusterBalloonContentLayout: 'cluster#balloonCarousel',
        clusterBalloonPanelMaxMapArea: 0,
        clusterBalloonContentLayoutWidth: 200,
        clusterBalloonContentLayoutHeight: 130,
        clusterBalloonPagerSize: 100,
    });

    if (existingPlacemarks.length) {
        
        existingPlacemarks.forEach(element => {
            let { coords, placemarkInfo } = element;

            addNewPlacemark(coords, placemarkInfo, map, clusterer); 
        });
    } 

    map.events.add('click', e => {
        const currentCoords = e.get('coords');

        const myGeocoder = ymaps.geocode(currentCoords, {
            results: 1,
            json: true
        });

        // const myGeocoder = geocoder(currentCoords);
        
        myGeocoder.then(function (res) {
            console.log(res);
            const responseData = res.GeoObjectCollection.featureMember[0].GeoObject;

            const placemarkInfo = {
                name: responseData.name,
                description: responseData.description,
            }
            
            addNewPlacemark(currentCoords, placemarkInfo, map, clusterer);
            existingPlacemarks.push({ coords: currentCoords, placemarkInfo: placemarkInfo });

            saveInLocalStorage('placemarks', existingPlacemarks);

        }, function (err) {
            // Обработка ошибки.
        });
    });

}

ymaps.ready(() => {
    const oldPlacemarks = localStorage.getItem('placemarks') ? JSON.parse(localStorage.getItem('placemarks')) : [];

    init(oldPlacemarks);
});

