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
        foreach ([
            ['name' => 'Hany Saad Innovations', 'role' => 'Architecture & design — KOV'],
            ['name' => 'GRID Architects', 'role' => 'Master planning — Mada'],
            ['name' => 'DMA', 'role' => 'Engineering consultancy — since 1989'],
            ['name' => 'Ahmed Husseini Designs', 'role' => 'Interior design — since 2008'],
            ['name' => 'Green Modeling Contracting', 'role' => 'Construction — 40+ years'],
            ['name' => '[Partner]', 'role' => '[Role / affiliation]'],
        ] as $order => $partner) {
            Partner::updateOrCreate(['name' => $partner['name']], [...$partner, 'sort_order' => $order, 'is_published' => true]);
        }
    }
}
