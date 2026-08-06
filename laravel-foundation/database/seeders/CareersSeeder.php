<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\CompanyValue;
use App\Models\InternshipProgram;
use App\Models\Job;

class CareersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach ([
            ['title' => 'Purposeful work', 'description' => 'What you build here becomes where people live their lives.', 'icon_key' => 'heart', 'sort_order' => 1],
            ['title' => 'Growth & mentorship', 'description' => 'Learn from founders with 40 years in the field.', 'icon_key' => 'growth', 'sort_order' => 2],
            ['title' => 'Wellbeing', 'description' => 'A culture that values balance as much as ambition.', 'icon_key' => 'leaf', 'sort_order' => 3],
            ['title' => 'Ownership', 'description' => 'Real responsibility, and the room to make it yours.', 'icon_key' => 'medal', 'sort_order' => 4],
        ] as $value) {
            CompanyValue::updateOrCreate(['title' => $value['title']], [...$value, 'is_published' => true]);
        }

        $jobs = [
            ['title' => 'Sales Consultant', 'slug' => 'sales-consultant', 'department' => 'Sales', 'location' => 'New Cairo', 'employment_type' => 'Full-time'],
            ['title' => 'Architect', 'slug' => 'architect', 'department' => 'Design', 'location' => 'New Administrative Capital', 'employment_type' => 'Full-time'],
            ['title' => 'Digital Marketing Specialist', 'slug' => 'digital-marketing-specialist', 'department' => 'Marketing', 'location' => 'New Cairo', 'employment_type' => 'Full-time'],
            ['title' => 'Site Engineer', 'slug' => 'site-engineer', 'department' => 'Construction', 'location' => 'New Administrative Capital', 'employment_type' => 'Full-time'],
            ['title' => 'Senior Architect', 'slug' => 'senior-architect', 'department' => 'Architecture', 'location' => 'Cairo, Egypt', 'employment_type' => 'Full Time', 'summary' => 'Lead high-end architectural projects from concept to completion.', 'description' => 'Lead the design and delivery of high-end residential and commercial developments with multidisciplinary teams.', 'requirements' => "Bachelor's degree in Architecture.\n5+ years of professional experience.\nStrong design and communication skills.", 'responsibilities' => 'Lead architectural projects from concept to completion.\nDevelop functional and sustainable design solutions.\nCoordinate with engineers, consultants, and project teams.'],
            ['title' => 'Project Engineer', 'slug' => 'project-engineer', 'department' => 'Engineering', 'location' => 'Cairo, Egypt', 'employment_type' => 'Full Time', 'summary' => 'Coordinate the technical delivery of ambitious developments.', 'description' => 'Oversee technical delivery, site execution, quality, and schedules across multidisciplinary teams.', 'requirements' => "Bachelor's degree in Engineering.\n4+ years of development experience.\nStrong coordination and reporting skills.", 'responsibilities' => 'Coordinate site execution and technical delivery.\nReview shop drawings and submittals.\nTrack schedules, budgets, and progress.'],
            ['title' => 'Interior Designer', 'slug' => 'interior-designer', 'department' => 'Design', 'location' => 'Cairo, Egypt', 'employment_type' => 'Full Time', 'summary' => 'Craft refined interiors that elevate everyday experience.', 'description' => 'Translate concepts into detailed, buildable interiors for residential and hospitality spaces.', 'requirements' => "Bachelor's degree in Interior Design or Architecture.\n3+ years of experience.\nA strong portfolio of interior work.", 'responsibilities' => 'Develop interior concepts and material palettes.\nProduce detailed drawings and specifications.\nCoordinate with architects and consultants.'],
        ];
        foreach ($jobs as $job) {
            Job::updateOrCreate(['slug' => $job['slug']], [...$job, 'is_published' => true, 'is_featured' => in_array($job['slug'], ['sales-consultant', 'architect', 'digital-marketing-specialist', 'site-engineer'], true)]);
        }

        InternshipProgram::updateOrCreate(['title' => 'Internship programs'], ['description' => "Our internships give students and recent graduates real work across design, marketing, sales and engineering — with mentorship from people who've done it for decades.", 'cta_label' => 'Apply for an internship', 'is_published' => true, 'sort_order' => 1]);
    }
}
