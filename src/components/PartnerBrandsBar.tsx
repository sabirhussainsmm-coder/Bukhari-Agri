import React from 'react';
import { ShieldCheck, Award } from 'lucide-react';
import { partnerBrands as fallbackBrands } from '../data/agroData';
import { PartnerBrand } from '../types';

interface PartnerBrandsBarProps {
  brands?: PartnerBrand[];
  onSelectBrand?: (brandName: string) => void;
  onViewAllBrands?: () => void;
}

export const PartnerBrandsBar: React.FC<PartnerBrandsBarProps> = ({ 
  brands, 
  onSelectBrand,
  onViewAllBrands
}) => {
  const displayBrands = (brands && brands.length > 0) ? brands : fallbackBrands;

  return (
    <section className="py-12 bg-white border-b border-emerald-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider mb-2">
            <Award className="w-3.5 h-3.5 text-emerald-600" />
            <span>Multi-Brand Portfolio</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Authorized Distributor for <span className="text-[#16A34A]">Leading Global & National Agro Brands</span>
          </h3>
          <p className="text-slate-600 text-sm mt-2">
            Bukhari Agro partners directly with premier agrochemical and fertilizer manufacturers, guaranteeing 100% genuine batch certifications for every bag and bottle.
          </p>
        </div>

        {/* Partner Brands Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4">
          {displayBrands.map((brand, idx) => (
            <div
              key={brand.id || idx}
              onClick={() => onSelectBrand && onSelectBrand(brand.name)}
              className="p-4 rounded-xl bg-[#FBFDF9] hover:bg-emerald-50/70 border border-emerald-100/80 transition-all duration-200 hover:shadow-md cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-extrabold text-slate-900 group-hover:text-emerald-800 transition-colors">
                    {brand.name}
                  </span>
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                </div>
                <div className="text-[11px] font-semibold text-emerald-800 mb-1">
                  {brand.tier}
                </div>
                <p className="text-[11px] text-slate-500 leading-snug line-clamp-2">
                  {brand.badge}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-emerald-50 text-[10px] font-bold text-emerald-600 flex items-center justify-between">
                <span>{brand.country}</span>
                <span className="group-hover:translate-x-1 transition-transform">Browse Products →</span>
              </div>
            </div>
          ))}
        </div>

        {onViewAllBrands && (
          <div className="mt-8 text-center">
            <button
              onClick={onViewAllBrands}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100 px-5 py-2.5 rounded-full transition-colors border border-emerald-200"
            >
              <span>Explore All {displayBrands.length} Certified Agro Brands</span>
              <span>→</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
