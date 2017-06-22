<?php
/**
 * @author Petr Marochkin petun911@gmail.com
 */

require "ImageProvider.php";

$provider = new ImageProvider();

try {

    $provider->processForm($_GET);

} catch (\Exception $e) {

    throw new \Exception('err', 0, $e);
    echo json_encode(['error' => $e->getMessage()]);

}