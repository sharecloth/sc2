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
        <h3 class="text-muted">ShareCloth Api Demo</h3>
    </div>

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


    <footer class="footer">
        <p>&copy; 2016 ShareCloth, Inc.</p>
    </footer>

</div> <!-- /container -->


<!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
<!-- Include all compiled plugins (below), or include individual files as needed -->
<script src="/demo_assets/js/bootstrap.min.js"></script>
<script src="/demo_assets/js/script.js"></script>
</body>
</html>