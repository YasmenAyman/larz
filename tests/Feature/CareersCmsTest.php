<?php

namespace Tests\Feature;

use App\Models\Job;
use App\Models\JobApplication;
use App\Models\MediaAsset;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Models\Permission;
use Tests\TestCase;

class CareersCmsTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
    }

    public function test_jobs_can_be_created_and_updated_by_a_permitted_user(): void
    {
        $user = $this->permittedUser(['jobs.view', 'jobs.create', 'jobs.update']);

        $this->actingAs($user)->post('/admin/jobs', [
            'title' => 'Senior Architect',
            'slug' => 'senior-architect',
            'department' => 'Design',
            'location' => 'Dubai',
            'employment_type' => 'Full-time',
            'experience_level' => 'Senior',
            'summary' => 'Lead design delivery.',
            'sort_order' => 1,
            'is_published' => false,
            'is_featured' => false,
        ])->assertRedirect(route('admin.jobs.index'));

        $job = Job::query()->where('slug', 'senior-architect')->firstOrFail();
        $this->assertFalse($job->is_published);

        $this->actingAs($user)->put("/admin/jobs/{$job->id}", [
            'title' => 'Principal Architect',
            'slug' => 'principal-architect',
            'department' => 'Design',
            'location' => 'Dubai',
            'employment_type' => 'Full-time',
            'experience_level' => 'Principal',
            'sort_order' => 1,
            'is_published' => true,
            'is_featured' => true,
        ])->assertRedirect();

        $this->assertDatabaseHas('job_positions', [
            'id' => $job->id,
            'slug' => 'principal-architect',
            'is_published' => true,
            'is_featured' => true,
        ]);
    }

    public function test_application_workflow_and_private_cv_download_are_authorized(): void
    {
        Storage::fake('local');
        $user = $this->permittedUser(['applications.view', 'applications.update']);
        $job = Job::create([
            'title' => 'Project Manager',
            'slug' => 'project-manager',
            'department' => 'Operations',
            'location' => 'Dubai',
            'employment_type' => 'Full-time',
        ]);
        Storage::disk('local')->put('private/cvs/applicant.pdf', 'resume');
        $asset = MediaAsset::create([
            'disk' => 'local',
            'path' => 'private/cvs/applicant.pdf',
            'original_name' => 'applicant.pdf',
            'mime_type' => 'application/pdf',
            'size_bytes' => 6,
        ]);
        $application = JobApplication::create([
            'job_position_id' => $job->id,
            'name' => 'Applicant Name',
            'email' => 'applicant@example.com',
            'resume_media_id' => $asset->id,
        ]);

        $this->actingAs($user)->get('/admin/job-applications')
            ->assertSuccessful()
            ->assertInertia(fn ($page) => $page->component('Admin/Careers/Applications/Index')->where('type', 'job'));

        $this->actingAs($user)->put("/admin/job-applications/{$application->id}", [
            'status' => 'shortlisted',
            'assigned_to' => $user->id,
            'admin_notes' => 'Invite to first interview.',
        ])->assertRedirect();

        $this->assertDatabaseHas('job_applications', [
            'id' => $application->id,
            'status' => 'shortlisted',
            'assigned_to' => $user->id,
            'admin_notes' => 'Invite to first interview.',
        ]);

        $this->actingAs($user)->get("/admin/job-applications/{$application->id}/cv")
            ->assertDownload('applicant.pdf');
    }

    public function test_public_cv_submission_is_stored_on_the_private_disk(): void
    {
        Storage::fake('local');

        $this->post('/career-general-applications', [
            'name' => 'Public Applicant',
            'email' => 'public@example.com',
            'phone' => '971500000000',
            'resume' => UploadedFile::fake()->create('public-resume.pdf', 20, 'application/pdf'),
            'consent_at' => now()->toISOString(),
        ])->assertRedirect();

        $submission = \App\Models\GeneralCvSubmission::query()->where('email', 'public@example.com')->firstOrFail();
        $asset = MediaAsset::findOrFail($submission->resume_media_id);

        $this->assertSame('local', $asset->disk);
        Storage::disk('local')->assertExists($asset->path);
    }

    private function permittedUser(array $permissions): User
    {
        $user = User::factory()->create(['email_verified_at' => now()]);
        $user->givePermissionTo(Permission::whereIn('name', array_merge(['dashboard.view'], $permissions))->get());

        return $user;
    }
}
