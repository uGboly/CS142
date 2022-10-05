"use strict";

function cs142MakeMultiFilter(originalArray) {
    let currentArray = originalArray.slice();

    function arrayFilterer(filterCriteria, callback) {
        if (filterCriteria instanceof Function) {
            currentArray = currentArray.filter(filterCriteria);
        } else {
            return currentArray;
        }

        if (callback instanceof Function) {
            callback.call(originalArray, currentArray);
        }

        return arrayFilterer;
    }

    return arrayFilterer;
}