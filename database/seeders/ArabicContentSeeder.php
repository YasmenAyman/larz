<?php

namespace Database\Seeders;

use App\Models\Award;
use App\Models\CompanyValue;
use App\Models\Job;
use App\Models\MediaPost;
use App\Models\PageSection;
use App\Models\Partner;
use App\Models\Project;
use App\Models\SiteSetting;
use App\Models\Testimonial;
use App\Support\LocalizedContent;
use Database\Seeders\Support\ProjectPageCopy;
use Illuminate\Database\Seeder;

/** Populates Arabic copy while preserving the English content and media. */
class ArabicContentSeeder extends Seeder
{
    public function run(): void
    {
        $this->translateSections();

        $projects = [
            'klove-new-cairo' => ['title' => 'كلوف القاهرة الجديدة', 'location' => 'القرنفل، القاهرة الجديدة', 'hero_heading' => 'عد إلى منزلك وإلى الهدوء.', 'hero_description' => 'مجتمع أخضر منخفض الارتفاع في القرنفل بالقاهرة الجديدة؛ لا تشغل المباني سوى خُمس الأرض، ليحافظ منزلك على نوره وهوائه وإطلالته.'],
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
        $this->translateProjectSections();

        $this->translateModels(CompanyValue::class, 'title', [
            'Purposeful work' => ['title' => 'عمل هادف', 'description' => 'ما تبنيه هنا يصبح المكان الذي يعيش فيه الناس حياتهم.'],
            'Growth & mentorship' => ['title' => 'النمو والإرشاد', 'description' => 'تعلّم من مؤسسين يتمتعون بخبرة 40 عامًا في المجال.'],
            'Wellbeing' => ['title' => 'الرفاهية', 'description' => 'ثقافة تقدّر التوازن بقدر ما تقدّر الطموح.'],
            'Ownership' => ['title' => 'تحمّل المسؤولية', 'description' => 'مسؤولية حقيقية ومساحة لتجعل العمل بطريقتك.'],
        ]);
        $this->translateModels(Job::class, 'slug', [
            'sales-consultant' => ['title' => 'استشاري مبيعات', 'department' => 'المبيعات', 'location' => 'القاهرة الجديدة', 'employment_type' => 'دوام كامل', 'summary' => 'ساعد العملاء في اختيار منزل يناسب طريقة حياتهم.', 'description' => 'انضم إلى فريق المبيعات لدينا لتقديم استشارات واضحة حول مجتمعاتنا وخطط السداد.', 'requirements' => 'خبرة في المبيعات العقارية. مهارات تواصل ممتازة. إجادة العربية والإنجليزية.', 'responsibilities' => 'استقبال العملاء وتقديم جولات. متابعة العملاء المحتملين. إتمام عمليات البيع وفق سياسات الشركة.'],
            'architect' => ['title' => 'مهندس معماري', 'department' => 'التصميم', 'location' => 'العاصمة الإدارية الجديدة', 'employment_type' => 'دوام كامل', 'summary' => 'صمّم مساحات سكنية وتجارية راقية.', 'description' => 'شارك في تطوير حلول معمارية عملية ومستدامة لمشاريع لارز.', 'requirements' => 'بكالوريوس هندسة معمارية. خبرة 3+ سنوات. إتقان برامج التصميم.', 'responsibilities' => 'إعداد المخططات والتصاميم. التنسيق مع فرق الهندسة. مراجعة مخططات التنفيذ.'],
            'digital-marketing-specialist' => ['title' => 'أخصائي تسويق رقمي', 'department' => 'التسويق', 'location' => 'القاهرة الجديدة', 'employment_type' => 'دوام كامل', 'summary' => 'انشر قصص مشاريعنا عبر القنوات الرقمية.', 'description' => 'خطط ونفّذ حملات تسويق رقمي تعكس جودة وتجربة علامة لارز.', 'requirements' => 'خبرة في التسويق الرقمي. معرفة بمنصات التواصل. مهارات تحليل البيانات.', 'responsibilities' => 'إدارة الحملات الإعلانية. إنتاج المحتوى. تقارير الأداء الشهرية.'],
            'site-engineer' => ['title' => 'مهندس موقع', 'department' => 'الإنشاءات', 'location' => 'العاصمة الإدارية الجديدة', 'employment_type' => 'دوام كامل', 'summary' => 'راقب جودة التنفيذ في الموقع.', 'description' => 'تأكد من التزام فرق المقاولين بالمواصفات والجداول الزمنية.', 'requirements' => 'بكالوريوس هندسة مدنية. خبرة موقع 2+ سنوات. قدرة على العمل الميداني.', 'responsibilities' => 'متابعة الأعمال اليومية. مراجعة المستخلصات. رفع تقارير التقدم.'],
            'senior-architect' => ['title' => 'مهندس معماري أول', 'department' => 'العمارة', 'location' => 'القاهرة، مصر', 'employment_type' => 'دوام كامل', 'summary' => 'قد مشاريع معمارية راقية من الفكرة حتى التسليم.', 'description' => 'قيادة فرق التصميم لتطوير مشاريع سكنية وتجارية متميزة.', 'requirements' => 'بكالوريوس هندسة معمارية. 5+ سنوات خبرة. محفظة أعمال قوية.', 'responsibilities' => 'قيادة مراحل التصميم. التنسيق مع الاستشاريين. ضمان جودة المخرجات.'],
            'project-engineer' => ['title' => 'مهندس مشروع', 'department' => 'الهندسة', 'location' => 'القاهرة، مصر', 'employment_type' => 'دوام كامل', 'summary' => 'نسّق التنفيذ الفني لمشاريع طموحة.', 'description' => 'إدارة الجوانب الفنية للمشروع من التصميم حتى التسليم.', 'requirements' => 'بكالوريوس هندسة. 4+ سنوات خبرة. مهارات تنسيق قوية.', 'responsibilities' => 'متابعة الجداول والميزانيات. مراجعة المخططات. حل المشكلات الفنية.'],
            'interior-designer' => ['title' => 'مصمم داخلي', 'department' => 'التصميم', 'location' => 'القاهرة، مصر', 'employment_type' => 'دوام كامل', 'summary' => 'صمّم مساحات داخلية راقية ترتقي بالتجربة اليومية.', 'description' => 'تطوير حلول داخلية للوحدات النموذجية ومراكز المبيعات.', 'requirements' => 'بكالوريوس تصميم داخلي. 3+ سنوات خبرة. محفظة أعمال.', 'responsibilities' => 'إعداد التصاميم الداخلية. اختيار المواد. التنسيق مع المقاولين.'],
        ]);
        $this->translateModels(MediaPost::class, 'slug', [
            'larz-announces-new-cairo-community' => ['title' => 'لارز تعلن عن أحدث مجتمعاتها في القاهرة الجديدة', 'excerpt' => 'مجتمع أخضر منخفض الارتفاع في القرنفل يُخطط حول النور والهواء والمساحة المفتوحة.', 'content' => '<p>أعلنت لارز للتطوير العقاري عن أحدث مجتمعاتها السكنية في حي القرنفل بالقاهرة الجديدة — حي منخفض الكثافة يُبنى على خُمس الأرض فقط.</p><p>يركز المخطط الرئيسي على الضوء الطبيعي وتهوية المنازل والإطلالات المفتوحة، مع وحدات تتراوح من الاستوديو إلى الدوبلكس.</p>'],
            'construction-milestone-reached-at-mada' => ['title' => 'تحقيق مرحلة إنشائية مهمة في مدى', 'excerpt' => 'تقدم الأعمال الإنشائية وفق الجدول مع بدء تشكيل المساحات الخضراء.', 'content' => '<p>حققت لارز مرحلة إنشائية مهمة في مشروع مدى، مع تقدم الأعمال الهيكلية في المجموعات السكنية الأولى.</p><p>بدأت أيضًا أعمال تنسيق المواقع والمحور المركزي، ما يمنح السكان مستقبليين لمحة عن البيئة المفتوحة المخطط لها.</p>'],
            'larz-business-hub-leed-recognition' => ['title' => 'لارز بيزنس هب يحصل على تقدير LEED', 'excerpt' => 'تقدير للتصميم المستدام وكفاءة التشغيل في مشروع مكاتب القاهرة الجديدة.', 'content' => '<p>حصل لارز بيزنس هب على تقدير LEED لتصميمه المستدام، بما في ذلك كفاءة الطوابق وضوء النهار والفناء المركزي.</p><p>يستمر المشروع في جذب الشركات التي تبحث عن عنوان مهني أكثر هدوءًا وإنسانية.</p>'],
            'what-to-look-for-in-a-new-cairo-community' => ['title' => 'ما الذي تبحث عنه في مجتمع بالقاهرة الجديدة؟', 'excerpt' => 'خمسة أسئلة تساعدك على مقارنة المخططات والكثافة والقيمة على المدى الطويل.', 'content' => '<p>اختيار مجتمع في القاهرة الجديدة يتجاوز مخططات الوحدات. الكثافة والوصول والمساحات الخضراء وجودة المرافق تشكل تجربة المعيشة لسنوات.</p><p>نستعرض خمسة أسئلة عملية قبل اتخاذ القرار — من نسبة الأرض المفتوحة إلى سهولة التنقل يوميًا.</p>'],
            'why-low-density-living-changes-everything' => ['title' => 'لماذا تغيّر الحياة منخفضة الكثافة كل شيء؟', 'excerpt' => 'كيف تؤثر المباني الأقل ارتفاعًا والمساحات المفتوحة على النور والخصوصية والقيمة.', 'content' => '<p>المخططات منخفضة الكثافة تغيّر إيقاع الحياة اليومية: صباحات أهدأ ونور أفضل وإطلالات غير محجوبة.</p><p>في لارز، نخطط مجتمعات لا تشغل المباني فيها سوى جزء من الأرض ليحتفظ السكان بالهدوء والمساحة.</p>'],
            'payment-plans-explained-simply' => ['title' => 'خطط السداد، ببساطة', 'excerpt' => 'دليل مبسّط للمقدم والأقساط وجداول التسليم.', 'content' => '<p>خطط السداد لا يجب أن تكون معقدة. تدمج معظم خطط لارز مقدمًا أوليًا مع أقساط مرتبطة بمراحل الإنشاء.</p><p>فهم مواعيد السداد وما يحدث عند التسليم يساعدك على التخطيط بثقة — هذا الدليل يشرح ذلك بلغة واضحة.</p>'],
        ]);
        $this->translateModels(Testimonial::class, 'name', [
            'Ahmed K.' => ['role' => 'صاحب عمل', 'quote' => '«كان اختيار لارز لاستثمارنا التجاري القرار الصحيح. منحنا الموقع الاستراتيجي والتصميم العصري والدعم الاحترافي ثقة كاملة في استثمارنا.»'],
            'Muhammed Y.' => ['role' => 'مالك منزل', 'quote' => '«من أول استشارة وحتى التسليم النهائي كانت التجربة سلسة. تجاوز الاهتمام بالتفاصيل وجودة التنفيذ توقعاتنا وجعل منزلنا الجديد كما تخيلناه.»'],
            'Sara M.' => ['role' => 'مستثمرة', 'quote' => '«قدمت لارز ما وعدت به — مجتمعًا مخططًا جيدًا مع طلب إيجار قوي وتواصل شفاف في كل مرحلة.»'],
            'Omar H.' => ['role' => 'مقيم', 'quote' => '«المساحات الخضراء والتصميم منخفض الارتفاع والمرافق المدروسة تجعل الحياة اليومية أكثر هدوءًا.»'],
        ]);
        $this->translateModels(Partner::class, 'name', [
            'Hany Saad Innovations' => ['name' => 'هاني سعد للابتكار', 'role' => 'العمارة والتصميم — كوف', 'description' => 'الشريك المعماري الرئيسي لمشروع كوف القاهرة الجديدة.'],
            'GRID Architects' => ['name' => 'GRID Architects', 'role' => 'التخطيط الرئيسي — مدى', 'description' => 'شريك التخطيط الرئيسي لمشروع مدى منخفض الكثافة.'],
            'DMA' => ['name' => 'DMA', 'role' => 'استشارات هندسية — منذ 1989', 'description' => 'استشارات هيكلية وميكانيكية لمشاريع لارز.'],
            'Ahmed Husseini Designs' => ['name' => 'Ahmed Husseini Designs', 'role' => 'تصميم داخلي — منذ 2008', 'description' => 'تصميم الوحدات النموذجية ومراكز المبيعات.'],
            'Green Modeling Contracting' => ['name' => 'Green Modeling Contracting', 'role' => 'مقاولات — 40+ سنة', 'description' => 'شريك تنفيذ بخبرة أربعة عقود في التسليم السكني.'],
        ]);
        $this->translateModels(Award::class, 'title', [
            'Best Residential Development' => ['title' => 'أفضل تطوير سكني', 'description' => 'تقدير لمخطط كلوف منخفض الكثافة وتصميم المناظر الطبيعية.'],
            'Excellence in Mixed-Use Design' => ['title' => 'التميز في التصميم متعدد الاستخدامات', 'description' => 'جائزة لتجربة كوف التجارية والمكتبية المتكاملة.'],
            'Green Building Certification' => ['title' => 'شهادة المباني الخضراء', 'description' => 'تقدير LEED لتصميم لارز بيزنس هب المستدام.'],
            '40 Years of Delivery' => ['title' => '40 عامًا من الإنجاز', 'description' => 'أربعة عقود من خبرة المؤسسين وراء كل مشروع.'],
        ]);
        foreach ([
            'contact.address_ar' => 'مول كوف، بجوار بوابة ميفيدا 6، القاهرة الجديدة 1، نهاية شارع التسعين بجوار الجامعة الأمريكية.',
            'footer.cta_title_ar' => 'لنبنِ المستقبل معًا',
            'footer.cta_button_ar' => 'تواصل معنا',
        ] as $key => $value) {
            SiteSetting::query()->where('key', $key)->update(['value' => $value]);
        }
    }

    private function translateSections(): void
    {
        $translations = [
            ['home', 'hero', ['eyebrow' => 'لارز', 'heading' => 'صُمّم لطريقة حياتك', 'description' => 'اكتشف مجتمعات مخططة بعناية تجمع بين التميز المعماري والقيمة الدائمة وأسلوب حياة مبني على الراحة والأناقة.', 'cta_label' => 'مشاريعنا', 'cta_url' => '/projects']],
            ['home', 'stats', ['items' => [['value' => '40+', 'label' => 'خبرة'], ['value' => '60+', 'label' => 'مشروع'], ['value' => '15k', 'label' => 'عميل'], ['value' => '2', 'label' => 'دولة']]]],
            ['home', 'featured_projects', ['eyebrow' => 'مشاريع مميزة', 'heading' => 'تطويراتنا الأيقونية', 'description' => 'اكتشف مجموعة منتقاة من أرقى مشاريعنا المصممة لرفع معايير المعيشة العصرية.', 'cta_label' => 'استكشف الكل', 'cta_url' => '/projects']],
            ['home', 'gallery', ['eyebrow' => 'معرض الصور', 'heading' => 'مساحات تُلهم', 'description' => 'لمحة عن التفاصيل والتصاميم والوجهات التي تعرّف تجربة لارز.', 'cta_label' => 'استكشف الكل', 'cta_url' => '/projects']],
            ['home', 'testimonials', ['eyebrow' => 'آراء العملاء', 'heading' => 'مبني على الثقة. مثبت بالخبرة.', 'description' => 'رضا عملائنا يعكس التزامنا بتقديم تطويرات مدروسة وخدمة استثنائية.']],
            ['home', 'final_cta', ['eyebrow' => 'ابدأ الآن', 'heading' => 'هل أنت مستعد لإيجاد منزلك؟', 'description' => 'استكشف مجتمعاتنا أو تحدث مع فريقنا لاختيار الأنسب لك.', 'cta_label' => 'عرض المشاريع', 'cta_url' => '/projects']],
            ['about', 'hero', ['eyebrow' => 'عن لارز', 'heading' => 'أنت لا تختار مبنى. أنت تختار كيف ستعيش.', 'description' => 'لأكثر من 40 عامًا، تعلّم مؤسسو لارز كيف يصنعون ذلك — في القاهرة الجديدة والعاصمة الإدارية.']],
            ['about', 'stats', ['items' => [['value' => '+60', 'label' => 'مشروع', 'note' => 'مكتمل وقيد التنفيذ'], ['value' => '2', 'label' => 'دولة', 'note' => 'مصر والتوسع مستمر'], ['value' => '+15k', 'label' => 'عميل', 'note' => 'عائلات وشركات'], ['value' => '+40', 'label' => 'سنة خبرة', 'note' => 'خبرة المؤسسين']]]],
            ['about', 'story', ['eyebrow' => 'قصتنا', 'heading' => 'لماذا يهم من يبني المكان.', 'body' => 'أنت تبحث عن مكان تنتمي إليه. عن مساحة للتنفس. عن منزل يظل مناسبًا بعد عشر سنوات. في لارز تشعر بخبرة 40 عامًا في التفاصيل التي يسهل تجاهلها ويصعب إصلاحها: كيف يسقط الضوء صباحًا، وكيف يتماسك الحي، وكيف يعيش المنزل بعد سنوات.']],
            ['about', 'promise', ['eyebrow' => 'وعدنا', 'heading' => 'نبني أماكن تظل تستحق بعد تسليم المفاتيح.', 'primary_cta_label' => 'استكشف مشاريعنا', 'primary_cta_url' => '/projects', 'secondary_cta_label' => 'تحدث معنا', 'secondary_cta_url' => '/contact-us']],
            ['about', 'partners', ['eyebrow' => 'شركاؤنا', 'heading' => 'نبني مع من يشاركوننا معاييرنا.', 'description' => 'معماريون ومهندسون ومقاولون نثق بهم في كل مشروع.']],
            ['about', 'awards', ['eyebrow' => 'الجوائز والإنجازات', 'heading' => 'معترف بنا لبناء ما يدوم.']],
            ['media', 'hero', ['eyebrow' => 'الإعلام', 'heading' => 'آخر أخبار لارز.', 'description' => 'أخبار وقصص ولحظات من مجتمعاتنا.']],
            ['media', 'news', ['eyebrow' => 'الأخبار والبيانات الصحفية', 'heading' => 'ما يحدث في لارز.', 'description' => 'آخر الإعلانات والمحطات من مشاريعنا ومجتمعاتنا.']],
            ['media', 'stories', ['eyebrow' => 'المدونة', 'heading' => 'قصص ورؤى.', 'description' => 'رؤى وقصص من صناع مجتمعاتنا.']],
            ['media', 'gallery', ['eyebrow' => 'معرض الصور', 'heading' => 'داخل مجتمعاتنا.', 'description' => 'لمحة عن المساحات والتفاصيل واللحظات التي تعرّف تجربة لارز.']],
            ['media', 'newsletter', ['eyebrow' => 'النشرة البريدية', 'heading' => 'لا تفوّت أي تحديث.', 'description' => 'اشترك لتصلك أحدث الأخبار والقصص ومراحل إنجاز مشاريعنا مباشرة إلى بريدك الإلكتروني.']],
            ['careers', 'hero', ['eyebrow' => 'الوظائف', 'heading' => 'ابنِ مستقبلك بينما نبني المجتمعات.', 'description' => 'انضم إلى فريق يهتم بالتفاصيل — وبمن ينفذونها.']],
            ['careers', 'values', ['eyebrow' => 'لماذا لارز', 'heading' => 'انمُ مع فريق يبني ما يدوم.', 'description' => 'نوظّف من يهتمون بالتفاصيل — وببعضهم البعض.']],
            ['careers', 'vacancies_settings', ['eyebrow' => 'الوظائف الشاغرة', 'heading' => 'فرص متاحة.', 'description' => 'انضم إلينا في تشكيل مجتمعات القاهرة الجديدة وما بعدها.']],
            ['careers', 'internship', ['heading' => 'ابدأ مسيرتك معنا.', 'description' => 'برامج تدريبية تمنح الطلاب والخريجين خبرة حقيقية في التصميم والتسويق والمبيعات والهندسة.']],
            ['careers', 'general_cv_cta', ['eyebrow' => 'الوظائف', 'heading' => 'لا تجد دورك؟ أرسل سيرتك الذاتية.', 'cta_label' => 'أرسل سيرتك الذاتية']],
            ['contact', 'hero', ['eyebrow' => 'تواصل معنا', 'heading' => 'لنتحدث.', 'description' => 'سواء كنت تختار منزلًا أو تستكشف شراكة، نحن هنا — ونرد بسرعة.', 'primary_cta_label' => 'أرسل رسالة', 'primary_cta_url' => '#contact-form', 'secondary_cta_label' => 'اتصل بنا', 'secondary_cta_url' => 'tel:15813']],
            ['contact', 'location', ['heading' => 'تجدنا.']],
            ['contact', 'contact_methods', ['eyebrow' => 'تواصل معنا', 'heading' => 'بالطريقة التي تناسبك.', 'description' => 'تواصل مع الفريق عبر القناة الأنسب لك.', 'items' => [['key' => 'hotline', 'icon' => 'phone', 'title' => 'الخط الساخن', 'value' => '15813', 'note' => 'السبت–الخميس، 9 ص–6 م'], ['key' => 'whatsapp', 'icon' => 'message-circle', 'title' => 'واتساب', 'value' => '+20 15813', 'note' => 'ردود سريعة يوميًا'], ['key' => 'email', 'icon' => 'mail', 'title' => 'البريد الإلكتروني', 'value' => 'info@larzdevelopments.com', 'note' => 'larzdevelopments.com'], ['key' => 'sales_office', 'icon' => 'map-pin', 'title' => 'مكتب المبيعات', 'value' => 'القاهرة الجديدة', 'note' => 'مول كوف، بجوار بوابة ميفيدا 6']]]],
            ['contact', 'request_form', ['heading' => 'أرسل لنا رسالة.', 'description' => 'أخبرنا بما تبحث عنه وسيرد فريقنا خلال يوم عمل واحد.', 'submit_label' => 'إرسال الرسالة']],
            ['contact', 'social_media', ['eyebrow' => 'وسائل التواصل', 'heading' => 'تابع لارز.', 'description' => 'أخبار وإطلاقات ولحظات من مجتمعاتنا.']],
        ];

        foreach ($translations as [$page, $section, $arabic]) {
            $record = PageSection::query()->where('page_key', $page)->where('section_key', $section)->first();
            if (! $record) {
                continue;
            }
            $snapshot = $record->content_snapshot ?? [];
            $english = [];
            foreach (array_keys($arabic) as $key) {
                if (isset($snapshot[$key]) && is_string($snapshot[$key])) {
                    $english[$key] = LocalizedContent::sanitizeNewlines($snapshot[$key]);
                    $snapshot[$key] = $english[$key];
                }
            }
            $snapshot['translations'] = array_replace($snapshot['translations'] ?? [], [
                'en' => array_replace($snapshot['translations']['en'] ?? [], $english),
                'ar' => $arabic,
            ]);
            $record->update(['content_snapshot' => LocalizedContent::sanitizeStrings($snapshot)]);
        }
    }

    private function translateProjectSections(): void
    {
        $this->translateProjectPageSectionTranslations();

        foreach (ProjectPageCopy::slugs() as $slug) {
            $project = Project::query()->where('slug', $slug)->first();
            if (! $project) {
                continue;
            }

            $copy = ProjectPageCopy::arabic($slug);
            $project->update([
                'sections' => array_replace($project->sections ?? [], [
                    'ar' => ProjectPageCopy::buildSections($project->fresh(), $copy, 'ar'),
                ]),
            ]);
        }
    }

    private function translateProjectPageSectionTranslations(): void
    {
        foreach (ProjectPageCopy::slugs() as $slug) {
            $copy = ProjectPageCopy::arabic($slug);
            $pageKey = 'project-'.$slug;
            $sections = [
                'hero_slides' => ['items' => $copy['heroSlides'] ?? []],
                'overview' => $copy['overview'] ?? ['heading' => '', 'body' => ''],
                'masterplan' => $copy['masterplan'] ?? [],
                'virtual_tour' => $copy['virtualTour'] ?? [],
                'cta' => ['eyebrow' => $copy['cta']['eyebrow'] ?? '', 'heading' => $copy['cta']['heading'] ?? ''],
                'homes3d' => $copy['homes3d'] ?? [],
                'construction' => ['heading' => $copy['construction']['heading'] ?? '', 'description' => $copy['construction']['description'] ?? ''],
                'amenities' => ['heading' => $copy['amenities']['heading'] ?? ''],
                'location' => $copy['location'] ?? [],
            ];

            foreach ($sections as $sectionKey => $arabic) {
                $record = PageSection::query()->where('page_key', $pageKey)->where('section_key', $sectionKey)->first();
                if (! $record) {
                    continue;
                }
                $snapshot = $record->content_snapshot ?? [];
                $snapshot['translations'] = array_replace($snapshot['translations'] ?? [], ['ar' => $arabic]);
                $record->update(['content_snapshot' => $snapshot]);
            }
        }
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
