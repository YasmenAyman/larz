<?php

// A production config cache can contain the MySQL connection. Never let the
// RefreshDatabase trait inherit that cached connection during PHPUnit runs.
$configCache = dirname(__DIR__).'/bootstrap/cache/config.php';

if (getenv('APP_ENV') === 'testing' && is_file($configCache)) {
    unlink($configCache);
}

require dirname(__DIR__).'/vendor/autoload.php';
