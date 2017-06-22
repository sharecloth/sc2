<?php

require_once(__DIR__ . '/ithumb/phpThumb.config.php');

function getThumb($img) {
    //return '/ecomm/custom/ithumb/phpThumb.php?src='.$img. '&w=100&h=100&zc=1&q=95&hash=' . ;

    return phpThumbURL('src=../'.$img. '&w=100&h=100&zc=1&q=95', '/ecomm/custom/ithumb/phpThumb.php');
}