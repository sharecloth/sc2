<?php
/**
 * @author Petr Marochkin petun911@gmail.com
 */

use ZfrMailChimp\Client\MailChimpClient;

require_once dirname(__DIR__) . '/vendor/autoload.php';

$config = require_once ("../php/config.php");


$id = !empty($_GET['id']) ? $_GET['id'] : '';

//todo add mail chimp support
if (strlen($id) !== 32) exit(0);

$client = new MailChimpClient($config['api-key']);
$clients = $client->getListMembers([
    'id'    => $config['white-paper-list-id'],
]);

$userExists = false;
foreach ($clients['data'] as $mailChimpClient) {
    if (isset($mailChimpClient['merges']['MMERGE4']) &&  $mailChimpClient['merges']['MMERGE4'] == $id) {
        $userExists = true;
        break;
    }
}

//if (!$userExists) {
// echo "Erro downoading. Code " . count($clients['data']);
//exit(0);
//} 

$content = file_get_contents('sharecloth-3dprinting-report.pdf');

// add some cache
//header('ETag: "5131e8-54eafcb231698"');
//header('Date: Thu, 04 May 2017 10:09:51 GMT');
header('Content-Type: application/pdf');

echo $content;