<?php

require "ImageProvider.php";
require "functions.php";
$provider = new ImageProvider();

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
    <title>ShareCloth Api Demo</title>

    <!-- Bootstrap -->
    <link href="/demo_assets/css/bootstrap.min.css" rel="stylesheet">
    <link href="/demo_assets/3d-plugin-gl/plugin.css" rel="stylesheet">
    <link href="/demo_assets/css/style.css" rel="stylesheet">

    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
    <script src="https://oss.maxcdn.com/html5shiv/3.7.3/html5shiv.min.js"></script>
    <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->
</head>
<body>

<div class="container">
    <div class="header clearfix">
        <nav>
            <ul class="nav nav-pills pull-right">
                <li role="presentation"><a href="http://sharecloth.com" target="_blank">ShareCloth Site</a></li>
            </ul>
        </nav>
        <h3 class="text-muted">ShareCloth Demo</h3>
    </div>


    <p class="lead">ShareCloth allows custom brands to demonstrate styles on the flights</p>

    <section class="ecomm-custom-wrap">
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
                        <li role="presentation"><a href="#color" aria-controls="profile" role="tab" data-toggle="tab">Color</a>
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
                                        <a href="#" class="thumbnail ecomm-trigger <?=$i == 0 ? 'active' : null;?>" data-type="<?=ImageProvider::TYPE_PRINT;?>"
                                           data-name="<?= basename($file) ?>">
                                            <img src="<?=getThumb('img/print/'. basename($file));?>" alt="">
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
                                    <a href="#" class="thumbnail ecomm-trigger <?=$i == 0 ? 'active' : null;?>" data-type="<?=ImageProvider::TYPE_COLOR;?>"
                                       data-name="<?=  basename($file) ; ?>">
                                        <img src="<?=getThumb('img/color/'.  basename($file) );?>" alt="">
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
                                    <a href="#" class="thumbnail ecomm-trigger <?=$i == 0 ? 'active' : null;?>" data-type="<?=ImageProvider::TYPE_FABRIC;?>"
                                       data-name="<?= basename($file); ?>">
                                        <img src="<?=getThumb('img/fabric/'. basename($file));?>" alt="">
                                    </a>
                                </div>
                            <?php } ?>
                            </div>
                        </div>
                    </div>

                    <div class="">
                        <div class="pull-left" style="padding-right: 20px;">
                            <form action="">
                                <input type="hidden" name="print" />
                                <input type="hidden" name="color" />
                                <input type="hidden" name="fabric" />
                                <input type="submit" value="Apply" class="btn btn-success btn-lg ecomm-custom-apply"  />
                            </form>
                        </div>
                        <div class="pull-left" style="padding-top: 10px;">
                            <script src="//yastatic.net/es5-shims/0.0.2/es5-shims.min.js"></script>
                            <script src="//yastatic.net/share2/share.js"></script>
                            <div class="ya-share2" data-services="vkontakte,facebook,odnoklassniki,moimir,gplus,linkedin"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <hr/>

        <div class="ta-center">
            <h1>Learn More</h1>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dignissimos distinctio ea exercitationem labore
                mollitia nemo officia quas soluta tempora! Ad animi aspernatur commodi consequatur consequuntur delectus
                distinctio dolore doloribus eaque ex facere fugit harum hic illum impedit incidunt ipsam ipsum iusto
                mollitia natus neque nihil nobis, odit perferendis quaerat quas quasi repellendus similique ut vel vero
                vitae voluptas voluptatem. Aliquam aliquid at aut corporis delectus dolore dolorem doloremque ducimus
                eius explicabo ipsum labore laudantium libero minima modi, mollitia non quam qui sequi unde! Blanditiis
                commodi dicta, dolor et facere mollitia quis recusandae repellat ullam veniam. Dignissimos in inventore
                qui rerum.</p>

            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad doloribus nemo recusandae tempora tenetur.
                Ad assumenda beatae blanditiis culpa delectus dignissimos dolores doloribus dolorum eveniet iusto
                mollitia, nam odio perferendis, porro quae, quam quibusdam quidem quis reiciendis rem repudiandae soluta
                suscipit ut velit voluptatibus. Asperiores ex impedit possimus praesentium velit!</p>
        </div>
    </section>


    <footer class="footer">
        <p>&copy; 2017 ShareCloth, Inc.</p>
    </footer>

</div> <!-- /container -->


<!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
<!-- Include all compiled plugins (below), or include individual files as needed -->
<script src="/demo_assets/js/bootstrap.min.js"></script>
<script src="/demo_assets/3d-plugin-gl/js/3d-client.min.js"></script>
<script src="/demo_assets/3d-plugin-gl/js/path-resolver.js"></script>
<script src="/demo_assets/3d-plugin-gl/js/3d-client.js"></script>
<script src="/demo_assets/js/ecomm-custom.js"></script>
</body>
</html>