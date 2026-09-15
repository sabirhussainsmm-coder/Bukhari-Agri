import React, { useState } from 'react';
import { 
  Bug, 
  Sprout, 
  Leaf, 
  ShieldAlert, 
  Zap, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Calendar, 
  AlertTriangle,
  Layers,
  Droplets
} from 'lucide-react';
import { categoriesData } from '../data/agroData';
import { ProductCategory } from '../types';

interface CategoriesPageProps {
  onSelectCategoryFilter: (category: ProductCategory) => void;
}

export const CategoriesPage: React.FC<CategoriesPageProps> = ({ onSelectCategoryFilter }) => {
  const [activeCategoryTab, setActiveCategoryTab] = useState<ProductCategory>('pesticides');

  const iconMap: Record<string, React.ElementType> = {
    Bug,
    Sprout,
    Leaf,
    ShieldAlert,
    Zap,
    Sparkles,
  };

  const currentCategory = categoriesData.find(c => c.id === activeCategoryTab) || categoriesData[0];
  const CurrentIcon = iconMap[currentCategory.icon] || Sprout;

  return (
    <div className="bg-[#F8FAF6] min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="mb-10 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider mb-3">
            <Layers className="w-3.5 h-3.5 text-emerald-600" />
            <span>Dedicated Category Directory</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Browse Crop Care <span className="text-[#16A34A]">Categories</span>
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            In-depth agronomic taxonomy covering insect control, balanced plant nutrition, selective weed termination, fungal defense, and physiological stimulants.
          </p>
        </div>

        {/* Category Navigation Strip / Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
          {categoriesData.map((cat) => {
            const Icon = iconMap[cat.icon] || Sprout;
            const isSelected = activeCategoryTab === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategoryTab(cat.id)}
                className={`p-4 rounded-2xl border text-center transition-all duration-200 flex flex-col items-center justify-center gap-2 group cursor-pointer ${
                  isSelected
                    ? 'bg-[#1B5E20] text-white border-[#1B5E20] shadow-md scale-102'
                    : 'bg-white hover:bg-emerald-50 text-slate-700 border-emerald-100/90 shadow-xs'
                }`}
                id={`category-tab-btn-${cat.id}`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-emerald-50 text-emerald-700'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold leading-tight">
                  {cat.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* Deep Dive Category Spotlight Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-emerald-100 shadow-sm mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Category Info (Cols 1-7) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <CurrentIcon className="w-8 h-8" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#16A34A] uppercase tracking-wider">
                    {currentCategory.subtitle}
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {currentCategory.title} Solutions
                  </h2>
                </div>
              </div>

              <p className="text-slate-600 text-base leading-relaxed">
                {currentCategory.description}
              </p>

              {/* Target Focus */}
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100">
                <div className="text-xs font-extrabold text-emerald-900 uppercase tracking-wider mb-1">
                  Primary Agronomic Focus:
                </div>
                <div className="text-sm font-semibold text-emerald-950">
                  {currentCategory.targetFocus}
                </div>
              </div>

              {/* Key Benefits Checklist */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Key Efficacy Benefits:</span>
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {currentCategory.keyBenefits.map((b, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Browse Catalog CTA */}
              <div className="pt-2">
                <button
                  onClick={() => onSelectCategoryFilter(currentCategory.id)}
                  className="inline-flex items-center gap-2 bg-[#1B5E20] hover:bg-[#154b1a] text-white font-bold px-7 py-3 rounded-full text-sm shadow-md transition-all duration-200"
                  id={`browse-category-products-${currentCategory.id}`}
                >
                  <span>Browse All {currentCategory.title} Products</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Technical Specs & Field Application (Cols 8-12) */}
            <div className="lg:col-span-5 bg-[#FAFDF8] rounded-2xl p-6 border border-emerald-100/90 space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-emerald-600" />
                  <span>Field Application Protocol</span>
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed bg-white p-3.5 rounded-xl border border-emerald-50">
                  {currentCategory.applicationGuide}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Common Threats & Crop Stages Managed:
                </h4>
                <div className="space-y-1.5">
                  {currentCategory.commonTargetPestsOrNeeds.map((need, idx) => (
                    <div key={idx} className="text-xs text-emerald-900 bg-emerald-100/50 px-3 py-1.5 rounded-lg font-medium">
                      • {need}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Standard Formulations in Stock:
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {currentCategory.popularFormulations.map((form, idx) => (
                    <span key={idx} className="text-[11px] font-semibold px-2.5 py-1 rounded-md bg-white border border-emerald-200 text-slate-700">
                      {form}
                    </span>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Agronomic Seasons Calendar (Kharif vs Rabi Guidance) */}
        <div className="bg-gradient-to-r from-emerald-950 to-[#0A4D2E] rounded-3xl p-6 sm:p-10 text-white shadow-xl">
          <div className="flex items-center gap-2.5 mb-4">
            <Calendar className="w-5 h-5 text-emerald-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
              Crop Calendar & Regional Agronomy
            </span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            Seasonal Planning for Maximum Harvest
          </h3>
          <p className="text-sm text-emerald-100/80 max-w-2xl mb-8">
            Bukhari Agro synchronizes inventory with Punjab and Sindh agricultural sowing schedules to prevent stock shortages during critical pesticide and fertilizer application windows.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-base font-bold text-emerald-300">Kharif Season Crops</span>
                <span className="text-xs bg-emerald-500/20 text-emerald-200 px-2.5 py-0.5 rounded-full">
                  April - October
                </span>
              </div>
              <p className="text-xs text-slate-300 mb-3">
                <strong>Cotton, Paddy Rice, Sugarcane, Maize, Chilies</strong>
              </p>
              <ul className="text-xs text-emerald-100/90 space-y-1">
                <li>• Pre-emergence weed control within 24 hours of sowing</li>
                <li>• Sucking pest management during high summer humidity</li>
                <li>• Bollworm interception and blast prevention in rice</li>
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-base font-bold text-emerald-300">Rabi Season Crops</span>
                <span className="text-xs bg-emerald-500/20 text-emerald-200 px-2.5 py-0.5 rounded-full">
                  October - April
                </span>
              </div>
              <p className="text-xs text-slate-300 mb-3">
                <strong>Wheat, Mustard / Canola, Potato, Chickpea, Sunflower</strong>
              </p>
              <ul className="text-xs text-emerald-100/90 space-y-1">
                <li>• Basal DAP and Zorawar Zinc application at drilling</li>
                <li>• Broad & narrow leaf weedicide application at 30-35 days</li>
                <li>• Rust prevention and flag leaf foliar nutrition at heading</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
