import React from 'react';
import { ArrowRight, Bug, Sprout, Leaf, ShieldAlert, Zap, TreePine, Tractor, Sparkles } from 'lucide-react';
import { ProductCategory } from '../types';

interface CategoryCardsProps {
  onSelectCategory: (categoryId: ProductCategory) => void;
  onViewAllProducts: () => void;
  onNavigateToPlantation?: () => void;
  onNavigateToMachinery?: () => void;
}

export const CategoryCards: React.FC<CategoryCardsProps> = ({
  onSelectCategory,
  onViewAllProducts,
  onNavigateToPlantation,
  onNavigateToMachinery
}) => {
  const cards = [
    {
      id: 'pesticides' as ProductCategory,
      title: 'Pesticides',
      subtitle: 'Protect your crops from harmful pests',
      icon: Bug,
      badgeColor: 'bg-emerald-100 text-emerald-800',
      accentColor: 'group-hover:border-emerald-500',
    },
    {
      id: 'fertilizers' as ProductCategory,
      title: 'Fertilizers',
      subtitle: 'Nourish your soil, boost your yield',
      icon: Sprout,
      badgeColor: 'bg-lime-100 text-lime-800',
      accentColor: 'group-hover:border-lime-500',
    },
    {
      id: 'herbicides' as ProductCategory,
      title: 'Herbicides',
      subtitle: 'Keep your fields weed-free',
      icon: Leaf,
      badgeColor: 'bg-teal-100 text-teal-800',
      accentColor: 'group-hover:border-teal-500',
    },
    {
      id: 'fungicides' as ProductCategory,
      title: 'Fungicides',
      subtitle: 'Prevent diseases, ensure healthy growth',
      icon: ShieldAlert,
      badgeColor: 'bg-amber-100 text-amber-800',
      accentColor: 'group-hover:border-amber-500',
    },
    {
      id: 'growth-regulators' as ProductCategory,
      title: 'Plant Growth Regulators',
      subtitle: 'Stronger roots, better results',
      icon: Zap,
      badgeColor: 'bg-green-100 text-green-800',
      accentColor: 'group-hover:border-green-500',
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header (Matching image.png) */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="text-xs sm:text-sm font-bold tracking-wider text-emerald-800 uppercase mb-2">
              OUR PRODUCTS & DIVISIONS
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Complete <span className="text-[#16A34A]">Crop Care & Farm</span> Solutions
            </h2>
            <p className="text-slate-600 mt-2 text-base">
              From soil nutrition and pest control to certified nursery saplings and modern farm machinery.
            </p>
          </div>

          <button
            onClick={onViewAllProducts}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-800 hover:text-emerald-950 transition-colors group shrink-0 cursor-pointer"
            id="category-view-all-products-btn"
          >
            <span>View All Products</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* 5-Column Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                onClick={() => onSelectCategory(card.id)}
                className={`group relative bg-[#F8FAF6] hover:bg-emerald-50/50 rounded-2xl p-6 border border-emerald-100/80 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer flex flex-col justify-between text-center min-h-[260px] ${card.accentColor}`}
                id={`category-card-${card.id}`}
              >
                <div>
                  {/* Icon illustration container */}
                  <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-white shadow-xs border border-emerald-100 flex items-center justify-center text-emerald-700 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-8 h-8" />
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-900 transition-colors">
                    {card.title}
                  </h3>

                  {/* Subtitle */}
                  <p className="text-xs sm:text-[13px] text-slate-600 mt-2 leading-relaxed">
                    {card.subtitle}
                  </p>
                </div>

                {/* Round green arrow button at bottom */}
                <div className="mt-6 flex justify-center">
                  <div className="w-9 h-9 rounded-full bg-emerald-600 group-hover:bg-[#1B5E20] text-white flex items-center justify-center transition-colors shadow-xs">
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* New Dedicated Divisions Showcase (Plantation & Agri Machinery) */}
        {(onNavigateToPlantation || onNavigateToMachinery) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4">
            
            {/* Plantation & Nursery Card */}
            {onNavigateToPlantation && (
              <div
                onClick={onNavigateToPlantation}
                className="group bg-linear-to-br from-emerald-900 to-emerald-950 text-white rounded-2xl p-6 sm:p-7 border border-emerald-800 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5"
                id="category-banner-plantation"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-800/80 border border-emerald-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <TreePine className="w-7 h-7 text-emerald-300" />
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-300 uppercase tracking-wider mb-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Certified Nursery Division • نرسری و باغات</span>
                    </div>
                    <h3 className="text-xl font-black text-white group-hover:text-emerald-200 transition-colors">
                      Fruit Orchards & Forestry Trees
                    </h3>
                    <p className="text-xs sm:text-sm text-emerald-100/80 mt-1 max-w-md leading-relaxed">
                      Kinnow, Mango, Thai Guava, Olive, and Safeda saplings with clear prices and 98% survival guarantee.
                    </p>
                  </div>
                </div>

                <div className="w-10 h-10 rounded-full bg-white/10 group-hover:bg-emerald-500 text-white flex items-center justify-center shrink-0 transition-colors shadow-xs">
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            )}

            {/* Agri Machinery Card */}
            {onNavigateToMachinery && (
              <div
                onClick={onNavigateToMachinery}
                className="group bg-linear-to-br from-slate-900 to-slate-950 text-white rounded-2xl p-6 sm:p-7 border border-slate-800 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5"
                id="category-banner-machinery"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Tractor className="w-7 h-7 text-amber-400" />
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Farm Machinery Division • جدید زرعی مشینیں</span>
                    </div>
                    <h3 className="text-xl font-black text-white group-hover:text-amber-300 transition-colors">
                      Modern Agricultural Equipment & Implements
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-md leading-relaxed">
                      Battery knapsack sprayers, engine power sprayers, rotavators, seed drills, and agricultural spray drones.
                    </p>
                  </div>
                </div>

                <div className="w-10 h-10 rounded-full bg-white/10 group-hover:bg-amber-500 text-white group-hover:text-slate-950 flex items-center justify-center shrink-0 transition-colors shadow-xs">
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </section>
  );
};

