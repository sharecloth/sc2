"use strict";

function Gallery(scene, settings) {

    var galThis = this;
    var cloth = [];
    var sizes = [];
    var gallaryActiveItems = [];
    var currentPage = 1;
    var pageSize = 10;
    var pagesCount = 1;

    var galleryGroup = new THREE.Object3D();
    galleryGroup.position.set(0, 0.23, 0.6);
    galleryGroup.visible = false; 
    galleryGroup.isGalleryItem = true;
    scene.add(galleryGroup);

    var currentPageGroup = new THREE.Object3D();
    currentPageGroup.isGalleryItem = true;
    galleryGroup.add(currentPageGroup);

    var itemGeometry = new THREE.PlaneGeometry(0.7, 0.7, 1, 1);
    itemGeometry.translate(0, 0, 0.01);

    var textGeometry = new THREE.PlaneGeometry(0.65, 0.1, 1, 1);
    textGeometry.translate(0, 0, 0.02);


    var sizeBtnGeometry = new THREE.PlaneGeometry(0.15, 0.1, 1, 1);
    sizeBtnGeometry.translate(0, 0, 0.02);

    var buttonGeometry = new THREE.PlaneGeometry(0.2, 0.2, 1, 1);
    buttonGeometry.translate(0, 0, 0.01);

    var bgMaterial = new THREE.MeshBasicMaterial({
        transparent: false, opacity: 1, color: 0x0b0b0b, side: THREE.DoubleSide
    });
    var bgGeometry = new THREE.PlaneGeometry(4, 2, 1, 1);
    var bgMesh = new THREE.Mesh(bgGeometry, bgMaterial);
    bgMesh.isGalleryItem = true;
    galleryGroup.add(bgMesh);

    var buttonTop = new THREE.Mesh(buttonGeometry, new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(settings.images + "chevron-up.png") }));
    buttonTop.position.y = 0.875;
    buttonTop.page = "prev";
    buttonTop.isVrBtn = true;
    buttonTop.isGalleryItem = true;
    buttonTop.visible = false;
    galleryGroup.add(buttonTop);

    var buttonBottom = new THREE.Mesh(buttonGeometry, new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(settings.images + "chevron-down.png") }));
    buttonBottom.position.y = -0.875;
    buttonBottom.page = "next";
    buttonBottom.isVrBtn = true;
    buttonBottom.isGalleryItem = true;
    galleryGroup.add(buttonBottom);

    var textUnderline = function (context, text, x, y) {

        var textWidth = context.measureText(text).width;
        var startX;
        var startY = y + 1;
        var endX;
        var endY = startY;
        var underlineHeight = 3;
        if (underlineHeight < 1) {
            underlineHeight = 1;
        }

        context.beginPath();
   
            startX = x - (textWidth / 2);
            endX = x + (textWidth / 2);


        context.strokeStyle = 'red';
        context.lineWidth = underlineHeight;
        context.moveTo(startX, startY);
        context.lineTo(endX, endY);
        context.stroke();

    }

    var changeCanvas = function (text, alternative) {

        let canvas = document.createElement('canvas');
        canvas.width = 320;
        canvas.height = 64;
        let ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.shadowColor = "black";
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.shadowBlur = 3;
        ctx.font = '20pt Arial';
        if (alternative == 'red') {
            ctx.fillStyle = 'red';
        } else {
            ctx.fillStyle = 'white';
        }
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(text, canvas.width / 2, canvas.height / 2);
        if (alternative == 'underline') {
            textUnderline(ctx, text, canvas.width / 2, canvas.height / 2);

        } 

        return canvas;
    }


    var сanvasBtn = function (text) {

        let canvas = document.createElement('canvas');
        canvas.width = 150;
        canvas.height = 100;
        let ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#D6D6D6';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#444444';
        ctx.fillRect(2, 2, canvas.width - 4, canvas.height - 4);

        ctx.font = '36pt Arial';

        ctx.fillStyle = 'white';    
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(text, canvas.width / 2, canvas.height / 2);

        return canvas;
    }

    var clearPageContent = function () {

        gallaryActiveItems = [];
        gallaryActiveItems.push(buttonTop);
        gallaryActiveItems.push(buttonBottom);

        for (var i = currentPageGroup.children.length - 1; i >= 0; i--) {
            currentPageGroup.remove(currentPageGroup.children[i]);
        }

    };

    var renderPage = function (pageNumber) {

        clearPageContent();

        currentPage = pageNumber;
        buttonTop.visible = currentPage != 1;
        buttonBottom.visible = currentPage < pagesCount;

        for (var i = 0; i < 2; i++) {
            for (var j = 0; j < 5; j++) {

                var clItem = cloth[(pageNumber - 1) * pageSize + 5 * i + j];

                if (clItem) {

                    let itemGroup = new THREE.Object3D();
                    itemGroup.position.set(-1.56 + j * 0.39 * 2, 0.4 - i * 0.4 * 2, 0);

                    let itemMaterial = new THREE.MeshBasicMaterial({ side: THREE.FrontSide });
                    let itemMesh = new THREE.Mesh(itemGeometry, itemMaterial);
                    itemMesh.gData = clItem;
                    itemMesh.gData.sizeN = 0;
                    itemMesh.isVrBtn = true;
                    itemMesh.isGalleryItem = true;
                    itemGroup.add(itemMesh);
                    gallaryActiveItems.push(itemMesh);

                    let loader = new THREE.TextureLoader();
                    loader.setCrossOrigin('anonymous');
                    loader.load(clItem.images[0].path, function (texture) {

                        itemMaterial.map = texture;
                        itemMaterial.needsUpdate = true;

                    });

                    if (clItem.sizes) {

                        var sLength = clItem.sizes.length;

                        for (var z = 0; z < 3; z++) {

                            if (clItem.sizes[z]) {
                                let sizeTexture = new THREE.Texture(сanvasBtn(clItem.sizes[z].name));
                                let sizeMesh = new THREE.Mesh(sizeBtnGeometry, new THREE.MeshBasicMaterial({ map: sizeTexture, side: THREE.FrontSide }));
                                sizeMesh.position.y = - 0.23;
                                sizeMesh.position.x = (- 0.1 + z * 0.1) * (sLength - 1);

                                let tmp = Object.assign({}, clItem);
                                itemMesh.gData = tmp;

                                sizeMesh.gData = tmp;
                                itemMesh.gData.sizeN = z;
                                sizeMesh.isVrBtn = true;
                                sizeMesh.sizeBtn = true;
                                sizeMesh.isGalleryItem = true;
                                sizeTexture.needsUpdate = true;
                                itemGroup.add(sizeMesh);
                                gallaryActiveItems.push(sizeMesh);
                            }

                        }

                    }

                    //let nameTexture = new THREE.Texture(changeCanvas(clItem.name));
                    //let nameMesh = new THREE.Mesh(textGeometry, new THREE.MeshBasicMaterial({ map: nameTexture, side: THREE.FrontSide, transparent: true }));
                    //nameMesh.position.y = - 0.15;
                    //nameTexture.needsUpdate = true;
                    //itemGroup.add(nameMesh);

                    //let priceTexture = new THREE.Texture(changeCanvas(clItem.price, clItem.without_discount_price ? 'underline' : 'white'));
                    //let priceMesh = new THREE.Mesh(textGeometry, new THREE.MeshBasicMaterial({ map: priceTexture, side: THREE.FrontSide, transparent: true }));
                    //priceMesh.position.y = - 0.22;
                    //priceTexture.needsUpdate = true;
                    //itemGroup.add(priceMesh);

                    //if (clItem.without_discount_price) {


                    //    let wdPriceTexture = new THREE.Texture(changeCanvas(clItem.without_discount_price, 'red'));
                    //    let wdPriceMesh = new THREE.Mesh(textGeometry, new THREE.MeshBasicMaterial({ map: wdPriceTexture, side: THREE.FrontSide, transparent: true }));
                    //    wdPriceMesh.position.y = - 0.29;
                    //    wdPriceTexture.needsUpdate = true;
                    //    itemGroup.add(wdPriceMesh);

                    //}


                    currentPageGroup.add(itemGroup);

                }
            }
        }
    }

    $.ajax({
        type: "GET",
        url: settings.catalogApiEndpoint + "?_=" + PathResolver.getUnixTimeStamp(),
        dataType: "json",
        success: function (data) {
            cloth = data.cloth;
            sizes = data.sizes;
            pagesCount = Math.ceil(cloth.length / pageSize);
            renderPage(1);
            galThis.hide();
        },
        error: function () {
            console.error("Gallery. Error of getting data from server !");
        }
    });

    this.getGalleryGroupElements = function () {
        return gallaryActiveItems;
    };

    this.nextPage = function () {
        renderPage(currentPage + 1);
    };

    this.prevPage = function () {
        renderPage(currentPage - 1);
    };

    this.show = function () {
        galleryGroup.visible = true;
        gallaryActiveItems.forEach(function (item) {
            item.visible = true;
        });

        buttonTop.visible = currentPage != 1;
        buttonBottom.visible = currentPage < pagesCount;
    };

    this.hide = function () {
        galleryGroup.visible = false;        
        gallaryActiveItems.forEach(function (item) {
            item.visible = false;
        });
    };

    this.getSizes = function() {
        return sizes;
    };

    this.setOffset = function (offset) {
        galleryGroup.position.y = offset;
    };



}