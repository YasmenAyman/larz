<?php

namespace Tests\Feature;

use App\Models\Award;
use App\Models\BrochureRequest;
use App\Models\CompanyValue;
use App\Models\ContactInquiry;
use App\Models\GeneralCvSubmission;
use App\Models\InternshipApplication;
use App\Models\InternshipProgram;
use App\Models\Job;
use App\Models\JobApplication;
use App\Models\MediaAsset;
use App\Models\MediaCategory;
use App\Models\MediaPost;
use App\Models\NavigationItem;
use App\Models\PageSection;
use App\Models\Partner;
use App\Models\PhotoGalleryItem;
use App\Models\Project;
use App\Models\ProjectCategory;
use App\Models\ProjectGallery;
use App\Models\ProjectInquiry;
use App\Models\ProjectStatistic;
use App\Models\ProjectUnitType;
use App\Models\ProjectUpdate;
use App\Models\Testimonial;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CmsRelationshipsTest extends TestCase
{
    use RefreshDatabase;

    public function test_project_relationships_are_connected(): void
    {
        $category = ProjectCategory::factory()->create();
        $project = Project::factory()->create(['project_category_id' => $category->id]);
        $asset = MediaAsset::factory()->create();
        $unit = ProjectUnitType::create(['project_id' => $project->id, 'tag' => 'Studio', 'name' => 'The Studio', 'sort_order' => 1]);

        ProjectGallery::create(['project_id' => $project->id, 'media_asset_id' => $asset->id]);
        ProjectStatistic::create(['project_id' => $project->id, 'value' => '24.', 'label' => 'Feddans']);
        ProjectUpdate::create(['project_id' => $project->id, 'media_asset_id' => $asset->id, 'title' => 'Progress']);

        $this->assertTrue($project->category->is($category));
        $this->assertCount(1, $project->galleries);
        $this->assertTrue($project->galleries->first()->media->is($asset));
        $this->assertCount(1, $project->statistics);
        $this->assertCount(1, $project->updates);
        $this->assertTrue($project->unitTypes()->first()->is($unit));
    }

    public function test_media_relationships_are_connected(): void
    {
        $category = MediaCategory::create(['name' => 'Blog', 'slug' => 'blog', 'type' => 'blog']);
        $author = User::factory()->create();
        $asset = MediaAsset::factory()->create();
        $post = MediaPost::factory()->create([
            'media_category_id' => $category->id,
            'author_id' => $author->id,
            'featured_image_id' => $asset->id,
        ]);
        $photo = PhotoGalleryItem::create(['media_asset_id' => $asset->id, 'title' => 'Gallery image']);

        $this->assertTrue($post->category->is($category));
        $this->assertTrue($post->author->is($author));
        $this->assertTrue($post->featuredImage->is($asset));
        $this->assertTrue($category->posts->first()->is($post));
        $this->assertTrue($photo->media->is($asset));
    }

    public function test_career_application_relationships_are_connected(): void
    {
        $job = Job::factory()->create();
        $program = InternshipProgram::create(['title' => 'Summer internship', 'description' => 'Learn with LARZ']);
        $asset = MediaAsset::factory()->create();

        $jobApplication = JobApplication::create(['job_position_id' => $job->id, 'name' => 'Applicant', 'email' => 'applicant@example.test', 'resume_media_id' => $asset->id]);
        $internshipApplication = InternshipApplication::create(['internship_program_id' => $program->id, 'name' => 'Student', 'email' => 'student@example.test', 'resume_media_id' => $asset->id]);
        $cv = GeneralCvSubmission::create(['name' => 'Candidate', 'email' => 'candidate@example.test', 'resume_media_id' => $asset->id]);

        $this->assertTrue($jobApplication->job->is($job));
        $this->assertTrue($job->applications->first()->is($jobApplication));
        $this->assertTrue($internshipApplication->program->is($program));
        $this->assertTrue($program->applications->first()->is($internshipApplication));
        $this->assertTrue($cv->resume->is($asset));
    }

    public function test_lead_relationships_are_connected(): void
    {
        $project = Project::factory()->create();
        $unit = ProjectUnitType::create(['project_id' => $project->id, 'tag' => 'One Bed', 'name' => 'Apartment']);

        $contact = ContactInquiry::create(['name' => 'Contact', 'phone' => '01000000000', 'project_id' => $project->id, 'source' => 'contact']);
        $projectInquiry = ProjectInquiry::create(['project_id' => $project->id, 'project_unit_type_id' => $unit->id, 'name' => 'Buyer', 'phone' => '01000000001', 'source' => 'project']);
        $brochure = BrochureRequest::create(['project_id' => $project->id, 'name' => 'Reader', 'phone' => '01000000002', 'source' => 'brochure']);

        $this->assertTrue($contact->project->is($project));
        $this->assertTrue($projectInquiry->project->is($project));
        $this->assertTrue($projectInquiry->unitType->is($unit));
        $this->assertTrue($brochure->project->is($project));
    }

    public function test_page_and_navigation_relationships_are_connected(): void
    {
        $parent = NavigationItem::create(['label' => 'Projects', 'url' => '/projects', 'location' => 'header']);
        $child = NavigationItem::create(['parent_id' => $parent->id, 'label' => 'KLOVE', 'url' => '/projects/klove', 'location' => 'header']);
        $section = PageSection::create(['page_key' => 'about', 'section_key' => 'hero', 'section_type' => 'about.hero']);

        $this->assertTrue($child->parent->is($parent));
        $this->assertTrue($parent->children->first()->is($child));
        $this->assertSame('about', $section->page_key);
    }

    public function test_company_content_models_support_soft_deletes(): void
    {
        $testimonial = Testimonial::create(['name' => 'Client', 'quote' => 'A quote']);
        $partner = Partner::create(['name' => 'Partner']);
        $award = Award::create(['title' => 'Award']);
        $value = CompanyValue::create(['title' => 'Ownership', 'icon_key' => 'star']);

        $testimonial->delete();
        $partner->delete();
        $award->delete();
        $value->delete();

        $this->assertNotNull($testimonial->fresh()->deleted_at);
        $this->assertNotNull($partner->fresh()->deleted_at);
        $this->assertNotNull($award->fresh()->deleted_at);
        $this->assertNotNull($value->fresh()->deleted_at);
    }
}
