<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Award;

class AwardsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach ([
            ['title' => '[Award name]', 'year' => 2025, 'description' => 'A short line on what this recognition was for.', 'icon_key' => 'award', 'sort_order' => 1],
            ['title' => '[Award name]', 'year' => 2024, 'description' => 'A short line on what this recognition was for.', 'icon_key' => 'star', 'sort_order' => 2],
            ['title' => '[Award name]', 'year' => 2023, 'description' => 'A short line on what this recognition was for.', 'icon_key' => 'medal', 'sort_order' => 3],
            ['title' => '[Milestone]', 'year' => null, 'description' => 'Four decades of delivery behind every project.', 'icon_key' => 'crown', 'sort_order' => 4],
        ] as $award) {
            Award::updateOrCreate(['title' => $award['title'], 'year' => $award['year']], [...$award, 'is_published' => true]);
        }
    }
}
