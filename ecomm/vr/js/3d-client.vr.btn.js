"use strict";

function Plugin3dVRButtons(options, camera, dummyContainer, plugin, gallery) {

    var raycaster = new THREE.Raycaster();
    var mouse = new THREE.Vector2(0, 0);
    var cursorClock = new THREE.Clock(false);
    var cursorTimeout = 1;
    var touchActive = false;
    var group;
    var crosshairCircleThetaLength = Math.PI;
    var crosshairCirclethetaStart = Math.PI / 2;
    var crosshairCircleColor = 0xffff00;
    var lock = true;
    var externalLock = false;

    var crosshair = new THREE.Mesh(
        new THREE.RingGeometry(0.02, 0.035, 32),
        new THREE.MeshBasicMaterial({
            color: 0xffffff,
            opacity: 0.5,
            transparent: true,
            depthTest: false
        })
    );
    crosshair.position.z = -1.4;
    crosshair.visible = false; // SHOW VR ON DESKTOP
    camera.add(crosshair);

    var crosshairCircle = new THREE.Mesh(
        new THREE.CircleGeometry(0.035, 32, crosshairCirclethetaStart, crosshairCircleThetaLength),
        new THREE.MeshBasicMaterial({color: crosshairCircleColor, side: THREE.DoubleSide })
        );
    crosshairCircle.position.z = -1.4;
    crosshairCircle.rotation.y = Math.PI;
    crosshairCircle.visible = false; // SHOW VR ON DESKTOP
    camera.add(crosshairCircle);

    var rotationOptions = $.extend({
        rightAngle: {
            min: -0.75, //минимальный правый угол (radians)
            max: -0.25  //максимальный правый угол (radians)
        },
        leftAngle: {
            min: 0.25,  //минимальный левый угол (radians)
            max: 0.75   //максимальный левый угол (radians)
        },
        rotationTimeout: 1000,  //задержка перед вращением (mc)
        rotationMaxSpeed: 0.05, //максимальная скорость (radians)
        rotationAcceleration: 0.0005 //ускорение  (radians)
    }, options);

    var buttons = [
        {
            name: "btnDown.robemesh",
            position: new THREE.Vector3(0, -0.7, 0.3),
            rotation: { x: -15 },
            hidden: true
        },
        {
            name: "btnLeft.robemesh",
            position: new THREE.Vector3(-1.35, 0.1, 0.3),
            rotation: { y: 25 },
            hidden: true
        },
        {
            name: "btnRight.robemesh",
            position: new THREE.Vector3(1.35, 0.1, 0.3),
            rotation: { y: -25 },
            hidden: true
        },
        {
            name: "btnSeams.robemesh",
            position: new THREE.Vector3(0.45, 0.5, 0.4),
            isStatic: true
        },
        {
            name: "btnStressMap.robemesh",
            position: new THREE.Vector3(-0.45, 0.5, 0.4),
            isStatic: true
        },
        {
            name: "btnUp.robemesh",
            position: new THREE.Vector3(0, 1, 0.3),
            rotation: { x: 15 },
            hidden: true
        },
        {
            name: "btnZoomIn.robemesh",
            position: new THREE.Vector3(1, 0.22, 0.3),
            rotation: { y: -15 },
            hidden: true
        },
        {
            name: "btnZoomOut.robemesh",
            position: new THREE.Vector3(1, -0.02, 0.3),
            rotation: { y: -15 },
            hidden: true
        },
        {
            name: "btnCatalogue.robemesh",
            position: new THREE.Vector3(0, 1.7, 0),
            rotation: { x: 100 }
        }
    ];

    var btnSeams, btnStressMap, intrObj;
    var updateGroup = function (group) {

        if (gallery)
            var galleryGroup = gallery.getGalleryGroupElements();

        if (!group && !galleryGroup) return;

        raycaster.setFromCamera(mouse, camera);

        var intersects = raycaster.intersectObjects(group);

        if (gallery) {
            var intersectsGallery = raycaster.intersectObjects(galleryGroup);
            intersects = intersects.concat(intersectsGallery);
        }


        if (intersects.length > 0 && intersects[0].object.isVrBtn && (!intrObj || intersects[0].object.uuid == intrObj.uuid)) {

            intrObj = intersects[0].object;

            if (!cursorClock.running) {
                cursorClock.start();
            }

            if (!lock && !externalLock) {

                crosshairCircle.visible = true;
                if (cursorClock.getElapsedTime() > cursorTimeout) {

                    if (gallery && intrObj.isGalleryItem) {

                        if (intrObj.page) {
                            if (intrObj.page == "prev") {
                                gallery.prevPage(); 
                            }
                            if (intrObj.page == "next") {
                                gallery.nextPage();
                            }
                        } else if (intrObj.gData && intrObj.gData.sizes[0]) {

                            plugin.container.dispatchEvent(new CustomEvent('onVRButtonClick', {
                                detail: {
                                    'buttonName': 'galleryItem',
                                    'currentAvatarId': gallery.getSizes()[intrObj.gData.sizes[intrObj.gData.sizeN].size_id].avatar_ident,
                                    'currentProductId': intrObj.gData.sizes[intrObj.gData.sizeN].ident,
                                    'currentProductName': intrObj.gData.sizes[intrObj.gData.sizeN].name,
                                    'currentClothBodyType': intrObj.gData.cloth_body_type,
                                }

                            }));
                            gallery.hide();
                            plugin.hideStaticButtons();
                            externalLock = true;
                        }

                    } else {

                        if (intrObj.name.indexOf("btnSeams.robemesh") > -1) {
                            btnSeams = intrObj;
                            btnSeams.isActive = !btnSeams.isActive;
                            plugin.edgesHighlightMode(btnSeams.isActive);
                            if (btnSeams.isActive && btnStressMap)
                                btnStressMap.isActive = false
                        } else if (intrObj.name.indexOf("btnStressMap.robemesh") > -1) {
                            btnStressMap = intrObj;
                            btnStressMap.isActive = !btnStressMap.isActive;
                            plugin.stretchMode(btnStressMap.isActive);
                            if (btnStressMap.isActive && btnSeams)
                                btnSeams.isActive = false
                        } else if (intrObj.name.indexOf("btnRight.robemesh") > -1) {
                            plugin.container.dispatchEvent(new CustomEvent('onVRButtonClick', { detail: { 'buttonName': 'right', 'currentAvatarId': plugin.avatarId, 'currentProductId': plugin.productIds } }));
                        } else if (intrObj.name.indexOf("btnLeft.robemesh") > -1) {
                            plugin.container.dispatchEvent(new CustomEvent('onVRButtonClick', { detail: { 'buttonName': 'left', 'currentAvatarId': plugin.avatarId, 'currentProductId': plugin.productIds } }));
                        } else if (intrObj.name.indexOf("btnCatalogue.robemesh") > -1 && gallery) {
                            gallery.show();
                        }
              
                    }


                    cursorClock = new THREE.Clock(false);
                    lock = true;
                    crosshairCircle.visible = false;

                } else {

                    crosshairCircleThetaLength = 2 * Math.PI / cursorTimeout * cursorClock.getElapsedTime();
                    crosshairCircle.geometry = new THREE.CircleGeometry(0.035, 32, crosshairCirclethetaStart, crosshairCircleThetaLength);
                    crosshairCircle.geometry.verticesNeedUpdate = true;

                }

                if (intrObj.material.emissive) {
                    intrObj.currentHex = intrObj.material.emissive.getHex();
                    intrObj.material.emissive.setHex(0x1e1e1e);
                }

                if (intrObj.isGalleryItem)

                    if (intrObj.sizeBtn){
                        intrObj.scale.set(1.3, 1.3, 1);
                    } else {
                        intrObj.scale.set(1.05, 1.05, 1);
                    }
                    
                else
                    intrObj.scale.set(1.2, 1.2, 1.2);
                intrObj.isHover = true;
    
            }

        } else {

            if (group) {
                for (var i = 0; i < group.length; i++) {
                    if (!group[i].isActive) {
                        group[i].material.emissive.setHex(0);
                        group[i].scale.set(1, 1, 1);
                    }
                    group[i].isHover = false;
                }
            }


            if (galleryGroup) {
                for (var i = 0; i < galleryGroup.length; i++) {
                    galleryGroup[i].scale.set(1, 1, 1);
                    galleryGroup[i].isHover = false;
                }
            }

            cursorClock = new THREE.Clock(false);
            crosshairCircle.visible = false; 
            crosshairCircleThetaLength = 0;
            lock = false;
            intrObj = null;

        }


    };

    var rotationTimeout = null;
    var rotationIsRunning = false;
    var rotationSpeed = 0;
    var processIncline = function () {
        var inclineAngle = camera.rotation.z;

        if (rotationOptions.rightAngle.min < inclineAngle &&
            inclineAngle < rotationOptions.rightAngle.max) {



            if (rotationIsRunning) {
                dummyContainer.rotation.y += rotationSpeed;
                if (Math.abs(rotationSpeed) < rotationOptions.rotationMaxSpeed)
                    rotationSpeed += rotationOptions.rotationAcceleration;
            } else {
                if (!rotationTimeout)
                    rotationTimeout = setTimeout(function () {
                        rotationIsRunning = true;
                        rotationTimeout = null;
                    }, rotationOptions.rotationTimeout);
            }

        } else if (rotationOptions.leftAngle.min < inclineAngle &&
            inclineAngle < rotationOptions.leftAngle.max) {

            if (rotationIsRunning) {
                dummyContainer.rotation.y += rotationSpeed;
                if (Math.abs(rotationSpeed) < rotationOptions.rotationMaxSpeed)
                    rotationSpeed -= rotationOptions.rotationAcceleration;
            } else {
                if (!rotationTimeout)
                    rotationTimeout = setTimeout(function () {
                        rotationIsRunning = true;
                        rotationTimeout = null;
                    }, rotationOptions.rotationTimeout);
            }

        } else {
            rotationSpeed = 0;
            rotationIsRunning = false;
        }
    }

    this.getButton = function (name) {
        for (var i = 0; i < buttons.length; i++) {
            if (buttons[i].name === name) {
                return buttons[i];
            }
        }
        return null;
    };

    this.setGroup = function (gr) {
        group = gr;
    };

    this.showHideCrosshair = function (state) {
        crosshair.visible = state;
    };

    this.update = function () {
        processIncline();
        updateGroup(group);
    };

    this.unlock = function () {
        externalLock = false;
    }

}