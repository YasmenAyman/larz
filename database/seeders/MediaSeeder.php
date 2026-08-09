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
            ['slug' => 'larz-announces-new-cairo-community', 'category_id' => $press->id, 'type' => 'press', 'date' => '2026-07-12', 'title' => 'LARZ announces its newest New Cairo community', 'excerpt' => 'A short standfirst summarising the announcement in a line or two.', 'image' => 'Gallery_1.png'],
            ['slug' => 'construction-milestone-reached-at-mada', 'category_id' => $press->id, 'type' => 'press', 'date' => '2026-06-28', 'title' => 'Construction milestone reached at Mada', 'excerpt' => 'A short standfirst summarising the announcement in a line or two.', 'image' => 'Gallery_2.png'],
            ['slug' => 'larz-business-hub-leed-recognition', 'category_id' => $press->id, 'type' => 'press', 'date' => '2026-06-05', 'title' => 'LARZ Business Hub earns LEED recognition', 'excerpt' => 'A short standfirst summarising the announcement in a line or two.', 'image' => 'Gallery_3.png'],
            ['slug' => 'what-to-look-for-in-a-new-cairo-community', 'category_id' => $blog->id, 'type' => 'blog', 'date' => '2026-05-22', 'title' => 'What to look for in a New Cairo community', 'excerpt' => 'A short teaser line for the article goes here.', 'image' => 'project_img_1.png'],
            ['slug' => 'why-low-density-living-changes-everything', 'category_id' => $blog->id, 'type' => 'blog', 'date' => '2026-05-10', 'title' => 'Why low-density living changes everything', 'excerpt' => 'A short teaser line for the article goes here.', 'image' => 'project_img_2.png'],
            ['slug' => 'payment-plans-explained-simply', 'category_id' => $blog->id, 'type' => 'blog', 'date' => '2026-05-03', 'title' => 'Payment plans, explained simply', 'excerpt' => 'A short teaser line for the article goes here.', 'image' => 'herobg.png'],
        ];
        foreach ($posts as $post) {
            MediaPost::updateOrCreate(['slug' => $post['slug']], ['media_category_id' => $post['category_id'], 'type' => $post['type'], 'title' => $post['title'], 'excerpt' => $post['excerpt'], 'featured_image_id' => $assets[$post['image']]->id, 'event_date' => $post['date'], 'is_featured' => false, 'is_published' => true, 'published_at' => $post['date']]);
        }

        $galleryFiles = ['Gallery_1.png', 'Gallery_2.png', 'Gallery_3.png', 'Gallery_4.png', 'Gallery_5.png', 'project_img_1.png', 'project_img_2.png', 'herobg.png'];
        foreach ($galleryFiles as $order => $file) {
            PhotoGalleryItem::updateOrCreate(['media_asset_id' => $assets[$file]->id], ['title' => null, 'alt_text' => 'LARZ gallery photo', 'sort_order' => $order, 'is_published' => true]);
        }
    }
}
