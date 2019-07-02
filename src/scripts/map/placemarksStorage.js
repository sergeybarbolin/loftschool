import { deleteCharacters } from './../helpers.js';
import moment from 'moment';

export const placemarksStorage = {
    _placemarks: localStorage.getItem('placemarks') ? JSON.parse(localStorage.getItem('placemarks')) : {},
    add: function(coords, address, review) {
        
        const key = deleteCharacters(address);
        
        if (!this._placemarks[key]) {
            this._placemarks[key] = {};
            this._placemarks[key].address = address;
            this._placemarks[key].reviews = []
        }
        
        this._placemarks[key].reviews.push( { coords, review, date: moment().format('YYYY.MM.DD') + ' ' + moment().format('hh:mm:ss') } );
        
        localStorage.setItem('placemarks', JSON.stringify(this._placemarks));
    },
    get getAll() {
        return this._placemarks;
    },
    getItem: function(key) {
        return this._placemarks[key];
    },
    forAll: function(fn) {
        const existingPlacemarks = this.getAll;

        // eslint-disable-next-line guard-for-in
        for (let prop in existingPlacemarks) {
            
            const address = existingPlacemarks[prop].address;

            existingPlacemarks[prop].reviews.forEach(item => {
                fn(item.coords, address, item.review);
            })
        }
    }
}