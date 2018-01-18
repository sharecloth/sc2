<?php include "../../_header.php"; ?>

<section class="api">
    <div class="row">
        <div class="col-md-2">
            <div class="api-menu">
                <ul>
                    <li><a href="/api/developers/index.php">Описание технологии</a></li>
                    <li><a href="/api/developers/plugin.php">Web Viewer</a></li>
                    <li class="active"><a href="/api/developers/data.php">DATA API</a></li>
                </ul>
            </div>
        </div>
        <div class="col-md-10">
            <h1 class="mb20">DATA API</h1>
            <p>В нашей технологии фигурируют две основные сущности - аватары и одежда.</p>
            <p>За создание, хранение и модицикацию аватаров отвечает <strong>Plugin API</strong>, за создание
                одежды - <strong>Sharecloth API</strong></p>

            <h2>Sharecloth API</h2>
            <p>Для создания лекал одежды мы предлагаем использовать наш редактор <strong>Sharecloth Editor</strong>.
            Редактор поможет вам создать 3D образцы одежды из плоского цифрового рисунка на вашем компьютере.</p>

            <p>Все проекты пользователи могут загрузить в облако, откуда по <strong>Sharecloth API</strong> можно
            будет использовать созданные проекты в своих веб решениях с помощью <a href="plugin.php">Web Viewer</a></p>

            <p>Для получения редактора необходимо зарегистрироваться на сайте <a href="http://app.sharecloth.com" target="_blank">app.sharecloth.com</a>, после чего
            <a href="http://app.sharecloth.com/en/profile/editor" target="_blank">скачать редактор</a>.</p>

            <p>Для доступа к API вам потребуется ключ, посмотреть который можно в <a href="http://app.sharecloth.com/en/account/api-page">личном кабинете</a> на app.sharecloth.com</p>

            <p>На данный момент клиент и описание методов доступно на github.</p>

            <p><a target="_blank" href="https://github.com/sharecloth/ShareCloth-API" class="btn btn-primary">Sharecloth API PHP Client</a>
                <a target="_blank" href="https://github.com/sharecloth/ShareCloth-API/blob/master/API.md" class="btn btn-primary">Документация по API</a></p>

            <h2>Plugin API</h2>

            <p>Позволяет генерировать аватары, работать с кешем сшивок, производить отложенные просчеты большого количества сшивок.</p>

            <p>Для доступа к API так же требуется ключ, получить который можно воспользовавшись <a href="/contacts/">формой обратной связи</a> на нашем сайте.</p>

            <p>Доступ к раздичным API методам разграничивается правами, поэтому, получив ключ, мы можете иметь досуп только к части методов</p>


            <p>На данный момент клиент и описание методов доступно на github.</p>
            <p><a target="_blank" href="https://github.com/sharecloth/plugin-api-client" class="btn btn-primary">Plugin API PHP Client</a>
                <a target="_blank" href="https://github.com/sharecloth/plugin-api-client/blob/master/API.md" class="btn btn-primary">Документация по API</a></p>

            <div class="mb50"></div>
        </div>
    </div>
</section>

<?php include "../../_footer.php"; ?>
