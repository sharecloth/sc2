<?php

require_once "../vendor/autoload.php";

use Symfony\Component\Validator\Constraints\Email;
use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Component\Validator\Validation;
use ZfrMailChimp\Client\MailChimpClient;

$validators = [
    'name' => [
        new NotBlank()
    ],
    'email' => [
        new NotBlank(),
        new Email()
    ],
];

$data = $_POST;

if (empty($data)) {
    return;
}

$errors = [];
$validator = Validation::createValidator();
foreach ($validators as $key => $validatorsCollection) {
    $violations = $validator->validate($data[$key], $validatorsCollection);
    if (0 !== count($violations)) {
        // there are errors, now you can show them
        foreach ($violations as $violation) {
            $errors[$key][] = $violation->getMessage();
        }
    }
}

if (empty($errors)) {
    $config = require_once ("config.php");

    $subscriber_email = addslashes(trim($_POST['email']));

    $array = array();
    $merge_vars = array();

    $client = new MailChimpClient($config['api-key']);

    try {
        $result = $client->subscribe(array(
            'id'    => $config['white-paper-list-id'],
            'email' => array(
                'email' => $subscriber_email,
            ),
            'double_optin' => false,
            'update_existing' => true,
            'replace_interests' => true
        ));
        //var_dump($result);
        $array['valid'] = 1;
        $array['message'] = 'Success!';

        $array = array_merge($array, $result);

    } catch (\Exception $e) {
        $array['valid'] = 0;
        $array['message'] = 'An error occurred! Please try again later.';
        $array['details'] = $e->getMessage();
    }


    echo json_encode($array);
} else {
    echo json_encode([
        'valid' => 0,
        'message' => 'Please, fill all required fields',
        'errors' => $errors
    ]);
}