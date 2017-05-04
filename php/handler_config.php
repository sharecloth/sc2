<?php

$mailTo = 'team@sharecloth.com';
//$mailTo = 'petun911@gmail.com';
$siteName = 'sharecloth.com';

$config = [
    'contactForm' => [
        'successMessage' => 'Thank you for your feedback!',
        'errorMessage' => 'Oops, something goes wrong!',
        'fields' => [
            'name' => 'Your name',
            'email' => 'Email',
            'phone' => 'Phone',
            'comment' => 'Comment',
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
                'to' => $mailTo,
		'useSmtp' => true,
                'smtpAuth' => true,
                'smtpHost' => 'smtp.globedrobe.com',
                'smtpPort' => 25,
                'smtpUsername' => 'robot@globedrobe.com',
                'smtpPassword' => 'aEsh6KdpvAF1',
            ],
        ]
    ],
];
