<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Console\Events\CommandStarting;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        Event::listen(CommandStarting::class, function (CommandStarting $event): void {
            $command = $event->command ?? '';
            $destructive = [
                'db:wipe',
                'migrate:fresh',
                'migrate:refresh',
                'migrate:reset',
                'migrate:rollback',
            ];

            if (in_array($command, $destructive, true)
                && ! (app()->environment('testing') && config('database.default') === 'sqlite')) {
                throw new \LogicException('Database reset commands are disabled. Use migrations only; production data is protected.');
            }
        });
    }
}
