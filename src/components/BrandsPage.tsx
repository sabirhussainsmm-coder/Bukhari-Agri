import React from 'react';
import { 
  Building2, 
  ExternalLink, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  Package, 
  ArrowRight,
  Globe,
  MapPin
} from 'lucide-react';
import { PartnerBrand, Product } from '../types';

interface BrandsPageProps {
  brands: PartnerBrand[];
  products: Product[];
  onSelectBrandFilter: (brandName: string) => void;
  onSelectProduct: (product: Product) => void;
  onNavigateToContact: () => void;
}

export const BrandsPage: React.FC<BrandsPageProps> = ({
  brands,
  products,
  onSelectBrandFilter,
  onSelectProduct,
  onNavigateToContact,
}) => {
  return (
    <div className="bg-[#FBFDFB] min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-4 border border-emerald-200">
            <Building2 className="w-3.5 h-3.5" />
            <span>Authorized Multi-Brand Distribution</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Our Certified <span className="text-[#16A34A]">Agro Brands</span>
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
            Bukhari Agro partners with world-class agrochemical multinationals and Pakistan’s premier fertilizer manufacturers to ensure 100% genuine formulation purity and verified field efficacy.
          </p>
        </div>

        {/* Brands Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {brands.map((brand, idx) => {
            // Find products belonging to this brand or company
            const brandProducts = products.filter(
              p => p.company?.toLowerCase().includes(brand.name.toLowerCase()) ||
                   p.brandName?.toLowerCase().includes(brand.name.toLowerCase())
            );

            return (
              <div 
                key={brand.id || `brand-${brand.name || idx}`}
                className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
                id={`brand-card-${brand.id || idx}`}
              >
                <div>
                  {/* Brand Card Top */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 font-extrabold text-lg shrink-0">
                      {brand.logoUrl ? (
                        <img 
                          src={brand.logoUrl} 
                          alt={brand.name} 
                          className="w-full h-full object-contain p-2 rounded-2xl" 
                        />
                      ) : (
                        brand.name.charAt(0)
                      )}
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-100">
                      {brand.tier}
                    </span>
                  </div>

                  <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    {brand.name}
                  </h3>

                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-1 mb-3">
                    <MapPin className="w-3 h-3 text-emerald-600" />
                    <span>{brand.country}</span>
                    <span>•</span>
                    <span className="text-emerald-700 font-medium">{brand.badge}</span>
                  </div>

                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-5">
                    {brand.description}
                  </p>

                  {/* Sample Products from this Brand */}
                  {brandProducts.length > 0 && (
                    <div className="mb-4 pt-3 border-t border-slate-100">
                      <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Package className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Available Formulations ({brandProducts.length})</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {brandProducts.slice(0, 3).map((prod) => (
                          <button
                            key={prod.id}
                            onClick={() => onSelectProduct(prod)}
                            className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-[#F3F7F2] text-slate-800 hover:bg-emerald-100 hover:text-emerald-900 transition-colors border border-emerald-100 text-left truncate max-w-full"
                          >
                            {prod.name}
                          </button>
                        ))}
                        {brandProducts.length > 3 && (
                          <span className="text-[11px] font-semibold text-emerald-700 self-center px-1">
                            +{brandProducts.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Action Footer */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <button
                    onClick={() => onSelectBrandFilter(brand.name)}
                    className="text-xs font-bold text-emerald-800 hover:text-emerald-950 inline-flex items-center gap-1 group/btn"
                  >
                    <span>View All {brand.name} Products</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
                  </button>

                  {brand.website && (
                    <a
                      href={brand.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-emerald-700 p-1.5 rounded-lg hover:bg-emerald-50 transition-colors"
                      title={`Visit ${brand.name} official site`}
                    >
                      <Globe className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Assurance Banner */}
        <div className="bg-gradient-to-r from-emerald-900 to-emerald-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-emerald-800 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Anti-Counterfeit Guarantee</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Direct Supply Chain, 100% Genuine Seals
            </h3>
            <p className="text-emerald-100/80 text-sm mt-2 leading-relaxed">
              Every bottle, bag, and pack distributed through Bukhari Agro features verifiable batch codes and genuine manufacturer seals. No adulteration, no sub-standard active ingredients.
            </p>
          </div>

          <button
            onClick={onNavigateToContact}
            className="shrink-0 bg-white text-emerald-900 hover:bg-emerald-50 font-bold px-6 py-3.5 rounded-full shadow-lg transition-all duration-200 text-sm inline-flex items-center gap-2"
          >
            <span>Inquire for Wholesale Distributorship</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
