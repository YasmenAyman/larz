<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class CreateInitialAdmin extends Command
{
    protected $signature = 'admin:create
        {--name= : Initial administrator name; falls back to INITIAL_ADMIN_NAME}
        {--email= : Initial administrator email; falls back to INITIAL_ADMIN_EMAIL}';

    protected $description = 'Create the initial Super Admin from explicit input or environment variables';

    public function handle(): int
    {
        $name = $this->option('name') ?: env('INITIAL_ADMIN_NAME');
        $email = $this->option('email') ?: env('INITIAL_ADMIN_EMAIL');
        $password = env('INITIAL_ADMIN_PASSWORD');

        $name ??= $this->ask('Name');
        $email ??= $this->ask('Email');
        $password ??= $this->secret('Password');

        if (! $name || ! filter_var($email, FILTER_VALIDATE_EMAIL) || ! $password) {
            $this->error('Name, a valid email, and a password are required.');

            return self::FAILURE;
        }

        if (User::where('email', $email)->exists()) {
            $this->error('A user with that email already exists.');

            return self::FAILURE;
        }

        $role = Role::findOrCreate('Super Admin', 'web');

        $user = User::create([
            'name' => $name,
            'email' => $email,
            'password' => $password,
            'email_verified_at' => now(),
        ]);

        $user->assignRole($role);

        $this->info("Super Admin created: {$user->email}");

        return self::SUCCESS;
    }
}
