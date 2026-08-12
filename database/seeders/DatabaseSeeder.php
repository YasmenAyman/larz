<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(RolePermissionSeeder::class);
        $this->call([
            SiteSettingsSeeder::class,
            NavigationSeeder::class,
            PageSectionsSeeder::class,
            MediaSeeder::class,
            ProjectsSeeder::class,
            CareersSeeder::class,
            PartnersSeeder::class,
            AwardsSeeder::class,
            TestimonialsSeeder::class,
            ArabicContentSeeder::class,
        ]);
    }
}
