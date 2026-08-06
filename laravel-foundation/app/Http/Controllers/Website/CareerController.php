<?php

namespace App\Http\Controllers\Website;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreGeneralCvSubmissionRequest;
use App\Http\Requests\StoreInternshipApplicationRequest;
use App\Http\Requests\StoreJobApplicationRequest;
use App\Models\CompanyValue;
use App\Models\GeneralCvSubmission;
use App\Models\InternshipApplication;
use App\Models\InternshipProgram;
use App\Models\Job;
use App\Models\JobApplication;
use App\Services\FormNotificationContext;
use App\Services\FormSubmissionService;
use App\Services\MediaUploadService;
use App\Support\WebsiteContent;
use App\Services\SeoMetadataService;
use Inertia\Inertia;
use Inertia\Response;

class CareerController extends Controller
{
    public function index(SeoMetadataService $seo): Response
    {
        return Inertia::render('Website/Careers/Index', [
            'hero' => WebsiteContent::section('careers', 'hero'),
            'values' => CompanyValue::query()->where('is_published', true)->orderBy('sort_order')->get()->map(fn ($value) => ['title' => $value->title, 'description' => $value->description, 'icon' => $value->icon_key])->values()->all(),
            'jobs' => Job::query()->where('is_published', true)->where('is_featured', true)->orderBy('sort_order')->get()->map(fn ($job) => ['id' => $job->id, 'title' => $job->title, 'department' => $job->department, 'location' => $job->location, 'employmentType' => $job->employment_type])->values()->all(),
            'internship' => InternshipProgram::query()->where('is_published', true)->orderBy('sort_order')->firstOrFail()->only(['id', 'title', 'description', 'cta_label']),
            'cta' => WebsiteContent::section('careers', 'cta'),
            'seo' => $seo->forPage('careers', '/careers', ['title' => 'Careers at LARZ Developments | Shape the Future With Us'], [
                $seo->breadcrumbs([['name' => 'Home', 'url' => url('/')], ['name' => 'Careers', 'url' => url('/careers')]]),
            ]),
        ]);
    }

    public function submitJobApplication(StoreJobApplicationRequest $request, FormSubmissionService $submissions, MediaUploadService $uploads): \Illuminate\Http\RedirectResponse
    {
        return $this->handleApplication(
            request: $request,
            submissions: $submissions,
            uploads: $uploads,
            model: new JobApplication,
            context: FormNotificationContext::jobApplication(),
            successMessage: 'Application received — our HR team will follow up within five business days.',
        );
    }

    public function submitInternshipApplication(StoreInternshipApplicationRequest $request, FormSubmissionService $submissions, MediaUploadService $uploads): \Illuminate\Http\RedirectResponse
    {
        return $this->handleApplication(
            request: $request,
            submissions: $submissions,
            uploads: $uploads,
            model: new InternshipApplication,
            context: FormNotificationContext::internshipApplication(),
            successMessage: 'Thanks — your internship application is in good hands.',
        );
    }

    public function submitGeneralCv(StoreGeneralCvSubmissionRequest $request, FormSubmissionService $submissions, MediaUploadService $uploads): \Illuminate\Http\RedirectResponse
    {
        return $this->handleApplication(
            request: $request,
            submissions: $submissions,
            uploads: $uploads,
            model: new GeneralCvSubmission,
            context: FormNotificationContext::generalCv(),
            successMessage: 'Thanks for sharing your CV — we will reach out when a matching role opens up.',
        );
    }

    public function submitJobApplicationBySlug(\Illuminate\Http\Request $request, string $job, FormSubmissionService $submissions, MediaUploadService $uploads): \Illuminate\Http\RedirectResponse
    {
        // First make sure the job exists / is published so we 404 on bad slugs
        // before any validation runs.
        $jobModel = Job::query()->where('slug', $job)->where('is_published', true)->firstOrFail();

        $request->merge([
            'job_position_id' => $jobModel->id,
            'source_url' => $request->input('source_url') ?: $request->headers->get('referer'),
        ]);

        $formRequest = app(StoreJobApplicationRequest::class);
        $formRequest->setContainer(app())->setRedirector(redirect());
        $formRequest->initialize(
            $request->query->all(),
            $request->all(),
            $request->attributes->all(),
            $request->cookies->all(),
            $request->files->all(),
            $request->server->all(),
            $request->getContent()
        );
        $formRequest->setJson($request->json());
        $formRequest->validateResolved();

        return $this->handleApplication(
            request: $formRequest,
            submissions: $submissions,
            uploads: $uploads,
            model: new JobApplication,
            context: FormNotificationContext::jobApplication(),
            successMessage: 'Application received — our HR team will follow up within five business days.',
        );
    }

    private function handleApplication(
        \Illuminate\Http\Request $request,
        FormSubmissionService $submissions,
        MediaUploadService $uploads,
        \Illuminate\Database\Eloquent\Model $model,
        FormNotificationContext $context,
        string $successMessage,
    ): \Illuminate\Http\RedirectResponse {
        $data = $request->validated();
        $data['status'] = 'new';
        $data['submission_date'] = now();

        if ($request->hasFile('resume')) {
            $data['resume_media_id'] = $uploads->storePrivate($request->file('resume'), 'private/cvs')->id;
        }
        unset($data['resume']);

        if (! empty($data['consent_at'])) {
            $data['consent_at'] = \Illuminate\Support\Carbon::parse($data['consent_at']);
        }

        $submissions->record($model, $data, $context);

        return back()->with('success', $successMessage);
    }
}
