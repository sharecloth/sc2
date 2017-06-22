<footer id="main-footer">

    <div class="copyright-footer">
        <div class="container">
            <div class="row">
                <div class="col-md-12">
                    ShareCloth, Inc. Copyright &copy; 2013-2017. All Rights Reserved

                    <div class="pull-right hidden-xs">
                        <ul class="list-inline">
                            <li>Facebook</li>
                            <li>Twitter</li>
                            <li>LinkedIn</li>
                            <li>YouTube</li>
                            <li>Blog</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</footer>

<script src="https://code.jquery.com/jquery-2.2.4.min.js"></script>

<!-- build:js scripts/vendor.js -->
<script src="/plugins/bootstrap/js/bootstrap.min.js"></script>
<script src="/plugins/slick/slick.min.js"></script>
<script src="/plugins/countUp/dist/countUp.js"></script>
<script src="/plugins/lightbox/dist/ekko-lightbox.min.js"></script>
<script src="/plugins/isotope/isotope.pkgd.js"></script>
<script src="/plugins/barba/dist/barba.min.js"></script>
<script src="/plugins/aos/aos.js"></script>
<script src="http://cdnjs.cloudflare.com/ajax/libs/fotorama/4.6.4/fotorama.js"></script> <!-- 16 KB -->
<script type="text/javascript" src="/vendor/petun/forms/frontend/js/jquery.petun-forms.js"></script>
<!-- endbuild -->

<?php if (isset($additionalScripts)) { ?>
    <?php foreach ($additionalScripts as $additionalScript) { ?>
        <script type="text/javascript" src="<?=$additionalScript;?>"></script>
    <?php } ?>
<?php } ?>

<script type="text/javascript" src="/js/main.js"></script>

<script>
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
            (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

    ga('create', 'UA-60689751-1', 'auto');
    ga('send', 'pageview');
</script>

</body>
</html>
