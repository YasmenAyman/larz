<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\NavigationItem;

class NavigationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $items = [
            ['label' => 'Home', 'url' => '/', 'location' => 'header', 'sort_order' => 1],
            ['label' => 'About US', 'url' => '/about', 'location' => 'header', 'sort_order' => 2],
            ['label' => 'Projects', 'url' => '/projects', 'location' => 'header', 'sort_order' => 3],
            ['label' => 'Media', 'url' => '/media', 'location' => 'header', 'sort_order' => 4],
            ['label' => 'Careers', 'url' => '/careers', 'location' => 'header', 'sort_order' => 5],
            ['label' => 'Contact Us', 'url' => '/contact', 'location' => 'header', 'sort_order' => 6],
            ['label' => 'Home', 'url' => '/', 'location' => 'footer', 'sort_order' => 1],
            ['label' => 'About Us', 'url' => '/about', 'location' => 'footer', 'sort_order' => 2],
            ['label' => 'Projects', 'url' => '/projects', 'location' => 'footer', 'sort_order' => 3],
            ['label' => 'Media', 'url' => '/media', 'location' => 'footer', 'sort_order' => 4],
        ];

        foreach ($items as $item) {
            NavigationItem::updateOrCreate(['location' => $item['location'], 'label' => $item['label']], [...$item, 'target' => '_self', 'is_active' => true]);
        }
    }
}
