<?php

namespace Tests\Feature;

use App\Models\BrochureRequest;
use App\Models\ContactInquiry;
use App\Models\GeneralCvSubmission;
use App\Models\InternshipApplication;
use App\Models\InternshipProgram;
use App\Models\Job;
use App\Models\JobApplication;
use App\Models\MediaAsset;
use App\Models\NewsletterSubscriber;
use App\Models\Project;
use App\Models\ProjectInquiry;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

/**
 * End-to-end coverage for every public form submission on the site:
 *
 *  - contact-us
 *  - project-inquiries
 *  - brochure-requests
 *  - newsletter-subscriptions
 *  - careers/{slug}/apply
 *  - career-general-applications
 *  - internship-applications
 *
 * For each we exercise: valid submission, invalid submission, honeypot
 * rejection, duplicate handling (newsletter), unauthorized file type, file
 * size cap, and database persistence. Rate limiting is verified once on the
 * highest-traffic endpoint.
 */
class PublicFormSubmissionsTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Mail::fake();
        Storage::fake('local');
    }

    private function publishedProject(): Project
    {
        return Project::create([
            'title' => 'KLOVE New Cairo',
            'slug' => 'klove-new-cairo',
            'location' => 'New Cairo',
            'is_published' => true,
            'is_featured' => true,
            'currency' => 'EGP',
            'area_unit' => 'm2',
        ]);
    }

    private function publishedJob(): Job
    {
        return Job::create([
            'title' => 'Sales Consultant',
            'slug' => 'sales-consultant',
            'department' => 'Sales',
            'location' => 'New Cairo',
            'employment_type' => 'Full-time',
            'is_published' => true,
        ]);
    }

    private function internshipProgram(): InternshipProgram
    {
        return InternshipProgram::create([
            'title' => 'Internship programs',
            'description' => 'Learn with the team.',
            'is_published' => true,
            'sort_order' => 1,
        ]);
    }

    // -----------------------------------------------------------------
    // /contact-us
    // -----------------------------------------------------------------

    public function test_contact_submission_is_persisted_with_source_url(): void
    {
        $project = $this->publishedProject();

        $response = $this->post('/contact-us', [
            'name' => 'Layla Visitor',
            'phone' => '201000000000',
            'email' => 'layla@example.test',
            'project_id' => $project->id,
            'message' => 'Tell me about pricing.',
            'consent_at' => now()->toISOString(),
            'source_url' => 'https://larz.test/contact-us',
        ]);

        $response->assertSessionHas('success');
        $this->assertDatabaseHas('contact_inquiries', [
            'name' => 'Layla Visitor',
            'email' => 'layla@example.test',
            'phone' => '201000000000',
            'project_id' => $project->id,
            'status' => 'new',
            'source_url' => 'https://larz.test/contact-us',
        ]);
        Mail::assertQueuedCount(2);
    }

    public function test_contact_submission_with_invalid_data_returns_errors(): void
    {
        $this->post('/contact-us', [
            'name' => '',
            'phone' => '',
        ])->assertSessionHasErrors(['name', 'phone']);

        $this->assertDatabaseCount('contact_inquiries', 0);
        Mail::assertNothingQueued();
    }

    public function test_contact_submission_rejects_invalid_name_phone_and_email_formats(): void
    {
        $this->post('/contact-us', [
            'name' => 'John123',
            'phone' => '+201000000000',
            'email' => 'not-an-email',
        ])->assertSessionHasErrors(['name', 'phone', 'email']);

        $this->post('/contact-us', [
            'name' => 'Jane Doe',
            'phone' => '201000000000',
            'email' => 'partial@',
        ])->assertSessionHasErrors(['email']);

        $this->assertDatabaseCount('contact_inquiries', 0);
        Mail::assertNothingQueued();
    }

    public function test_contact_submission_honeypot_is_rejected_silently(): void
    {
        $this->post('/contact-us', [
            'name' => 'Bot McBot',
            'phone' => '+201000000001',
            '_hp_website' => 'I am a bot',
        ])->assertSessionHasErrors('_hp_website');

        $this->assertDatabaseCount('contact_inquiries', 0);
        Mail::assertNothingQueued();
    }

    // -----------------------------------------------------------------
    // /project-inquiries
    // -----------------------------------------------------------------

    public function test_project_inquiry_is_persisted(): void
    {
        $project = $this->publishedProject();

        $this->post('/project-inquiries', [
            'project_id' => $project->id,
            'name' => 'Buyer One',
            'phone' => '+201000000002',
            'email' => 'buyer@example.test',
            'preferred_contact_method' => 'whatsapp',
            'message' => 'Interested in the 3-bedroom units.',
            'source_url' => 'https://larz.test/projects',
        ])->assertSessionHas('success');

        $this->assertDatabaseHas('project_inquiries', [
            'project_id' => $project->id,
            'name' => 'Buyer One',
            'preferred_contact_method' => 'whatsapp',
            'status' => 'new',
            'source_url' => 'https://larz.test/projects',
        ]);
    }

    public function test_project_inquiry_rejects_unpublished_project(): void
    {
        $unpublished = Project::create([
            'title' => 'Hidden', 'slug' => 'hidden', 'is_published' => false,
        ]);

        $this->post('/project-inquiries', [
            'project_id' => $unpublished->id,
            'name' => 'Buyer', 'phone' => '+201000000003',
        ])->assertSessionHasErrors('project_id');

        $this->assertDatabaseCount('project_inquiries', 0);
    }

    // -----------------------------------------------------------------
    // /brochure-requests
    // -----------------------------------------------------------------

    public function test_brochure_request_is_persisted(): void
    {
        $project = $this->publishedProject();

        $this->post('/brochure-requests', [
            'project_id' => $project->id,
            'name' => 'Reader',
            'phone' => '201000000004',
            'email' => 'reader@example.test',
        ])->assertSessionHas('success');

        $this->assertDatabaseHas('brochure_requests', [
            'project_id' => $project->id,
            'name' => 'Reader',
            'status' => 'new',
        ]);
    }

    public function test_brochure_request_rejects_invalid_name_and_phone(): void
    {
        $project = $this->publishedProject();

        $this->post('/brochure-requests', [
            'project_id' => $project->id,
            'name' => 'John$$',
            'phone' => '2rr',
        ])->assertSessionHasErrors(['name', 'phone']);

        $this->assertDatabaseCount('brochure_requests', 0);
    }

    // -----------------------------------------------------------------
    // /newsletter-subscriptions (duplicate safe)
    // -----------------------------------------------------------------

    public function test_newsletter_subscription_persists_new_subscriber(): void
    {
        $this->post('/newsletter-subscriptions', [
            'email' => 'subscriber@example.test',
            'source_url' => 'https://larz.test/media',
            'consent_at' => now()->toISOString(),
        ])->assertSessionHas('success');

        $this->assertDatabaseHas('newsletter_subscribers', [
            'email' => 'subscriber@example.test',
            'status' => 'active',
            'source_url' => 'https://larz.test/media',
        ]);
    }

    public function test_newsletter_subscription_is_idempotent_for_active_subscribers(): void
    {
        NewsletterSubscriber::create([
            'email' => 'repeat@example.test',
            'status' => 'active',
            'subscribed_at' => now()->subDay(),
        ]);

        $this->post('/newsletter-subscriptions', [
            'email' => 'repeat@example.test',
        ])->assertSessionHas('success');

        $this->assertSame(1, NewsletterSubscriber::query()->where('email', 'repeat@example.test')->count());
    }

    public function test_newsletter_subscription_rejects_invalid_email(): void
    {
        $this->post('/newsletter-subscriptions', [
            'email' => 'not-an-email',
        ])->assertSessionHasErrors('email');

        $this->post('/newsletter-subscriptions', [
            'email' => 'partial@',
        ])->assertSessionHasErrors('email');

        $this->post('/newsletter-subscriptions', [
            'email' => 'user@domain',
        ])->assertSessionHasErrors('email');

        $this->assertDatabaseCount('newsletter_subscribers', 0);
    }

    public function test_newsletter_subscription_honeypot_blocks_bots(): void
    {
        $this->post('/newsletter-subscriptions', [
            'email' => 'bot@example.test',
            '_hp_website' => 'spam',
        ])->assertSessionHasErrors('_hp_website');

        $this->assertDatabaseCount('newsletter_subscribers', 0);
    }

    public function test_newsletter_subscription_is_rate_limited(): void
    {
        // Newsletter throttle is 3/minute.
        for ($i = 0; $i < 3; $i++) {
            $this->post('/newsletter-subscriptions', ['email' => "user{$i}@example.test"])->assertSessionHas('success');
        }
        $this->post('/newsletter-subscriptions', ['email' => 'over@example.test'])
            ->assertStatus(429);
    }

    // -----------------------------------------------------------------
    // /careers/{slug}/apply (job by slug)
    // -----------------------------------------------------------------

    public function test_job_application_by_slug_persists_with_resume(): void
    {
        $job = $this->publishedJob();
        $resume = UploadedFile::fake()->create('cv.pdf', 200, 'application/pdf');

        $this->post("/careers/{$job->slug}/apply", [
            'name' => 'Applicant',
            'email' => 'applicant@example.test',
            'phone' => '201000000010',
            'city' => 'Cairo',
            'linkedin_url' => 'https://linkedin.com/in/applicant',
            'cover_note' => 'I would love to join.',
            'resume' => $resume,
        ])->assertSessionHas('success');

        $application = JobApplication::query()->where('email', 'applicant@example.test')->firstOrFail();
        $this->assertSame($job->id, $application->job_position_id);
        $this->assertSame('new', $application->status);
        $this->assertNotNull($application->resume_media_id);
        Storage::disk('local')->assertExists(MediaAsset::find($application->resume_media_id)->path);
    }

    public function test_job_application_rejects_unauthorized_file_type(): void
    {
        $job = $this->publishedJob();
        $bad = UploadedFile::fake()->create('photo.png', 50, 'image/png');

        $this->post("/careers/{$job->slug}/apply", [
            'name' => 'Applicant',
            'email' => 'applicant@example.test',
            'phone' => '201000000011',
            'resume' => $bad,
        ])->assertSessionHasErrors('resume');

        $this->assertDatabaseCount('job_applications', 0);
    }

    public function test_job_application_rejects_oversized_file(): void
    {
        $job = $this->publishedJob();
        // 11 MB > 10 MB cap.
        $huge = UploadedFile::fake()->create('cv.pdf', 11 * 1024, 'application/pdf');

        $this->post("/careers/{$job->slug}/apply", [
            'name' => 'Applicant',
            'email' => 'applicant@example.test',
            'phone' => '201000000012',
            'resume' => $huge,
        ])->assertSessionHasErrors('resume');

        $this->assertDatabaseCount('job_applications', 0);
    }

    public function test_job_application_requires_resume(): void
    {
        $job = $this->publishedJob();

        $this->post("/careers/{$job->slug}/apply", [
            'name' => 'Applicant',
            'email' => 'applicant@example.test',
            'phone' => '201000000013',
        ])->assertSessionHasErrors('resume');
    }

    public function test_job_application_rejects_unknown_slug(): void
    {
        $this->post('/careers/does-not-exist/apply', [
            'name' => 'Applicant',
            'email' => 'applicant@example.test',
            'phone' => '201000000014',
            'resume' => UploadedFile::fake()->create('cv.pdf', 100, 'application/pdf'),
        ])->assertNotFound();

        $this->assertDatabaseCount('job_applications', 0);
    }

    // -----------------------------------------------------------------
    // /career-general-applications (general CV)
    // -----------------------------------------------------------------

    public function test_general_cv_submission_persists(): void
    {
        $resume = UploadedFile::fake()->create('general.pdf', 150, 'application/pdf');

        $this->post('/career-general-applications', [
            'name' => 'General Candidate',
            'email' => 'general@example.test',
            'phone' => '201000000020',
            'city' => 'Cairo',
            'linkedin_url' => 'https://linkedin.com/in/general',
            'cover_letter' => 'Open to any opportunity.',
            'resume' => $resume,
        ])->assertSessionHas('success');

        $this->assertDatabaseHas('general_cv_submissions', [
            'email' => 'general@example.test',
            'status' => 'new',
        ]);
    }

    public function test_general_cv_submission_rejects_invalid_data(): void
    {
        $this->post('/career-general-applications', [
            'name' => '',
            'email' => 'broken',
            'phone' => '',
        ])->assertSessionHasErrors(['name', 'email', 'phone', 'resume']);

        $this->post('/career-general-applications', [
            'name' => 'John123',
            'email' => 'partial@example',
            'phone' => '+201000000000',
            'resume' => UploadedFile::fake()->create('cv.pdf', 100, 'application/pdf'),
        ])->assertSessionHasErrors(['name', 'phone', 'email']);
    }

    // -----------------------------------------------------------------
    // /internship-applications
    // -----------------------------------------------------------------

    public function test_internship_application_persists(): void
    {
        $program = $this->internshipProgram();
        $resume = UploadedFile::fake()->create('intern.pdf', 100, 'application/pdf');

        $this->post('/internship-applications', [
            'internship_program_id' => $program->id,
            'name' => 'Intern',
            'email' => 'intern@example.test',
            'phone' => '201000000030',
            'university' => 'AUC',
            'graduation_year' => 2026,
            'resume' => $resume,
        ])->assertSessionHas('success');

        $application = InternshipApplication::query()->where('email', 'intern@example.test')->firstOrFail();
        $this->assertSame($program->id, $application->internship_program_id);
        $this->assertSame(2026, $application->graduation_year);
    }

    public function test_internship_application_rejects_oversized_resume(): void
    {
        $program = $this->internshipProgram();
        $huge = UploadedFile::fake()->create('intern.pdf', 12 * 1024, 'application/pdf');

        $this->post('/internship-applications', [
            'internship_program_id' => $program->id,
            'name' => 'Intern',
            'email' => 'intern@example.test',
            'phone' => '201000000031',
            'resume' => $huge,
        ])->assertSessionHasErrors('resume');
    }

    public function test_internship_application_rejects_unauthorized_file_type(): void
    {
        $program = $this->internshipProgram();
        $bad = UploadedFile::fake()->create('photo.jpg', 200, 'image/jpeg');

        $this->post('/internship-applications', [
            'internship_program_id' => $program->id,
            'name' => 'Intern',
            'email' => 'intern@example.test',
            'phone' => '201000000032',
            'resume' => $bad,
        ])->assertSessionHasErrors('resume');
    }

    // -----------------------------------------------------------------
    // Rate limiting on a high-traffic endpoint
    // -----------------------------------------------------------------

    public function test_contact_submission_is_rate_limited(): void
    {
        // Contact throttle is 5/minute.
        for ($i = 0; $i < 5; $i++) {
            $this->post('/contact-us', [
                'name' => "User {$i}",
                'phone' => "201111111{$i}0",
            ])->assertSessionHas('success');
        }
        $this->post('/contact-us', [
            'name' => 'Over the limit',
            'phone' => '201111111199',
        ])->assertStatus(429);
    }

    // -----------------------------------------------------------------
    // Persistence guarantee when mail fails
    // -----------------------------------------------------------------

    public function test_submission_is_persisted_even_when_mail_throws(): void
    {
        Mail::extend('failing', function () {
            throw new \RuntimeException('SMTP down');
        });
        config(['mail.default' => 'failing']);

        $this->post('/contact-us', [
            'name' => 'Still Persisted',
            'phone' => '201000000099',
        ]);

        $this->assertDatabaseHas('contact_inquiries', [
            'name' => 'Still Persisted',
            'phone' => '+201000000099',
        ]);
    }

    public function test_unauthorized_admin_access_to_lead_pages_is_blocked(): void
    {
        $this->get('/admin/contact-inquiries')
            ->assertRedirect('/login');
        $this->get('/admin/project-inquiries')
            ->assertRedirect('/login');
        $this->get('/admin/brochure-requests')
            ->assertRedirect('/login');
    }
}