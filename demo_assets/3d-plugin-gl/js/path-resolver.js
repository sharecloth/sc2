var pathResolver = {

    getScenePath: function(data, settings) {
        if (typeof data == 'string') {
            return settings.host + '/plugin/get-scene/' + data;
        } else {
            return data.url;
        }
    },

    getAvatatParamsPath: function(data, settings) {
        if (typeof data == 'string') {
            return settings.host + '/plugin/get-avatar-parameters/' + data;
        } else {
            return data.params;
        }
    },

    getAvatarDataPath: function(data, settings) {
        if (typeof data == 'string') {
            return settings.host + '/plugin/get-user-avatar/' + data;
        } else {
            return data.avatar;
        }
    },

    getAvatarTexturePath: function (data, settings) {
        if (typeof data == 'string') {
            return settings.host + '/plugin/avatar-texture/' + data;
        } else {
            return data.texture;
        }
    },


    getMesh: function(data, avatarId, settings) {
        if (typeof data == 'string') {
            return settings.host + '/plugin/get-animation/' + avatarId + '?combination_ids=' + data + '&animation_name=hands_down&version=3'
        } else {
            return data.mesh;
        }
    },

    // todo uncompleted method
    getMeshTextures: function (data, settings) {
        return data.texture;
    }
};