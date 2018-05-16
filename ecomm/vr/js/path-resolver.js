var PathResolver = {

    getCombinationIds: function (data, avatarId, pose, settings, requestId) {
        if (typeof data === 'string') {
            return settings.host + '/plugin/get-animation/' + avatarId + '?combination_ids=' + data + '&animation_name=' + pose + '&request_id=' + requestId;
        } else {
            var result = [];

            data.forEach(function(e) {
                result.push(e.product) ;
            });

            return settings.host + '/plugin/get-animation/' + avatarId + '?combination_ids=' + result.join('_') + '&animation_name=' + pose + '&request_id=' + requestId;
        }
    },

    getProductTextures: function (data, settings) {
        var self = this;
        var result = [];

        if (typeof data === 'string') {
            // if we have two or more products to load
            if (data.indexOf('_') !== -1) {
                var r = data.split('_');
                for (var i in r) {
                    result.push(settings.host + '/plugin/product-texture/' + r[i] + '?_=' + self.getUnixTimeStamp());
                }
            } else {
                result.push(settings.host + '/plugin/product-texture/' + data + '?_=' + self.getUnixTimeStamp());
            }

        } else {
            data.forEach(function(item) {
                if (item.texture) {
                    result.push(item.texture);
                } else {
                    result.push(settings.host + '/plugin/product-texture/' + item.product + '?_=' + self.getUnixTimeStamp());
                }
            });
        }
        return result;
    },

    getUnixTimeStamp: function() {
        return new Date().getTime();
    },

    getRequestId: function () {
        return Math.random().toString(36).substring(7) + '_' + Math.random().toString(36).substring(7);
    },
    
    getAvatarUrl: function (avatarId, pose, settings) {
        var self = this;
        if (pose === 'v_pose') {
            pose = '';
        }

        return settings.host + '/plugin/avatar/data/' + avatarId + '?pose='+ pose +'&_=' + self.getUnixTimeStamp();
    },

    getLocation: function(href) {
        var l = document.createElement("a");
        l.href = href;
        return l;
    }
};