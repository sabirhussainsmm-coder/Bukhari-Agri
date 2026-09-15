import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  Search, 
  ShoppingBag, 
  Menu, 
  X, 
  ChevronDown, 
  MessageCircle,
  ShieldCheck
} from 'lucide-react';
import { BukhariAgroLogo } from './BukhariAgroLogo';
import { SiteSettings } from '../types';

interface HeaderProps {
  currentTab?: 'home' | 'about' | 'products' | 'categories' | 'brands' | 'plantation' | 'machinery' | 'contact';
  activeTab?: 'home' | 'about' | 'products' | 'categories' | 'brands' | 'plantation' | 'machinery' | 'contact';
  onNavigate: (tab: 'home' | 'about' | 'products' | 'categories' | 'brands' | 'plantation' | 'machinery' | 'contact', categoryFilter?: string) => void;
  inquiryCount: number;
  onOpenInquiryTray: () => void;
  onOpenSearch: () => void;
  siteSettings?: SiteSettings;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  activeTab,
  onNavigate,
  inquiryCount,
  onOpenInquiryTray,
  onOpenSearch,
  siteSettings
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);

  const active = currentTab || activeTab || 'home';

  // Fallback buttons if siteSettings not loaded yet
  const defaultButtons = [
    { id: 'btn-home', label: 'Home', targetTab: 'home' as const, visible: true, hasDropdown: false },
    { id: 'btn-products', label: 'Products', targetTab: 'products' as const, visible: true, hasDropdown: false },
    { id: 'btn-categories', label: 'Categories', targetTab: 'categories' as const, visible: true, hasDropdown: true },
    { id: 'btn-plantation', label: 'Plantation & Nursery', targetTab: 'plantation' as const, visible: true, hasDropdown: false, badgeText: 'New' },
    { id: 'btn-machinery', label: 'Agri Machines', targetTab: 'machinery' as const, visible: true, hasDropdown: false, badgeText: 'New' },
    { id: 'btn-brands', label: 'Agro Brands', targetTab: 'brands' as const, visible: true, hasDropdown: false },
    { id: 'btn-about', label: 'About Us', targetTab: 'about' as const, visible: true, hasDropdown: false },
    { id: 'btn-contact', label: 'Contact', targetTab: 'contact' as const, visible: true, hasDropdown: false }
  ];

  const navButtons = (siteSettings?.headerButtons || defaultButtons).filter(b => b.visible !== false);

  const quickCategories = [
    { id: 'pesticides', label: 'Pesticides', tab: 'categories' as const },
    { id: 'fertilizers', label: 'Fertilizers', tab: 'categories' as const },
    { id: 'herbicides', label: 'Herbicides', tab: 'categories' as const },
    { id: 'fungicides', label: 'Fungicides', tab: 'categories' as const },
    { id: 'growth-regulators', label: 'Plant Growth Regulators', tab: 'categories' as const },
    { id: 'micronutrients', label: 'Micronutrients', tab: 'categories' as const },
    { id: 'plantation-quick', label: 'Plantation & Nursery (پودے و باغات)', tab: 'plantation' as const },
    { id: 'machinery-quick', label: 'Agri Machinery & Sprayers (زرعی مشینیں)', tab: 'machinery' as const },
  ];

  const helpline = siteSettings?.helplinePhone || '+92 311 6666600';
  const email = siteSettings?.email || 'bukhariagropvtltd@gmail.com';
  const topBarText = siteSettings?.topBarText || 'Healthy Crops, Brighter Future';
  const ctaText = siteSettings?.ctaButtonText || 'bukhariagro.com';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-xs">
      
      {/* Top Utility Bar */}
      <div className="bg-emerald-950 text-emerald-100 text-xs py-1.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          
          <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
            <span className="flex items-center gap-1.5 font-medium text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              {topBarText}
            </span>
            <a 
              href={`tel:${helpline.replace(/\s+/g, '')}`}
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>{helpline}</span>
            </a>
            <a 
              href={`mailto:${email}`}
              className="hidden md:flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-emerald-400" />
              <span>{email}</span>
            </a>
          </div>

          <div className="flex items-center gap-3 ml-auto text-[11px]">
            <a
              href={`https://wa.me/${(siteSettings?.whatsappNumber || helpline).replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Assalam-o-Alaikum Bukhari Agro, I would like to inquire about agricultural products.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 bg-emerald-700/60 hover:bg-emerald-600 text-white px-2.5 py-0.5 rounded-full transition-colors font-medium"
            >
              <MessageCircle className="w-3 h-3 text-emerald-300" />
              <span>WhatsApp Direct</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo (Configurable via Backend: SVG or Custom Image) */}
          <div className="relative group/logo flex items-center">
            <button 
              onClick={() => onNavigate('home')}
              className="flex items-center text-left focus:outline-hidden"
              id="nav-brand-logo"
            >
              {siteSettings?.logo?.type === 'image' && siteSettings?.logo?.imageUrl ? (
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <img
                    src={siteSettings.logo.imageUrl}
                    alt={siteSettings.logo.companyName || "Bukhari Agro"}
                    referrerPolicy="no-referrer"
                    className="h-9 sm:h-12 w-auto object-contain rounded-lg shadow-xs"
                  />
                  <div>
                    <div className="text-sm sm:text-lg font-black text-slate-900 leading-tight">
                      {siteSettings.logo.companyName || "Bukhari Agro"}
                    </div>
                    <div className="text-[10px] sm:text-[11px] font-semibold text-emerald-600 uppercase tracking-wider">
                      {siteSettings.logo.tagline || "Healthy Crops, Brighter Future"}
                    </div>
                  </div>
                </div>
              ) : (
                <BukhariAgroLogo variant="horizontal" size="md" />
              )}
            </button>
          </div>

          {/* Desktop Navigation Links (Configured via Backend - Visible from md: 768px+) */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 xl:space-x-3">
            {navButtons.map((link) => {
              const isLinkActive = active === link.targetTab;

              if (link.hasDropdown || link.targetTab === 'categories') {
                return (
                  <div 
                    key={link.id}
                    className="relative"
                    onMouseEnter={() => setCategoriesDropdownOpen(true)}
                    onMouseLeave={() => setCategoriesDropdownOpen(false)}
                  >
                    <button
                      onClick={() => onNavigate('categories')}
                      className={`inline-flex items-center gap-1 px-2.5 lg:px-3.5 py-1.5 lg:py-2 rounded-lg text-xs lg:text-[15px] font-medium transition-all ${
                        isLinkActive
                          ? 'text-emerald-800 font-semibold bg-emerald-50'
                          : 'text-gray-700 hover:text-emerald-700 hover:bg-gray-50'
                      }`}
                      id="nav-dropdown-categories"
                    >
                      <span>{link.label}</span>
                      <ChevronDown className="w-3.5 h-3.5 text-gray-500 transition-transform duration-200" />
                    </button>

                    {/* Dropdown Menu */}
                    {categoriesDropdownOpen && (
                      <div className="absolute left-0 mt-0 w-64 rounded-xl bg-white shadow-xl border border-emerald-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                        <div className="px-3 py-1.5 text-xs font-bold text-emerald-900 uppercase tracking-wider border-b border-emerald-50">
                          Browse Solutions
                        </div>
                        {quickCategories.map((cat) => (
                          <button
                            key={cat.id}
                            onClick={() => {
                              setCategoriesDropdownOpen(false);
                              if (cat.tab === 'plantation' || cat.tab === 'machinery') {
                                onNavigate(cat.tab);
                              } else {
                                onNavigate('categories', cat.id);
                              }
                            }}
                            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-800 flex items-center justify-between transition-colors"
                          >
                            <span>{cat.label}</span>
                            <span className="text-xs text-emerald-600 font-medium">Explore →</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <button
                  key={link.id}
                  onClick={() => onNavigate(link.targetTab)}
                  className={`relative px-2.5 lg:px-3.5 py-1.5 lg:py-2 rounded-lg text-xs lg:text-[15px] font-medium transition-all flex items-center gap-1.5 ${
                    isLinkActive
                      ? 'text-emerald-800 font-semibold bg-emerald-50'
                      : 'text-gray-700 hover:text-emerald-700 hover:bg-gray-50'
                  }`}
                  id={`nav-link-${link.targetTab}`}
                >
                  <span>{link.label}</span>
                  {link.badgeText && (
                    <span className="text-[9px] uppercase font-bold bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded-full leading-none">
                      {link.badgeText}
                    </span>
                  )}
                  {isLinkActive && (
                    <span className="absolute bottom-1 left-2.5 right-2.5 h-0.5 bg-emerald-600 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Utilities (Visible on md+) */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-3">
            {/* Search Trigger */}
            <button
              onClick={onOpenSearch}
              className="p-2 lg:p-2.5 text-gray-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-full transition-colors"
              title="Search products, crops, pests"
              id="header-search-btn"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Inquiry Bag Trigger */}
            <button
              onClick={onOpenInquiryTray}
              className="relative p-2 lg:p-2.5 text-gray-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-full transition-colors"
              title="View Product Inquiry List"
              id="header-inquiry-tray-btn"
            >
              <ShoppingBag className="w-5 h-5" />
              {inquiryCount > 0 && (
                <span className="absolute top-1 right-1 bg-emerald-600 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                  {inquiryCount}
                </span>
              )}
            </button>

            {/* CTA Button */}
            <button
              onClick={() => onNavigate('contact')}
              className="inline-flex items-center gap-1.5 bg-[#1B5E20] hover:bg-[#154a1a] text-white text-xs lg:text-sm font-semibold px-3.5 lg:px-5 py-2 lg:py-2.5 rounded-full shadow-xs hover:shadow-md transition-all duration-200"
              id="header-cta-bukhariagro"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-300 shrink-0" />
              <span className="truncate max-w-[140px]">{ctaText}</span>
            </button>
          </div>

          {/* Mobile Menu & Inquiry Buttons (Visible below md) */}
          <div className="flex md:hidden items-center space-x-1">
            <button
              onClick={onOpenSearch}
              className="p-2 text-gray-700 hover:text-emerald-700"
              id="mobile-search-btn"
            >
              <Search className="w-5 h-5" />
            </button>

            <button
              onClick={onOpenInquiryTray}
              className="relative p-2 text-gray-700 hover:text-emerald-700"
              id="mobile-inquiry-btn"
            >
              <ShoppingBag className="w-5 h-5" />
              {inquiryCount > 0 && (
                <span className="absolute top-0 right-0 bg-emerald-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {inquiryCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-700 hover:text-emerald-700 focus:outline-hidden"
              id="mobile-menu-toggle-btn"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation (Visible below md) */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-emerald-100 bg-white px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-2">
          {navButtons.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                onNavigate(link.targetTab);
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                active === link.targetTab
                  ? 'bg-emerald-50 text-emerald-800 font-semibold'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {link.label}
            </button>
          ))}

          <div className="pt-4 border-t border-emerald-100 flex flex-col gap-2">
            <a
              href={`tel:${helpline.replace(/\s+/g, '')}`}
              className="flex items-center justify-center gap-2 bg-emerald-50 text-emerald-800 py-2.5 rounded-lg font-medium text-sm"
            >
              <Phone className="w-4 h-4 text-emerald-600" />
              <span>Call {helpline}</span>
            </a>
            <a
              href={`https://wa.me/${(siteSettings?.whatsappNumber || helpline).replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-[#1B5E20] text-white py-2.5 rounded-lg font-semibold text-sm"
            >
              <MessageCircle className="w-4 h-4 text-emerald-300" />
              <span>WhatsApp Us</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
