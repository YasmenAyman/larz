<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\MediaAsset;
use App\Models\MediaCategory;
use App\Models\MediaPost;
use App\Models\PhotoGalleryItem;

class MediaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Development/content baseline extracted from src/components/media/MediaSections.tsx.
        $files = ['user_2.png', 'user_1.png', 'TYPE-B-IMAGE-01.png', 'TYPE-B-IMAGE-02-1.png', 'TOWN-HOUSE-02-RENDERED.png', 'TOWN-HOUSE-01-RENDERED.png', 'tower_img.png', 'review_bg.png', 'related_bg.png', 'project_img_4.png', 'project_img_3.png', 'project_img_2.png', 'project_img_1.png', 'OpenPositions-bg.png', 'new_mask.png', 'IMAGE-03-RENDERED.png', 'IMAGE-02-RENDERED-1.png', 'IMAGE-01-RENDERED-1.png', 'herobg.png', 'hero-image-3.png', 'hero-image-2.png', 'hero-image-1.png', 'Gallery_5.png', 'Gallery_4.png', 'Gallery_3.png', 'Gallery_2.png', 'Gallery_1.png', 'Footer_bg.png', 'DSC04295-HDR.jpg', 'DSC04142-HDR.jpg', 'carrers_bg.png'];
        $assets = [];
        foreach ($files as $file) {
            $extension = strtolower(pathinfo($file, PATHINFO_EXTENSION));
            $mime = in_array($extension, ['jpg', 'jpeg'], true) ? 'image/jpeg' : 'image/png';
            $assets[$file] = MediaAsset::updateOrCreate(['path' => 'assets/'.$file], ['disk' => 'public', 'original_name' => $file, 'mime_type' => $mime, 'size_bytes' => 0, 'alt_text' => pathinfo($file, PATHINFO_FILENAME)]);
        }

        $press = MediaCategory::updateOrCreate(['slug' => 'press'], ['name' => 'Press releases', 'type' => 'press']);
        $blog = MediaCategory::updateOrCreate(['slug' => 'blog'], ['name' => 'Blogs', 'type' => 'blog']);
        $posts = [
            ['slug' => 'larz-announces-new-cairo-community', 'category_id' => $press->id, 'type' => 'press', 'date' => '2026-07-12', 'title' => 'LARZ announces its newest New Cairo community', 'excerpt' => 'A low-rise, green community in Al-Qornofel designed around light, air and open space.', 'content' => '<p>LARZ Developments has unveiled its newest residential community in New Cairo\'s Al-Qornofel district — a low-rise, landscape-led neighbourhood where only a fifth of the land is built on.</p><p>The masterplan prioritises daylight, ventilation and long views, with homes ranging from studios to duplexes across eight typologies.</p>', 'image' => 'Gallery_1.png'],
            ['slug' => 'construction-milestone-reached-at-mada', 'category_id' => $press->id, 'type' => 'press', 'date' => '2026-06-28', 'title' => 'Construction milestone reached at Mada', 'excerpt' => 'Structural works advance on schedule as landscaping and public realm take shape.', 'content' => '<p>LARZ has reached a major construction milestone at Mada, with structural works progressing on schedule across the first residential clusters.</p><p>Landscaping and the central spine are now taking form, giving future residents an early view of the open, walkable environment planned for the community.</p>', 'image' => 'Gallery_2.png'],
            ['slug' => 'larz-business-hub-leed-recognition', 'category_id' => $press->id, 'type' => 'press', 'date' => '2026-06-05', 'title' => 'LARZ Business Hub earns LEED recognition', 'excerpt' => 'The New Cairo workplace development is recognised for sustainable design and operational efficiency.', 'content' => '<p>LARZ Business Hub has received LEED recognition for its sustainable workplace design, including efficient floor plates, natural light and a central courtyard that reduces reliance on artificial cooling.</p><p>The project continues to attract companies seeking a professional address with a calmer, more human working environment.</p>', 'image' => 'Gallery_3.png'],
            ['slug' => 'what-to-look-for-in-a-new-cairo-community', 'category_id' => $blog->id, 'type' => 'blog', 'date' => '2026-05-22', 'title' => 'What to look for in a New Cairo community', 'excerpt' => 'Five questions that help you compare masterplans, density and long-term value.', 'content' => '<p>Choosing a community in New Cairo is about more than floor plans. Density, access, green space and the quality of everyday amenities all shape how a place feels years after handover.</p><p>We outline five practical questions to ask before you commit — from how much of the land is left open to how easy it is to move in and out every day.</p>', 'image' => 'project_img_1.png'],
            ['slug' => 'why-low-density-living-changes-everything', 'category_id' => $blog->id, 'type' => 'blog', 'date' => '2026-05-10', 'title' => 'Why low-density living changes everything', 'excerpt' => 'How fewer floors and more open space affect light, privacy and resale value.', 'content' => '<p>Low-density masterplans change the rhythm of daily life: quieter mornings, better light and views that are not blocked by the next tower.</p><p>At LARZ, we plan communities where buildings occupy a fraction of the land so residents keep the things that are hardest to retrofit later — air, space and calm.</p>', 'image' => 'project_img_2.png'],
            ['slug' => 'payment-plans-explained-simply', 'category_id' => $blog->id, 'type' => 'blog', 'date' => '2026-05-03', 'title' => 'Payment plans, explained simply', 'excerpt' => 'A plain-language guide to deposits, instalments and handover schedules.', 'content' => '<p>Payment plans do not need to be confusing. Most LARZ plans combine an initial deposit with staged instalments aligned to construction milestones.</p><p>Understanding what is due, when it is due and what happens at handover helps you plan with confidence — this guide breaks it down without the jargon.</p>', 'image' => 'herobg.png'],
        ];
        foreach ($posts as $post) {
            MediaPost::updateOrCreate(['slug' => $post['slug']], ['media_category_id' => $post['category_id'], 'type' => $post['type'], 'title' => $post['title'], 'excerpt' => $post['excerpt'], 'content' => $post['content'], 'featured_image_id' => $assets[$post['image']]->id, 'event_date' => $post['date'], 'is_featured' => false, 'is_published' => true, 'published_at' => $post['date']]);
        }

        $galleryFiles = ['Gallery_1.png', 'Gallery_2.png', 'Gallery_3.png', 'Gallery_4.png', 'Gallery_5.png', 'project_img_1.png', 'project_img_2.png', 'herobg.png'];
        foreach ($galleryFiles as $order => $file) {
            PhotoGalleryItem::updateOrCreate(['media_asset_id' => $assets[$file]->id], ['title' => null, 'alt_text' => 'LARZ gallery photo', 'sort_order' => $order, 'is_published' => true]);
        }
    }
}
