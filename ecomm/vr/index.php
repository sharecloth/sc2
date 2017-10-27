<?php
$additionalCss = [
    '/demo_assets/3d-plugin-gl/plugin.css',
    '/demo_assets/css/style.css',
];

$title = 'ShareCloth VR experience for Puma';
?>

<?php
$additionalCss = [
    '/ecomm/puma/cover.css',
    '/ecomm/puma/styles.css',
];
?>

<?php include "../../_header.php"; ?>

    <div class="container-fluid">
        <h1 class="cover-heading">ShareCloth VR demo-page</h1>
        <p class="lead">This is a demonstration of the core features of ShareCloth virtual fitting solution. Eyes
            only.</p>
        <br>

        <p class="lead">
            <a href="vr/woman.html" target="_blank" class="btn btn-lg btn-secondary">Launch women fitting</a>
        </p>

        <div class="jumbotron" id="controls">
            <h1 class="display-5">Controls</h1>
            <p class="lead">To enter the VR mode, launch the application, press <i>the icon</i> and rotate the device
                into horizontal mode</p>
            <ul class="list-unstyled">
                <li class="media">
                    <div class="row">
                        <div class="col-md-3">
                            <img class="d-flex mr-3" src="icons/pointer128.png" alt="The move">
                        </div>
                        <div class="col-md-9">
                            <h5 class="mt-0 mb-1">Consider the pointer in the centre of the screen</h5>
                        </div>
                    </div>
                </li>
                <li class="media">
                    <div class="row">
                        <div class="col-md-3">
                            <img class="d-flex mr-3" src="icons/interaction128.png" alt="The move">
                        </div>
                        <div class="col-md-9">
                            <h5 class="mt-0 mb-1">Wait indicator. Freeze the pointer until it's done</h5>
                        </div>
                    </div>
                </li>
                <li class="media">
                    <div class="row">
                        <div class="col-md-3">
                            <img class="d-flex mr-3 img-responsive" src="icons/rotate128.png" alt="The move">
                        </div>
                        <div class="col-md-9">
                            <h5 class="mt-0 mb-1">To rotate mannequin tilt the head left or right</h5>
                        </div>
                    </div>
                </li>
                <li class="media">
                    <div class="row">
                        <div class="col-md-3">
                            <img class="d-flex mr-3 img-responsive" src="icons/catalog128.png" alt="The move">
                        </div>
                        <div class="col-md-9">
                            <h5 class="mt-0 mb-1">Press to open clothing catalog</h5>
                        </div>
                    </div>
                </li>
                <li class="media">
                    <div class="row">
                        <div class="col-md-3">
                            <img class="d-flex mr-3 img-responsive" src="icons/stress-map.png" alt="The move">
                        </div>
                        <div class="col-md-9">
                            <h5 class="mt-0 mb-1">To turn the heat map feature on</h5>
                        </div>
                    </div>
                </li>
                <li class="media">
                    <div class="row">
                        <div class="col-md-3">
                            <img class="d-flex mr-3 img-responsive" src="icons/seams.png" alt="The move">
                        </div>
                        <div class="col-md-9">
                            <h5 class="mt-0 mb-1">To turn the transparency mode</h5>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>


<?php include "../../_footer.php";