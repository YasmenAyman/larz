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
            ['name' => 'Sara M.', 'role' => 'Investor', 'quote' => '"LARZ delivered exactly what was promised — a well-planned community with strong rental demand and transparent communication at every stage."', 'image' => 'assets/user_2.png'],
            ['name' => 'Omar H.', 'role' => 'Resident', 'quote' => '"The green spaces, low-rise design and thoughtful amenities make everyday life feel calmer. We knew we had chosen the right place from day one."', 'image' => 'assets/user_1.png'],
        ] as $order => $testimonial) {
            $assetId = MediaAsset::where('path', $testimonial['image'])->value('id');
            Testimonial::updateOrCreate(['sort_order' => $order], ['name' => $testimonial['name'], 'role' => $testimonial['role'], 'quote' => $testimonial['quote'], 'media_asset_id' => $assetId, 'is_published' => true]);
        }
    }
}
