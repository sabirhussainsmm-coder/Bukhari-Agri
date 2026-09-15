import React from 'react';
import { 
  TreePine, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Droplets, 
  Sun, 
  Clock, 
  ShoppingBag, 
  Check 
} from 'lucide-react';
import { PlantItem } from '../types';

interface PlantationSectionProps {
  plants: PlantItem[];
  onSelectPlant: (plant: PlantItem) => void;
  onViewAllPlants: () => void;
  onQuickAddPlant?: (plant: PlantItem) => void;
}

export const PlantationSection: React.FC<PlantationSectionProps> = ({
  plants,
  onSelectPlant,
  onViewAllPlants,
  onQuickAddPlant
}) => {
  // Pick featured plants (max 4 or 6)
  const displayPlants = plants.slice(0, 4);

  return (
    <section className="py-16 sm:py-20 bg-linear-to-b from-white to-[#F6FBF7] border-t border-emerald-100/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 mb-3">
              <TreePine className="w-3.5 h-3.5 text-emerald-700" />
              <span>Plantation & Certified Nursery • پودے و نرسری</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
              Certified Fruit Plants & Commercial Timber Trees
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
              Genuine certified rootstocks with intact earthen rootballs (گچی), high survival rate, and agronomist planting guidance.
            </p>
          </div>

          <button
            onClick={onViewAllPlants}
            className="inline-flex items-center gap-2 text-sm font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100/80 px-4 py-2.5 rounded-xl transition-colors shrink-0 cursor-pointer self-start md:self-auto border border-emerald-200/60"
            id="home-view-all-plants-btn"
          >
            <span>View All Nursery Plants & Rates</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Highlight Guarantee Banner */}
        <div className="mb-10 bg-emerald-950 text-white rounded-2xl p-5 sm:p-6 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 border border-emerald-900">
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <div className="w-12 h-12 rounded-xl bg-emerald-800/80 flex items-center justify-center shrink-0 border border-emerald-700">
              <ShieldCheck className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <h4 className="font-extrabold text-base sm:text-lg text-emerald-100">
                100% Certified Nursery Guarantee & Safe Farm Delivery
              </h4>
              <p className="text-xs sm:text-sm text-emerald-300/90 mt-0.5">
                Bulk discounts available on commercial orchard projects (Kinnow, Mango, Guava, Olive & Safeda).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs bg-emerald-900/90 text-emerald-200 px-3 py-1.5 rounded-lg border border-emerald-700 font-semibold">
              98% Survival Rate
            </span>
            <span className="text-xs bg-emerald-900/90 text-emerald-200 px-3 py-1.5 rounded-lg border border-emerald-700 font-semibold">
              Earthen Gachi Packed
            </span>
          </div>
        </div>

        {/* Plants Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayPlants.map((plant) => (
            <div
              key={plant.id}
              className="bg-white rounded-2xl border border-emerald-100 hover:border-emerald-300 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group"
            >
              {/* Image & Badges */}
              <div 
                className="relative aspect-4/3 overflow-hidden bg-slate-100 cursor-pointer"
                onClick={() => onSelectPlant(plant)}
              >
                <img
                  src={plant.imageUrl}
                  alt={plant.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-xs text-emerald-800 text-[11px] font-bold px-2.5 py-1 rounded-md shadow-xs border border-emerald-100">
                  {plant.categoryLabel.split('(')[0]}
                </div>
                <div className="absolute bottom-2.5 right-2.5 bg-emerald-950/90 text-white text-[11px] font-semibold px-2 py-0.5 rounded-md backdrop-blur-xs" dir="rtl">
                  {plant.urduName}
                </div>
              </div>

              {/* Plant Info */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 
                    onClick={() => onSelectPlant(plant)}
                    className="font-extrabold text-base text-slate-900 group-hover:text-emerald-700 transition-colors cursor-pointer line-clamp-1"
                  >
                    {plant.name}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                    {plant.shortDescription}
                  </p>
                </div>

                {/* Attributes Pills */}
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 py-1 border-t border-slate-100">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span className="truncate">{plant.fruitingTime}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Sun className="w-3 h-3 text-amber-500 shrink-0" />
                    <span className="truncate">{plant.heightOrAge}</span>
                  </div>
                </div>

                {/* Price & Action */}
                <div className="pt-2 border-t border-emerald-50 flex items-center justify-between gap-2">
                  <div>
                    <div className="text-lg font-black text-emerald-900">
                      {plant.formattedPrice}
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium">
                      {plant.unit}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectPlant(plant)}
                    className="inline-flex items-center gap-1 text-xs font-bold px-3 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white transition-all shadow-xs cursor-pointer"
                  >
                    <span>View & Rates</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Bottom Link */}
        <div className="text-center mt-10">
          <button
            onClick={onViewAllPlants}
            className="inline-flex items-center gap-2 text-sm font-extrabold text-emerald-900 hover:text-emerald-700 bg-white hover:bg-emerald-50 border border-emerald-200 px-6 py-3 rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <span>Explore All 10+ Certified Plants & Saplings</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
