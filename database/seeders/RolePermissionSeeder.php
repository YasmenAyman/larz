<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [
            'dashboard.view',
            'pages.view',
            'pages.update',
            'projects.view',
            'projects.create',
            'projects.update',
            'projects.delete',
            'media.view',
            'media.create',
            'media.update',
            'media.delete',
            'jobs.view',
            'jobs.create',
            'jobs.update',
            'jobs.delete',
            'applications.view',
            'applications.update',
            'inquiries.view',
            'inquiries.update',
            'settings.view',
            'settings.update',
            'navigation.view',
            'navigation.update',
            'newsletter.view',
            'newsletter.update',
            'seo.view',
            'seo.update',
            'users.manage',
            'roles.manage',
        ];

        $permissionModels = collect($permissions)
            ->map(fn (string $permission) => Permission::findOrCreate($permission, 'web'));

        foreach ([
            'Super Admin',
            'Administrator',
            'Content Manager',
            'Editor',
            'Sales',
            'HR',
            'Viewer',
        ] as $roleName) {
            Role::findOrCreate($roleName, 'web');
        }

        Role::findByName('Super Admin', 'web')->syncPermissions($permissionModels);
        Role::findByName('Administrator', 'web')->syncPermissions(
            $permissionModels->reject(fn (Permission $permission) => in_array($permission->name, ['users.manage', 'roles.manage'], true)),
        );
        Role::findByName('Content Manager', 'web')->syncPermissions([
            'dashboard.view', 'pages.view', 'pages.update', 'projects.view', 'projects.create',
            'projects.update', 'media.view', 'media.create', 'media.update', 'jobs.view', 'navigation.view', 'navigation.update', 'seo.view', 'seo.update',
        ]);
        Role::findByName('Editor', 'web')->syncPermissions([
            'dashboard.view', 'pages.view', 'pages.update', 'projects.view', 'projects.update',
            'media.view', 'media.create', 'media.update', 'jobs.view', 'jobs.update',
        ]);
        Role::findByName('Sales', 'web')->syncPermissions([
            'dashboard.view', 'projects.view', 'media.view', 'inquiries.view', 'inquiries.update',
        ]);
        Role::findByName('HR', 'web')->syncPermissions([
            'dashboard.view', 'jobs.view', 'jobs.create', 'jobs.update', 'jobs.delete',
            'applications.view', 'applications.update',
        ]);
        Role::findByName('Viewer', 'web')->syncPermissions([
            'dashboard.view', 'pages.view', 'projects.view', 'media.view', 'jobs.view',
            'applications.view', 'inquiries.view', 'settings.view',
        ]);
    }
}
