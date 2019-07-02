export const addNewPlacemark = (coords, address, review = {}) => {
    let placemark = new ymaps.Placemark(coords, {
        balloonContentHeader: address,
        balloonContentBody: `Имя: ${review.firstName} Фамилия: ${review.secondName} Отзыв: ${review.review}`,
        balloonContentFooter: 'Подвал',
        hintContent: 'footer',
    });

    return placemark;
};