import { placemarksStorage } from './../map/placemarksStorage.js';
import { deleteCharacters, formClear } from './../helpers.js';

export const renderReviews = (popup, address) => {
    const key = deleteCharacters(address);
    const dataItem = placemarksStorage.getItem(key);
    const reviews = dataItem ? dataItem.reviews : [];
    const reviewWrapper = popup.querySelector('.reviews');

    formClear('.form');
    reviewWrapper.innerHTML = '';

    reviews.forEach(item => {
        let reviewItem = document.createElement('p');
        let textReview = `Имя: ${item.review.firstName} Фамилия: ${item.review.secondName} Отзыв: ${item.review.review}`;
        
        reviewItem.innerText = textReview; 
        reviewWrapper.prepend(reviewItem);
    });
}