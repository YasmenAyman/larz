<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreGeneralCvSubmissionRequest;
use App\Http\Requests\Admin\StoreInternshipApplicationRequest;
use App\Http\Requests\Admin\StoreJobApplicationRequest;
use App\Http\Requests\Admin\UpdateCareerApplicationRequest;
use App\Models\GeneralCvSubmission;
use App\Models\InternshipApplication;
use App\Models\JobApplication;
use App\Models\User;
use App\Services\MediaUploadService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class CareerApplicationController extends Controller
{
    public function jobs(): Response { return Inertia::render('Admin/Careers/Applications/Index', ['type' => 'job', 'applications' => JobApplication::with(['job', 'assignee', 'resume'])->orderByDesc('submission_date')->paginate(20)->through(fn ($item) => $this->row($item)), 'users' => $this->staff()]); }
    public function internships(): Response { return Inertia::render('Admin/Careers/Applications/Index', ['type' => 'internship', 'applications' => InternshipApplication::with(['program', 'assignee', 'resume'])->orderByDesc('submission_date')->paginate(20)->through(fn ($item) => $this->row($item)), 'users' => $this->staff()]); }
    public function cvs(): Response { return Inertia::render('Admin/Careers/Applications/Index', ['type' => 'cv', 'applications' => GeneralCvSubmission::with(['assignee', 'resume'])->orderByDesc('submission_date')->paginate(20)->through(fn ($item) => $this->row($item)), 'users' => $this->staff()]); }
    public function updateJob(UpdateCareerApplicationRequest $request, JobApplication $application): RedirectResponse { $application->update($request->validated()); return back()->with('success', 'Application updated.'); }
    public function updateInternship(UpdateCareerApplicationRequest $request, InternshipApplication $application): RedirectResponse { $application->update($request->validated()); return back()->with('success', 'Application updated.'); }
    public function updateCv(UpdateCareerApplicationRequest $request, GeneralCvSubmission $application): RedirectResponse { $application->update($request->validated()); return back()->with('success', 'CV submission updated.'); }
    public function downloadJobCv(JobApplication $application, MediaUploadService $uploads) { return $this->download($application->resume, $uploads); }
    public function downloadInternshipCv(InternshipApplication $application, MediaUploadService $uploads) { return $this->download($application->resume, $uploads); }
    public function downloadGeneralCv(GeneralCvSubmission $application, MediaUploadService $uploads) { return $this->download($application->resume, $uploads); }

    public function storeJob(StoreJobApplicationRequest $request, MediaUploadService $uploads): RedirectResponse { DB::transaction(function () use ($request, $uploads) { $data = $request->validated(); $data['resume_media_id'] = $uploads->storePrivate($request->file('resume'), 'private/cvs')->id; unset($data['resume']); $data['submission_date'] = now(); JobApplication::create($data); }); return back(); }
    public function storeInternship(StoreInternshipApplicationRequest $request, MediaUploadService $uploads): RedirectResponse { DB::transaction(function () use ($request, $uploads) { $data = $request->validated(); $data['resume_media_id'] = $uploads->storePrivate($request->file('resume'), 'private/cvs')->id; unset($data['resume']); $data['submission_date'] = now(); InternshipApplication::create($data); }); return back(); }
    public function storeCv(StoreGeneralCvSubmissionRequest $request, MediaUploadService $uploads): RedirectResponse { DB::transaction(function () use ($request, $uploads) { $data = $request->validated(); $data['resume_media_id'] = $uploads->storePrivate($request->file('resume'), 'private/cvs')->id; unset($data['resume']); $data['submission_date'] = now(); GeneralCvSubmission::create($data); }); return back(); }

    private function staff() { return User::query()->select(['id', 'name'])->orderBy('name')->get(); }
    private function row(object $item): array { return ['id' => $item->id, 'name' => $item->name, 'email' => $item->email, 'status' => $item->status, 'job' => $item->job?->title ?? $item->program?->title ?? null, 'assigned_to' => $item->assignee?->name, 'assigned_to_id' => $item->assigned_to, 'admin_notes' => $item->admin_notes, 'submission_date' => $item->submission_date?->toDateTimeString(), 'has_resume' => $item->resume !== null]; }
    private function download($resume, MediaUploadService $uploads) { abort_unless($resume, 404); return $uploads->downloadPrivate($resume); }
}
