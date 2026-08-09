<?php

namespace Tests;

use Illuminate\Foundation\Http\Middleware\ValidateCsrfToken;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        if (config('database.default') !== 'sqlite' || app()->environment() !== 'testing') {
            throw new \LogicException('Tests must run with APP_ENV=testing and the SQLite database. Production database reset blocked.');
        }
        $this->withoutMiddleware([ValidateCsrfToken::class]);
    }
}
