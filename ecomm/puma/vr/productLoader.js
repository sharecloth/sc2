var ProductLoader = (function(){

    var currentClothTypesLoaded = [];

    function _getProductsToLoad(size)
    {
        currentClothTypesLoaded[size.cloth_body_type] = size.ident;

        var result = [];

        for (var i = currentClothTypesLoaded.length - 1; i >= 0; i--) {
            if (currentClothTypesLoaded[i]) result.push('c-' + currentClothTypesLoaded[i]);
        }

        console.log('products to load ' + result.join('_'));

        return result.reverse().join('_');
    }


    return {
        getProductsToLoad: _getProductsToLoad
    }
})();

