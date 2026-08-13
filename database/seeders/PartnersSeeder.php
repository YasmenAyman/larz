<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Partner;

class PartnersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Partner::query()->where('name', '[Partner]')->delete();

        foreach ([
            ['name' => 'Hany Saad Innovations', 'role' => 'Architecture & design — KOV', 'description' => 'Lead architectural partner for KOV New Cairo, shaping the project\'s calm, walkable streetscape.'],
            ['name' => 'GRID Architects', 'role' => 'Master planning — Mada', 'description' => 'Master planning partner delivering the open, low-rise framework at Mada.'],
            ['name' => 'DMA', 'role' => 'Engineering consultancy — since 1989', 'description' => 'Structural and MEP engineering consultancy supporting delivery across LARZ developments.'],
            ['name' => 'Ahmed Husseini Designs', 'role' => 'Interior design — since 2008', 'description' => 'Interior design partner for show homes, sales centres and resident-facing spaces.'],
            ['name' => 'Green Modeling Contracting', 'role' => 'Construction — 40+ years', 'description' => 'Construction partner with four decades of experience in high-quality residential delivery.'],
        ] as $order => $partner) {
            Partner::updateOrCreate(['sort_order' => $order], [...$partner, 'is_published' => true]);
        }
    }
}
