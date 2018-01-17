<?php include "../../_header.php"; ?>

<section class="api">
    <div class="row">
        <div class="col-md-3">
            <ul>
                <li><a href="/api/developers/index.php">Описание технологии</a></li>
                <li><a href="/api/developers/plugin.php">Web Viewer</a></li>
                <li><a href="/api/developers/data.php">DATA API</a></li>
            </ul>

        </div>
        <div class="col-md-6">
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
        </div>
    </div>
</section>

<?php include "../../_footer.php"; ?>
