import { resolve } from "url";

const createPlacemark = (coords, geoObject) => {
    let placemark = new ymaps.Placemark(coords, {
        balloonContentHeader: geoObject.name,
        balloonContentBody: geoObject.description,
        balloonContentFooter: "Подвал",
        hintContent: "Хинт метки"
    });

    placemark.events.add('click', event => {
        event.preventDefault();
        console.log('etst');
    });
    
    // map.geoObjects.add(placemark);

    return placemark;
};

const placemarks = [];
// const geocoder = async coords => {
//     const coordsStr = coords.reverse().join(',');
//     const url = `https://geocode-maps.yandex.ru/1.x/?apikey=963c3670-287a-487a-8c60-9f1d43c03028&format=json&results=1&geocode=${coordsStr}`;
//     const response = await fetch(url);
//     const data = await response.json();
    
//     return data.response;
//     // return data.response.GeoObjectCollection.featureMember[0].GeoObject;
// }

// const geocoder = coords => {
//     const coordsStr = coords.reverse().join(',');
//     const url = `https://geocode-maps.yandex.ru/1.x/?apikey=963c3670-287a-487a-8c60-9f1d43c03028&format=json&results=1&geocode=${coordsStr}`;
    
//     return fetch(url).then(response => response.json()).then(response => response.response);
// }

// const oldPlacemarks = JSON.parse(localStorage.getItem('placemarks'));

// console.log(oldPlacemarks);

const init = () => {
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

    // oldPlacemarks.forEach(item => {
    //     const placemark = createPlacemark(item.item.coord, item.item);

    //     clusterer.add(placemark);
    //     map.geoObjects.add(clusterer);
    // });

    map.events.add('click', e => {
        const currentCoords = e.get('coords');

        const myGeocoder = ymaps.geocode(currentCoords, {
            results: 1,
            json: true
        });

        // const myGeocoder = geocoder(currentCoords);
        
        myGeocoder.then(function (res) {
            const obj = res.GeoObjectCollection.featureMember[0].GeoObject;
            const placemark = createPlacemark(currentCoords, obj);

            clusterer.add(placemark);
            map.geoObjects.add(clusterer);
            
            // const saveObj = {
            //     name: obj.name,
            //     description: obj.description,
            //     coord: currentCoords
            // }

            // placemarks.push({item: saveObj, reviews: []})
            // localStorage.setItem('placemarks', JSON.stringify(placemarks));
        }, function (err) {
            // Обработка ошибки.
        });
    });

}

ymaps.ready(init)
