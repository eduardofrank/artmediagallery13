<?php

$EM_CONF[$_EXTKEY] = [
    'title' => 'artmediagallery13',
    'description' => 'Artmedia Gallery site package for TYPO3 13 (Site Set)',
    'category' => 'templates',
    'constraints' => [
        'depends' => [
            'typo3' => '13.4.0-13.99.99',
            'bootstrap_package' => '15.0.0-15.99.99',
        ],
        'conflicts' => [
        ],
    ],
    'autoload' => [
        'psr-4' => [
            'EduardoFrank\\Artmediagallery13\\' => 'Classes',
        ],
    ],
    'state' => 'stable',
    'uploadfolder' => 0,
    'createDirs' => '',
    'clearCacheOnLoad' => 1,
    'author' => 'Eduardo Frank',
    'author_email' => 'edfrank@gmail.com',
    'author_company' => 'Eduardo Frank',
    'version' => '1.0.0',
];
