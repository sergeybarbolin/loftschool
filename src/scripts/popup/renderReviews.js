import { placemarksStorage } from './../map/placemarksStorage.js';
import { deleteCharacters, formClear } from './../helpers.js';

export const renderReviews = (popup, address) => {
    const key = deleteCharacters(address);
    const dataItem = placemarksStorage.getItem(key);
    const reviews = dataItem ? dataItem.reviews : [];

    const reviewWrapper = popup.querySelector('.reviews');
    const popupHeader = popup.querySelector('.address');

    popupHeader.innerText = address;

    formClear('.form');

    reviewWrapper.innerHTML = '';

    if (!reviews.length) {
        reviewWrapper.innerHTML = 'Отзывов пока нет...';
    }

    reviews.forEach(item => {
        let reviewItem = document.createElement('div');
        reviewItem.innerHTML = `
            <div class="review">
                <span class="review__user">${item.review.firstName} ${item.review.secondName}</span>
                <span class="review__date">${item.date}</span>
                <p class="review__text">${item.review.review}</p>
            </div>
        `
        
        reviewWrapper.prepend(reviewItem);
    });
}