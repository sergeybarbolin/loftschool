export const geocoder = coords => {
    const coordsStr = coords.slice().reverse().join(',');
    const url = `https://geocode-maps.yandex.ru/1.x/?apikey=963c3670-287a-487a-8c60-9f1d43c03028&format=json&results=1&geocode=${coordsStr}`;
    
    return fetch(url)
        .then(response => response.json())
        .then(response => response.response.GeoObjectCollection.featureMember[0].GeoObject.metaDataProperty.GeocoderMetaData.text)
}
