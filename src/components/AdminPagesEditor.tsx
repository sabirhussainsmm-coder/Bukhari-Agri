import React, { useState } from 'react';
import { 
  FileText, 
  Sprout, 
  Home, 
  Phone, 
  Plus, 
  Edit, 
  Trash2, 
  Check, 
  ExternalLink, 
  Users, 
  Save, 
  Globe 
} from 'lucide-react';
import { SiteSettings, CustomPage, TeamMember } from '../types';
import { saveSiteSettingsToDb, saveCustomPageToDb, deleteCustomPageFromDb } from '../services/supabaseService';

interface AdminPagesEditorProps {
  siteSettings: SiteSettings;
  onSiteSettingsUpdated: (newSettings: SiteSettings) => void;
  pages: CustomPage[];
  onPagesUpdated: (newPages: CustomPage[]) => void;
  onNavigateToTeam: () => void;
  teamMembersCount: number;
  showToast: (msg: string, isErr?: boolean) => void;
  onOpenPageModal: (page?: CustomPage) => void;
}

export const AdminPagesEditor: React.FC<AdminPagesEditorProps> = ({
  siteSettings,
  onSiteSettingsUpdated,
  pages,
  onPagesUpdated,
  onNavigateToTeam,
  teamMembersCount,
  showToast,
  onOpenPageModal
}) => {
  const [activePageTab, setActivePageTab] = useState<'about' | 'home' | 'contact' | 'custom'>('about');
  
  // Local states for page fields
  const [savingSettings, setSavingSettings] = useState(false);
  const [tempSettings, setTempSettings] = useState<SiteSettings>({ ...siteSettings });

  // About Page specific narrative state (can be saved to site_settings or custom_pages)
  const [aboutHeading, setAboutHeading] = useState('About Bukhari Agro (Pvt) Ltd');
  const [aboutTagline, setAboutTagline] = useState(
    "Empowering Pakistani growers with genuine, science-backed pesticides, fertilizers, and complete crop protection solutions from the world's most trusted agricultural manufacturers."
  );
  const [aboutMission, setAboutMission] = useState(
    "To deliver authentic agrochemical technology to every acre of Pakistani farmland, eradicating pest devastation, optimizing crop nutritional balance, and securing generational prosperity for farming families."
  );
  const [aboutStory, setAboutStory] = useState(
    "Headquartered in Mian Channu, Punjab, Bukhari Agro (Pvt) Ltd has emerged as one of the region's most reputable distributors of top-tier agrochemicals. Over decades of dedicated field advisory, we have built unshakeable trust by partnering exclusively with certified global innovators including Bayer Crop Science, Syngenta, FMC Corporation, and leading national formulators."
  );

  const handleSavePageSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);

    const res = await saveSiteSettingsToDb(tempSettings);
    setSavingSettings(false);

    if (res.success) {
      onSiteSettingsUpdated(tempSettings);
      showToast('Page content and settings saved to database!');
    } else {
      showToast(res.error || 'Failed to save settings', true);
    }
  };

  const handleDeleteCustomPage = async (page: CustomPage) => {
    if (!window.confirm(`Delete page "${page.title}"?`)) return;

    const res = await deleteCustomPageFromDb(page.id);
    if (res.success) {
      showToast(`Page "${page.title}" deleted`);
      onPagesUpdated(pages.filter(p => p.id !== page.id));
    } else {
      showToast(res.error || 'Failed to delete page', true);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      
      {/* Top Header & Page Selector */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#2271b1]" />
              <span>Page Content Editor</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Edit each page of your website individually: About Us, Home, Contact, and custom policy pages.
            </p>
          </div>

          <a
            href={activePageTab === 'home' ? '/' : `/${activePageTab}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer shrink-0"
          >
            <span>Live Preview</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Page Selector Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActivePageTab('about')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activePageTab === 'about'
                ? 'bg-[#2271b1] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
            id="page-tab-about"
          >
            <Sprout className="w-4 h-4" />
            <span>About Us Page</span>
          </button>

          <button
            type="button"
            onClick={() => setActivePageTab('home')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activePageTab === 'home'
                ? 'bg-[#2271b1] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
            id="page-tab-home"
          >
            <Home className="w-4 h-4" />
            <span>Home Page</span>
          </button>

          <button
            type="button"
            onClick={() => setActivePageTab('contact')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activePageTab === 'contact'
                ? 'bg-[#2271b1] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
            id="page-tab-contact"
          >
            <Phone className="w-4 h-4" />
            <span>Contact Page</span>
          </button>

          <button
            type="button"
            onClick={() => setActivePageTab('custom')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activePageTab === 'custom'
                ? 'bg-[#2271b1] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
            id="page-tab-custom"
          >
            <FileText className="w-4 h-4" />
            <span>Custom CMS Pages ({pages.length})</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 1. ABOUT US PAGE EDITOR */}
      {/* ========================================================= */}
      {activePageTab === 'about' && (
        <div className="space-y-6">
          
          {/* Quick Team Banner */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-emerald-950">About Us Team Members & Agronomists</h4>
                <p className="text-xs text-emerald-800">
                  {teamMembersCount} agronomists and executive leaders are currently active on the About Us page.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onNavigateToTeam}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg transition-colors shadow-xs cursor-pointer shrink-0"
              id="goto-team-manager-btn"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Manage Team & Photos</span>
            </button>
          </div>

          {/* About Narrative Form */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">About Page Content & Agronomic Story</h3>
              <p className="text-xs text-slate-500">
                Updates headline, hero tagline, mission statement, and company profile on <code>/about</code>.
              </p>
            </div>

            <form onSubmit={handleSavePageSettings} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Page Hero Headline</label>
                <input
                  type="text"
                  value={aboutHeading}
                  onChange={(e) => setAboutHeading(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Hero Subheading / Tagline</label>
                <textarea
                  rows={2}
                  value={aboutTagline}
                  onChange={(e) => setAboutTagline(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 leading-relaxed"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Corporate Mission Statement</label>
                <textarea
                  rows={3}
                  value={aboutMission}
                  onChange={(e) => setAboutMission(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 leading-relaxed"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Company History & Heritage Story</label>
                <textarea
                  rows={4}
                  value={aboutStory}
                  onChange={(e) => setAboutStory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 leading-relaxed"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
                <button
                  type="submit"
                  disabled={savingSettings}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#2271b1] hover:bg-[#135e96] text-white text-xs font-bold rounded-lg transition-colors shadow-xs cursor-pointer"
                  id="save-about-page-btn"
                >
                  <Save className="w-4 h-4" />
                  <span>{savingSettings ? 'Saving...' : 'Save About Page Content'}</span>
                </button>
              </div>
            </form>
          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* 2. HOME PAGE EDITOR */}
      {/* ========================================================= */}
      {activePageTab === 'home' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">Home Page Content & Hero Banners</h3>
            <p className="text-xs text-slate-500">
              Customize top ticker, company branding, and primary call-to-action on <code>/</code>.
            </p>
          </div>

          <form onSubmit={handleSavePageSettings} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Company Name</label>
                <input
                  type="text"
                  value={tempSettings.logo.companyName}
                  onChange={(e) => setTempSettings({
                    ...tempSettings,
                    logo: { ...tempSettings.logo, companyName: e.target.value }
                  })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tagline</label>
                <input
                  type="text"
                  value={tempSettings.logo.tagline}
                  onChange={(e) => setTempSettings({
                    ...tempSettings,
                    logo: { ...tempSettings.logo, tagline: e.target.value }
                  })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Top Bar Notice / Ticker</label>
              <input
                type="text"
                value={tempSettings.topBarText}
                onChange={(e) => setTempSettings({ ...tempSettings, topBarText: e.target.value })}
                placeholder="e.g. Healthy Crops, Brighter Future"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Primary CTA Button Text</label>
              <input
                type="text"
                value={tempSettings.ctaButtonText}
                onChange={(e) => setTempSettings({ ...tempSettings, ctaButtonText: e.target.value })}
                placeholder="e.g. bukhariagro.com"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
              <button
                type="submit"
                disabled={savingSettings}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#2271b1] hover:bg-[#135e96] text-white text-xs font-bold rounded-lg transition-colors shadow-xs cursor-pointer"
                id="save-home-page-btn"
              >
                <Save className="w-4 h-4" />
                <span>{savingSettings ? 'Saving...' : 'Save Home Page Content'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. CONTACT PAGE EDITOR */}
      {/* ========================================================= */}
      {activePageTab === 'contact' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">Contact Details & Helpline Numbers</h3>
            <p className="text-xs text-slate-500">
              Updates phone numbers, WhatsApp, email, and physical head office address on <code>/contact</code>.
            </p>
          </div>

          <form onSubmit={handleSavePageSettings} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Official Helpline Phone</label>
                <input
                  type="text"
                  value={tempSettings.helplinePhone}
                  onChange={(e) => setTempSettings({ ...tempSettings, helplinePhone: e.target.value })}
                  placeholder="+92 311 6666600"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">WhatsApp Business Number</label>
                <input
                  type="text"
                  value={tempSettings.whatsappNumber}
                  onChange={(e) => setTempSettings({ ...tempSettings, whatsappNumber: e.target.value })}
                  placeholder="+92 311 6666600"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Official Email Address</label>
                <input
                  type="email"
                  value={tempSettings.email}
                  onChange={(e) => setTempSettings({ ...tempSettings, email: e.target.value })}
                  placeholder="bukhariagropvtltd@gmail.com"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Head Office / Warehouse Address</label>
                <input
                  type="text"
                  value={tempSettings.address || ''}
                  onChange={(e) => setTempSettings({ ...tempSettings, address: e.target.value })}
                  placeholder="Mian Channu, Punjab, Pakistan"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
              <button
                type="submit"
                disabled={savingSettings}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#2271b1] hover:bg-[#135e96] text-white text-xs font-bold rounded-lg transition-colors shadow-xs cursor-pointer"
                id="save-contact-page-btn"
              >
                <Save className="w-4 h-4" />
                <span>{savingSettings ? 'Saving...' : 'Save Contact Details'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. CUSTOM CMS PAGES (Terms, Guides, Policies) */}
      {/* ========================================================= */}
      {activePageTab === 'custom' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Custom CMS Pages</h3>
              <p className="text-xs text-slate-500">Create new landing pages, agronomy guides, or legal notices.</p>
            </div>
            <button
              type="button"
              onClick={() => onOpenPageModal()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#2271b1] hover:bg-[#135e96] text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer"
              id="admin-create-custom-page-btn"
            >
              <Plus className="w-4 h-4" />
              <span>Create Page</span>
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="p-3">Page Title</th>
                  <th className="p-3">URL Slug</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Created</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pages.map(pg => (
                  <tr key={pg.id} className="hover:bg-slate-50/80">
                    <td className="p-3 font-bold text-slate-900 text-sm">{pg.title}</td>
                    <td className="p-3 font-mono text-slate-500">/{pg.slug}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        pg.is_published ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {pg.is_published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="p-3 text-slate-400">
                      {new Date(pg.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onOpenPageModal(pg)}
                          className="p-1.5 text-slate-500 hover:text-[#2271b1] hover:bg-blue-50 rounded transition-colors cursor-pointer"
                          title="Edit Page"
                          id={`edit-page-${pg.id}`}
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteCustomPage(pg)}
                          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                          title="Delete Page"
                          id={`delete-page-${pg.id}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
