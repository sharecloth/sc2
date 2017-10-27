<?php


namespace Site;


use Ganga\Potato\Connection;
use Petun\Forms\Actions\BaseAction;
use Site\entity\Contact;

class DatabaseSave extends BaseAction
{

    function run()
    {
        $sqliteConfig = [
            "type" => "sqlite", //case insensitive
            "database" => "contacts.sqlite" //path to db file
        ];

        $conn = new Connection($sqliteConfig);

        $data = $this->_form->fieldValues();

        $form = new Contact();
        $form->id = uniqid();
        $form->type = $data['Request type'];
        $form->name = $data['Your name'];
        $form->email = $data['Email'];
        $form->company = $data['Company'];
        $form->position = $data['Position'];
        $form->phone = $data['Phone'];
        $form->comment = $data['Comment'];
        $form->created = date('Y-m-d H:i:s');
        $form->save();
    }
}