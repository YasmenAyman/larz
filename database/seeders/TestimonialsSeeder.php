<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\MediaAsset;
use App\Models\Testimonial;

class TestimonialsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach ([
            ['name' => 'Ahmed K.', 'role' => 'Business Owner', 'quote' => '"Choosing Larz for our commercial investment was the right decision. The strategic location, modern design, and professional support throughout the process gave us complete confidence in our investment."', 'image' => 'assets/user_2.png'],
            ['name' => 'Muhammed Y.', 'role' => 'Homeowner', 'quote' => '"From the very first consultation to the final handover, the entire experience was seamless. The attention to detail and construction quality exceeded our expectations, making our new home everything we envisioned."', 'image' => 'assets/user_1.png'],
            ['name' => 'Ahmed K.', 'role' => 'Business Owner', 'quote' => '"Choosing Larz for our commercial investment was the right decision. The strategic location, modern design, and professional support throughout the process gave us complete confidence in our investment."', 'image' => 'assets/user_2.png'],
            ['name' => 'Muhammed Y.', 'role' => 'Homeowner', 'quote' => '"From the very first consultation to the final handover, the entire experience was seamless. The attention to detail and construction quality exceeded our expectations, making our new home everything we envisioned."', 'image' => 'assets/user_1.png'],
        ] as $order => $testimonial) {
            $assetId = MediaAsset::where('path', $testimonial['image'])->value('id');
            Testimonial::updateOrCreate(['name' => $testimonial['name'], 'sort_order' => $order], ['role' => $testimonial['role'], 'quote' => $testimonial['quote'], 'media_asset_id' => $assetId, 'is_published' => true]);
        }
    }
}
