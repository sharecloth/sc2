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
                        ShareCloth allows custom brands to demonstrate styles on the flights<br>
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
                            <div class="pull-left" style="padding-right: 20px;">
                                <form action="">
                                    <input type="hidden" name="print"/>
                                    <input type="hidden" name="color"/>
                                    <input type="hidden" name="fabric"/>
                                    <input type="submit" value="Apply Style"
                                           class="btn btn-primary btn-lg ecomm-custom-apply"/>
                                </form>
                            </div>
                            <div class="pull-right" style="padding-top: 10px;">
                                <script src="//yastatic.net/es5-shims/0.0.2/es5-shims.min.js"></script>
                                <script src="//yastatic.net/share2/share.js"></script>
                                <div class="ya-share2"
                                     data-services="facebook,twitter,gplus,linkedin,odnoklassniki,moimir,vkontakte"></div>
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
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dignissimos distinctio ea exercitationem
                    labore
                    mollitia nemo officia quas soluta tempora! Ad animi aspernatur commodi consequatur consequuntur
                    delectus
                    distinctio dolore doloribus eaque ex facere fugit harum hic illum impedit incidunt ipsam ipsum iusto
                    mollitia natus neque nihil nobis, odit perferendis quaerat quas quasi repellendus similique ut vel
                    vero
                    vitae voluptas voluptatem. Aliquam aliquid at aut corporis delectus dolore dolorem doloremque
                    ducimus
                    eius explicabo ipsum labore laudantium libero minima modi, mollitia non quam qui sequi unde!
                    Blanditiis
                    commodi dicta, dolor et facere mollitia quis recusandae repellat ullam veniam. Dignissimos in
                    inventore
                    qui rerum.</p>

                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad doloribus nemo recusandae tempora
                    tenetur.
                    Ad assumenda beatae blanditiis culpa delectus dignissimos dolores doloribus dolorum eveniet iusto
                    mollitia, nam odio perferendis, porro quae, quam quibusdam quidem quis reiciendis rem repudiandae
                    soluta
                    suscipit ut velit voluptatibus. Asperiores ex impedit possimus praesentium velit!</p>
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