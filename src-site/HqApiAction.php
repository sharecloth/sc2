<?php


namespace Site;


use Highrise\HighriseAPI;
use Highrise\Resources\HighrisePerson;
use Petun\Forms\Actions\BaseAction;

class HqApiAction extends BaseAction
{

    public $account;

    public $token;

    function run()
    {
        $data = $this->_form->fieldValues();

        $hr = new HighriseAPI();
        //$hr->debug = false;
        $hr->setAccount($this->account);
        $hr->setToken($this->token);

        $new_person = new HighrisePerson($hr);
        $new_person->setFirstName($data['Your name']);
        $new_person->setTitle($data['Position']);
        $new_person->setBackground($data['Request type'] . '. ' .$data['Comment']);
        $new_person->setCompanyName($data['Company']);
        $new_person->addEmailAddress($data['Email']);
        $new_person->addPhoneNumber($data['Phone'], 'Work');
        $new_person->addTag('inbound');
        $new_person->save();
    }


}