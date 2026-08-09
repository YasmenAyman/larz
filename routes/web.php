<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\AdminPageRouteController;
use App\Http\Controllers\Admin\AwardController;
use App\Http\Controllers\Admin\PartnerController;
use App\Http\Controllers\Admin\CareerApplicationController;
use App\Http\Controllers\Admin\ContactInquiryController;
use App\Http\Controllers\Admin\JobController;
use App\Http\Controllers\Admin\HomeGalleryController;
use App\Http\Controllers\Admin\HomeFeaturedProjectsController;
use App\Http\Controllers\Admin\BrochureRequestController;
use App\Http\Controllers\Admin\MediaCategoryController;
use App\Http\Controllers\Admin\MediaPostController;
use App\Http\Controllers\Admin\NearbyLocationController;
use App\Http\Controllers\Admin\NewsletterSubscriberController;

use App\Http\Controllers\Admin\ContentController;
use App\Http\Controllers\Admin\NavigationController;
use App\Http\Controllers\Admin\ProjectCategoryController;
use App\Http\Controllers\Admin\ProjectController as AdminProjectController;
use App\Http\Controllers\Admin\ProjectGalleryController;
use App\Http\Controllers\Admin\ProjectStatisticController;
use App\Http\Controllers\Admin\ProjectUnitTypeController;
use App\Http\Controllers\Admin\ProjectAmenityController;
use App\Http\Controllers\Admin\ProjectUpdateController;
use App\Http\Controllers\Admin\ProjectInquiryController;
use App\Http\Controllers\Admin\SettingsController;
use App\Http\Controllers\Admin\TestimonialController;
use App\Http\Controllers\Admin\PromiseCtaController;
use App\Http\Controllers\Admin\AboutHeroController;
use App\Http\Controllers\Admin\AboutStoryController;
use App\Http\Controllers\Admin\CareersHeroController;
use App\Http\Controllers\Admin\CareersInternshipController;
use App\Http\Controllers\Admin\CompanyValueController;
use App\Http\Controllers\Admin\MediaNewsController;
use App\Http\Controllers\Admin\MediaBlogController;
use App\Http\Controllers\Admin\MediaGalleryController;
use App\Http\Controllers\Admin\ContactMethodsController;
use App\Http\Controllers\Admin\ContactRequestHeroController;
use App\Http\Controllers\Admin\LocationMapController;
use App\Http\Controllers\Admin\SocialMediaController;
use App\Http\Controllers\Admin\SeoController as AdminSeoController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Website\AboutController;
use App\Http\Controllers\Website\CareerController;
use App\Http\Controllers\Website\ContactController;
use App\Http\Controllers\Website\DashboardController as WebsiteDashboardController;
use App\Http\Controllers\Website\HomeController;
use App\Http\Controllers\Website\MediaController;
use App\Http\Controllers\Website\NewsletterSubscriptionController;
use App\Http\Controllers\Website\ProjectController;
use App\Http\Controllers\Website\SeoController;
use Illuminate\Support\Facades\Route;

Route::get('/', HomeController::class)->name('home');
Route::get('/language/{locale}', \App\Http\Controllers\LanguageController::class)->name('language');
Route::get('/about-us', AboutController::class)->name('about');
Route::redirect('/about', '/about-us', 301);
Route::get('/projects', [ProjectController::class, 'index'])->name('projects.index');
Route::get('/projects/{project:slug}', [ProjectController::class, 'show'])->name('projects.show');
Route::get('/media', [MediaController::class, 'index'])->name('media.index');
Route::get('/media/{post:slug}', [MediaController::class, 'show'])->name('media.show');
Route::get('/careers', [CareerController::class, 'index'])->name('careers.index');
Route::get('/contact-us', [ContactController::class, 'index'])->name('contact.index');
Route::redirect('/contact', '/contact-us', 301);
Route::get('/sitemap.xml', [SeoController::class, 'sitemap'])->name('seo.sitemap');
Route::get('/robots.txt', [SeoController::class, 'robots'])->name('seo.robots');

Route::get('/dashboard', function () {
    if (auth()->user()?->hasRole('Super Admin') || auth()->user()?->can('dashboard.view')) {
        return redirect()->route('admin.dashboard');
    }
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// Public form submissions. Each route enforces CSRF (default web stack),
// rate limiting via throttle middleware, and routes through a FormRequest that
// runs the honeypot check before any database write.
Route::middleware('throttle:5,1')->group(function () {
    Route::post('/contact-us', [ContactController::class, 'submit'])->name('contact.submit');
    Route::post('/project-inquiries', [ProjectController::class, 'submitInquiry'])->name('project-inquiries.submit');
    Route::post('/brochure-requests', [ProjectController::class, 'submitBrochure'])->name('brochure-requests.submit');
    Route::post('/careers/{job:slug}/apply', [CareerController::class, 'submitJobApplicationBySlug'])->name('careers.apply-by-slug');
    Route::post('/career-general-applications', [CareerController::class, 'submitGeneralCv'])->name('careers.general');
    Route::post('/internship-applications', [CareerController::class, 'submitInternshipApplication'])->name('careers.internship');
});

Route::middleware('throttle:3,1')->post('/newsletter-subscriptions', [NewsletterSubscriptionController::class, 'store'])->name('newsletter.subscribe');

Route::middleware(['auth', 'verified', 'permission:dashboard.view'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::redirect('/', '/admin/dashboard')->name('index');
        Route::get('/dashboard', DashboardController::class)->name('dashboard');
        Route::get('/pages/about/awards', [AwardController::class, 'index'])->middleware('permission:pages.view')->name('pages.about.awards.index');
        Route::get('/pages/about/awards/create', [AwardController::class, 'create'])->middleware('permission:pages.update')->name('pages.about.awards.create');
        Route::post('/pages/about/awards', [AwardController::class, 'store'])->middleware('permission:pages.update')->name('pages.about.awards.store');
        Route::get('/pages/about/awards/{award}/edit', [AwardController::class, 'edit'])->middleware('permission:pages.update')->name('pages.about.awards.edit');
        Route::put('/pages/about/awards/{award}', [AwardController::class, 'update'])->middleware('permission:pages.update')->name('pages.about.awards.update');
        Route::delete('/pages/about/awards/{award}', [AwardController::class, 'destroy'])->middleware('permission:pages.update')->name('pages.about.awards.destroy');
        Route::post('/pages/about/awards/{award}/publish', [AwardController::class, 'togglePublished'])->middleware('permission:pages.update')->name('pages.about.awards.publish');
        Route::get('/pages/about/partners/create', [PartnerController::class, 'create'])->middleware('permission:pages.update')->name('pages.about.partners.create');
        Route::post('/pages/about/partners', [PartnerController::class, 'store'])->middleware('permission:pages.update')->name('pages.about.partners.store');
        Route::get('/pages/about/partners/{partner}/edit', [PartnerController::class, 'edit'])->middleware('permission:pages.update')->name('pages.about.partners.item.edit');
        Route::put('/pages/about/partners/{partner}', [PartnerController::class, 'update'])->middleware('permission:pages.update')->name('pages.about.partners.item.update');
        Route::delete('/pages/about/partners/{partner}', [PartnerController::class, 'destroy'])->middleware('permission:pages.update')->name('pages.about.partners.item.destroy');
        Route::post('/pages/about/partners/{partner}/publish', [PartnerController::class, 'togglePublished'])->middleware('permission:pages.update')->name('pages.about.partners.item.publish');
        foreach (config('admin_pages', []) as $page => $pageConfig) {
            Route::get('/pages/'.$page, [AdminPageRouteController::class, 'overview'])->middleware('permission:pages.view')->name('pages.'.$page.'.index');
            foreach (array_keys($pageConfig['sections']) as $section) {
                $sectionName = str_replace('-', '_', $section);
                $sectionController = match (true) {
                    $page === 'media' && $section === 'news' => MediaNewsController::class,
                    $page === 'media' && $section === 'stories' => MediaBlogController::class,
                    $page === 'media' && $section === 'gallery' => MediaGalleryController::class,
                    $page === 'about' && $section === 'hero' => AboutHeroController::class,
                    $page === 'about' && $section === 'story' => AboutStoryController::class,
                    $page === 'careers' && $section === 'hero' => CareersHeroController::class,
                    $page === 'careers' && $section === 'values' => CompanyValueController::class,
                    $page === 'careers' && $section === 'internship' => CareersInternshipController::class,
                    $page === 'home' && $section === 'gallery' => HomeGalleryController::class,
                    $page === 'home' && $section === 'featured-projects' => HomeFeaturedProjectsController::class,
                    $page === 'home' && $section === 'testimonials' => TestimonialController::class,
                    $page === 'about' && $section === 'partners' => PartnerController::class,
                    $page === 'about' && $section === 'promise-cta' => PromiseCtaController::class,
                    $page === 'contact' && $section === 'contact-methods' => ContactMethodsController::class,
                    $page === 'contact' && $section === 'request-form' => ContactRequestHeroController::class,
                    $page === 'contact' && $section === 'location-map' => LocationMapController::class,
                    $page === 'contact' && $section === 'social-media' => SocialMediaController::class,
                    default => AdminPageRouteController::class,
                };
                $editAction = in_array($sectionController, [MediaNewsController::class, MediaBlogController::class, CompanyValueController::class], true) ? 'index' : (in_array($sectionController, [AboutHeroController::class, AboutStoryController::class, CareersHeroController::class, CareersInternshipController::class, HomeGalleryController::class, HomeFeaturedProjectsController::class, MediaGalleryController::class, ContactMethodsController::class, ContactRequestHeroController::class, LocationMapController::class, SocialMediaController::class], true) ? 'edit' : (in_array($sectionController, [TestimonialController::class, PartnerController::class, PromiseCtaController::class], true) ? 'index' : 'section'));
                $updateAction = in_array($sectionController, [MediaNewsController::class, MediaBlogController::class, CompanyValueController::class], true) ? 'updateSettings' : (in_array($sectionController, [AboutHeroController::class, AboutStoryController::class, CareersHeroController::class, CareersInternshipController::class, HomeGalleryController::class, HomeFeaturedProjectsController::class, MediaGalleryController::class, ContactMethodsController::class, LocationMapController::class], true) ? 'update' : (in_array($sectionController, [TestimonialController::class, PartnerController::class, PromiseCtaController::class, ContactRequestHeroController::class, SocialMediaController::class], true) ? 'updateSettings' : 'updateSection'));
                Route::get('/pages/'.$page.'/'.$section, [$sectionController, $editAction])->middleware('permission:pages.view')->name('pages.'.$page.'.'.$sectionName.'.edit');
                 Route::put('/pages/'.$page.'/'.$section, [$sectionController, $updateAction])->defaults('page', $page)->defaults('section', $section)->middleware('permission:pages.update')->name('pages.'.$page.'.'.$sectionName.'.update');
             }
         }
         Route::get('/pages/home/testimonials/create', [TestimonialController::class, 'create'])->middleware('permission:pages.update')->name('pages.home.testimonials.create');
         Route::post('/pages/home/testimonials', [TestimonialController::class, 'store'])->middleware('permission:pages.update')->name('pages.home.testimonials.store');
         Route::get('/pages/home/testimonials/{testimonial}/edit', [TestimonialController::class, 'edit'])->middleware('permission:pages.update')->name('pages.home.testimonials.item.edit');
         Route::put('/pages/home/testimonials/{testimonial}', [TestimonialController::class, 'update'])->middleware('permission:pages.update')->name('pages.home.testimonials.item.update');
         Route::delete('/pages/home/testimonials/{testimonial}', [TestimonialController::class, 'destroy'])->middleware('permission:pages.update')->name('pages.home.testimonials.item.destroy');
         Route::post('/pages/home/testimonials/{testimonial}/publish', [TestimonialController::class, 'togglePublished'])->middleware('permission:pages.update')->name('pages.home.testimonials.item.publish');
         Route::get('/pages/careers/values/create', [CompanyValueController::class, 'create'])->middleware('permission:pages.update')->name('pages.careers.values.create');
         Route::post('/pages/careers/values', [CompanyValueController::class, 'store'])->middleware('permission:pages.update')->name('pages.careers.values.store');
         Route::get('/pages/careers/values/{companyValue}/edit', [CompanyValueController::class, 'edit'])->middleware('permission:pages.update')->name('pages.careers.values.item.edit');
         Route::put('/pages/careers/values/{companyValue}', [CompanyValueController::class, 'update'])->middleware('permission:pages.update')->name('pages.careers.values.item.update');
         Route::delete('/pages/careers/values/{companyValue}', [CompanyValueController::class, 'destroy'])->middleware('permission:pages.update')->name('pages.careers.values.item.destroy');
         Route::post('/pages/careers/values/{companyValue}/publish', [CompanyValueController::class, 'togglePublished'])->middleware('permission:pages.update')->name('pages.careers.values.item.publish');
         Route::get('/content/{page}', [ContentController::class, 'edit'])->middleware('permission:pages.view')->name('content.edit');
        Route::put('/content/{page}', [ContentController::class, 'update'])->middleware('permission:pages.update')->name('content.update');
        Route::get('/settings', [SettingsController::class, 'edit'])->middleware('permission:settings.view')->name('settings.edit');
        Route::put('/settings', [SettingsController::class, 'update'])->middleware('permission:settings.update')->name('settings.update');
        Route::get('/seo', [AdminSeoController::class, 'index'])->middleware('permission:seo.view')->name('seo.index');
        Route::put('/seo/{target}', [AdminSeoController::class, 'update'])->middleware('permission:seo.update')->name('seo.update');
        Route::get('/navigation', [NavigationController::class, 'index'])->middleware('permission:navigation.view')->name('navigation.index');
        Route::put('/navigation', [NavigationController::class, 'update'])->middleware('permission:navigation.update')->name('navigation.update');
        Route::get('/media/posts', [MediaPostController::class, 'index'])->middleware('permission:media.view')->name('media.posts.index');
        Route::get('/media/posts/create', [MediaPostController::class, 'create'])->middleware('permission:media.create')->name('media.posts.create');
        Route::post('/media/posts', [MediaPostController::class, 'store'])->middleware('permission:media.create')->name('media.posts.store');
        Route::get('/media/posts/{mediaPost}/edit', [MediaPostController::class, 'edit'])->middleware('permission:media.update')->name('media.posts.edit');
        Route::put('/media/posts/{mediaPost}', [MediaPostController::class, 'update'])->middleware('permission:media.update')->name('media.posts.update');
        Route::delete('/media/posts/{mediaPost}', [MediaPostController::class, 'destroy'])->middleware('permission:media.delete')->name('media.posts.destroy');
        Route::post('/media/posts/{mediaPost}/publish', [MediaPostController::class, 'togglePublished'])->middleware('permission:media.update')->name('media.posts.publish');
        Route::post('/media/posts/{mediaPost}/feature', [MediaPostController::class, 'toggleFeatured'])->middleware('permission:media.update')->name('media.posts.feature');
        Route::post('/media/posts/{mediaPost}/restore', [MediaPostController::class, 'restore'])->middleware('permission:media.update')->name('media.posts.restore');
        Route::delete('/media/posts/{mediaPost}/force', [MediaPostController::class, 'forceDelete'])->middleware('role:Super Admin')->name('media.posts.force');
        Route::get('/media/categories', [MediaCategoryController::class, 'index'])->middleware('permission:media.view')->name('media.categories.index');
        Route::post('/media/categories', [MediaCategoryController::class, 'store'])->middleware('permission:media.create')->name('media.categories.store');
        Route::put('/media/categories/{mediaCategory}', [MediaCategoryController::class, 'update'])->middleware('permission:media.update')->name('media.categories.update');
        Route::delete('/media/categories/{mediaCategory}', [MediaCategoryController::class, 'destroy'])->middleware('permission:media.delete')->name('media.categories.destroy');
        Route::get('/newsletter-subscribers', [NewsletterSubscriberController::class, 'index'])->middleware('permission:newsletter.view')->name('newsletter.index');
        Route::put('/newsletter-subscribers/{newsletterSubscriber}', [NewsletterSubscriberController::class, 'update'])->middleware('permission:newsletter.update')->name('newsletter.update');
        Route::get('/newsletter-subscribers/export', [NewsletterSubscriberController::class, 'export'])->middleware('permission:newsletter.view')->name('newsletter.export');
        Route::get('/jobs', [JobController::class, 'index'])->middleware('permission:jobs.view')->name('jobs.index');
        Route::get('/jobs/create', [JobController::class, 'create'])->middleware('permission:jobs.create')->name('jobs.create');
        Route::post('/jobs', [JobController::class, 'store'])->middleware('permission:jobs.create')->name('jobs.store');
        Route::get('/jobs/{job}/edit', [JobController::class, 'edit'])->middleware('permission:jobs.update')->name('jobs.edit');
        Route::put('/jobs/{job}', [JobController::class, 'update'])->middleware('permission:jobs.update')->name('jobs.update');
        Route::delete('/jobs/{job}', [JobController::class, 'destroy'])->middleware('permission:jobs.delete')->name('jobs.destroy');
        Route::post('/jobs/{job}/publish', [JobController::class, 'togglePublished'])->middleware('permission:jobs.update')->name('jobs.publish');
        Route::get('/job-applications', [CareerApplicationController::class, 'jobs'])->middleware('permission:applications.view')->name('job-applications.index');
        Route::put('/job-applications/{application}', [CareerApplicationController::class, 'updateJob'])->middleware('permission:applications.update')->name('job-applications.update');
        Route::get('/job-applications/{application}/cv', [CareerApplicationController::class, 'downloadJobCv'])->middleware('permission:applications.view')->name('job-applications.cv');
        Route::get('/internship-applications', [CareerApplicationController::class, 'internships'])->middleware('permission:applications.view')->name('internship-applications.index');
        Route::put('/internship-applications/{application}', [CareerApplicationController::class, 'updateInternship'])->middleware('permission:applications.update')->name('internship-applications.update');
        Route::get('/internship-applications/{application}/cv', [CareerApplicationController::class, 'downloadInternshipCv'])->middleware('permission:applications.view')->name('internship-applications.cv');
        Route::get('/general-cv-submissions', [CareerApplicationController::class, 'cvs'])->middleware('permission:applications.view')->name('general-cv.index');
        Route::put('/general-cv-submissions/{application}', [CareerApplicationController::class, 'updateCv'])->middleware('permission:applications.update')->name('general-cv.update');
        Route::get('/general-cv-submissions/{application}/cv', [CareerApplicationController::class, 'downloadGeneralCv'])->middleware('permission:applications.view')->name('general-cv.cv');
        Route::get('/contact-inquiries', [ContactInquiryController::class, 'index'])->middleware('permission:inquiries.view')->name('contact-inquiries.index');
        Route::put('/contact-inquiries/{contactInquiry}', [ContactInquiryController::class, 'update'])->middleware('permission:inquiries.update')->name('contact-inquiries.update');
        Route::get('/project-inquiries', [ProjectInquiryController::class, 'index'])->middleware('permission:inquiries.view')->name('project-inquiries.index');
        Route::put('/project-inquiries/{projectInquiry}', [ProjectInquiryController::class, 'update'])->middleware('permission:inquiries.update')->name('project-inquiries.update');
        Route::get('/brochure-requests', [BrochureRequestController::class, 'index'])->middleware('permission:inquiries.view')->name('brochure-requests.index');
        Route::put('/brochure-requests/{brochureRequest}', [BrochureRequestController::class, 'update'])->middleware('permission:inquiries.update')->name('brochure-requests.update');

        Route::get('/projects', [AdminProjectController::class, 'index'])->middleware('permission:projects.view')->name('projects.index');
        Route::get('/projects/create', [AdminProjectController::class, 'create'])->middleware('permission:projects.create')->name('projects.create');
        Route::post('/projects', [AdminProjectController::class, 'store'])->middleware('permission:projects.create')->name('projects.store');
        Route::get('/projects/{project}/edit', [AdminProjectController::class, 'edit'])->middleware('permission:projects.update')->name('projects.edit');
        Route::put('/projects/{project}', [AdminProjectController::class, 'update'])->middleware('permission:projects.update')->name('projects.update');
        Route::delete('/projects/{project}', [AdminProjectController::class, 'destroy'])->middleware('permission:projects.delete')->name('projects.destroy');
        Route::post('/projects/{project}/publish', [AdminProjectController::class, 'togglePublished'])->middleware('permission:projects.update')->name('projects.publish');
        Route::post('/projects/{project}/feature', [AdminProjectController::class, 'toggleFeatured'])->middleware('permission:projects.update')->name('projects.feature');
        Route::post('/projects/{project}/restore', [AdminProjectController::class, 'restore'])->middleware('permission:projects.update')->name('projects.restore');

        Route::get('/project-categories', [ProjectCategoryController::class, 'index'])->middleware('permission:projects.view')->name('project-categories.index');
        Route::post('/project-categories', [ProjectCategoryController::class, 'store'])->middleware('permission:projects.create')->name('project-categories.store');
        Route::put('/project-categories/{projectCategory}', [ProjectCategoryController::class, 'update'])->middleware('permission:projects.update')->name('project-categories.update');
        Route::delete('/project-categories/{projectCategory}', [ProjectCategoryController::class, 'destroy'])->middleware('permission:projects.delete')->name('project-categories.destroy');

        Route::get('/project-galleries', [ProjectGalleryController::class, 'index'])->middleware('permission:projects.view')->name('project-galleries.index');
        Route::post('/project-galleries', [ProjectGalleryController::class, 'store'])->middleware('permission:projects.create')->name('project-galleries.store');
        Route::put('/project-galleries/{projectGallery}', [ProjectGalleryController::class, 'update'])->middleware('permission:projects.update')->name('project-galleries.update');
        Route::delete('/project-galleries/{projectGallery}', [ProjectGalleryController::class, 'destroy'])->middleware('permission:projects.delete')->name('project-galleries.destroy');

        Route::get('/project-statistics', [ProjectStatisticController::class, 'index'])->middleware('permission:projects.view')->name('project-statistics.index');
        Route::post('/project-statistics', [ProjectStatisticController::class, 'store'])->middleware('permission:projects.create')->name('project-statistics.store');
        Route::put('/project-statistics/{projectStatistic}', [ProjectStatisticController::class, 'update'])->middleware('permission:projects.update')->name('project-statistics.update');
        Route::delete('/project-statistics/{projectStatistic}', [ProjectStatisticController::class, 'destroy'])->middleware('permission:projects.delete')->name('project-statistics.destroy');

        Route::get('/project-units', [ProjectUnitTypeController::class, 'index'])->middleware('permission:projects.view')->name('project-units.index');
        Route::post('/project-units', [ProjectUnitTypeController::class, 'store'])->middleware('permission:projects.create')->name('project-units.store');
        Route::put('/project-units/{projectUnitType}', [ProjectUnitTypeController::class, 'update'])->middleware('permission:projects.update')->name('project-units.update');
        Route::delete('/project-units/{projectUnitType}', [ProjectUnitTypeController::class, 'destroy'])->middleware('permission:projects.delete')->name('project-units.destroy');

        Route::get('/amenities', [ProjectAmenityController::class, 'index'])->middleware('permission:projects.view')->name('amenities.index');
        Route::post('/amenities', [ProjectAmenityController::class, 'store'])->middleware('permission:projects.create')->name('amenities.store');
        Route::put('/amenities/{projectAmenity}', [ProjectAmenityController::class, 'update'])->middleware('permission:projects.update')->name('amenities.update');
        Route::delete('/amenities/{projectAmenity}', [ProjectAmenityController::class, 'destroy'])->middleware('permission:projects.delete')->name('amenities.destroy');

        Route::get('/project-updates', [ProjectUpdateController::class, 'index'])->middleware('permission:projects.view')->name('project-updates.index');
        Route::post('/project-updates', [ProjectUpdateController::class, 'store'])->middleware('permission:projects.create')->name('project-updates.store');
        Route::put('/project-updates/{projectUpdate}', [ProjectUpdateController::class, 'update'])->middleware('permission:projects.update')->name('project-updates.update');
        Route::delete('/project-updates/{projectUpdate}', [ProjectUpdateController::class, 'destroy'])->middleware('permission:projects.delete')->name('project-updates.destroy');

        Route::get('/nearby-locations', [NearbyLocationController::class, 'index'])->middleware('permission:projects.view')->name('nearby-locations.index');
        Route::post('/nearby-locations', [NearbyLocationController::class, 'store'])->middleware('permission:projects.create')->name('nearby-locations.store');
        Route::put('/nearby-locations/{nearbyLocation}', [NearbyLocationController::class, 'update'])->middleware('permission:projects.update')->name('nearby-locations.update');
        Route::delete('/nearby-locations/{nearbyLocation}', [NearbyLocationController::class, 'destroy'])->middleware('permission:projects.delete')->name('nearby-locations.destroy');
    });

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
