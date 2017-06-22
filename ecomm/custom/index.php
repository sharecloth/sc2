<?php

require "ImageProvider.php";
require "functions.php";
$provider = new ImageProvider();

?>

<?php
$additionalCss = [
    '/demo_assets/3d-plugin-gl/plugin.css',
    '/demo_assets/css/style.css',
];
?>

<?php include "../../_header.php"; ?>

    <div class="section-header">
        <div class="container">
            <div class="row">
                <div class="col-md-12">
                    <h2>
                        ShareCloth allows custom brands to demonstrate styles on the fly<br>
                    </h2>
                </div>
            </div>
        </div>
    </div>

    <section class="ecomm-custom-wrap">
        <div class="container">
            <div class="row">
                <div class="col-md-5">
                    <div class="ecomm-custom-plugin">
                        <div class="ecomm-custom-plugin-placeholder"></div>
                    </div>
                </div>
                <div class="col-md-7">
                    <div>
                        <!-- Nav tabs -->
                        <ul class="nav nav-tabs ecomm-custom-tabs" role="tablist">
                            <li>
                                <div class="">Change <span class="glyphicon glyphicon-arrow-right"></span></div>
                            </li>
                            <li role="presentation" class="active"><a href="#print" aria-controls="home" role="tab"
                                                                      data-toggle="tab">Print</a></li>
                            <li role="presentation"><a href="#color" aria-controls="profile" role="tab"
                                                       data-toggle="tab">Color</a>
                            </li>
                            <li role="presentation"><a href="#fabric" aria-controls="messages" role="tab"
                                                       data-toggle="tab">Fabric</a></li>
                        </ul>

                        <!-- Tab panes -->
                        <div class="tab-content mb20">
                            <div role="tabpanel" class="tab-pane ecomm-custom-tab-content active" id="print">
                                <div class="row">
                                    <?php
                                    $files = $provider->scanTypeDir(ImageProvider::TYPE_PRINT);
                                    ?>
                                    <?php foreach ($files as $i => $file) { ?>
                                        <div class="col-md-3">
                                            <a href="#"
                                               class="thumbnail ecomm-trigger <?= $i == 0 ? 'active' : null; ?>"
                                               data-type="<?= ImageProvider::TYPE_PRINT; ?>"
                                               data-name="<?= basename($file) ?>">
                                                <img src="<?= getThumb('img/print/' . basename($file)); ?>" alt="">
                                            </a>
                                        </div>

                                    <?php } ?>
                                </div>
                            </div>
                            <div role="tabpanel" class="tab-pane ecomm-custom-tab-content" id="color">
                                <div class="row">
                                    <?php
                                    $files = $provider->scanTypeDir(ImageProvider::TYPE_COLOR);
                                    ?>
                                    <?php foreach ($files as $i => $file) { ?>
                                        <div class="col-md-3">
                                            <a href="#"
                                               class="thumbnail ecomm-trigger <?= $i == 0 ? 'active' : null; ?>"
                                               data-type="<?= ImageProvider::TYPE_COLOR; ?>"
                                               data-name="<?= basename($file); ?>">
                                                <img src="<?= getThumb('img/color/' . basename($file)); ?>" alt="">
                                            </a>
                                        </div>

                                    <?php } ?>
                                </div>
                            </div>
                            <div role="tabpanel" class="tab-pane ecomm-custom-tab-content" id="fabric">
                                <div class="row">
                                    <?php
                                    $files = $provider->scanTypeDir(ImageProvider::TYPE_FABRIC);
                                    ?>
                                    <?php foreach ($files as $i => $file) { ?>
                                        <div class="col-md-3">
                                            <a href="#"
                                               class="thumbnail ecomm-trigger <?= $i == 0 ? 'active' : null; ?>"
                                               data-type="<?= ImageProvider::TYPE_FABRIC; ?>"
                                               data-name="<?= basename($file); ?>">
                                                <img src="<?= getThumb('img/fabric/' . basename($file)); ?>" alt="">
                                            </a>
                                        </div>
                                    <?php } ?>
                                </div>
                            </div>
                        </div>

                        <div class="">
                            <div class="" style="padding-right: 20px; text-align: center;">
                                <form action="">
                                    <input type="hidden" name="print"/>
                                    <input type="hidden" name="color"/>
                                    <input type="hidden" name="fabric"/>
                                    <input type="submit" value="Apply Style"
                                           class="btn btn-primary btn-lg ecomm-custom-apply"/>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section style="background: whitesmoke;padding: 30px 0 45px;margin-top: 30px;border-top: 1px #eee solid;">
        <div class="container">
            <div class="ta-center">
                <h1>Learn More</h1>
                <p>ShareCloth offers solutions for e-commerce, retail and tailoring business that allows to develop precise adanced virtual fitting application on web, mobile or VR for your fashion brand.
                </p>

                <p>ShareCloth infrastructure consist of 3D body scanning solution, garment 3D rendering and advanced cloud technology to run this for your business</p>
            </div>
        </div>
    </section>


<?php $additionalScripts = [
    '/demo_assets/3d-plugin-gl/js/3d-client.min.js',
    '/demo_assets/3d-plugin-gl/js/path-resolver.js',
    '/demo_assets/3d-plugin-gl/js/3d-client.js',
    '/demo_assets/js/ecomm-custom.js',
]; ?>

<?php include "../../_footer.php";