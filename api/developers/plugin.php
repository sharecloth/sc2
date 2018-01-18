<?php
$additionalCss = [
    'http://plugin-web.globedrobe.com/3d-plugin-gl/0.5/plugin.css'
];
?>
<?php include "../../_header.php"; ?>

<section class="api">
    <div class="row">
        <div class="col-md-2">
            <div class="api-menu">
                <ul>
                    <li><a href="/api/developers/index.php">Описание технологии</a></li>
                    <li class="active"><a href="/api/developers/plugin.php">Web Viewer</a></li>
                    <li><a href="/api/developers/data.php">DATA API</a></li>
                </ul>
            </div>
        </div>
        <div class="col-md-10">
            <h1 class="mb20">Web Viewer</h1>
            <p>Позволяет вам создавать веб приложения для просмотра аватаров, а так же отображения
                результатов сшивки.</p>

            <h3>Для начала работы</h3>
            <p>Для использования Web viewer api, следуйте следующими шагами:</p>
            <ol>
                <li>Подключите библиотеку на вашу html страницу</li>
                <li>Инициализируйте плагин</li>
                <li>Загрузите сцену</li>
                <li>Загрузите аватар</li>
                <li>Сшейте вещь</li>
            </ol>

            <p>Ниже представлен готовый пример:</p>
            <pre>
                <code>
<?php echo htmlspecialchars(file_get_contents('plugin.html')); ?>
                </code>
            </pre>

            <p><a href="plugin.html" target="_blank">Открыть пример в отдельном окне</a></p>

            <h3>Документация</h3>
            <h4>Опции запуска</h4>

            <pre>
                <code>
<?php echo htmlspecialchars(file_get_contents('plugin-options.html')); ?>
                </code>
            </pre>

            <h4>Список методов</h4>
            <p><strong>plugin.loadScene(sceneid)</strong> - загрузить сцену. Список доступных сцен:</p>
            <ul>
                <li>8 - стандартная сервая сцена</li>
                <li>13 - стандартная белая сцена</li>
            </ul>

            <p><strong>plugin.loadDummy(avatarId)</strong> - загрузить аватар. ID аватара можно получить, используя наш <a href="data.php">DATA API</a> </p>
            <p><strong>plugin.loadProducts(productId)</strong> - загрузить результаты сшивки. productId - это идендификатор вещи, созданной в нашем редакторе ShareClothEditor.</p>

            <h4>Демо</h4>
            <div id="plugin-3d" style="width: 480px; height: 600px; background: #c8c9cc; margin-bottom: 10px;"></div>
            <p><a href="#" id="plugin-load-data" class="btn btn-primary">Загрузить данные</a></p>

            <hr/>
            <h1>Использование спрайтов</h1>
            <p>Наша технология позволяет на выходе сшивки получать не только 3D объекты, но и простые спрайты.</p>
            <p>Ниже приведен пример кода, обрабатывающий готовый спрайт с помощью jQuery плагина <a
                        href="http://spritespin.ginie.eu" target="_blank">SpriteSpin</a>:</p>

            <pre>
                <code>
<?php echo htmlspecialchars(file_get_contents('sprite.html')); ?>
                </code>
            </pre>

            <p>В итоге получается результат, представленный ниже.</p>

            <div id="sprite">
            </div>

            <div class="mb50"></div>


        </div>
    </div>
</section>

<?php
$additionalScripts = [
    '../../plugins/spritespin.js',
    'sprite.js',
    'http://plugin-web.globedrobe.com/3d-plugin-gl/0.5/js/3d-client.min.js',
    'plugin.js',
];
?>

<?php include "../../_footer.php"; ?>
