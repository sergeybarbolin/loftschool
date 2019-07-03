export const addNewPlacemark = (coords, address, review = {}, date) => {
    let placemark = new ymaps.Placemark(coords, {
        balloonContentHeader: address,
        balloonContentBody: `${review.firstName} ${review.secondName} :  ${review.review}`,
        balloonContentFooter: date,
        hintContent: address,
    });

    return placemark;
};