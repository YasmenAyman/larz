<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactInquiry;
use App\Models\GeneralCvSubmission;
use App\Models\InternshipApplication;
use App\Models\Job;
use App\Models\MediaPost;
use App\Models\NewsletterSubscriber;
use App\Models\Project;
use App\Models\ProjectInquiry;
use App\Models\JobApplication;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('Admin/Dashboard', [
            'cards' => [
                ['label' => 'Total projects', 'value' => Project::count()],
                ['label' => 'Published projects', 'value' => Project::where('is_published', true)->count()],
                ['label' => 'Total media posts', 'value' => MediaPost::count()],
                ['label' => 'Open jobs', 'value' => Job::where('is_published', true)->count()],
                ['label' => 'New contact inquiries', 'value' => ContactInquiry::where('status', 'new')->count()],
                ['label' => 'New project inquiries', 'value' => ProjectInquiry::where('status', 'new')->count()],
                ['label' => 'New applications', 'value' => JobApplication::where('status', 'new')->count() + InternshipApplication::where('status', 'new')->count() + GeneralCvSubmission::where('status', 'new')->count()],
                ['label' => 'Newsletter subscribers', 'value' => NewsletterSubscriber::where('status', 'active')->count()],
            ],
        ]);
    }
}
