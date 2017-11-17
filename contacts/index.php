<!DOCTYPE html>
<!--[if lt IE 7 ]>
<html itemscope itemtype="https://schema.org/" id="ie6" class="ie" lang="en-US"><![endif]-->
<!--[if IE 7 ]>
<html itemscope itemtype="https://schema.org/" id="ie7" class="ie" lang="en-US"><![endif]-->
<!--[if IE 8 ]>
<html itemscope itemtype="https://schema.org/" id="ie8" class="ie" lang="en-US"><![endif]-->
<!--[if IE 9 ]>
<html itemscope itemtype="https://schema.org/" id="ie9" class="ie" lang="en-US"><![endif]-->
<!--[if gt IE 9]><!-->
<html itemscope itemtype="https://schema.org/" lang="en-US">
<!--<![endif]-->
<head>
    <base href="/" />
    <meta charset="utf-8">

    <meta http-equiv="X-UA-Compatible" content="IE=edge">

    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">

    <meta content="yes" name="apple-mobile-web-app-capable">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">

    <link rel="icon" type="image/png" href="../favicon_sc2.png">

    <!-- TWITTER -->
    <meta name="twitter:site" content="http://sharecloth.com/">
    <meta name="twitter:title" content="ShareCloth.com – fashion 3D printing">
    <meta name="twitter:description" content="ShareCloth allows fashion designers to connect their knowledge of garment design with revolutionary 3D-printing technologies
Release in May'17">
    <meta name="twitter:image:src" content="http://sharecloth.com/img/display/mockup-2.png">

    <!-- FACEBOOK -->
    <meta property="og:site_name" content="ShareCloth">
    <meta property="og:url" content="http://sharecloth.com/">
    <meta property="og:title" content="ShareCloth.com – fashion 3D printing">
    <meta property="og:description" content="ShareCloth allows fashion designers to connect their knowledge of garment design with revolutionary 3D-printing technologies
Release in May'17">
    <meta property="og:image" content="http://sharecloth.com/img/display/mockup-2.png">

    <!-- G+ -->
    <meta itemprop="name" content="ShareCloth.com – fashion 3D printing">
    <meta itemprop="description" content="ShareCloth allows fashion designers to connect their knowledge of garment design with revolutionary 3D-printing technologies
Release in May'17">
    <meta itemprop="image" content="http://sharecloth.com/img/display/mockup-2.png">


    <title>ShareCloth.com – Contact Us</title>

    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css"
          media="screen" charset="utf-8">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link href="http://cdnjs.cloudflare.com/ajax/libs/fotorama/4.6.4/fotorama.css" rel="stylesheet"> <!-- 3 KB -->

    <link rel="stylesheet" type="text/css" href="../plugins/aos/aos.css">

    <link rel="stylesheet" type="text/css" href="../vendor/petun/forms/frontend/css/petun-forms.css">

    <link rel="stylesheet" type="text/css" href="/css/styles.css">
    <link rel="stylesheet" type="text/css" href="/css/custom.css?rev=3">

    <!-- Google Tag Manager -->
    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-WCXG39T');</script>
    <!-- End Google Tag Manager -->
</head>
<body>
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-WCXG39T"
                  height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
<?php echo  include("../_blue_menu.php");?>
<div id="barba-wrapper">
    <div class="barba-container">

        <div class="container contact-form">
            <div class="row">
                <div class="col-md-7">
                    <div class="additional-header"><h3>Contact Us</h3></div>
                    <p class="lead">We appreciate your interest to ShareCloth technologies and products. We'll get back to you as soon as possible</p>
                    <form id="contact-us-form" id="petun-form">
                        <input type="hidden" name="formId" value="contactForm" />
                        <div class="row">
                            <div class="col-md-5">
	                            <div class="form-group"><label for="type">Request type</label>
											<select id="type" name="type" class="form-control">
                                                <?php

                                                $types = [
                                                    '3d-retail' => 'Products - "3D retail" inquiry',
                                                    'product-development' => 'Products - "Product development" inquiry',
                                                    'services' => 'Services request',
                                                    'creators' => 'ShareCloth Creators',
                                                    'feedback' => 'Feedback',
                                                    'support' => 'Support'
                                                ];
                                                $defaultType = !empty($_GET['from']) && in_array($_GET['from'], array_keys($types))
                                                ?
                                                    $_GET['from'] : 'feedback';
                                                ?>

                                                <?php foreach ($types as $key => $value) { ?>
                                                    <?php $selected = $key == $defaultType ? 'selected="1"' : '';?>
                                                    <option <?=$selected;?> value="<?=$value;?>"><?=$value;?></option>
                                                <?php }?>
											</select>
                                </div>
                                <div class="form-group"><label for="fname">Name <sup>*</sup></label><input type="text" name="name"
                                                                                              id="fname"
                                                                                              class="form-control">
                                </div>
                                <div class="form-group"><label for="email">Email <sup>*</sup></label><input type="email"
                                                                                                            name="email"
                                                                                                            id="email"
                                                                                                            class="form-control">
                                </div>
								<div class="form-group"><label for="company">Company name <sup>*</sup></label><input type="text"
                                                                                                            name="company"
                                                                                                            id="company"
                                                                                                            class="form-control">
                                </div>
								<div class="form-group"><label for="position">Position </label><input type="text"
                                                                                                            name="position"
                                                                                                            id="position"
                                                                                                            class="form-control">
                                </div>
                                <div class="form-group"><label for="phone">Phone to call you back <sup>*</sup></label><input
                                        type="text" name="phone" id="phone" class="form-control"></div>
                            </div>
                            <div class="col-md-7">
                                <div class="form-group"><label for="comment">Comment</label><textarea
                                        name="comment" id="comment" class="form-control" cols="30" rows="10"></textarea>
                                </div>
                            </div>
                        </div>
                        <div class="actions"><input type="submit" class="btn btn-primary btn-lg" id="contact-form-button" value="Send Message">
                        </div>
                        <div class="form-result"></div>
                    </form>
                </div>
				<div class="col-md-4 col-md-offset-1">
                    <div class="additional-header"><h3>Get in touch</h3></div>
					<p class="lead">You can reach us with:</p>


					<h4>Online support chat</h4>
					<p><button id="support_chat" class="btn btn-success btn-round" onclick="Chatra('show'); Chatra('openChat', true)">Start chatting</button><br><br></p>

                    <!-- Chatra {literal} -->
                    <script>
                        window.ChatraSetup = {
                            startHidden: true
                        };

                        (function(d, w, c) {
                            w.ChatraID = 'R2NDg9B8Tmo5E4uZd';
                            var s = d.createElement('script');
                            w[c] = w[c] || function() {
                                (w[c].q = w[c].q || []).push(arguments);
                            };
                            s.async = true;
                            s.src = (d.location.protocol === 'https:' ? 'https:': 'http:')
                                + '//call.chatra.io/chatra.js';
                            if (d.head) d.head.appendChild(s);
                        })(document, window, 'Chatra');
                    </script>
                    <!-- /Chatra {/literal} -->

					<h4>Online one-click call</h4>	
					<p><a class="zingayaButton zingaya0398fcfa7a2f41c7b9935d9b14296873" id="zingayaButton0398fcfa7a2f41c7b9935d9b14296873" href="https://zingaya.com/widget/0398fcfa7a2f41c7b9935d9b14296873" onclick="window.open(this.href+'?referrer='+escape(window.location.href)+'', '_blank', 'width=236,height=220,resizable=no,toolbar=no,menubar=no,location=no,status=no'); return false;"></a>
					<script>
					var ZingayaConfig = {"buttonLabel":"Call us","labelColor":"#ffffff","labelFontSize":14,"labelTextDecoration":"none","labelFontWeight":"bold","labelShadowDirection":"bottom","labelShadowColor":"#edd7a7","labelShadow":1,"buttonBackgroundColor":"#90cbe8","buttonGradientColor1":"#90cbe8","buttonGradientColor2":"#90cbe8","buttonGradientColor3":"#90cbe8","buttonGradientColor4":"#90cbe8","buttonShadow":"true","buttonHoverBackgroundColor":"#69ad26","buttonHoverGradientColor1":"#80b5cf","buttonHoverGradientColor2":"#80b5cf","buttonHoverGradientColor3":"#80b5cf","buttonHoverGradientColor4":"#80b5cf","buttonActiveShadowColor1":"#000000","buttonActiveShadowColor2":"#985100","buttonCornerRadius":10,"buttonPadding":5,"iconColor":"#fff","iconOpacity":1,"iconDropShadow":1,"iconShadowColor":"#13487f","iconShadowDirection":"bottom","iconShadowOpacity":0.5,"callme_id":"0398fcfa7a2f41c7b9935d9b14296873","poll_id":null,"analytics_id":null,"zid":"f21aa9a67ef524410f718cff368a6ff2","type":"button","widgetPosition":"left","plain_html":false,"save":1};
					(function(d, t) {
					    var g = d.createElement(t),s = d.getElementsByTagName(t)[0];g.src = '//d1bvayotk7lhk7.cloudfront.net/js/zingayabutton.js';g.async = 'true';
					        g.onload = g.onreadystatechange = function() {
					        if (this.readyState && this.readyState != 'complete' && this.readyState != 'loaded') return;
					        try {Zingaya.load(ZingayaConfig, 'zingaya0398fcfa7a2f41c7b9935d9b14296873'); if (!Zingaya.SVG()) {
					                var p = d.createElement(t);p.src='//d1bvayotk7lhk7.cloudfront.net/PIE.js';p.async='true';s.parentNode.insertBefore(p, s);
					                p.onload = p.onreadystatechange = function() {
					                        if (this.readyState && this.readyState != 'complete' && this.readyState != 'loaded') return;
					                        if (window.PIE) PIE.attach(document.getElementById("zingayaButton"+ZingayaConfig.callme_id)); 
					        }}} catch (e) {}};
					    s.parentNode.insertBefore(g, s);
					}(document, 'script'));

					</script><br><br></p>
					<h4>Social media</h4>
					<ul class="list-inline">
						<li><a href="https://twitter.com/sharecloth" target="_blank"><img src="img/icons/social/twitter.png" alt="We on twitter" /></a></li>
						<li><a href="https://fb.com/shareclothcom" target="_blank"><img src="img/icons/social/facebook.png" alt="Facebook page" /></a></li>
						<li><a href="https://www.linkedin.com/company/9194254"><img src="img/icons/social/linkedin.png" alt="LinkedIn page" /></a></li>
						<li><a href="https://www.youtube.com/channel/UC2ZTjdI7UTgiPTKFmCvivjg"><img src="img/icons/social/youtube.png" alt="Our video channel" /></a></li>
                        <li><a href="http://medium.com/@sharecloth" target="_blank"><img style="height: 31px;" src="img/icons/social/medium.png" alt="Our blog" /></a></li>
					</ul><br>
					<h4>Company info</h4>
					<strong>ShareCloth, Inc.</strong>
					<address>Suit 210-A, 300 Delaware Ave., Willmington, DE, United States</address>
					<hr>
					<h4>Latest news <small><a href="https://twitter.com/sharecloth" class="twitter-follow-button" data-show-count="false">Follow @sharecloth</a><script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script></small></h4>
					<p>
						
					</p>
					<a class="twitter-timeline" data-lang="en" data-height="300" href="https://twitter.com/sharecloth">Tweets by sharecloth</a> <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>
				</div>
            </div>
        </div>


    </div>
</div>

<?php include('../_blue_footer.php');