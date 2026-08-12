import { Head, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import { Breadcrumbs, FormField } from '@/components/admin/AdminLayoutParts';
import { useState } from 'react';
import { useI18n } from '@/i18n';
import { translateAdmin } from '@/admin-translations';

type ContactItem = { key: string; icon: string; title: string; value: string; note: string };
type LocaleData = { eyebrow: string; heading: string; description: string; items: ContactItem[] };
type Settings = { translations: { en: LocaleData; ar: LocaleData } };

const tabs = ['English', 'العربية'] as const;
type Tab = typeof tabs[number];

const icons = ['phone', 'message-circle', 'mail', 'map-pin'] as const;

export default function ContactMethods({ settings }: { settings: Settings }) {
  const { locale: websiteLocale } = useI18n();
  const [activeTab, setActiveTab] = useState<Tab>(websiteLocale === 'ar' ? tabs[1] : 'English');
  const locale = activeTab === 'English' ? 'en' : 'ar';

  const { data, setData } = useForm<{ translations: { en: LocaleData; ar: LocaleData } }>({
    translations: settings.translations,
  });

  const current = data.translations[locale];

  const setField = (field: keyof LocaleData, value: string) => {
    setData('translations', {
      ...data.translations,
      [locale]: { ...current, [field]: value },
    });
  };

  const setItem = (index: number, field: keyof ContactItem, value: string) => {
    const items = [...current.items];
    items[index] = { ...items[index], [field]: value };
    setData('translations', {
      ...data.translations,
      [locale]: { ...current, items },
    });
  };

  const addItem = () => {
    const items = [...current.items, { key: `item_${Date.now()}`, icon: 'phone', title: '', value: '', note: '' }];
    setData('translations', {
      ...data.translations,
      [locale]: { ...current, items },
    });
  };

  const removeItem = (index: number) => {
    const items = current.items.filter((_, i) => i !== index);
    setData('translations', {
      ...data.translations,
      [locale]: { ...current, items },
    });
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    router.put('/admin/pages/contact/contact-methods', { sections: { contact_methods: data } }, { preserveScroll: true });
  };

  return (
    <AdminLayout>
      <Head title="Contact Methods" />
      <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={['Dashboard', 'Website Pages', 'Contact Page', 'Contact Methods']} />
        <h1 className="text-3xl font-semibold">Contact Methods</h1>

        <div className="flex gap-2 border-b border-slate-800 pb-3">
          {tabs.map((tab) => {
            const loc = tab === 'English' ? 'en' : 'ar';
            const filled = data.translations[loc].items.filter((item) => item.title.trim()).length;
            return (
              <button key={tab} type="button" onClick={() => setActiveTab(tab)} className={`rounded-lg px-4 py-2 text-sm font-medium transition ${activeTab === tab ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>
                {tab} {filled > 0 && <span className="ml-1 text-xs text-emerald-400">{filled}/{data.translations[loc].items.length}</span>}
              </button>
            );
          })}
        </div>

        <form onSubmit={submit} className="space-y-6">
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-6">
            <FormField label="Eyebrow">
              <input value={current.eyebrow} onChange={(e) => setField('eyebrow', e.target.value)} dir={locale === 'ar' ? 'rtl' : 'ltr'} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2" />
            </FormField>
            <FormField label="Heading">
              <input value={current.heading} onChange={(e) => setField('heading', e.target.value)} dir={locale === 'ar' ? 'rtl' : 'ltr'} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2" />
            </FormField>
            <FormField label="Description">
              <textarea value={current.description} onChange={(e) => setField('description', e.target.value)} rows={2} dir={locale === 'ar' ? 'rtl' : 'ltr'} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2" />
            </FormField>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Contact Cards</h2>
              <button type="button" onClick={addItem} className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium">+ Add card</button>
            </div>
            <div className="space-y-4">
              {current.items.map((item, index) => (
                <div key={item.key} className="rounded-lg border border-slate-800 bg-slate-900 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500">Card {index + 1}</span>
                    {current.items.length > 1 && (
                      <button type="button" onClick={() => removeItem(index)} className="text-xs text-red-400 hover:text-red-300">Remove</button>
                    )}
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <FormField label="Icon">
                      <select value={item.icon} onChange={(e) => setItem(index, 'icon', e.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2">
                        {icons.map((ic) => <option key={ic} value={ic}>{ic}</option>)}
                      </select>
                    </FormField>
                    <FormField label="Title">
                      <input value={item.title} onChange={(e) => setItem(index, 'title', e.target.value)} dir={locale === 'ar' ? 'rtl' : 'ltr'} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2" />
                    </FormField>
                    <FormField label="Value">
                      <input value={item.value} onChange={(e) => setItem(index, 'value', e.target.value)} dir={locale === 'ar' ? 'rtl' : 'ltr'} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2" />
                    </FormField>
                  </div>
                  <div className="mt-3">
                    <FormField label="Note">
                      <input value={item.note} onChange={(e) => setItem(index, 'note', e.target.value)} dir={locale === 'ar' ? 'rtl' : 'ltr'} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2" />
                    </FormField>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className="rounded-lg bg-emerald-600 px-6 py-2 text-sm font-medium hover:bg-emerald-500">
            {translateAdmin(activeTab === 'English' ? 'Save English contact methods' : 'Save Arabic contact methods', websiteLocale)}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}
