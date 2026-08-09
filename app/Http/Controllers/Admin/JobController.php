<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreJobRequest;
use App\Http\Requests\Admin\UpdateJobRequest;
use App\Models\Job;
use App\Support\WebsiteCache;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class JobController extends Controller
{
    public function index(Request $request): Response
    {
        $jobs = Job::query()
            ->when($request->string('search')->isNotEmpty(), fn ($q) => $q->where('title', 'like', '%'.$request->string('search').'%'))
            ->when($request->filled('status'), fn ($q) => $q->where('is_published', $request->boolean('status')))
            ->orderBy('sort_order')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Careers/Jobs/Index', [
            'jobs' => $jobs->through(fn ($job) => [
                'id' => $job->id,
                'title' => $job->title,
                'department' => $job->department,
                'location' => $job->location,
                'published' => $job->is_published,
                'featured' => $job->is_featured,
            ]),
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Careers/Jobs/Form', ['job' => null]);
    }

    public function store(StoreJobRequest $request): RedirectResponse
    {
        DB::transaction(function () use ($request) {
            $validated = $request->validated();
            $en = $validated['translations']['en'] ?? [];

            Job::create([
                'title' => $en['title'] ?? '',
                'slug' => $validated['slug'],
                'department' => $en['department'] ?? '',
                'location' => $en['location'] ?? '',
                'employment_type' => $en['employment_type'] ?? 'Full-time',
                'experience_level' => $en['experience_level'] ?? null,
                'summary' => $en['summary'] ?? null,
                'description' => $en['description'] ?? null,
                'requirements' => $en['requirements'] ?? null,
                'responsibilities' => $en['responsibilities'] ?? null,
                'benefits' => $en['benefits'] ?? null,
                'deadline' => $validated['deadline'] ?? null,
                'is_published' => $request->boolean('is_published'),
                'is_featured' => $request->boolean('is_featured'),
                'sort_order' => $validated['sort_order'] ?? 0,
                'translations' => $validated['translations'] ?? null,
            ]);
        });

        WebsiteCache::careers();

        return to_route('admin.jobs.index')->with('success', 'Job created.');
    }

    public function edit(Job $job): Response
    {
        return Inertia::render('Admin/Careers/Jobs/Form', ['job' => $job]);
    }

    public function update(UpdateJobRequest $request, Job $job): RedirectResponse
    {
        DB::transaction(function () use ($request, $job) {
            $validated = $request->validated();
            $translations = $validated['translations'] ?? [];
            $en = $translations['en'] ?? [];

            $data = [
                'slug' => $validated['slug'] ?? $job->slug,
                'deadline' => $validated['deadline'] ?? $job->deadline,
                'is_published' => $request->boolean('is_published'),
                'is_featured' => $request->boolean('is_featured'),
                'sort_order' => $validated['sort_order'] ?? $job->sort_order,
                'translations' => $translations ?: null,
            ];

            if ($en) {
                $data['title'] = $en['title'] ?? $job->title;
                $data['department'] = $en['department'] ?? $job->department;
                $data['location'] = $en['location'] ?? $job->location;
                $data['employment_type'] = $en['employment_type'] ?? $job->employment_type;
                $data['experience_level'] = $en['experience_level'] ?? $job->experience_level;
                $data['summary'] = $en['summary'] ?? $job->summary;
                $data['description'] = $en['description'] ?? $job->description;
                $data['requirements'] = $en['requirements'] ?? $job->requirements;
                $data['responsibilities'] = $en['responsibilities'] ?? $job->responsibilities;
                $data['benefits'] = $en['benefits'] ?? $job->benefits;
            }

            $job->update($data);
        });

        WebsiteCache::careers();

        return back()->with('success', 'Job updated.');
    }

    public function destroy(Job $job): RedirectResponse
    {
        $job->delete();
        WebsiteCache::careers();
        return back()->with('success', 'Job archived.');
    }

    public function togglePublished(Job $job): RedirectResponse
    {
        $job->update(['is_published' => ! $job->is_published, 'published_at' => ! $job->is_published ? now() : null]);
        WebsiteCache::careers();
        return back();
    }
}
