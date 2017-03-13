<?php

use ZfrMailChimp\Client\MailChimpClient;

require_once dirname(__DIR__) . '/vendor/autoload.php';

// Email address verification
function isEmail($email)
{
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

if ($_POST) {

    $config = require_once ("config.php");

    $subscriber_email = addslashes(trim($_POST['email']));

    if (!isEmail($subscriber_email)) {
        $array = array();
        $array['valid'] = 0;
        $array['message'] = 'Not a valid email address!';
        echo json_encode($array);
    } else {
        $array = array();
        $merge_vars = array();

        $client = new MailChimpClient($config['api-key']);

        try {
            $result = $client->subscribe(array(
                'id'    => $config['list-id'],
                'email' => array(
                    'email' => $subscriber_email,
                ),
                'double_optin' => false,
                'update_existing' => true,
                'replace_interests' => true
            ));
            //var_dump($result);
            $array['valid'] = 1;
            $array['message'] = 'Success! Please check your mail.';

            $array = array_merge($array, $result);

        } catch (\Exception $e) {
            $array['valid'] = 0;
            $array['message'] = 'An error occurred! Please try again later.';
            $array['details'] = $e->getMessage();
        }


        echo json_encode($array);

    }

}

?>