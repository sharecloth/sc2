<?php

$mailTo = 'petun911@gmail.com';
$siteName = 'sharecloth.com';

$config = [
    'contactForm' => [
        'successMessage' => 'Thank you! We send the link to your email in a minute!',
        'errorMessage' => 'Oops, something goes wrong!',
        'fields' => [
            'name' => 'Your name',
            'email' => 'Email',
            'phone' => 'Ваш телефон',
            'select-box' => 'select-box',
            'check-test' => 'test check',
            'regexText' => 'Regex Text',

        ],
        'rules' => [
            ['name', 'required', 'errorMessage' => 'Name is required'],
            ['phone', 'required', 'errorMessage' => 'Phone is required'],
            ['email', 'email', 'allowEmpty' => false, 'errorMessage' => 'Email is required and must be a valid email address'],
        ],
        'actions' => [
            [
                'mail', 'subject' => 'Новое письмо с сайта',
                'from' => 'no-reply@' . $siteName,
                'fromName' => 'Администратор',
                'to' => $mailTo
            ],
        ]
    ],
];