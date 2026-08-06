<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreJobRequest;
use App\Http\Requests\Admin\UpdateJobRequest;
use App\Models\Job;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class JobController extends Controller
{
    public function index(Request $request): Response { $jobs = Job::query()->when($request->string('search')->isNotEmpty(), fn ($q) => $q->where('title', 'like', '%'.$request->string('search').'%'))->when($request->filled('status'), fn ($q) => $q->where('is_published', $request->boolean('status')))->orderBy('sort_order')->paginate(15)->withQueryString(); return Inertia::render('Admin/Careers/Jobs/Index', ['jobs' => $jobs->through(fn ($job) => ['id' => $job->id, 'title' => $job->title, 'department' => $job->department, 'location' => $job->location, 'published' => $job->is_published, 'featured' => $job->is_featured]), 'filters' => $request->only(['search', 'status'])]); }
    public function create(): Response { return Inertia::render('Admin/Careers/Jobs/Form', ['job' => null]); }
    public function store(StoreJobRequest $request): RedirectResponse { DB::transaction(fn () => Job::create([...$request->validated(), 'is_published' => $request->boolean('is_published'), 'is_featured' => $request->boolean('is_featured')])); return to_route('admin.jobs.index')->with('success', 'Job created.'); }
    public function edit(Job $job): Response { return Inertia::render('Admin/Careers/Jobs/Form', ['job' => $job]); }
    public function update(UpdateJobRequest $request, Job $job): RedirectResponse { DB::transaction(fn () => $job->update([...$request->validated(), 'is_published' => $request->boolean('is_published'), 'is_featured' => $request->boolean('is_featured')])); return back()->with('success', 'Job updated.'); }
    public function destroy(Job $job): RedirectResponse { $job->delete(); return back()->with('success', 'Job archived.'); }
    public function togglePublished(Job $job): RedirectResponse { $job->update(['is_published' => ! $job->is_published, 'published_at' => ! $job->is_published ? now() : null]); return back(); }
}
