const addPlacemark = (coords, map) => {
    let placemark = new ymaps.Placemark(coords);

    map.geoObjects.add(placemark);
    geocoder(coords).then(data => console.log(data));
};

const geocoder = async coords => {
    const coordsStr = coords.reverse().join(',');
    const response = await fetch(`https://geocode-maps.yandex.ru/1.x/?apikey=963c3670-287a-487a-8c60-9f1d43c03028&format=json&kind=house&geocode=${coordsStr}`);
    const data = await response.json()
    return data.response.GeoObjectCollection.featureMember[0].GeoObject;
}



const init = () => {
    const map = new ymaps.Map('map', {
        center: [59.938892, 30.315221],
        zoom: 17,
    })

    map.events.add('click', e => {
        const currentCoords = e.get('coords');

        addPlacemark(currentCoords, map);
    });
}

ymaps.ready(init)
