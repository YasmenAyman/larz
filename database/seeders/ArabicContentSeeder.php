<?php

namespace Database\Seeders;

use App\Models\CompanyValue;
use App\Models\Job;
use App\Models\MediaPost;
use App\Models\PageSection;
use App\Models\Project;
use App\Models\SiteSetting;
use App\Models\Testimonial;
use Illuminate\Database\Seeder;

/** Populates Arabic copy while preserving the English content and media. */
class ArabicContentSeeder extends Seeder
{
    public function run(): void
    {
        $this->translateSections();

        $projects = [
            'klove-new-cairo' => ['title' => 'كلوف القاهرة الجديدة', 'location' => 'القرنفل، القاهرة الجديدة', 'hero_heading' => "عد إلى منزلك\nوإلى الهدوء.", 'hero_description' => 'مجتمع أخضر منخفض الارتفاع في القرنفل بالقاهرة الجديدة؛ لا تشغل المباني سوى خُمس الأرض، ليحافظ منزلك على نوره وهوائه وإطلالته.'],
            'kov-new-cairo' => ['title' => 'كوف القاهرة الجديدة', 'location' => 'المربع الذهبي، القاهرة الجديدة', 'description' => 'يجمع كوف القاهرة الجديدة متاجر ومكاتب وعيادات في عنوان هادئ قابل للمشي بقلب المربع الذهبي، صُمم حول ضوء النهار والساحات المفتوحة وسهولة الوصول.', 'short_description' => 'حيث يهدأ المربع الذهبي أخيرًا.'],
            'larz-business-hub' => ['title' => 'لارز بيزنس هب', 'location' => 'القاهرة الجديدة', 'description' => 'طوابق مكاتب مرنة ومقاهٍ في الطابق الأرضي وفناء يجعل يوم العمل أكثر إنسانية؛ صُممت للشركات التي تريد حضورًا بلا ضوضاء.', 'short_description' => 'مكان عمل يتصرف كأنه حيّ متكامل.'],
            'larz-medical-park' => ['title' => 'لارز ميديكال بارك', 'location' => 'القاهرة الجديدة', 'description' => 'وجهة للعيادات والمعامل تضم مناطق انتظار هادئة ومسارات حركة رحبة ومواقف لا تصبح جزءًا من موعدك.', 'short_description' => 'رعاية مخططة حول الهدوء.'],
            'larz-riverside' => ['title' => 'لارز ريفرسايد', 'location' => 'القاهرة الجديدة', 'description' => 'مساكن منخفضة الارتفاع حول البحيرات والمساحات الخضراء المفتوحة، مع شرفات تطل على الطبيعة بدلًا من الشارع.', 'short_description' => 'حياة قريبة من الماء ومن كل ما تحتاجه.'],
        ];
        foreach ($projects as $slug => $arabic) {
            if ($project = Project::query()->where('slug', $slug)->first()) {
                $project->update(['translations' => array_replace($project->translations ?? [], ['ar' => $arabic])]);
            }
        }
        $this->translateKloveProjectSections();

        $this->translateModels(CompanyValue::class, 'title', [
            'Purposeful work' => ['title' => 'عمل هادف', 'description' => 'ما تبنيه هنا يصبح المكان الذي يعيش فيه الناس حياتهم.'],
            'Growth & mentorship' => ['title' => 'النمو والإرشاد', 'description' => 'تعلّم من مؤسسين يتمتعون بخبرة 40 عامًا في المجال.'],
            'Wellbeing' => ['title' => 'الرفاهية', 'description' => 'ثقافة تقدّر التوازن بقدر ما تقدّر الطموح.'],
            'Ownership' => ['title' => 'تحمّل المسؤولية', 'description' => 'مسؤولية حقيقية ومساحة لتجعل العمل بطريقتك.'],
        ]);
        $this->translateModels(Job::class, 'slug', [
            'sales-consultant' => ['title' => 'استشاري مبيعات', 'department' => 'المبيعات', 'location' => 'القاهرة الجديدة', 'employment_type' => 'دوام كامل'],
            'architect' => ['title' => 'مهندس معماري', 'department' => 'التصميم', 'location' => 'العاصمة الإدارية الجديدة', 'employment_type' => 'دوام كامل'],
            'digital-marketing-specialist' => ['title' => 'أخصائي تسويق رقمي', 'department' => 'التسويق', 'location' => 'القاهرة الجديدة', 'employment_type' => 'دوام كامل'],
            'site-engineer' => ['title' => 'مهندس موقع', 'department' => 'الإنشاءات', 'location' => 'العاصمة الإدارية الجديدة', 'employment_type' => 'دوام كامل'],
            'senior-architect' => ['title' => 'مهندس معماري أول', 'department' => 'العمارة', 'location' => 'القاهرة، مصر', 'employment_type' => 'دوام كامل', 'summary' => 'قد مشاريع معمارية راقية من الفكرة حتى التسليم.'],
            'project-engineer' => ['title' => 'مهندس مشروع', 'department' => 'الهندسة', 'location' => 'القاهرة، مصر', 'employment_type' => 'دوام كامل', 'summary' => 'نسّق التنفيذ الفني لمشاريع طموحة.'],
            'interior-designer' => ['title' => 'مصمم داخلي', 'department' => 'التصميم', 'location' => 'القاهرة، مصر', 'employment_type' => 'دوام كامل', 'summary' => 'صمّم مساحات داخلية راقية ترتقي بالتجربة اليومية.'],
        ]);
        $this->translateModels(MediaPost::class, 'slug', [
            'larz-announces-new-cairo-community' => ['title' => 'لارز تعلن عن أحدث مجتمعاتها في القاهرة الجديدة', 'excerpt' => 'نبذة موجزة تلخّص الإعلان في سطر أو سطرين.'],
            'construction-milestone-reached-at-mada' => ['title' => 'تحقيق مرحلة إنشائية مهمة في مدى', 'excerpt' => 'نبذة موجزة تلخّص الإعلان في سطر أو سطرين.'],
            'larz-business-hub-leed-recognition' => ['title' => 'لارز بيزنس هب يحصل على تقدير LEED', 'excerpt' => 'نبذة موجزة تلخّص الإعلان في سطر أو سطرين.'],
            'what-to-look-for-in-a-new-cairo-community' => ['title' => 'ما الذي تبحث عنه في مجتمع بالقاهرة الجديدة؟', 'excerpt' => 'سطر تمهيدي قصير للمقال.'],
            'why-low-density-living-changes-everything' => ['title' => 'لماذا تغيّر الحياة منخفضة الكثافة كل شيء؟', 'excerpt' => 'سطر تمهيدي قصير للمقال.'],
            'payment-plans-explained-simply' => ['title' => 'خطط السداد، ببساطة', 'excerpt' => 'سطر تمهيدي قصير للمقال.'],
        ]);
        $this->translateModels(Testimonial::class, 'name', [
            'Ahmed K.' => ['role' => 'صاحب عمل', 'quote' => '«كان اختيار لارز لاستثمارنا التجاري القرار الصحيح. منحنا الموقع الاستراتيجي والتصميم العصري والدعم الاحترافي ثقة كاملة في استثمارنا.»'],
            'Muhammed Y.' => ['role' => 'مالك منزل', 'quote' => '«من أول استشارة وحتى التسليم النهائي كانت التجربة سلسة. تجاوز الاهتمام بالتفاصيل وجودة التنفيذ توقعاتنا وجعل منزلنا الجديد كما تخيلناه.»'],
        ]);
        foreach ([
            'contact.address_ar' => 'مول كوف، بجوار بوابة ميفيدا 6، القاهرة الجديدة 1، نهاية شارع التسعين بجوار الجامعة الأمريكية.',
            'footer.cta_title_ar' => "لنبنِ\nالمستقبل معًا",
            'footer.cta_button_ar' => 'تواصل معنا',
        ] as $key => $value) {
            SiteSetting::query()->where('key', $key)->update(['value' => $value]);
        }
    }

    private function translateSections(): void
    {
        $translations = [
            ['about', 'stats', ['items' => [['value' => '+60', 'label' => 'مشروع', 'note' => 'مكتمل وقيد التنفيذ'], ['value' => '2', 'label' => 'دولة', 'note' => 'مصر والتوسع مستمر'], ['value' => '+15k', 'label' => 'عميل', 'note' => 'عائلات وشركات'], ['value' => '+40', 'label' => 'سنة خبرة', 'note' => 'خبرة المؤسسين']]]],
            ['contact', 'location', ['heading' => 'تجدنا.']],
            ['contact', 'contact_methods', ['items' => [['key' => 'hotline', 'icon' => 'phone', 'title' => 'الخط الساخن', 'value' => '15813', 'note' => 'السبت–الخميس، 9 ص–6 م'], ['key' => 'whatsapp', 'icon' => 'message-circle', 'title' => 'واتساب', 'value' => '+20 15813', 'note' => 'ردود سريعة يوميًا'], ['key' => 'email', 'icon' => 'mail', 'title' => 'البريد الإلكتروني', 'value' => 'info@larzdevelopments.com', 'note' => 'larzdevelopments.com'], ['key' => 'sales_office', 'icon' => 'map-pin', 'title' => 'مكتب المبيعات', 'value' => 'القاهرة الجديدة', 'note' => 'العنوان الكامل']]]],
            ['media', 'newsletter', ['eyebrow' => 'النشرة البريدية', 'heading' => 'لا تفوّت أي تحديث.', 'description' => 'اشترك لتصلك أحدث الأخبار والقصص ومراحل إنجاز مشاريعنا مباشرة إلى بريدك الإلكتروني.']],
            ['project-klove-new-cairo', 'hero_slides', ['items' => [['eyebrow' => 'كلوف — القاهرة الجديدة', 'titleLine1' => 'عد إلى منزلك', 'titleLine2' => 'وإلى الهدوء.', 'description' => 'مجتمع أخضر منخفض الارتفاع في القرنفل بالقاهرة الجديدة؛ لا تشغل المباني سوى خُمس الأرض، ليحافظ منزلك على نوره وهوائه وإطلالته.'], ['eyebrow' => 'كلوف — القاهرة الجديدة', 'titleLine1' => 'عِش وسط', 'titleLine2' => 'الخُضرة.', 'description' => 'تحيط بك ساحات خضراء وممرات مفتوحة صُممت لتجلب الطبيعة إلى كل زاوية من حياتك اليومية.'], ['eyebrow' => 'كلوف — القاهرة الجديدة', 'titleLine1' => 'نور وهواء', 'titleLine2' => 'وإطلالة.', 'description' => 'صُمم كل منزل لتعظيم الضوء الطبيعي وتجدد الهواء والإطلالات الخضراء المفتوحة؛ رفاهية نادرة في الحياة الحضرية.']]]],
            ['project-klove-new-cairo', 'overview', ['heading' => 'المدينة لا تهدأ. منزلك يجب أن يهدأ.', 'body' => "في كلوف، تستيقظ على الخُضرة بدلًا من الزحام، وعلى مساحة خُطّطت لطريقة الحياة التي تريدها فعلًا.\nعلى مساحة 24 فدانًا، لا تشغل المباني سوى الخُمس؛ والباقي حدائق ومياه وهواء طلق. لا يتجاوز أي مبنى خمسة طوابق، فتبقى صباحاتك هادئة وأمسياتك خاصة وإطلالتك لك." ]],
            ['project-klove-new-cairo', 'masterplan', ['heading' => 'اعرف بدقة موقع منزلك.', 'description' => 'اكتشف كيف تحيط به الخُضرة والمياه والممرات، ثم خذ الصورة الكاملة معك.', 'brochureHeading' => 'احصل على الكتيب', 'brochureDescription' => 'تفصيلان فقط ويصبح بين يديك.']],
            ['project-klove-new-cairo', 'virtual_tour', ['heading' => 'تجوّل في كلوف الليلة.', 'description' => 'من أريكتك؛ الشوارع والطبيعة والمساحات قبل أن تزورها.', 'videoUrl' => 'https://www.youtube.com/embed/MLpWrANjFbI?si=xdUBsJQ3tkUMv1ZX']],
            ['project-klove-new-cairo', 'cta', ['eyebrow' => 'كلوف — القاهرة الجديدة', 'heading' => 'حياة أفضل تبدأ من المكان المناسب.']],
            ['project-klove-new-cairo', 'homes3d', ['heading' => 'منزل يناسب مكانك في الحياة.', 'description' => 'ثماني طرق للعيش في كلوف؛ استكشف كلًا منها ثلاثي الأبعاد، غرفةً بغرفة.', 'note' => 'يفتح كل منزل على تراسه الخاص.']],
            ['project-klove-new-cairo', 'construction', ['heading' => 'شاهد منزلك وهو يتشكل.', 'description' => 'تحديثات مؤرخة من الموقع حتى تعرف دائمًا أين وصلت الأعمال.']],
            ['project-klove-new-cairo', 'amenities', ['heading' => 'أفضل لحظات يومك لن تكون داخل المنزل.']],
            ['project-klove-new-cairo', 'location', ['heading' => 'الهدوء لا يعني البُعد.', 'description' => 'يقع كلوف في القرنفل مقابل المربع الذهبي، على بعد دقائق من الطرق والمدارس والأماكن التي تستخدمها، وببوابتين تجعل العودة إلى المنزل سهلة دائمًا.', 'gateNote' => 'بوابتان للدخول، وُضعتا لتسهيل الحركة من وإلى المشروع', 'driveNote' => 'أوقات القيادة تقديرية.']],
        ];

        foreach ($translations as [$page, $section, $arabic]) {
            $record = PageSection::query()->where('page_key', $page)->where('section_key', $section)->first();
            if (! $record) {
                continue;
            }
            $snapshot = $record->content_snapshot ?? [];
            $snapshot['translations'] = array_replace($snapshot['translations'] ?? [], ['ar' => $arabic]);
            $record->update(['content_snapshot' => $snapshot]);
        }
    }

    private function translateKloveProjectSections(): void
    {
        $project = Project::query()->where('slug', 'klove-new-cairo')->first();
        if (! $project) {
            return;
        }

        $arabic = [
            'heroSlides' => [
                ['eyebrow' => 'كلوف — القاهرة الجديدة', 'titleLine1' => 'عد إلى منزلك', 'titleLine2' => 'وإلى الهدوء.', 'description' => 'مجتمع أخضر منخفض الارتفاع في القرنفل بالقاهرة الجديدة؛ لا تشغل المباني سوى خُمس الأرض، ليحافظ منزلك على نوره وهوائه وإطلالته.', 'cta1Label' => 'اطلب الأسعار وخطة السداد', 'cta1Url' => '#brochure', 'cta2Label' => 'حمّل الكتيب', 'cta2Url' => '#brochure'],
                ['eyebrow' => 'كلوف — القاهرة الجديدة', 'titleLine1' => 'عِش وسط', 'titleLine2' => 'الخُضرة.', 'description' => 'تحيط بك ساحات خضراء وممرات مفتوحة صُممت لتجلب الطبيعة إلى كل زاوية من حياتك اليومية.', 'cta1Label' => 'اطلب الأسعار وخطة السداد', 'cta1Url' => '#brochure', 'cta2Label' => 'حمّل الكتيب', 'cta2Url' => '#brochure'],
                ['eyebrow' => 'كلوف — القاهرة الجديدة', 'titleLine1' => 'نور وهواء', 'titleLine2' => 'وإطلالة.', 'description' => 'صُمم كل منزل لتعظيم الضوء الطبيعي وتجدد الهواء والإطلالات الخضراء المفتوحة؛ رفاهية نادرة في الحياة الحضرية.', 'cta1Label' => 'اطلب الأسعار وخطة السداد', 'cta1Url' => '#brochure', 'cta2Label' => 'حمّل الكتيب', 'cta2Url' => '#brochure'],
            ],
            'stats' => [['value' => '24', 'label' => 'فدانًا', 'note' => 'مساحة للتنفس'], ['value' => '20%', 'label' => 'مبانٍ', 'note' => '80% من المساحة مفتوح'], ['value' => 'G+5', 'label' => 'طوابق', 'note' => 'مبانٍ منخفضة بلا أبراج'], ['value' => '50–196 م²', 'label' => 'منازل', 'note' => 'من الاستوديو إلى الدوبلكس']],
            'overview' => ['heading' => 'المدينة لا تهدأ. منزلك يجب أن يهدأ.', 'body' => "في كلوف، تستيقظ على الخُضرة بدلًا من الزحام، وعلى مساحة خُطّطت لطريقة الحياة التي تريدها فعلًا.\nعلى مساحة 24 فدانًا، لا تشغل المباني سوى الخُمس؛ والباقي حدائق ومياه وهواء طلق. لا يتجاوز أي مبنى خمسة طوابق، فتبقى صباحاتك هادئة وأمسياتك خاصة وإطلالتك لك."],
            'masterplan' => ['heading' => 'اعرف بدقة موقع منزلك.', 'description' => 'اكتشف كيف تحيط به الخُضرة والمياه والممرات، ثم خذ الصورة الكاملة معك.', 'brochureHeading' => 'احصل على الكتيب', 'brochureDescription' => 'تفصيلان فقط ويصبح بين يديك.'],
            'virtualTour' => ['heading' => 'تجوّل في كلوف الليلة.', 'description' => 'من أريكتك؛ الشوارع والطبيعة والمساحات قبل أن تزورها.', 'videoUrl' => 'https://www.youtube.com/embed/MLpWrANjFbI?si=xdUBsJQ3tkUMv1ZX'],
            'homes3d' => ['heading' => 'منزل يناسب مكانك في الحياة.', 'description' => 'ثماني طرق للعيش في كلوف؛ استكشف كلًا منها ثلاثي الأبعاد، غرفةً بغرفة.', 'note' => 'يفتح كل منزل على تراسه الخاص.', 'items' => []],
            'construction' => ['heading' => 'شاهد منزلك وهو يتشكل.', 'description' => 'تحديثات مؤرخة من الموقع حتى تعرف دائمًا أين وصلت الأعمال.', 'items' => []],
            'amenities' => ['heading' => 'أفضل لحظات يومك لن تكون داخل المنزل.', 'categories' => []],
            'location' => ['heading' => 'الهدوء لا يعني البُعد.', 'description' => 'يقع كلوف في القرنفل مقابل المربع الذهبي، على بعد دقائق من الطرق والمدارس والأماكن التي تستخدمها، وببوابتين تجعل العودة إلى المنزل سهلة دائمًا.', 'gateNote' => 'بوابتان للدخول، وُضعتا لتسهيل الحركة من وإلى المشروع', 'driveNote' => 'أوقات القيادة تقديرية.', 'image' => null, 'nearbyLocations' => []],
            'cta' => ['eyebrow' => 'كلوف — القاهرة الجديدة', 'heading' => 'حياة أفضل تبدأ من المكان المناسب.', 'whatsappNumber' => '', 'primaryCtaLabel' => '', 'secondaryCtaLabel' => ''],
        ];

        $project->update(['sections' => array_replace($project->sections ?? [], ['ar' => $arabic])]);
    }

    /** @param class-string<\Illuminate\Database\Eloquent\Model> $model */
    private function translateModels(string $model, string $key, array $translations): void
    {
        foreach ($translations as $value => $arabic) {
            $record = $model::query()->where($key, $value)->first();
            if ($record) {
                $record->update(['translations' => array_replace($record->translations ?? [], ['ar' => $arabic])]);
            }
        }
    }
}
