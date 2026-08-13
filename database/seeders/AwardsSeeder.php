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
        Award::query()->where('title', '[Award name]')->delete();

        foreach ([
            ['title' => 'Best Residential Development', 'year' => 2025, 'description' => 'Recognised for KLOVE New Cairo\'s low-density masterplan and landscape design.', 'icon_key' => 'award', 'sort_order' => 1],
            ['title' => 'Excellence in Mixed-Use Design', 'year' => 2024, 'description' => 'Awarded for KOV New Cairo\'s integrated retail and office experience.', 'icon_key' => 'star', 'sort_order' => 2],
            ['title' => 'Green Building Certification', 'year' => 2023, 'description' => 'LEED recognition for LARZ Business Hub\'s sustainable workplace design.', 'icon_key' => 'medal', 'sort_order' => 3],
            ['title' => '40 Years of Delivery', 'year' => null, 'description' => 'Four decades of founding experience behind every LARZ project.', 'icon_key' => 'crown', 'sort_order' => 4],
        ] as $award) {
            Award::updateOrCreate(['sort_order' => $award['sort_order']], [...$award, 'is_published' => true]);
        }
    }
}
