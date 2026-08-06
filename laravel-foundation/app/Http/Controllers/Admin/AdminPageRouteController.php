<?php

namespace App\Http\Controllers\Admin;

use App\Http\Requests\UpdateAdminContentRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Response;

class AdminPageRouteController
{
    public function overview(Request $request, ContentController $content): Response
    {
        return $content->overview($request->segment(3));
    }

    public function section(Request $request, ContentController $content): Response
    {
        return $content->sectionEdit($request->segment(3), $request->segment(4));
    }

    public function updateSection(UpdateAdminContentRequest $request, ContentController $content): RedirectResponse
    {
        return $content->updateSection($request, $request->route('page'), $request->route('section'));
    }
}
