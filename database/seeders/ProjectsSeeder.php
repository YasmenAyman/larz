<?php

namespace Database\Seeders;

use App\Models\MediaAsset;
use App\Models\NearbyLocation;
use App\Models\PageSection;
use App\Models\Project;
use App\Models\ProjectAmenity;
use App\Models\ProjectCategory;
use App\Models\ProjectGallery;
use App\Models\ProjectStatistic;
use App\Models\ProjectUnitType;
use App\Models\ProjectUpdate;
use Database\Seeders\Support\ProjectPageCopy;
use Illuminate\Database\Seeder;

class ProjectsSeeder extends Seeder
{
    public function run(): void
    {
        $asset = fn (string $file): int => MediaAsset::where('path', 'assets/'.$file)->value('id');
        $categories = [];
        foreach (['Mixed-use', 'Offices & retail', 'Medical', 'Residential'] as $name) {
            $category = ProjectCategory::updateOrCreate(['slug' => str($name)->slug()], ['name' => $name, 'description' => null, 'is_active' => true]);
            $categories[$name] = $category->id;
        }

        $projects = [
            ['slug' => 'klove-new-cairo', 'title' => 'KLOVE New Cairo', 'location' => 'Al-Qornofel, New Cairo', 'status' => null, 'project_type' => 'Residential', 'hero_heading' => 'Come home to quiet.', 'hero_description' => 'A low-rise, green community in New Cairo’s Al-Qornofel — where only a fifth of the land is built on, so your home keeps its light, its air, and its view.', 'hero_image' => 'hero-image-1.png', 'brochure' => 'project_img_2.png', 'virtual_tour_url' => 'https://www.youtube.com/embed/MLpWrANjFbI?si=xdUBsJQ3tkUMv1ZX', 'map_image' => 'Gallery_5.png'],
            ['slug' => 'kov-new-cairo', 'title' => 'KOV New Cairo', 'location' => 'Golden Square, New Cairo', 'status' => 'Under construction', 'project_type' => 'Mixed-use', 'description' => 'KOV New Cairo brings retail, offices and clinics into one calm, walkable address in the heart of the Golden Square — designed around daylight, open plazas and easy arrival.', 'short_description' => 'Where the Golden Square finally slows down.', 'hero_image' => 'project_img_1.png', 'virtual_tour_url' => 'https://www.youtube.com/embed/MLpWrANjFbI?si=xdUBsJQ3tkUMv1ZX', 'map_image' => 'Gallery_1.png'],
            ['slug' => 'larz-business-hub', 'title' => 'LARZ Business Hub', 'location' => 'New Cairo', 'status' => 'Now selling', 'project_type' => 'Offices & retail', 'description' => 'Flexible office floors, ground-level cafés and a courtyard that keeps the working day human — built for companies that want presence without noise.', 'short_description' => 'A workplace that behaves like a neighbourhood.', 'hero_image' => 'project_img_2.png', 'virtual_tour_url' => 'https://www.youtube.com/embed/MLpWrANjFbI?si=xdUBsJQ3tkUMv1ZX', 'map_image' => 'Gallery_2.png'],
            ['slug' => 'larz-medical-park', 'title' => 'LARZ Medical Park', 'location' => 'New Cairo', 'status' => 'Now selling', 'project_type' => 'Medical', 'description' => 'A clinics-and-labs destination with quiet waiting areas, generous circulation and parking that never becomes part of the appointment.', 'short_description' => 'Care, planned around calm.', 'hero_image' => 'project_img_3.png', 'virtual_tour_url' => 'https://www.youtube.com/embed/MLpWrANjFbI?si=xdUBsJQ3tkUMv1ZX', 'map_image' => 'Gallery_3.png'],
            ['slug' => 'larz-riverside', 'title' => 'LARZ Riverside', 'location' => 'New Cairo', 'status' => 'Coming soon', 'project_type' => 'Residential', 'description' => 'Low-rise residences arranged around lakes and open green, with terraces that face the landscape instead of the street.', 'short_description' => 'Living close to water, and to everything.', 'hero_image' => 'project_img_4.png', 'virtual_tour_url' => 'https://www.youtube.com/embed/MLpWrANjFbI?si=xdUBsJQ3tkUMv1ZX', 'map_image' => 'Gallery_4.png'],
        ];

        $models = [];
        foreach ($projects as $data) {
            $models[$data['slug']] = Project::updateOrCreate(
                ['slug' => $data['slug']],
                ['project_category_id' => $categories[$data['project_type']], 'title' => $data['title'], 'location' => $data['location'], 'status' => $data['status'], 'project_type' => $data['project_type'], 'description' => $data['description'] ?? null, 'short_description' => $data['short_description'] ?? null, 'hero_heading' => $data['hero_heading'] ?? null, 'hero_description' => $data['hero_description'] ?? null, 'hero_image_id' => $asset($data['hero_image']), 'brochure_id' => isset($data['brochure']) ? $asset($data['brochure']) : null, 'virtual_tour_url' => $data['virtual_tour_url'] ?? null, 'map_image_id' => isset($data['map_image']) ? $asset($data['map_image']) : null, 'currency' => 'EGP', 'area_unit' => 'm2', 'is_published' => true, 'is_featured' => $data['slug'] === 'klove-new-cairo'],
            );
        }

        $catalog = [
            'kov-new-cairo' => ['facts' => [['12', 'Feddans', 'Integrated district'], ['Mixed-use', 'Typology', 'Retail, offices and clinics'], ['2027', 'Delivery', 'Under construction'], ['180+', 'Units', 'Flexible spaces']], 'highlights' => ['Double-height retail frontage along the main spine', 'Panoramic office floors with private terraces', 'Three levels of covered parking with direct lift access', 'Landscaped plaza with water features and shaded seating'], 'gallery' => ['Gallery_1.png', 'Gallery_2.png', 'Gallery_3.png']],
            'larz-business-hub' => ['facts' => [['8', 'Feddans', 'Office campus'], ['Offices & retail', 'Typology', 'Mixed-use'], ['2026', 'Delivery', 'Now selling'], ['120+', 'Units', 'Flexible plates']], 'highlights' => ['Column-free floor plates from 60 to 400 m²', 'Central courtyard with all-day shade', 'Dedicated visitor drop-off and valet', 'Smart access and building management systems'], 'gallery' => ['Gallery_2.png', 'Gallery_4.png', 'Gallery_5.png']],
            'larz-medical-park' => ['facts' => [['6', 'Feddans', 'Medical campus'], ['Medical', 'Typology', 'Clinics and labs'], ['2027', 'Delivery', 'Now selling'], ['90+', 'Units', 'Flexible clinics']], 'highlights' => ['Clinic units from 45 m² with flexible fit-out', 'Separate patient and staff circulation', 'Pharmacy and diagnostics on the ground floor', 'Naturally lit waiting lounges'], 'gallery' => ['Gallery_3.png', 'Gallery_1.png', 'Gallery_5.png']],
            'larz-riverside' => ['facts' => [['18', 'Feddans', 'Lakeside living'], ['Residential', 'Typology', 'Low-rise'], ['2028', 'Delivery', 'Coming soon'], ['240+', 'Homes', 'Multiple typologies']], 'highlights' => ['Apartments, duplexes and garden homes', 'Only 22% of the land built on', 'Lakeside walking and cycling loop', 'Clubhouse, pools and family lawns'], 'gallery' => ['Gallery_4.png', 'Gallery_5.png', 'Gallery_2.png']],
        ];

        foreach ($catalog as $slug => $content) {
            $project = $models[$slug];
            foreach ($content['facts'] as $order => [$value, $label, $note]) {
                ProjectStatistic::updateOrCreate(['project_id' => $project->id, 'label' => $label], ['value' => $value, 'note' => $note, 'sort_order' => $order, 'is_active' => true]);
            }
            PageSection::updateOrCreate(['page_key' => 'project-'.$slug, 'section_key' => 'highlights'], ['section_type' => 'project.highlights', 'content_snapshot' => ['items' => $content['highlights']], 'status' => 'published', 'published_at' => now(), 'sort_order' => 0]);
            foreach ($content['gallery'] as $order => $file) {
                ProjectGallery::updateOrCreate(['project_id' => $project->id, 'media_asset_id' => $asset($file)], ['alt_text' => $project->title.' gallery image '.($order + 1), 'sort_order' => $order, 'is_published' => true]);
            }
        }

        $klove = $models['klove-new-cairo'];
        foreach ([['24.', 'Feddans', 'Room to breathe'], ['20%', 'Built', 'The other 80% left open'], ['G+5', 'Floors', 'Low-rise, no towers'], ['50–196 m²', 'Homes', 'Studios to duplexes']] as $order => [$value, $label, $note]) {
            ProjectStatistic::updateOrCreate(['project_id' => $klove->id, 'label' => $label], ['value' => $value, 'note' => $note, 'sort_order' => $order, 'is_active' => true]);
        }
        foreach ([['Studio', 'The Studio', '50–54'], ['1 Bedroom', 'Apartment', '78–90'], ['2 Bedroom', 'Apartment', '99–116'], ['Grand 2 Bed', 'Apartment', '125–143'], ['3 Bedroom', 'Apartment', '150–161'], ['Grand 3 Bed', 'Apartment', '170–175'], ['Signature 3 Bed', 'Apartment', '179–190'], ['Duplex', 'The Duplex', '190–196']] as $order => [$tag, $name, $size]) {
            [$sizeMin, $sizeMax] = array_map('floatval', explode('–', $size));
            ProjectUnitType::updateOrCreate(['project_id' => $klove->id, 'tag' => $tag], ['name' => $name, 'size_min' => $sizeMin, 'size_max' => $sizeMax, 'size_unit' => 'm2', 'sort_order' => $order, 'is_published' => true]);
        }
        foreach ([['Wellness & movement', 'user', 'Yoga deck', 'Mornings that start calm, above the water.'], ['Wellness & movement', 'book', 'Reading nook', "A quiet corner that's just yours."], ['Wellness & movement', 'bike', 'Cycling & jogging', 'Your daily loop through the green.'], ['Wellness & movement', 'dumbbell', 'Gym & fitness', 'A workout that never means a commute.'], ['Water & leisure', 'waves', 'Community pool', 'For leisurely swims and lounging.'], ['Water & leisure', 'moon', 'Clubhouse pool', 'An adults-only pool to unwind.'], ['Water & leisure', 'droplet', 'Water features', 'Lakes and water that cool the air.'], ['Water & leisure', 'users', 'Social club', 'Where neighbours become friends.'], ['Family & everyday', 'baby', "Children's play areas", 'Somewhere safe to let them run.'], ['Family & everyday', 'dog', 'Dog park', "The best part of your dog's day."], ['Family & everyday', 'leaf', 'Green spaces', 'Garden wherever you look.'], ['Family & everyday', 'flame', 'Barbecue area', 'Weekend lunches, outdoors.']] as $order => [$group, $icon, $title, $description]) {
            ProjectAmenity::updateOrCreate(['project_id' => $klove->id, 'title' => $title], ['group_name' => $group, 'icon_key' => $icon, 'description' => $description, 'sort_order' => $order, 'is_active' => true]);
        }
        foreach ([['Latest update', 'Structure & landscaping progress', 'Gallery_2.png'], ['Previous', 'Foundations & clusters', 'Gallery_3.png'], ['Earlier', 'Groundworks begin', 'Gallery_4.png']] as $order => [$tag, $title, $file]) {
            ProjectUpdate::updateOrCreate(['project_id' => $klove->id, 'title' => $title], ['media_asset_id' => $asset($file), 'tag' => $tag, 'sort_order' => $order, 'is_published' => true]);
        }
        foreach ([['North Teseen Road', '1 min'], ['Rehab City', '3 min'], ["General Prosecutor's Office", '5 min'], ['American University in Cairo', '7 min'], ['New Administrative Capital', '20 min']] as $order => [$place, $time]) {
            NearbyLocation::updateOrCreate(['project_id' => $klove->id, 'place' => $place], ['time_label' => $time, 'sort_order' => $order, 'is_active' => true]);
        }

        $this->seedProjectChildren($models['kov-new-cairo'], $asset, [
            'unitTypes' => [['Retail', 'Retail unit', '45–120'], ['Office', 'Office', '80–250'], ['Clinic', 'Clinic', '55–95']],
            'amenities' => [['Retail & dining', 'store', 'Ground-floor retail', 'Double-height frontage along the main spine.'], ['Retail & dining', 'coffee', 'Cafés & restaurants', 'Shaded outdoor seating throughout the plaza.'], ['Work & wellness', 'building', 'Office floors', 'Panoramic views with private terraces.'], ['Work & wellness', 'car', 'Covered parking', 'Three levels with direct lift access.']],
            'updates' => [['Latest update', 'Structure & façades', 'Gallery_1.png'], ['Previous', 'Foundations & retail spine', 'Gallery_2.png']],
            'nearby' => [['Golden Square', '2 min'], ['North Teseen Road', '5 min'], ['Rehab City', '8 min'], ['New Administrative Capital', '18 min']],
        ]);

        $this->seedProjectChildren($models['larz-business-hub'], $asset, [
            'unitTypes' => [['Small office', 'Office', '60–90'], ['Mid office', 'Office', '100–180'], ['Large office', 'Office', '200–400']],
            'amenities' => [['Work', 'building', 'Flexible offices', 'Column-free plates from 60 to 400 m².'], ['Work', 'shield', 'Smart access', 'Building management and secure entry.'], ['Daily life', 'tree', 'Central courtyard', 'All-day shade and natural ventilation.'], ['Daily life', 'coffee', 'Ground cafés', 'Coffee and lunch without leaving the building.']],
            'updates' => [['Latest update', 'Façades & lobby', 'Gallery_2.png'], ['Previous', 'Concrete structure', 'Gallery_4.png']],
            'nearby' => [['Teseen Road', '4 min'], ['Golden Square', '10 min'], ['New Administrative Capital', '22 min']],
        ]);

        $this->seedProjectChildren($models['larz-medical-park'], $asset, [
            'unitTypes' => [['Small clinic', 'Clinic', '45–65'], ['Mid clinic', 'Clinic', '70–95'], ['Lab', 'Lab', '80–120']],
            'amenities' => [['Care', 'stethoscope', 'Clinic units', 'From 45 m² with flexible fit-out.'], ['Care', 'pill', 'Pharmacy', 'On the ground floor.'], ['Comfort', 'sofa', 'Waiting lounges', 'Naturally lit lounges.'], ['Comfort', 'car', 'Dedicated parking', 'Patient and staff parking separated.']],
            'updates' => [['Latest update', 'Interior fit-out', 'Gallery_3.png'], ['Previous', 'Structure & services', 'Gallery_1.png']],
            'nearby' => [['Teseen Road', '6 min'], ['New Cairo hospitals', '12 min'], ['New Administrative Capital', '20 min']],
        ]);

        $this->seedProjectChildren($models['larz-riverside'], $asset, [
            'unitTypes' => [['2 Bedroom', 'Apartment', '99–116'], ['3 Bedroom', 'Apartment', '150–161'], ['Duplex', 'Duplex', '190–196'], ['Garden home', 'Garden home', '220–280']],
            'amenities' => [['Water & leisure', 'waves', 'Lakeside loop', 'Walking and cycling loop.'], ['Water & leisure', 'droplet', 'Pools', 'Community and clubhouse pools.'], ['Family', 'home', 'Clubhouse', 'Clubhouse and family lawns.'], ['Family', 'leaf', 'Green spaces', 'Lawns and play areas.']],
            'updates' => [['Latest update', 'Landscaping around the lake', 'Gallery_4.png'], ['Previous', 'Foundations & clusters', 'Gallery_5.png']],
            'nearby' => [['Teseen Road', '7 min'], ['Golden Square', '12 min'], ['New Administrative Capital', '25 min']],
        ]);

        foreach (ProjectPageCopy::slugs() as $slug) {
            $project = $models[$slug]->fresh();
            $copy = ProjectPageCopy::english($slug);
            foreach (ProjectPageCopy::pageSections($slug, $copy) as $section) {
                PageSection::updateOrCreate(['page_key' => $section['page_key'], 'section_key' => $section['section_key']], [...$section, 'status' => 'published', 'published_at' => now(), 'sort_order' => 0]);
            }
            $project->update(['sections' => array_replace($project->sections ?? [], ['en' => ProjectPageCopy::buildSections($project, $copy, 'en')])]);
        }

        $featuredIds = Project::query()->whereIn('slug', ['klove-new-cairo', 'kov-new-cairo', 'larz-business-hub'])->pluck('id')->all();
        $featuredSection = PageSection::query()->where('page_key', 'home')->where('section_key', 'featured_projects')->first();
        if ($featuredSection) {
            $snapshot = $featuredSection->content_snapshot ?? [];
            $snapshot['project_ids'] = $featuredIds;
            $featuredSection->update(['content_snapshot' => $snapshot]);
        }
    }

    /** @param array{unitTypes: list<array{0: string, 1: string, 2: string}>, amenities: list<array{0: string, 1: string, 2: string, 3: string}>, updates: list<array{0: string, 1: string, 2: string}>, nearby: list<array{0: string, 1: string}>} $data */
    private function seedProjectChildren(Project $project, callable $asset, array $data): void
    {
        foreach ($data['unitTypes'] as $order => [$tag, $name, $size]) {
            [$sizeMin, $sizeMax] = array_map('floatval', explode('–', $size));
            ProjectUnitType::updateOrCreate(['project_id' => $project->id, 'tag' => $tag], ['name' => $name, 'size_min' => $sizeMin, 'size_max' => $sizeMax, 'size_unit' => 'm2', 'sort_order' => $order, 'is_published' => true]);
        }
        foreach ($data['amenities'] as $order => [$group, $icon, $title, $description]) {
            ProjectAmenity::updateOrCreate(['project_id' => $project->id, 'title' => $title], ['group_name' => $group, 'icon_key' => $icon, 'description' => $description, 'sort_order' => $order, 'is_active' => true]);
        }
        foreach ($data['updates'] as $order => [$tag, $title, $file]) {
            ProjectUpdate::updateOrCreate(['project_id' => $project->id, 'title' => $title], ['media_asset_id' => $asset($file), 'tag' => $tag, 'sort_order' => $order, 'is_published' => true]);
        }
        foreach ($data['nearby'] as $order => [$place, $time]) {
            NearbyLocation::updateOrCreate(['project_id' => $project->id, 'place' => $place], ['time_label' => $time, 'sort_order' => $order, 'is_active' => true]);
        }
    }
}
