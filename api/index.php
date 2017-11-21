<?php
$additionalCss = [
    '/demo_assets/css/style.css',
]
?>

<?php include "../_header.php"; ?>

<div class="container">
    <section class="login-form ta-center">
        <div class="row ">
            <div class="col-md-5 col-md-offset-3">
                <h4>Login Form</h4>
                <form class="mb20">
                    <div class="form-group">
                        <input type="text" class="form-control" id="exampleInputEmail1" placeholder="Email"
                               name="email">
                    </div>
                    <div class="form-group">
                        <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Password"
                               name="password">
                    </div>
                    <button type="submit" class="btn btn-primary" id="get-token-button">Get Token</button>
                </form>

                <div class="login-error hidden">
                    <div class="alert alert-danger">
                        Login or password not valid
                    </div>
                </div>

                <div class="login-result hidden">
                    <p>API Token:</p>
                    <p><strong>12-043812askldfjkl23j4504958</strong></p>
                </div>
            </div>
        </div>
        <hr/>
    </section>


    <section id="lists" class="hidden">
        <div class="row marketing">
            <div class="col-lg-6 ta-center">
                <h4>Avatars</h4>
                <p><a href="#" class="btn btn-primary" id="get-avatar-list">Get avatar list</a></p>
                <div class="avatar-table-wrapper"></div>
            </div>

            <div class="col-lg-6 ta-center">
                <h4>Cloth</h4>
                <p><a href="#" class="btn btn-primary" id="get-cloth-list">Get cloth list</a></p>
                <div class="cloth-table-wrapper"></div>
            </div>
        </div>
        <hr/>
    </section>


    <section id="avatar-preview" class="hidden">
        <div class="row ta-center">
            <h4>Iframe result</h4>
            <p>Selected Avatar Id: <strong id="selectedAvatarId"></strong></p>
            <p>Selected Cloth Id: <strong id="selectedClothId"></strong></p>
            <p><input type="button" id="show-embed-button" value="Show Embed" class="btn btn-success btn-lg hidden"/>
            </p>
            <div class="sharecloth-embed-wrapper"></div>
        </div>
    </section>

</div> <!-- /container -->

<?php $additionalScripts = [
    '/demo_assets/js/script.js',
];?>

<?php include "../_footer.php";