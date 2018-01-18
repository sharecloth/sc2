<?php include "../../_header.php"; ?>

<section class="api">
    <div class="row">
        <div class="col-md-2">
            <div class="api-menu">
                <ul>
                    <li class="active"><a href="/api/developers/index.php">Описание технологии</a></li>
                    <li><a href="/api/developers/plugin.php">Web Viewer</a></li>
                    <li><a href="/api/developers/data.php">DATA API</a></li>
                </ul>
            </div>
        </div>
        <div class="col-md-10">
            <h1 class="mb20">Описание технологий ShareCloth</h1>
            <p class="lead">Мы предлагаем следующие инструменты интеграции технологии Sharecloth, включая генерацию манекенов
                и сшивку одежды.</p>

            <div class="row">
                <div class="col-md-5 col-md-offset-0">
                    <h3 class="text-center">Web Viewer</h3>
                    <p class="lead text-center">
                        Javascript библиотека, позволяющая отображать аватары, а так же результаты сшивки.
                    </p>
                    <div class="buttons-container aos-init" data-aos="fade-up">
                        <div class="row">
                            <div class="col-md-12 col-xs-12 col-sm-6 col-md-offset-0 text-center">
                                <p class="mt20"><a href="plugin.php" class="btn btn-success btn-round btn-main btn-lg">Подробнее</a></p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-5 col-md-offset-1">
                    <h3 class="text-center">DATA API</h3>
                    <p class="lead text-center">
                        Позволяет генерировать аватары, создавать одежду, производит сшивку, а так же предоставляет доступ до метрик и других характеристик
                        сшивки.
                    </p>
                    <div class="buttons-container aos-init" data-aos="fade-up">
                        <div class="row">
                            <div class="col-md-12 col-xs-12 col-sm-6 col-md-offset-0 text-center">
                                <p class="mt20"><a href="data.php" class="btn btn-success btn-round btn-main btn-lg">подробнее</a></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<?php include "../../_footer.php"; ?>
