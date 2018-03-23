<?php


namespace Site;


use Petun\Forms\Actions\BaseAction;
use ZfrMailChimp\Client\MailChimpClient;

/**
 * No usage at this time
 * Class MailChimpAction
 * @package Site
 */
class MailChimpAction extends BaseAction
{

    public $apiKey;

    public $listId;

    function run()
    {
        $client = new MailChimpClient($this->apiKey);

        try {
            $result = $client->subscribe(array(
                'id' => $this->listId,
                'email' => array(
                    'email' => $this->_form->fieldValue('email'),
                ),
                'double_optin' => false,
                'update_existing' => true,
                'replace_interests' => false,
                'merge_vars' => [

                ],
            ));
            return true;
        } catch (\Exception $e) {
            return false;
        }
    }
}