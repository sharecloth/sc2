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
                'smtpHost' => 'smtp.globedrobe.com',
                'smtpPort' => 25,
                'smtpUsername' => 'robot@globedrobe.com',
                'smtpPassword' => 'aEsh6KdpvAF1',
            ],
//            [
//                'fucking-mail',
//                'to' => 'dropbox@40833388.sharecloth.highrisehq.com',
//                //'to' => 'petun911@gmail.com',
//                'class' => \Site\MailActionHq::class,
//                'from' => 'no-reply@' . $siteName,
//                'fromName' => 'Администратор',
//                'useSmtp' => true,
//                'smtpAuth' => true,
//                'smtpHost' => 'smtp.globedrobe.com',
//                'smtpPort' => 25,
//                'smtpUsername' => 'robot@globedrobe.com',
//                'smtpPassword' => 'aEsh6KdpvAF1',
//            ],
            [
                'hq-api',
                'class' => HqApiAction::class,
                'token' => '',
                'account' => '',
            ],
            [
                'db',
                'class' => DatabaseSave::class,
            ]
        ]
    ],
];
