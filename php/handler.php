<?php
/**
 * @author Petr Marochkin petun911@gmail.com
 */


require_once dirname(__DIR__) . "/vendor/autoload.php";

include("handler_config.php");

use Petun\Forms;
$app = new Forms\Application($config);
$app->handleRequest();