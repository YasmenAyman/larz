<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('contact_inquiries', fn (Blueprint $table) => $table->text('admin_notes')->nullable()->after('status'));
        Schema::table('project_inquiries', fn (Blueprint $table) => $table->text('admin_notes')->nullable()->after('status'));
        Schema::table('brochure_requests', fn (Blueprint $table) => $table->text('admin_notes')->nullable()->after('status'));
    }

    public function down(): void
    {
        Schema::table('brochure_requests', fn (Blueprint $table) => $table->dropColumn('admin_notes'));
        Schema::table('project_inquiries', fn (Blueprint $table) => $table->dropColumn('admin_notes'));
        Schema::table('contact_inquiries', fn (Blueprint $table) => $table->dropColumn('admin_notes'));
    }
};
