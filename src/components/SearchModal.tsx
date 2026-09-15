import React, { useState, useMemo } from 'react';
import { Search, X, ArrowRight, TreePine, Tractor } from 'lucide-react';
import { Product, PlantItem, AgriMachine } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  plants?: PlantItem[];
  machines?: AgriMachine[];
  onSelectProduct: (product: Product) => void;
  onSelectPlant?: (plant: PlantItem) => void;
  onSelectMachine?: (machine: AgriMachine) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  products,
  plants = [],
  machines = [],
  onSelectProduct,
  onSelectPlant,
  onSelectMachine
}) => {
  const [query, setQuery] = useState('');

  const productResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.activeIngredient.toLowerCase().includes(q) ||
      p.company.toLowerCase().includes(q) ||
      p.categoryLabel.toLowerCase().includes(q) ||
      p.targetCrops.some(c => c.toLowerCase().includes(q)) ||
      p.targetPestsOrRole.some(pest => pest.toLowerCase().includes(q))
    ).slice(0, 6);
  }, [query, products]);

  const plantResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return plants.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.urduName.includes(query) ||
      p.variety.toLowerCase().includes(q) ||
      p.scientificName?.toLowerCase().includes(q)
    ).slice(0, 4);
  }, [query, plants]);

  const machineResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return machines.filter(m =>
      m.name.toLowerCase().includes(q) ||
      m.urduName.includes(query) ||
      m.brand.toLowerCase().includes(q) ||
      m.category.toLowerCase().includes(q)
    ).slice(0, 4);
  }, [query, machines]);

  if (!isOpen) return null;

  const hasAnyResults = productResults.length > 0 || plantResults.length > 0 || machineResults.length > 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center p-4 pt-16 sm:pt-24">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden border border-emerald-100 animate-in zoom-in-95 duration-150">
        
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <Search className="w-5 h-5 text-emerald-600" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, nursery plants, sprayers, machines..."
            className="w-full text-base text-slate-800 placeholder-slate-400 outline-hidden"
            id="modal-search-input"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-4">
          {!query.trim() ? (
            <div className="py-8 text-center text-xs text-slate-400">
              Type keywords like "Kinnow", "Sprayer", "Cotton", "NPK", "Safeda", or "Tiller"
            </div>
          ) : !hasAnyResults ? (
            <div className="py-8 text-center text-xs text-slate-500">
              No matching agro products, plants, or machines found for "{query}".
            </div>
          ) : (
            <>
              {/* Product Results */}
              {productResults.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider mb-2">
                    Crop Protection & Nutrition ({productResults.length})
                  </div>
                  <div className="divide-y divide-slate-50">
                    {productResults.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => {
                          onSelectProduct(p);
                          onClose();
                        }}
                        className="py-2 px-2 hover:bg-emerald-50/70 rounded-xl cursor-pointer flex items-center justify-between gap-3 group transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={p.imageUrl}
                            alt={p.name}
                            referrerPolicy="no-referrer"
                            className="w-9 h-9 object-contain rounded-md bg-white p-1 border border-emerald-50"
                          />
                          <div>
                            <div className="text-sm font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                              {p.name}
                            </div>
                            <div className="text-[11px] text-slate-500">
                              <span className="font-semibold text-emerald-700">{p.company}</span> • {p.activeIngredient}
                            </div>
                          </div>
                        </div>

                        <div className="text-xs text-emerald-700 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform shrink-0">
                          <span>View</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Plant Results */}
              {plantResults.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <TreePine className="w-3.5 h-3.5" />
                    <span>Nursery & Plantation ({plantResults.length})</span>
                  </div>
                  <div className="divide-y divide-slate-50">
                    {plantResults.map((plant) => (
                      <div
                        key={plant.id}
                        onClick={() => {
                          if (onSelectPlant) onSelectPlant(plant);
                          onClose();
                        }}
                        className="py-2 px-2 hover:bg-emerald-50/70 rounded-xl cursor-pointer flex items-center justify-between gap-3 group transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={plant.imageUrl}
                            alt={plant.name}
                            referrerPolicy="no-referrer"
                            className="w-9 h-9 object-cover rounded-md border border-emerald-100"
                          />
                          <div>
                            <div className="text-sm font-bold text-slate-900 group-hover:text-emerald-800 transition-colors flex items-center gap-2">
                              <span>{plant.name}</span>
                              <span className="text-xs font-urdu font-normal text-emerald-700">{plant.urduName}</span>
                            </div>
                            <div className="text-[11px] text-emerald-700 font-bold">
                              {plant.formattedPrice} • {plant.variety}
                            </div>
                          </div>
                        </div>

                        <div className="text-xs text-emerald-700 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform shrink-0">
                          <span>View</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Machinery Results */}
              {machineResults.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold text-amber-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Tractor className="w-3.5 h-3.5" />
                    <span>Agri Machines & Equipment ({machineResults.length})</span>
                  </div>
                  <div className="divide-y divide-slate-50">
                    {machineResults.map((mach) => (
                      <div
                        key={mach.id}
                        onClick={() => {
                          if (onSelectMachine) onSelectMachine(mach);
                          onClose();
                        }}
                        className="py-2 px-2 hover:bg-amber-50/70 rounded-xl cursor-pointer flex items-center justify-between gap-3 group transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={mach.imageUrl}
                            alt={mach.name}
                            referrerPolicy="no-referrer"
                            className="w-9 h-9 object-cover rounded-md border border-amber-200"
                          />
                          <div>
                            <div className="text-sm font-bold text-slate-900 group-hover:text-amber-800 transition-colors flex items-center gap-2">
                              <span>{mach.name}</span>
                              <span className="text-xs font-urdu font-normal text-amber-800">{mach.urduName}</span>
                            </div>
                            <div className="text-[11px] text-amber-800 font-bold">
                              {mach.formattedPrice} • {mach.brand}
                            </div>
                          </div>
                        </div>

                        <div className="text-xs text-amber-800 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform shrink-0">
                          <span>View</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer info */}
        <div className="bg-slate-50 px-4 py-2.5 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Bukhari Agro Multi-Product & Nursery Directory</span>
          <span>Press ESC to close</span>
        </div>

      </div>
    </div>
  );
};

