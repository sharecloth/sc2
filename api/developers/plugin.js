$(function () {
    $('#plugin-load-data').on('click', function (e) {
        e.preventDefault();
        var plugin = new Plugin3d($('#plugin-3d'),
            {
                // сервер с DATA API
                'host': 'http://plugin-web.globedrobe.com/api',
                // путь к использующимся скриптом изображениям
                'images': 'http://plugin-web.globedrobe.com/3d-plugin-gl/0.5/images/',
                // размеры
                'width': 480,
                'height': 600,
                // вертикальный угол обзора камеры в градусах
                'fov': 45,
                // расстояния (в метрах) до плоскостей отсечения камеры
                // см. напр. https://msdn.microsoft.com/en-us/library/ms924585.aspx
                'near': 0.1,
                'far': 10,
                // цвет и прозрачность заднего фона
                'clearColor': 0xcccccc,
                'transparent': false,
                // длительность анимации шторок, мс
                'curtainsDelay': 1000,
                // разрешить дополнительные кнопки управления и зум
                'extendedCameraControls': true,
                // запретить изменение наклона камеры
                'disablePitch': false,
                // функция, вызывающаяся при ошибках инициализации
                'error': function (e) {
                    console.error(e);
                }
            });


// load scene
        plugin.loadScene(8);

// load dummy
        plugin.loadDummy(24);

//load product
        plugin.loadProducts('c-e5f2b05c-8720-47e1-9f65-6e29cd33b9df');

    });
});

