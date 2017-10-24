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
        $array = [];
        $array['valid'] = 0;
        $array['message'] = 'Not a valid email address!';
        echo json_encode($array);
    } else {
        $array = [];
        $merge_vars = [];

        $client = new MailChimpClient($config['api-key']);

        try {
            $member = $client->GetListMembersInfo([
                'id'    => $config['sc-list-id'],
                'emails' => [['email'=>$subscriber_email]],
            ]);

            $groups = [];
            if (!empty($member['data'][0])) {
                $groups = $member['data'][0]['merges']['GROUPINGS'] ? $member['data'][0]['merges']['GROUPINGS'] : [];
            }

            if (!empty($_POST['internalSource']) && !empty($_POST['type'])) {
                $merge_vars = [
                    'GROUPINGS' => [
                        [
                            'name' => 'Internal source',
                            'groups' => array_unique(array_merge([$_POST['internalSource']], findActiveGroupsFor($groups, 'Internal source'))),
                        ],
                    ],
                    'NEWSSUB' => 1,
                ];
            }

            $result = $client->subscribe(array(
                'id'    => $config['sc-list-id'],
                'email' => array(
                    'email' => $subscriber_email,
                ),
                'double_optin' => false,
                'update_existing' => true,
                'replace_interests' => false,
                'merge_vars' => $merge_vars,
            ));
            //var_dump($result);
            $array['valid'] = 1;
            $array['message'] = 'Thank you! <br /> We\'ll reach you with our release news as soon as possible!';

            $array = array_merge($array, $result);

        } catch (\Exception $e) {
            $array['valid'] = 0;
            $array['message'] = 'An error occurred! Please try again later.';
            $array['details'] = $e->getMessage();
        }


        echo json_encode($array);

    }

}

/**
 * @param $groupList
 * @param $groupName
 * @return array
 */
function findActiveGroupsFor($groupList, $groupName) {
    $result =[];
    foreach ($groupList as $groupItem) {
        if ($groupItem['name'] == $groupName) {
            foreach ($groupItem['groups'] as $group) {
                if ($group['interested'] == true) {
                    $result[] = $group['name'];
                }
            }
        }
    }

    return $result;
}

?>