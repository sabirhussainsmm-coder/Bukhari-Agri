import React from 'react';
import { ArrowRight, Bug, Sprout, Leaf, ShieldAlert, Zap, ArrowUpRight } from 'lucide-react';
import { ProductCategory } from '../types';

interface CategoryCardsProps {
  onSelectCategory: (categoryId: ProductCategory) => void;
  onViewAllProducts: () => void;
}

export const CategoryCards: React.FC<CategoryCardsProps> = ({
  onSelectCategory,
  onViewAllProducts
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header (Matching image.png) */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <div className="text-xs sm:text-sm font-bold tracking-wider text-emerald-800 uppercase mb-2">
              OUR PRODUCTS
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Complete <span className="text-[#16A34A]">Crop Care</span> Solutions
            </h2>
            <p className="text-slate-600 mt-2 text-base">
              From soil to harvest, we have everything your crops need.
            </p>
          </div>

          <button
            onClick={onViewAllProducts}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-800 hover:text-emerald-950 transition-colors group shrink-0"
            id="category-view-all-products-btn"
          >
            <span>View All Products</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* 5-Column Category Cards Grid (as in image.png) */}
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

                {/* Round green arrow button at bottom (as in image.png) */}
                <div className="mt-6 flex justify-center">
                  <div className="w-9 h-9 rounded-full bg-emerald-600 group-hover:bg-[#1B5E20] text-white flex items-center justify-center transition-colors shadow-xs">
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
