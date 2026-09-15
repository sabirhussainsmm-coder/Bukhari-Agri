import React, { useState, useMemo } from 'react';
import { 
  TreePine, 
  Search, 
  Filter, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  Sun, 
  Droplets, 
  ShoppingBag, 
  MessageCircle, 
  ArrowRight,
  Info,
  PhoneCall
} from 'lucide-react';
import { PlantItem, PlantCategory } from '../types';

interface PlantationPageProps {
  plants: PlantItem[];
  onSelectPlant: (plant: PlantItem) => void;
  onAddToInquiry: (plant: PlantItem, quantity: number) => void;
  onNavigateToContact: () => void;
}

export const PlantationPage: React.FC<PlantationPageProps> = ({
  plants,
  onSelectPlant,
  onAddToInquiry,
  onNavigateToContact
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recommended' | 'price-asc' | 'price-desc'>('recommended');

  const categories: { id: string; label: string; urdu: string }[] = [
    { id: 'all', label: 'All Plants', urdu: 'تمام پودے' },
    { id: 'fruit', label: 'Fruit Trees', urdu: 'پھل دار پودے' },
    { id: 'forestry', label: 'Commercial Timber & Forestry', urdu: 'لکڑی و جنگلاتی' },
    { id: 'medicinal', label: 'Medicinal & Cash Crops', urdu: 'طبی و نقد آور' }
  ];

  const filteredPlants = useMemo(() => {
    return plants
      .filter((plant) => {
        const matchesCategory = selectedCategory === 'all' || plant.category === selectedCategory;
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch = 
          !q ||
          plant.name.toLowerCase().includes(q) ||
          plant.urduName.toLowerCase().includes(q) ||
          (plant.scientificName && plant.scientificName.toLowerCase().includes(q)) ||
          plant.categoryLabel.toLowerCase().includes(q) ||
          plant.shortDescription.toLowerCase().includes(q);

        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [plants, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="py-8 sm:py-12 bg-[#F8FAF7] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Page Hero Banner */}
        <div className="bg-linear-to-r from-emerald-950 via-emerald-900 to-[#0B3D1D] rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden border border-emerald-800">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-800/80 text-emerald-200 border border-emerald-700">
              <TreePine className="w-4 h-4 text-emerald-300" />
              <span>Bukhari Agro Certified Nursery & Plantation • زرعی نرسری و باغات</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Certified Fruit Orchards & Fast Commercial Timber Plants
            </h1>
            
            <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed">
              Every sapling is cultivated on disease-resistant certified rootstocks and delivered with intact earthen rootballs (گچی) to guarantee 98%+ orchard survival rates across Punjab, Sindh, and Balochistan.
            </p>

            <div className="flex flex-wrap gap-4 pt-2 text-xs">
              <div className="flex items-center gap-2 bg-white/10 px-3.5 py-1.5 rounded-lg border border-white/10">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>100% Certified Variety & Girth</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-3.5 py-1.5 rounded-lg border border-white/10">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Wholesale Rates on Commercial Orchards</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-3.5 py-1.5 rounded-lg border border-white/10">
                <PhoneCall className="w-4 h-4 text-emerald-400" />
                <span>Free Orchard Layout Agronomic Advice</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-xs border border-emerald-100 space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search plants by name, variety, or Urdu (e.g., Kinnow, چونسہ, Olive, سفیدا)..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:border-emerald-600 focus:bg-white transition-all text-slate-900 placeholder:text-slate-400 font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-bold text-slate-500 whitespace-nowrap">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold rounded-xl px-3 py-2.5 focus:outline-hidden focus:border-emerald-600 cursor-pointer"
              >
                <option value="recommended">Featured / Popular</option>
                <option value="price-asc">Price: Low to High (کم سے زیادہ)</option>
                <option value="price-desc">Price: High to Low (زیادہ سے کم)</option>
              </select>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
            {categories.map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                    active
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className="text-[10px] opacity-80" dir="rtl">({cat.urdu})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between text-xs text-slate-600 px-1">
          <div>
            Showing <strong className="text-emerald-900 font-bold">{filteredPlants.length}</strong> certified plant varieties
            {selectedCategory !== 'all' && ` in "${categories.find(c => c.id === selectedCategory)?.label}"`}
          </div>
          <div className="text-emerald-700 font-semibold">
            All prices include nursery certificate & root-ball packing
          </div>
        </div>

        {/* Plants Catalog Grid */}
        {filteredPlants.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
            <TreePine className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No plants match your search</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your search keyword or switch to "All Plants" to view the complete nursery stock.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
              className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlants.map((plant) => {
              const whatsAppUrl = `https://wa.me/923116666600?text=${encodeURIComponent(
                `Assalam-o-Alaikum Bukhari Agro,\nI want to order certified nursery saplings for *${plant.name}* (${plant.urduName}).\nPrice: *${plant.formattedPrice} ${plant.unit}*\nRootstock: ${plant.heightOrAge}\n\nPlease share booking and delivery terms.`
              )}`;

              return (
                <div
                  key={plant.id}
                  className="bg-white rounded-2xl border border-emerald-100 hover:border-emerald-300 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group"
                >
                  {/* Image & Tags */}
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
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-emerald-900 text-xs font-bold px-2.5 py-1 rounded-lg shadow-xs border border-emerald-100">
                      {plant.categoryLabel.split('(')[0]}
                    </div>
                    <div className="absolute bottom-3 right-3 bg-emerald-950/95 text-white text-xs font-bold px-2.5 py-1 rounded-lg backdrop-blur-xs" dir="rtl">
                      {plant.urduName}
                    </div>
                    {plant.survivalRate && (
                      <div className="absolute top-3 right-3 bg-emerald-600/90 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-xs">
                        {plant.survivalRate}
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 
                          onClick={() => onSelectPlant(plant)}
                          className="font-extrabold text-lg text-slate-900 group-hover:text-emerald-700 transition-colors cursor-pointer"
                        >
                          {plant.name}
                        </h3>
                      </div>
                      
                      {plant.scientificName && (
                        <div className="text-xs text-slate-400 italic mt-0.5">
                          {plant.scientificName}
                        </div>
                      )}

                      <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                        {plant.shortDescription}
                      </p>
                    </div>

                    {/* Quick Specs Badges */}
                    <div className="grid grid-cols-2 gap-2 text-xs bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100/60">
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">{plant.fruitingTime}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <Sun className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span className="truncate">{plant.heightOrAge}</span>
                      </div>
                    </div>

                    {/* Pricing Display */}
                    <div className="pt-2 border-t border-slate-100 flex items-baseline justify-between">
                      <div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-2xl font-black text-emerald-900">
                            {plant.formattedPrice}
                          </span>
                          <span className="text-xs text-slate-400 font-medium">
                            {plant.unit}
                          </span>
                        </div>
                        {plant.bulkPrice && (
                          <div className="text-[11px] font-bold text-emerald-700 mt-0.5">
                            Bulk: {plant.bulkPrice}
                          </div>
                        )}
                      </div>

                      {plant.originalPrice && (
                        <div className="text-xs text-slate-400 line-through">
                          {plant.originalPrice}
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => onSelectPlant(plant)}
                        className="w-full inline-flex items-center justify-center gap-1 text-xs font-bold py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white transition-all shadow-xs cursor-pointer"
                      >
                        <span>View Details</span>
                      </button>

                      <a
                        href={whatsAppUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-1 text-xs font-bold py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-xs cursor-pointer"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>WhatsApp Order</span>
                      </a>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Nursery Project Consultation Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">
              Planning a Commercial Orchard or Boundary Plantation?
            </h3>
            <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
              Our certified agronomists provide site soil testing, pit preparation blueprints, row-to-row spacing calculations, and seasonal fertilizer schedules for commercial orchards.
            </p>
          </div>

          <button
            onClick={onNavigateToContact}
            className="inline-flex items-center gap-2 bg-emerald-800 hover:bg-emerald-900 text-white px-6 py-3.5 rounded-xl font-bold text-sm shadow-md transition-all shrink-0 cursor-pointer"
          >
            <span>Consult Bukhari Agronomist</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
