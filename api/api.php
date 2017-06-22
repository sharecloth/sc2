<?php
/**
 * Created by PhpStorm.
 * User: User
 * Date: 12.10.2016
 * Time: 11:25
 */

require_once "../vendor/autoload.php";

$email = $_POST['email'];
$password = $_POST['password'];

if (!empty($email) && !empty($password)) {
    try {
        $client = new \ShareCloth\Api\Client($email, $password);
    } catch (\ShareCloth\Api\Exception\BadResponseException $e) {
        echo json_encode(['result' => false, 'message' => $e->getMessage()]);
        exit;
    }
}

$method = $_GET['method'];


if ($method == 'login') {
    echo json_encode(['result' => true, 'apiSecret' => $client->getApiSecret()]);
} else if ($method == 'avatarList') {
    $data = $client->avatarList();
    $html = '<table class="table">';
    $html .= '<tr><th>ID</th><th>Name</th></tr>';
    foreach ($data as $value) {
        $html .= '<tr data-id="'.$value['avatar_id'].'" class="selectable" data-type="avatar">';
        $html .= '<td>'.$value['avatar_id'].'</td>';
        $html .= '<td>'.$value['description'].'</td>';
        $html .= '</tr>';
    }
    $html .= '</table>';
    echo json_encode(['result' => true, 'data' => $data, 'html' => $html]);
} else if ($method == 'itemList') {
    $data = $client->itemsList(['list' => $_POST['list']]);
    $html = '<table class="table">';
    $html .= '<tr><th>ID</th><th>Name</th></tr>';
    foreach ($data as $value) {
        $html .= '<tr data-id="'.$value['ident'].'" class="selectable" data-type="cloth">';
        $html .= '<td>'.$value['ident'].'</td>';
        $html .= '<td>'.$value['name'].'</td>';
        $html .= '</tr>';
    }
    $html .= '</table>';
    echo json_encode(['result' => true, 'data' => $data, 'html' => $html]);
}





