<?php

use Site\DatabaseSave;
use Site\HqApiAction;

$mailTo = 'team@sharecloth.com';
//$mailTo = 'petun911@gmail.com';
$siteName = 'sharecloth.com';

$config = [
    'contactForm' => [
        'successMessage' => 'Thank you for your feedback!',
        'errorMessage' => 'Oops, something goes wrong!',
        'fields' => [
            'type' => 'Request type',
            'company' => 'Company',
            'position' => 'Position',
            'name' => 'Your name',
            'email' => 'Email',
            'phone' => 'Phone',
            'comment' => 'Comment',
        ],
        'rules' => [
            ['type', 'required', 'errorMessage' => 'Type is required'],
            ['company', 'required', 'errorMessage' => 'Company is required'],
            ['comment', 'required', 'errorMessage' => 'Comment is required'],
            ['name', 'required', 'errorMessage' => 'Name is required'],
            ['phone', 'required', 'errorMessage' => 'Phone is required'],
            ['email', 'email', 'allowEmpty' => false, 'errorMessage' => 'Email is required and must be a valid email address'],
        ],
        'actions' => [
            [
                'mail', 'subject' => 'Новое письмо с сайта',
                'from' => 'no-reply@' . $siteName,
                'fromName' => 'Администратор',
                'to' => $mailTo,
		        'useSmtp' => true,
                'smtpAuth' => true,
                'smtpHost' => 'localhost',
                'smtpPort' => 25,
                'smtpUsername' => 'login',
                'smtpPassword' => 'you password here',
            ],
            [
                'hq-api',
                'class' => HqApiAction::class,
                'token' => 'access token',
                'account' => 'account name',
            ],
            [
                'db',
                'class' => DatabaseSave::class,
            ]
        ]
    ],
];
