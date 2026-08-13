<?php

namespace Database\Seeders\Support;

use App\Models\MediaAsset;
use App\Models\Project;
use App\Support\WebsiteContent;

/** Bilingual project page copy (no literal newline characters). */
final class ProjectPageCopy
{
    /** @return list<string> */
    public static function slugs(): array
    {
        return ['klove-new-cairo', 'kov-new-cairo', 'larz-business-hub', 'larz-medical-park', 'larz-riverside'];
    }

    public static function english(string $slug): array
    {
        return match ($slug) {
            'klove-new-cairo' => self::kloveEn(),
            'kov-new-cairo' => self::kovEn(),
            'larz-business-hub' => self::businessHubEn(),
            'larz-medical-park' => self::medicalParkEn(),
            'larz-riverside' => self::riversideEn(),
            default => [],
        };
    }

    public static function arabic(string $slug): array
    {
        return match ($slug) {
            'klove-new-cairo' => self::kloveAr(),
            'kov-new-cairo' => self::kovAr(),
            'larz-business-hub' => self::businessHubAr(),
            'larz-medical-park' => self::medicalParkAr(),
            'larz-riverside' => self::riversideAr(),
            default => [],
        };
    }

    /** @return list<array{page_key: string, section_key: string, section_type: string, content_snapshot: array<string, mixed>}> */
    public static function pageSections(string $slug, array $copy): array
    {
        $pageKey = 'project-'.$slug;

        return [
            ['page_key' => $pageKey, 'section_key' => 'hero_slides', 'section_type' => 'project.hero_slides', 'content_snapshot' => ['items' => $copy['heroSlides'] ?? []]],
            ['page_key' => $pageKey, 'section_key' => 'overview', 'section_type' => 'project.overview', 'content_snapshot' => $copy['overview'] ?? ['heading' => '', 'body' => '']],
            ['page_key' => $pageKey, 'section_key' => 'masterplan', 'section_type' => 'project.masterplan', 'content_snapshot' => $copy['masterplan'] ?? []],
            ['page_key' => $pageKey, 'section_key' => 'virtual_tour', 'section_type' => 'project.virtual_tour', 'content_snapshot' => $copy['virtualTour'] ?? []],
            ['page_key' => $pageKey, 'section_key' => 'cta', 'section_type' => 'project.cta', 'content_snapshot' => ['eyebrow' => $copy['cta']['eyebrow'] ?? '', 'heading' => $copy['cta']['heading'] ?? '']],
            ['page_key' => $pageKey, 'section_key' => 'homes3d', 'section_type' => 'project.homes3d', 'content_snapshot' => $copy['homes3d'] ?? []],
            ['page_key' => $pageKey, 'section_key' => 'gallery', 'section_type' => 'project.gallery', 'content_snapshot' => $copy['gallery'] ?? ['eyebrow' => 'Gallery', 'heading' => 'A closer look.']],
            ['page_key' => $pageKey, 'section_key' => 'construction', 'section_type' => 'project.construction', 'content_snapshot' => ['heading' => $copy['construction']['heading'] ?? '', 'description' => $copy['construction']['description'] ?? '']],
            ['page_key' => $pageKey, 'section_key' => 'amenities', 'section_type' => 'project.amenities', 'content_snapshot' => ['heading' => $copy['amenities']['heading'] ?? '']],
            ['page_key' => $pageKey, 'section_key' => 'location', 'section_type' => 'project.location', 'content_snapshot' => $copy['location'] ?? []],
        ];
    }

    public static function buildSections(Project $project, array $copy, string $locale): array
    {
        $project->loadMissing(['statistics', 'unitTypes', 'updates.media', 'nearbyLocations', 'amenities']);

        $localized = $copy;
        $stats = $localized['stats'] ?? null;
        if ($stats === null) {
            $stats = $project->statistics->map(fn ($item) => [
                'value' => $item->value,
                'label' => $item->label,
                'note' => $item->note ?? '',
            ])->values()->all();
        }

        $homes3dItems = $localized['homes3dItems'] ?? null;
        if ($homes3dItems === null) {
            $homes3dItems = $project->unitTypes->map(fn ($item) => [
                'tag' => $item->tag,
                'name' => $item->name,
                'size' => $item->size_min.'–'.$item->size_max,
                'url' => '',
            ])->values()->all();
        }

        $constructionItems = $localized['constructionItems'] ?? null;
        if ($constructionItems === null) {
            $constructionItems = $project->updates->map(fn ($item) => [
                'tag' => $item->tag,
                'title' => $item->title,
                'image' => self::assetUrl($item->media_asset_id),
            ])->values()->all();
        } else {
            $constructionItems = collect($constructionItems)->values()->map(function (array $item, int $index) use ($project) {
                $update = $project->updates->values()->get($index);

                return [
                    'tag' => $item['tag'],
                    'title' => $item['title'],
                    'image' => self::assetUrl($update?->media_asset_id),
                ];
            })->all();
        }

        $nearbyLocations = $localized['nearbyLocations'] ?? null;
        if ($nearbyLocations === null) {
            $nearbyLocations = $project->nearbyLocations->map(fn ($item) => [
                'place' => $item->place,
                'time' => $item->time_label,
            ])->values()->all();
        }

        $amenities = $localized['amenities'] ?? ['heading' => '', 'categories' => []];
        if (empty($amenities['categories']) && $project->amenities->isNotEmpty()) {
            $amenities['categories'] = $project->amenities->groupBy('group_name')->map(fn ($items, $group) => [
                'title' => $group,
                'items' => $items->map(fn ($item) => [
                    'title' => $item->title,
                    'description' => $item->description,
                    'icon' => null,
                ])->values()->all(),
            ])->values()->all();
        }

        $cta = $localized['cta'] ?? [];
        $heroSlides = array_map(fn (array $slide) => [
            ...$slide,
            'cta1Label' => $slide['cta1Label'] ?? ($locale === 'ar' ? 'اطلب الأسعار وخطة السداد' : 'Request pricing & payment plan'),
            'cta1Url' => $slide['cta1Url'] ?? '#brochure',
            'cta2Label' => $slide['cta2Label'] ?? ($locale === 'ar' ? 'حمّل الكتيب' : 'Download brochure'),
            'cta2Url' => $slide['cta2Url'] ?? '#brochure',
        ], $localized['heroSlides'] ?? []);

        return [
            'heroSlides' => $heroSlides,
            'stats' => $stats,
            'overview' => $localized['overview'] ?? ['heading' => '', 'body' => ''],
            'gallery' => [
                'eyebrow' => $localized['gallery']['eyebrow'] ?? ($locale === 'ar' ? 'المعرض' : 'Gallery'),
                'heading' => $localized['gallery']['heading'] ?? ($locale === 'ar' ? 'نظرة أقرب.' : 'A closer look.'),
            ],
            'masterplan' => $localized['masterplan'] ?? ['heading' => '', 'description' => '', 'brochureHeading' => '', 'brochureDescription' => ''],
            'virtualTour' => $localized['virtualTour'] ?? ['heading' => '', 'description' => '', 'videoUrl' => ''],
            'cta' => [
                'eyebrow' => $cta['eyebrow'] ?? '',
                'heading' => $cta['heading'] ?? '',
                'whatsappNumber' => $cta['whatsappNumber'] ?? '201128775744',
                'primaryCtaLabel' => $cta['primaryCtaLabel'] ?? ($locale === 'ar' ? 'اطلب الأسعار وخطة السداد' : 'Request pricing & payment plan'),
                'secondaryCtaLabel' => $cta['secondaryCtaLabel'] ?? ($locale === 'ar' ? 'تواصل عبر واتساب' : 'WhatsApp us'),
            ],
            'homes3d' => [
                'heading' => $localized['homes3d']['heading'] ?? '',
                'description' => $localized['homes3d']['description'] ?? '',
                'note' => $localized['homes3d']['note'] ?? '',
                'items' => $homes3dItems,
            ],
            'construction' => [
                'heading' => $localized['construction']['heading'] ?? '',
                'description' => $localized['construction']['description'] ?? '',
                'items' => $constructionItems,
            ],
            'amenities' => $amenities,
            'location' => [
                'heading' => $localized['location']['heading'] ?? '',
                'description' => $localized['location']['description'] ?? '',
                'gateNote' => $localized['location']['gateNote'] ?? '',
                'driveNote' => $localized['location']['driveNote'] ?? '',
                'image' => $localized['location']['image'] ?? null,
                'nearbyLocations' => $nearbyLocations,
            ],
        ];
    }

    private static function assetUrl(?int $assetId): string
    {
        if (! $assetId) {
            return '';
        }

        return WebsiteContent::assetUrl(MediaAsset::query()->find($assetId)) ?? '';
    }

    private static function kloveEn(): array
    {
        return [
            'heroSlides' => [
                ['eyebrow' => 'KLOVE — New Cairo', 'titleLine1' => 'Come home', 'titleLine2' => 'to quiet.', 'description' => 'A low-rise, green community in New Cairo’s Al-Qornofel — where only a fifth of the land is built on, so your home keeps its light, its air, and its view.'],
                ['eyebrow' => 'KLOVE — New Cairo', 'titleLine1' => 'Live among', 'titleLine2' => 'the green.', 'description' => 'Surrounded by landscaped courtyards and open walkways designed to bring nature into every corner of your daily life.'],
                ['eyebrow' => 'KLOVE — New Cairo', 'titleLine1' => 'Light, air,', 'titleLine2' => 'and view.', 'description' => 'Every home is crafted to maximise natural light, fresh air circulation, and unobstructed green views — a rare luxury in urban living.'],
            ],
            'overview' => ['heading' => "The city doesn't slow down. Your home should.", 'body' => 'At Klove, you wake up to green instead of traffic, and to space that was planned around the way you actually want to live. Across 24 feddans, only a fifth carries buildings — the rest is garden, water and open air. Nothing rises above five floors, so your mornings stay calm, your evenings stay private, and the view from your window stays yours.'],
            'masterplan' => ['heading' => 'See exactly where your home sits.', 'description' => 'How the green, the water and the walkways wrap around it. Then take the full picture with you.', 'brochureHeading' => 'Get the brochure', 'brochureDescription' => "Two details, and it's yours."],
            'virtualTour' => ['heading' => 'Take a walk through Klove tonight.', 'description' => 'From your sofa — the streets, the landscape and the spaces, before you ever visit.', 'videoUrl' => 'https://www.youtube.com/embed/MLpWrANjFbI?si=xdUBsJQ3tkUMv1ZX'],
            'cta' => ['eyebrow' => 'KLOVE — New Cairo', 'heading' => 'A better life begins in the right place.', 'whatsappNumber' => '201128775744', 'primaryCtaLabel' => 'Request pricing & payment plan', 'secondaryCtaLabel' => 'WhatsApp us'],
            'homes3d' => ['heading' => 'A home that fits where you are in life.', 'description' => 'Eight ways to live at Klove — explore each one in three dimensions, room by room.', 'note' => 'Every home opens onto its own private terrace.'],
            'construction' => ['heading' => 'Watch your home take shape.', 'description' => "Dated updates from site, so you're never left wondering where things stand."],
            'amenities' => ['heading' => "The best parts of your day won't happen indoors.", 'categories' => []],
            'location' => ['heading' => "Quiet doesn't mean far.", 'description' => 'Klove sits in Al-Qornofel, opposite Golden Square — minutes from the roads, schools and places you already use, with two gates so getting home is never a wait.', 'gateNote' => 'Two access gates — each placed for an easier way in and out', 'driveNote' => 'Drive times are indicative.', 'image' => null],
        ];
    }

    private static function kloveAr(): array
    {
        return [
            'heroSlides' => [
                ['eyebrow' => 'كلوف — القاهرة الجديدة', 'titleLine1' => 'عد إلى منزلك', 'titleLine2' => 'وإلى الهدوء.', 'description' => 'مجتمع أخضر منخفض الارتفاع في القرنفل بالقاهرة الجديدة؛ لا تشغل المباني سوى خُمس الأرض، ليحافظ منزلك على نوره وهوائه وإطلالته.'],
                ['eyebrow' => 'كلوف — القاهرة الجديدة', 'titleLine1' => 'عِش وسط', 'titleLine2' => 'الخُضرة.', 'description' => 'تحيط بك ساحات خضراء وممرات مفتوحة صُممت لتجلب الطبيعة إلى كل زاوية من حياتك اليومية.'],
                ['eyebrow' => 'كلوف — القاهرة الجديدة', 'titleLine1' => 'نور وهواء', 'titleLine2' => 'وإطلالة.', 'description' => 'صُمم كل منزل لتعظيم الضوء الطبيعي وتجدد الهواء والإطلالات الخضراء المفتوحة؛ رفاهية نادرة في الحياة الحضرية.'],
            ],
            'stats' => [
                ['value' => '24', 'label' => 'فدانًا', 'note' => 'مساحة للتنفس'],
                ['value' => '20%', 'label' => 'مبانٍ', 'note' => '80% من المساحة مفتوح'],
                ['value' => 'G+5', 'label' => 'طوابق', 'note' => 'مبانٍ منخفضة بلا أبراج'],
                ['value' => '50–196 م²', 'label' => 'منازل', 'note' => 'من الاستوديو إلى الدوبلكس'],
            ],
            'overview' => ['heading' => 'المدينة لا تهدأ. منزلك يجب أن يهدأ.', 'body' => 'في كلوف، تستيقظ على الخُضرة بدلًا من الزحام، وعلى مساحة خُطّطت لطريقة الحياة التي تريدها فعلًا. على مساحة 24 فدانًا، لا تشغل المباني سوى الخُمس؛ والباقي حدائق ومياه وهواء طلق. لا يتجاوز أي مبنى خمسة طوابق، فتبقى صباحاتك هادئة وأمسياتك خاصة وإطلالتك لك.'],
            'masterplan' => ['heading' => 'اعرف بدقة موقع منزلك.', 'description' => 'اكتشف كيف تحيط به الخُضرة والمياه والممرات، ثم خذ الصورة الكاملة معك.', 'brochureHeading' => 'احصل على الكتيب', 'brochureDescription' => 'تفصيلان فقط ويصبح بين يديك.'],
            'virtualTour' => ['heading' => 'تجوّل في كلوف الليلة.', 'description' => 'من أريكتك؛ الشوارع والطبيعة والمساحات قبل أن تزورها.', 'videoUrl' => 'https://www.youtube.com/embed/MLpWrANjFbI?si=xdUBsJQ3tkUMv1ZX'],
            'cta' => ['eyebrow' => 'كلوف — القاهرة الجديدة', 'heading' => 'حياة أفضل تبدأ من المكان المناسب.', 'whatsappNumber' => '201128775744', 'primaryCtaLabel' => 'اطلب الأسعار وخطة السداد', 'secondaryCtaLabel' => 'تواصل عبر واتساب'],
            'homes3d' => ['heading' => 'منزل يناسب مكانك في الحياة.', 'description' => 'ثماني طرق للعيش في كلوف؛ استكشف كلًا منها ثلاثي الأبعاد، غرفةً بغرفة.', 'note' => 'يفتح كل منزل على تراسه الخاص.'],
            'homes3dItems' => [
                ['tag' => 'استوديو', 'name' => 'الاستوديو', 'size' => '50–54', 'url' => ''],
                ['tag' => 'غرفة نوم', 'name' => 'شقة', 'size' => '78–90', 'url' => ''],
                ['tag' => 'غرفتا نوم', 'name' => 'شقة', 'size' => '99–116', 'url' => ''],
                ['tag' => 'غرفتا نوم كبيرة', 'name' => 'شقة', 'size' => '125–143', 'url' => ''],
                ['tag' => '3 غرف', 'name' => 'شقة', 'size' => '150–161', 'url' => ''],
                ['tag' => '3 غرف كبيرة', 'name' => 'شقة', 'size' => '170–175', 'url' => ''],
                ['tag' => '3 غرف مميزة', 'name' => 'شقة', 'size' => '179–190', 'url' => ''],
                ['tag' => 'دوبلكس', 'name' => 'الدوبلكس', 'size' => '190–196', 'url' => ''],
            ],
            'construction' => ['heading' => 'شاهد منزلك وهو يتشكل.', 'description' => 'تحديثات مؤرخة من الموقع حتى تعرف دائمًا أين وصلت الأعمال.'],
            'constructionItems' => [
                ['tag' => 'آخر تحديث', 'title' => 'تقدم الهيكل والتنسيق'],
                ['tag' => 'سابق', 'title' => 'الأساسات والمجموعات السكنية'],
                ['tag' => 'أقدم', 'title' => 'بداية أعمال الحفر'],
            ],
            'amenities' => ['heading' => 'أفضل لحظات يومك لن تكون داخل المنزل.', 'categories' => [
                ['title' => 'العافية والحركة', 'items' => [['title' => 'سطح لليوغا', 'description' => 'صباحات هادئة فوق الماء.', 'icon' => null], ['title' => 'صالة رياضية', 'description' => 'تمرينك دون عناء التنقل.', 'icon' => null], ['title' => 'مسارات الجري', 'description' => 'حلقتك اليومية وسط الخضرة.', 'icon' => null]]],
                ['title' => 'المياه والترفيه', 'items' => [['title' => 'حمام سباحة مجتمعي', 'description' => 'للسباحة والاسترخاء.', 'icon' => null], ['title' => 'حمام سباحة النادي', 'description' => 'مخصص للبالغين.', 'icon' => null], ['title' => 'نادي اجتماعي', 'description' => 'حيث يلتقي الجيران.', 'icon' => null]]],
                ['title' => 'العائلة والحياة اليومية', 'items' => [['title' => 'مناطق لعب الأطفال', 'description' => 'مساحة آمنة للعب.', 'icon' => null], ['title' => 'مساحات خضراء', 'description' => 'خضرة أينما نظرت.', 'icon' => null], ['title' => 'منطقة شواء', 'description' => 'غداءات نهاية الأسبوع في الهواء الطلق.', 'icon' => null]]],
            ]],
            'location' => ['heading' => 'الهدوء لا يعني البُعد.', 'description' => 'يقع كلوف في القرنفل مقابل المربع الذهبي، على بعد دقائق من الطرق والمدارس والأماكن التي تستخدمها، وببوابتين تجعل العودة إلى المنزل سهلة دائمًا.', 'gateNote' => 'بوابتان للدخول، وُضعتا لتسهيل الحركة من وإلى المشروع', 'driveNote' => 'أوقات القيادة تقديرية.', 'image' => null],
            'nearbyLocations' => [
                ['place' => 'طريق شمال التسعين', 'time' => '1 دقيقة'],
                ['place' => 'مدينة الرحاب', 'time' => '3 دقائق'],
                ['place' => 'مكتب النائب العام', 'time' => '5 دقائق'],
                ['place' => 'الجامعة الأمريكية بالقاهرة', 'time' => '7 دقائق'],
                ['place' => 'العاصمة الإدارية الجديدة', 'time' => '20 دقيقة'],
            ],
        ];
    }

    private static function kovEn(): array
    {
        return [
            'heroSlides' => [
                ['eyebrow' => 'KOV — New Cairo', 'titleLine1' => 'Where Golden Square', 'titleLine2' => 'slows down.', 'description' => 'Retail, offices and clinics in one calm, walkable address — designed around daylight, open plazas and easy arrival.'],
                ['eyebrow' => 'KOV — New Cairo', 'titleLine1' => 'Work, shop,', 'titleLine2' => 'live closer.', 'description' => 'Double-height retail frontage, panoramic office floors and shaded seating along the main spine.'],
                ['eyebrow' => 'KOV — New Cairo', 'titleLine1' => 'Built for', 'titleLine2' => 'everyday ease.', 'description' => 'Three levels of covered parking, direct lift access and a landscaped plaza with water features.'],
            ],
            'overview' => ['heading' => 'Mixed-use, without the noise.', 'body' => 'KOV New Cairo brings retail, offices and clinics into one address in the heart of Golden Square. The masterplan prioritises walkability, natural light and generous circulation — so every visit feels calm, whether you are working, shopping or meeting a client.'],
            'masterplan' => ['heading' => 'See how the district connects.', 'description' => 'Retail at street level, offices above and clinics with their own circulation — all wrapped around a central plaza.', 'brochureHeading' => 'Get the brochure', 'brochureDescription' => 'Leave your details and we will send the full masterplan.'],
            'virtualTour' => ['heading' => 'Walk through KOV before you visit.', 'description' => 'Explore the plazas, retail spine and office floors from your screen.', 'videoUrl' => 'https://www.youtube.com/embed/MLpWrANjFbI?si=xdUBsJQ3tkUMv1ZX'],
            'cta' => ['eyebrow' => 'KOV — New Cairo', 'heading' => 'Your place in Golden Square starts here.', 'whatsappNumber' => '201128775744', 'primaryCtaLabel' => 'Request pricing & payment plan', 'secondaryCtaLabel' => 'WhatsApp us'],
            'homes3d' => ['heading' => 'Spaces shaped for how you use them.', 'description' => 'From street-level retail to upper-floor offices — explore the typologies available at KOV.', 'note' => 'Flexible fit-out options across unit types.'],
            'construction' => ['heading' => 'Progress you can follow.', 'description' => 'Regular dated updates from site as KOV takes shape.'],
            'amenities' => ['heading' => 'Everything within a short walk.', 'categories' => []],
            'location' => ['heading' => 'Heart of Golden Square.', 'description' => 'KOV sits at the centre of New Cairo’s Golden Square — minutes from major roads, schools and everyday destinations.', 'gateNote' => 'Dedicated drop-off and visitor parking', 'driveNote' => 'Drive times are indicative.', 'image' => null],
        ];
    }

    private static function kovAr(): array
    {
        return [
            'heroSlides' => [
                ['eyebrow' => 'كوف — القاهرة الجديدة', 'titleLine1' => 'حيث يهدأ', 'titleLine2' => 'المربع الذهبي.', 'description' => 'متاجر ومكاتب وعيادات في عنوان هادئ قابل للمشي — صُمم حول ضوء النهار والساحات المفتوحة.'],
                ['eyebrow' => 'كوف — القاهرة الجديدة', 'titleLine1' => 'اعمل وتسوق', 'titleLine2' => 'بقربك.', 'description' => 'واجهات تجارية مزدوجة الارتفاع وطوابق مكاتب بإطلالات بانورامية.'],
                ['eyebrow' => 'كوف — القاهرة الجديدة', 'titleLine1' => 'مبني', 'titleLine2' => 'للراحة اليومية.', 'description' => 'ثلاثة مستويات من المواقف المغطاة ووصول مباشر بالمصاعد.'],
            ],
            'stats' => [
                ['value' => '12', 'label' => 'فدانًا', 'note' => 'حي متكامل'],
                ['value' => 'استخدام مختلط', 'label' => 'النمط', 'note' => 'تجزئة ومكاتب وعيادات'],
                ['value' => '2027', 'label' => 'التسليم', 'note' => 'قيد الإنشاء'],
                ['value' => '180+', 'label' => 'وحدة', 'note' => 'مساحات متنوعة'],
            ],
            'overview' => ['heading' => 'استخدام مختلط بلا ضوضاء.', 'body' => 'يجمع كوف القاهرة الجديدة بين التجزئة والمكاتب والعيادات في عنوان واحد بقلب المربع الذهبي. يركز المخطط على قابلية المشي والضوء الطبيعي ومسارات الحركة الرحبة.'],
            'masterplan' => ['heading' => 'اكتشف كيف يرتبط الحي.', 'description' => 'تجزئة على مستوى الشارع ومكاتب في الأدوار العلوية وعيادات بمسارات منفصلة حول ساحة مركزية.', 'brochureHeading' => 'احصل على الكتيب', 'brochureDescription' => 'اترك بياناتك وسنرسل المخطط الكامل.'],
            'virtualTour' => ['heading' => 'تجوّل في كوف قبل زيارتك.', 'description' => 'استكشف الساحات والمحور التجاري وطوابق المكاتب من شاشتك.', 'videoUrl' => 'https://www.youtube.com/embed/MLpWrANjFbI?si=xdUBsJQ3tkUMv1ZX'],
            'cta' => ['eyebrow' => 'كوف — القاهرة الجديدة', 'heading' => 'مكانك في المربع الذهبي يبدأ هنا.', 'whatsappNumber' => '201128775744', 'primaryCtaLabel' => 'اطلب الأسعار وخطة السداد', 'secondaryCtaLabel' => 'تواصل عبر واتساب'],
            'homes3d' => ['heading' => 'مساحات تناسب طريقة استخدامك.', 'description' => 'من التجزئة على مستوى الشارع إلى المكاتب في الأدوار العلوية — استكشف الأنماط المتاحة في كوف.', 'note' => 'خيارات تشطيب مرنة عبر أنواع الوحدات.'],
            'homes3dItems' => [
                ['tag' => 'تجزئة', 'name' => 'وحدة تجارية', 'size' => '45–120', 'url' => ''],
                ['tag' => 'مكتب', 'name' => 'مكتب', 'size' => '80–250', 'url' => ''],
                ['tag' => 'عيادة', 'name' => 'عيادة', 'size' => '55–95', 'url' => ''],
            ],
            'construction' => ['heading' => 'تقدم يمكنك متابعته.', 'description' => 'تحديثات دورية من الموقع مع تقدم أعمال كوف.'],
            'constructionItems' => [
                ['tag' => 'آخر تحديث', 'title' => 'أعمال الهيكل والواجهات'],
                ['tag' => 'سابق', 'title' => 'الأساسات والمحور التجاري'],
            ],
            'amenities' => ['heading' => 'كل شيء على مسافة قريبة.', 'categories' => [
                ['title' => 'التجزئة والمطاعم', 'items' => [['title' => 'محلات أرضية', 'description' => 'واجهات مزدوجة الارتفاع على المحور الرئيسي.', 'icon' => null], ['title' => 'مقاهٍ ومطاعم', 'description' => 'جلسات خارجية مظللة في الساحة.', 'icon' => null]]],
                ['title' => 'العمل والرفاهية', 'items' => [['title' => 'طوابق مكاتب', 'description' => 'إطلالات بانورامية مع تراسات خاصة.', 'icon' => null], ['title' => 'مواقف مغطاة', 'description' => 'ثلاثة مستويات مع وصول مباشر بالمصاعد.', 'icon' => null]]],
            ]],
            'location' => ['heading' => 'قلب المربع الذهبي.', 'description' => 'يقع كوف في مركز المربع الذهبي بالقاهرة الجديدة — على دقائق من الطرق الرئيسية والمدارس.', 'gateNote' => 'منطقة إنزال وزوار مخصصة', 'driveNote' => 'أوقات القيادة تقديرية.', 'image' => null],
            'nearbyLocations' => [
                ['place' => 'المربع الذهبي', 'time' => '2 دقيقة'],
                ['place' => 'طريق التسعين الشمالي', 'time' => '5 دقائق'],
                ['place' => 'مدينة الرحاب', 'time' => '8 دقائق'],
                ['place' => 'العاصمة الإدارية', 'time' => '18 دقيقة'],
            ],
        ];
    }

    private static function businessHubEn(): array
    {
        return [
            'heroSlides' => [
                ['eyebrow' => 'LARZ Business Hub', 'titleLine1' => 'A workplace', 'titleLine2' => 'that breathes.', 'description' => 'Flexible office floors, ground-level cafés and a courtyard that keeps the working day human.'],
                ['eyebrow' => 'LARZ Business Hub', 'titleLine1' => 'Column-free', 'titleLine2' => 'floor plates.', 'description' => 'From 60 to 400 m² with natural light and all-day shade in the central courtyard.'],
                ['eyebrow' => 'LARZ Business Hub', 'titleLine1' => 'Presence', 'titleLine2' => 'without noise.', 'description' => 'Built for companies that want a professional address and a calmer daily rhythm.'],
            ],
            'overview' => ['heading' => 'Workplaces should feel like neighbourhoods.', 'body' => 'LARZ Business Hub combines flexible office floors with ground-level cafés and a central courtyard. Smart access, visitor drop-off and building management systems support teams that want presence without the chaos of a typical business district.'],
            'masterplan' => ['heading' => 'Understand the layout.', 'description' => 'See how office floors, retail and the courtyard connect — then download the brochure.', 'brochureHeading' => 'Get the brochure', 'brochureDescription' => 'Two details and the full pack is yours.'],
            'virtualTour' => ['heading' => 'Tour the Business Hub.', 'description' => 'Walk the courtyard, lobby and sample floor plates before your visit.', 'videoUrl' => 'https://www.youtube.com/embed/MLpWrANjFbI?si=xdUBsJQ3tkUMv1ZX'],
            'cta' => ['eyebrow' => 'LARZ Business Hub', 'heading' => 'Give your team a better address.', 'whatsappNumber' => '201128775744', 'primaryCtaLabel' => 'Request pricing & payment plan', 'secondaryCtaLabel' => 'WhatsApp us'],
            'homes3d' => ['heading' => 'Office typologies.', 'description' => 'Explore floor plate sizes and layouts available at the Business Hub.', 'note' => 'Custom fit-out packages available.'],
            'construction' => ['heading' => 'Delivery on schedule.', 'description' => 'Follow construction milestones as the hub nears completion.'],
            'amenities' => ['heading' => 'Designed for the working day.', 'categories' => []],
            'location' => ['heading' => 'Connected in New Cairo.', 'description' => 'The Business Hub is minutes from major arteries, retail and residential communities across New Cairo.', 'gateNote' => 'Visitor drop-off and valet', 'driveNote' => 'Drive times are indicative.', 'image' => null],
        ];
    }

    private static function businessHubAr(): array
    {
        return [
            'heroSlides' => [
                ['eyebrow' => 'لارز بيزنس هب', 'titleLine1' => 'مكان عمل', 'titleLine2' => 'يتنفس.', 'description' => 'طوابق مكاتب مرنة ومقاهٍ في الطابق الأرضي وفناء يجعل يوم العمل أكثر إنسانية.'],
                ['eyebrow' => 'لارز بيزنس هب', 'titleLine1' => 'طوابق', 'titleLine2' => 'بلا أعمدة.', 'description' => 'من 60 إلى 400 م² مع ضوء طبيعي وظل طوال اليوم في الفناء المركزي.'],
                ['eyebrow' => 'لارز بيزنس هب', 'titleLine1' => 'حضور', 'titleLine2' => 'بلا ضوضاء.', 'description' => 'للشركات التي تريد عنوانًا مهنيًا وإيقاعًا يوميًا أكثر هدوءًا.'],
            ],
            'stats' => [
                ['value' => '8', 'label' => 'فدانًا', 'note' => 'مجمع مكاتب'],
                ['value' => 'مكاتب وتجزئة', 'label' => 'النمط', 'note' => 'استخدام مختلط'],
                ['value' => '2026', 'label' => 'التسليم', 'note' => 'متاح للبيع'],
                ['value' => '120+', 'label' => 'وحدة', 'note' => 'مساحات مرنة'],
            ],
            'overview' => ['heading' => 'أماكن العمل يجب أن تشبه الأحياء.', 'body' => 'يجمع لارز بيزنس هب بين طوابق مكاتب مرنة ومقاهٍ في الطابق الأرضي وفناء مركزي. أنظمة دخول ذكية وإدارة مباني تدعم فرقًا تريد حضورًا مهنيًا بلا فوضى أحياء الأعمال التقليدية.'],
            'masterplan' => ['heading' => 'افهم المخطط.', 'description' => 'اكتشف كيف تتصل طوابق المكاتب والتجزئة والفناء — ثم حمّل الكتيب.', 'brochureHeading' => 'احصل على الكتيب', 'brochureDescription' => 'تفصيلان فقط وتصبح الحزمة الكاملة بين يديك.'],
            'virtualTour' => ['heading' => 'جولة في بيزنس هب.', 'description' => 'تجوّل في الفناء واللوبي ونماذج الطوابق قبل زيارتك.', 'videoUrl' => 'https://www.youtube.com/embed/MLpWrANjFbI?si=xdUBsJQ3tkUMv1ZX'],
            'cta' => ['eyebrow' => 'لارز بيزنس هب', 'heading' => 'امنح فريقك عنوانًا أفضل.', 'whatsappNumber' => '201128775744', 'primaryCtaLabel' => 'اطلب الأسعار وخطة السداد', 'secondaryCtaLabel' => 'تواصل عبر واتساب'],
            'homes3d' => ['heading' => 'أنماط المكاتب.', 'description' => 'استكشف أحجام الطوابق والتخطيطات المتاحة في بيزنس هب.', 'note' => 'باقات تشطيب مخصصة متاحة.'],
            'homes3dItems' => [
                ['tag' => 'مكتب صغير', 'name' => 'مكتب', 'size' => '60–90', 'url' => ''],
                ['tag' => 'مكتب متوسط', 'name' => 'مكتب', 'size' => '100–180', 'url' => ''],
                ['tag' => 'مكتب كبير', 'name' => 'مكتب', 'size' => '200–400', 'url' => ''],
            ],
            'construction' => ['heading' => 'التسليم وفق الجدول.', 'description' => 'تابع مراحل الإنشاء مع اقتراب المجمع من الاكتمال.'],
            'constructionItems' => [
                ['tag' => 'آخر تحديث', 'title' => 'أعمال الواجهات واللوبي'],
                ['tag' => 'سابق', 'title' => 'الهيكل الخرساني'],
            ],
            'amenities' => ['heading' => 'مصمم ليوم العمل.', 'categories' => [
                ['title' => 'العمل', 'items' => [['title' => 'مكاتب مرنة', 'description' => 'طوابق بلا أعمدة من 60 إلى 400 م².', 'icon' => null], ['title' => 'دخول ذكي', 'description' => 'إدارة مباني ودخول آمن.', 'icon' => null]]],
                ['title' => 'الحياة اليومية', 'items' => [['title' => 'فناء مركزي', 'description' => 'ظل طوال اليوم وتهوية طبيعية.', 'icon' => null], ['title' => 'مقاهي أرضية', 'description' => 'قهوة وغداء دون مغادرة المبنى.', 'icon' => null]]],
            ]],
            'location' => ['heading' => 'متصل في القاهرة الجديدة.', 'description' => 'يقع بيزنس هب على دقائق من الطرق الرئيسية والتجزئة والمجتمعات السكنية في القاهرة الجديدة.', 'gateNote' => 'إنزال زوار وخدمة صف السيارات', 'driveNote' => 'أوقات القيادة تقديرية.', 'image' => null],
            'nearbyLocations' => [
                ['place' => 'طريق التسعين', 'time' => '4 دقائق'],
                ['place' => 'المربع الذهبي', 'time' => '10 دقائق'],
                ['place' => 'العاصمة الإدارية', 'time' => '22 دقيقة'],
            ],
        ];
    }

    private static function medicalParkEn(): array
    {
        return [
            'heroSlides' => [
                ['eyebrow' => 'LARZ Medical Park', 'titleLine1' => 'Care, planned', 'titleLine2' => 'around calm.', 'description' => 'Clinics and labs with quiet waiting areas, generous circulation and parking that stays out of the appointment.'],
                ['eyebrow' => 'LARZ Medical Park', 'titleLine1' => 'Separate paths', 'titleLine2' => 'for everyone.', 'description' => 'Dedicated patient and staff circulation keeps every visit orderly and private.'],
                ['eyebrow' => 'LARZ Medical Park', 'titleLine1' => 'Light-filled', 'titleLine2' => 'waiting.', 'description' => 'Naturally lit lounges and ground-floor pharmacy and diagnostics for everyday convenience.'],
            ],
            'overview' => ['heading' => 'Healthcare spaces should feel reassuring.', 'body' => 'LARZ Medical Park is a clinics-and-labs destination designed around calm waiting areas, clear wayfinding and parking that never becomes part of the appointment. Flexible clinic units from 45 m² support specialists, diagnostics and day-care practices.'],
            'masterplan' => ['heading' => 'See the medical campus layout.', 'description' => 'Clinics, diagnostics and support services arranged for efficient patient flow — download the brochure for full details.', 'brochureHeading' => 'Get the brochure', 'brochureDescription' => 'Leave your details and we will send the full pack.'],
            'virtualTour' => ['heading' => 'Tour the Medical Park.', 'description' => 'Walk the lobbies, waiting lounges and clinic corridors before your visit.', 'videoUrl' => 'https://www.youtube.com/embed/MLpWrANjFbI?si=xdUBsJQ3tkUMv1ZX'],
            'cta' => ['eyebrow' => 'LARZ Medical Park', 'heading' => 'A calmer setting for care.', 'whatsappNumber' => '201128775744', 'primaryCtaLabel' => 'Request pricing & payment plan', 'secondaryCtaLabel' => 'WhatsApp us'],
            'homes3d' => ['heading' => 'Clinic typologies.', 'description' => 'Explore unit sizes and layouts suited to different medical specialties.', 'note' => 'Flexible fit-out packages for clinics and labs.'],
            'construction' => ['heading' => 'Built for long-term care.', 'description' => 'Follow construction milestones as the medical park nears completion.'],
            'amenities' => ['heading' => 'Support for every visit.', 'categories' => []],
            'location' => ['heading' => 'Easy to reach in New Cairo.', 'description' => 'The Medical Park sits close to major roads and residential communities — with dedicated patient drop-off and parking.', 'gateNote' => 'Patient drop-off and staff parking separated', 'driveNote' => 'Drive times are indicative.', 'image' => null],
        ];
    }

    private static function medicalParkAr(): array
    {
        return [
            'heroSlides' => [
                ['eyebrow' => 'لارز ميديكال بارك', 'titleLine1' => 'رعاية', 'titleLine2' => 'مخططة للهدوء.', 'description' => 'عيادات ومعامل مع مناطق انتظار هادئة ومسارات حركة رحبة ومواقف لا تتداخل مع موعدك.'],
                ['eyebrow' => 'لارز ميديكال بارك', 'titleLine1' => 'مسارات', 'titleLine2' => 'منفصلة للجميع.', 'description' => 'مسارات مخصصة للمرضى والموظفين تجعل كل زيارة منظمة وخاصة.'],
                ['eyebrow' => 'لارز ميديكال بارك', 'titleLine1' => 'انتظار', 'titleLine2' => 'مملوء بالضوء.', 'description' => 'صالات انتظار مضيئة وصيدلية وتشخيص في الطابق الأرضي لراحة يومية.'],
            ],
            'stats' => [
                ['value' => '6', 'label' => 'فدانًا', 'note' => 'حرم طبي'],
                ['value' => 'طبي', 'label' => 'النمط', 'note' => 'عيادات ومعامل'],
                ['value' => '2027', 'label' => 'التسليم', 'note' => 'متاح للبيع'],
                ['value' => '90+', 'label' => 'وحدة', 'note' => 'عيادات مرنة'],
            ],
            'overview' => ['heading' => 'مساحات الرعاية يجب أن تطمئن.', 'body' => 'لارز ميديكال بارك وجهة للعيادات والمعامل صُممت حول مناطق انتظار هادئة وإرشاد واضح ومواقف لا تصبح جزءًا من الموعد. وحدات عيادات مرنة من 45 م² تدعم التخصصات والتشخيص.'],
            'masterplan' => ['heading' => 'اطلع على مخطط الحرم الطبي.', 'description' => 'عيادات وتشخيص وخدمات مساندة مرتبة لتدفق مرضى سلس — حمّل الكتيب للتفاصيل الكاملة.', 'brochureHeading' => 'احصل على الكتيب', 'brochureDescription' => 'اترك بياناتك وسنرسل الحزمة الكاملة.'],
            'virtualTour' => ['heading' => 'جولة في ميديكال بارك.', 'description' => 'تجوّل في اللوبي وصالات الانتظار وممرات العيادات قبل زيارتك.', 'videoUrl' => 'https://www.youtube.com/embed/MLpWrANjFbI?si=xdUBsJQ3tkUMv1ZX'],
            'cta' => ['eyebrow' => 'لارز ميديكال بارك', 'heading' => 'بيئة أكثر هدوءًا للرعاية.', 'whatsappNumber' => '201128775744', 'primaryCtaLabel' => 'اطلب الأسعار وخطة السداد', 'secondaryCtaLabel' => 'تواصل عبر واتساب'],
            'homes3d' => ['heading' => 'أنماط العيادات.', 'description' => 'استكشف أحجام الوحدات والتخطيطات المناسبة للتخصصات الطبية المختلفة.', 'note' => 'باقات تشطيب مرنة للعيادات والمعامل.'],
            'homes3dItems' => [
                ['tag' => 'عيادة صغيرة', 'name' => 'عيادة', 'size' => '45–65', 'url' => ''],
                ['tag' => 'عيادة متوسطة', 'name' => 'عيادة', 'size' => '70–95', 'url' => ''],
                ['tag' => 'معمل', 'name' => 'معمل', 'size' => '80–120', 'url' => ''],
            ],
            'construction' => ['heading' => 'مبني للرعاية على المدى الطويل.', 'description' => 'تابع مراحل الإنشاء مع اقتراب المجمع الطبي من الاكتمال.'],
            'constructionItems' => [
                ['tag' => 'آخر تحديث', 'title' => 'أعمال التشطيبات الداخلية'],
                ['tag' => 'سابق', 'title' => 'الهيكل والخدمات'],
            ],
            'amenities' => ['heading' => 'دعم لكل زيارة.', 'categories' => [
                ['title' => 'الرعاية', 'items' => [['title' => 'وحدات عيادات', 'description' => 'من 45 م² مع تشطيب مرن.', 'icon' => null], ['title' => 'صيدلية', 'description' => 'في الطابق الأرضي.', 'icon' => null]]],
                ['title' => 'الراحة', 'items' => [['title' => 'صالات انتظار', 'description' => 'صالات مضيئة بالضوء الطبيعي.', 'icon' => null], ['title' => 'مواقف مخصصة', 'description' => 'مواقف منفصلة للمرضى والموظفين.', 'icon' => null]]],
            ]],
            'location' => ['heading' => 'سهل الوصول في القاهرة الجديدة.', 'description' => 'يقع ميديكال بارك قريبًا من الطرق الرئيسية والمجتمعات السكنية — مع إنزال مخصص للمرضى.', 'gateNote' => 'إنزال مرضى ومواقف منفصلة للموظفين', 'driveNote' => 'أوقات القيادة تقديرية.', 'image' => null],
            'nearbyLocations' => [
                ['place' => 'طريق التسعين', 'time' => '6 دقائق'],
                ['place' => 'مستشفيات القاهرة الجديدة', 'time' => '12 دقيقة'],
                ['place' => 'العاصمة الإدارية', 'time' => '20 دقيقة'],
            ],
        ];
    }

    private static function riversideEn(): array
    {
        return [
            'heroSlides' => [
                ['eyebrow' => 'LARZ Riverside', 'titleLine1' => 'Living close', 'titleLine2' => 'to water.', 'description' => 'Low-rise residences around lakes and open green, with terraces that face the landscape instead of the street.'],
                ['eyebrow' => 'LARZ Riverside', 'titleLine1' => 'Only 22%', 'titleLine2' => 'built on.', 'description' => 'Most of the land stays open — lakes, lawns and walking loops define the community.'],
                ['eyebrow' => 'LARZ Riverside', 'titleLine1' => 'Homes for', 'titleLine2' => 'every stage.', 'description' => 'Apartments, duplexes and garden homes with clubhouse, pools and family lawns.'],
            ],
            'overview' => ['heading' => 'Water, green and room to breathe.', 'body' => 'LARZ Riverside arranges low-rise residences around lakes and open green across 18 feddans. With only 22% of the land built on, homes keep their light, privacy and connection to the landscape — plus a clubhouse, pools and a lakeside walking loop.'],
            'masterplan' => ['heading' => 'See where your home sits by the water.', 'description' => 'Explore how lakes, green spines and home clusters connect — then download the brochure.', 'brochureHeading' => 'Get the brochure', 'brochureDescription' => 'Two details and the full pack is yours.'],
            'virtualTour' => ['heading' => 'Walk Riverside tonight.', 'description' => 'Tour the lakeside paths, clubhouse and sample homes before you visit.', 'videoUrl' => 'https://www.youtube.com/embed/MLpWrANjFbI?si=xdUBsJQ3tkUMv1ZX'],
            'cta' => ['eyebrow' => 'LARZ Riverside', 'heading' => 'A better life by the water.', 'whatsappNumber' => '201128775744', 'primaryCtaLabel' => 'Request pricing & payment plan', 'secondaryCtaLabel' => 'WhatsApp us'],
            'homes3d' => ['heading' => 'Homes for every stage of life.', 'description' => 'Apartments, duplexes and garden homes — explore each typology in detail.', 'note' => 'Terraces and gardens oriented to the landscape.'],
            'construction' => ['heading' => 'Watch the community take shape.', 'description' => 'Dated updates from site as Riverside progresses.'],
            'amenities' => ['heading' => 'Life outdoors, by the water.', 'categories' => []],
            'location' => ['heading' => 'Connected, yet calm.', 'description' => 'Riverside sits in New Cairo with quick access to major roads, schools and retail — while keeping daily life centred on the water and green.', 'gateNote' => 'Two community gates for easy access', 'driveNote' => 'Drive times are indicative.', 'image' => null],
        ];
    }

    private static function riversideAr(): array
    {
        return [
            'heroSlides' => [
                ['eyebrow' => 'لارز ريفرسايد', 'titleLine1' => 'حياة قريبة', 'titleLine2' => 'من الماء.', 'description' => 'مساكن منخفضة الارتفاع حول البحيرات والمساحات الخضراء، مع شرفات تطل على الطبيعة.'],
                ['eyebrow' => 'لارز ريفرسايد', 'titleLine1' => '22% فقط', 'titleLine2' => 'مباني.', 'description' => 'معظم الأرض تبقى مفتوحة — بحيرات ومساحات خضراء ومسارات للمشي.'],
                ['eyebrow' => 'لارز ريفرسايد', 'titleLine1' => 'منازل', 'titleLine2' => 'لكل مرحلة.', 'description' => 'شقق ودوبلكس ومنازل حديقة مع نادي ومسابح ومساحات عائلية.'],
            ],
            'stats' => [
                ['value' => '18', 'label' => 'فدانًا', 'note' => 'على البحيرة'],
                ['value' => 'سكني', 'label' => 'النمط', 'note' => 'منخفض الارتفاع'],
                ['value' => '2028', 'label' => 'التسليم', 'note' => 'قريبًا'],
                ['value' => '240+', 'label' => 'منزل', 'note' => 'أنماط متعددة'],
            ],
            'overview' => ['heading' => 'ماء وخضرة ومساحة للتنفس.', 'body' => 'يرتب لارز ريفرسايد مساكن منخفضة الارتفاع حول البحيرات والمساحات الخضراء على 18 فدانًا. مع 22% فقط من الأرض مبنية، تحافظ المنازل على نورها وخصوصيتها وارتباطها بالطبيعة — مع نادي ومسابح ومسار على ضفة البحيرة.'],
            'masterplan' => ['heading' => 'اعرف موقع منزلك على الماء.', 'description' => 'اكتشف كيف تتصل البحيرات والمحاور الخضراء ومجموعات المنازل — ثم حمّل الكتيب.', 'brochureHeading' => 'احصل على الكتيب', 'brochureDescription' => 'تفصيلان فقط وتصبح الحزمة الكاملة بين يديك.'],
            'virtualTour' => ['heading' => 'تجوّل في ريفرسايد الليلة.', 'description' => 'جولة في مسارات البحيرة والنادي ونماذج المنازل قبل زيارتك.', 'videoUrl' => 'https://www.youtube.com/embed/MLpWrANjFbI?si=xdUBsJQ3tkUMv1ZX'],
            'cta' => ['eyebrow' => 'لارز ريفرسايد', 'heading' => 'حياة أفضل على الماء.', 'whatsappNumber' => '201128775744', 'primaryCtaLabel' => 'اطلب الأسعار وخطة السداد', 'secondaryCtaLabel' => 'تواصل عبر واتساب'],
            'homes3d' => ['heading' => 'منازل لكل مرحلة من الحياة.', 'description' => 'شقق ودوبلكس ومنازل حديقة — استكشف كل نمط بالتفصيل.', 'note' => 'شرفات وحدائق موجهة نحو الطبيعة.'],
            'homes3dItems' => [
                ['tag' => '2 غرف', 'name' => 'شقة', 'size' => '99–116', 'url' => ''],
                ['tag' => '3 غرف', 'name' => 'شقة', 'size' => '150–161', 'url' => ''],
                ['tag' => 'دوبلكس', 'name' => 'دوبلكس', 'size' => '190–196', 'url' => ''],
                ['tag' => 'حديقة', 'name' => 'منزل حديقة', 'size' => '220–280', 'url' => ''],
            ],
            'construction' => ['heading' => 'شاهد المجتمع وهو يتشكل.', 'description' => 'تحديثات مؤرخة من الموقع مع تقدم أعمال ريفرسايد.'],
            'constructionItems' => [
                ['tag' => 'آخر تحديث', 'title' => 'أعمال التنسيق حول البحيرة'],
                ['tag' => 'سابق', 'title' => 'الأساسات والمجموعات السكنية'],
            ],
            'amenities' => ['heading' => 'حياة في الهواء الطلق على الماء.', 'categories' => [
                ['title' => 'المياه والترفيه', 'items' => [['title' => 'مسار على البحيرة', 'description' => 'حلقة للمشي والدراجات.', 'icon' => null], ['title' => 'مسابح', 'description' => 'مسابح مجتمعية ونادي.', 'icon' => null]]],
                ['title' => 'العائلة', 'items' => [['title' => 'نادي', 'description' => 'نادي ومساحات عائلية خضراء.', 'icon' => null], ['title' => 'مساحات خضراء', 'description' => 'حدائق ومناطق لعب.', 'icon' => null]]],
            ]],
            'location' => ['heading' => 'متصل وهادئ.', 'description' => 'يقع ريفرسايد في القاهرة الجديدة مع وصول سريع للطرق والمدارس والتجزئة — بينما تدور الحياة اليومية حول الماء والخضرة.', 'gateNote' => 'بوابتان للمجتمع لتسهيل الدخول', 'driveNote' => 'أوقات القيادة تقديرية.', 'image' => null],
            'nearbyLocations' => [
                ['place' => 'طريق التسعين', 'time' => '7 دقائق'],
                ['place' => 'المربع الذهبي', 'time' => '12 دقيقة'],
                ['place' => 'العاصمة الإدارية', 'time' => '25 دقيقة'],
            ],
        ];
    }
}
