import React from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageCircle, 
  ArrowRight, 
  Globe, 
  ShieldCheck,
  Sliders
} from 'lucide-react';
import { BukhariAgroLogo } from './BukhariAgroLogo';
import { contactInfo, partnerBrands as defaultBrands } from '../data/agroData';
import { PartnerBrand, SiteSettings } from '../types';

interface FooterProps {
  onNavigate: (tab: 'home' | 'about' | 'products' | 'categories' | 'brands' | 'contact') => void;
  brands?: PartnerBrand[];
  siteSettings?: SiteSettings;
  onOpenBackendStudio?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ 
  onNavigate, 
  brands, 
  siteSettings, 
  onOpenBackendStudio 
}) => {
  const displayBrands = (brands && brands.length > 0) ? brands : defaultBrands;
  const helpline = siteSettings?.helplinePhone || contactInfo.phone;
  const email = siteSettings?.email || contactInfo.email;
  const address = siteSettings?.address || contactInfo.address;

  return (
    <footer className="bg-slate-950 text-slate-300">
      
      {/* 1. Bottom Landscape CTA Banner (Recreation from design) */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/farm-landscape.jpg"
            alt="Lush green agricultural fields"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B381A]/95 via-[#0D4B22]/90 to-[#0B381A]/95 backdrop-blur-[1px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2 border border-emerald-500/30">
                Healthy Crops, Brighter Future
              </div>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
                Let's Grow Together
              </h3>
              <p className="text-emerald-100/90 text-sm sm:text-base mt-1.5 max-w-xl">
                For a healthier crop, a stronger tomorrow. Partner with Bukhari Agro for certified pest protection and balanced plant nutrition.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
              <button
                onClick={() => onNavigate('contact')}
                className="inline-flex items-center gap-2 bg-[#65A30D] hover:bg-[#54870a] text-white font-bold px-6 py-3 rounded-full shadow-lg transition-all duration-200 text-sm"
                id="footer-visit-website-btn"
              >
                <span>Contact Our Specialists</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('products')}
                className="inline-flex items-center gap-2 bg-[#1B5E20] hover:bg-[#154c1a] text-white font-bold px-6 py-3 rounded-full border border-emerald-600/40 shadow-lg transition-all duration-200 text-sm"
                id="footer-bukhariagro-domain-btn"
              >
                <Globe className="w-4 h-4 text-emerald-300" />
                <span>Explore Products</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Multi-Column Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Brand Profile (Cols 1-4) */}
          <div className="lg:col-span-4 space-y-4">
            <BukhariAgroLogo variant="horizontal" inverted={true} size="md" />
            
            <p className="text-sm text-slate-400 leading-relaxed pt-2">
              <strong className="text-white">Bukhari Agro (Pvt) Ltd</strong> is an authorized multi-brand distributor of certified crop protection chemicals, water-soluble fertilizers, herbicides, and biological stimulants.
            </p>

            <div className="flex items-center gap-2 text-xs text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Genuine Seals & Formulation Purity</span>
            </div>

            {onOpenBackendStudio && (
              <div className="pt-2">
                <button
                  onClick={onOpenBackendStudio}
                  className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-emerald-300 border border-slate-800 transition-colors"
                  id="footer-studio-hub-btn"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Open Studio Backend Hub</span>
                </button>
              </div>
            )}
          </div>

          {/* Quick Navigation (Cols 5-6) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-emerald-400 transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-emerald-400 transition-colors">
                  About Us & Team
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('products')} className="hover:text-emerald-400 transition-colors">
                  Products Catalog
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('categories')} className="hover:text-emerald-400 transition-colors">
                  Crop Categories
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('brands')} className="hover:text-emerald-400 transition-colors">
                  Agro Brands
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-emerald-400 transition-colors">
                  Contact & Inquiries
                </button>
              </li>
            </ul>
          </div>

          {/* Partner Brands (Cols 7-9) */}
          <div className="lg:col-span-3 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-white font-bold text-sm uppercase tracking-wider">
                Partner Brands
              </h4>
              <button
                onClick={() => onNavigate('brands')}
                className="text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold"
              >
                View All →
              </button>
            </div>
            <p className="text-xs text-slate-400">
              Supplying certified formulations from:
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {displayBrands.map((b, idx) => (
                <button
                  key={b.id || `footer-brand-${b.name || idx}`}
                  onClick={() => onNavigate('brands')}
                  className="text-xs px-2.5 py-1 rounded-md bg-slate-900 hover:bg-emerald-950 border border-slate-800 text-slate-300 hover:text-emerald-200 transition-colors"
                >
                  {b.name}
                </button>
              ))}
            </div>
          </div>

          {/* Contact Details (Cols 10-12) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Contact Details</span>
            </h4>
            
            <ul className="space-y-3 text-sm text-slate-300">
              <li>
                <a 
                  href={`tel:${helpline.replace(/\s+/g, '')}`}
                  className="flex items-start gap-2.5 hover:text-emerald-400 transition-colors"
                >
                  <Phone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="font-semibold text-white">{helpline}</span>
                </a>
              </li>

              <li>
                <a 
                  href={`mailto:${email}`}
                  className="flex items-start gap-2.5 hover:text-emerald-400 transition-colors"
                >
                  <Mail className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="break-all">{email}</span>
                </a>
              </li>

              <li className="flex items-start gap-2.5 text-xs text-slate-400">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{address}</span>
              </li>

              <li className="flex items-start gap-2.5 text-xs text-slate-400">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{contactInfo.businessHours}</span>
              </li>
            </ul>

            <div className="pt-2">
              <a
                href={`https://wa.me/${helpline.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hello Bukhari Agro, I would like to consult with an agronomist.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors w-full justify-center"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Quick WhatsApp Consultation</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Sub-footer */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} Bukhari Agro (Pvt) Ltd. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-4 text-emerald-400 font-medium">
            <span>Healthy Crops</span>
            <span>•</span>
            <span>Brighter Future</span>
            <span>•</span>
            <span className="italic font-serif text-white">Growing Together</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
