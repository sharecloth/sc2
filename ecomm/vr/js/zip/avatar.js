function Avatar () {

    var meshes = [];

    function loadMesh(avatarId){
        JSZipUtils.getBinaryContent('/plugin/get-user-avatar/' + avatarId, function(err, data) {
            if(err) {
                throw err; // or handle err
            }
            var zip = new JSZip(data);
            for (var fileName in zip.files) {
                if (fileName.match(/\.dae$/) === null) {
                    continue;
                }
                var daeStr = zip.file(fileName).asText();
                var parser = new DOMParser(),
                    daeDoc = parser.parseFromString(daeStr, "text/xml");

                var loader = new THREE.ColladaLoader();
//                loader.options.convertUpAxis = true;

                loader.parse(daeDoc, function(collada){
                    dae = collada.scene;

                    dae.traverse( function ( child ) {

                        if ( child instanceof THREE.SkinnedMesh ) {

                            var animation = new THREE.Animation( child, child.geometry.animation );
                            animation.play();

                        }

                    } );
                    dae.scale.x = dae.scale.y = dae.scale.z = 1;
                    dae.updateMatrix();
                    meshes[avatarId] = dae;
                    break;
                });
            }

        });
    }


    this.getMesh = function(avatarId, callback) {
        if (meshes[avatarId] == undefined) {
            loadMesh(avatarId);
        }

        return meshes[avatarId];
    }

    return this;
}
