import React, { useState, useMemo } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { Product } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct
}) => {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.activeIngredient.toLowerCase().includes(q) ||
      p.company.toLowerCase().includes(q) ||
      p.categoryLabel.toLowerCase().includes(q) ||
      p.targetCrops.some(c => c.toLowerCase().includes(q)) ||
      p.targetPestsOrRole.some(pest => pest.toLowerCase().includes(q))
    ).slice(0, 8);
  }, [query, products]);

  if (!isOpen) return null;

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
            placeholder="Search products, pests (e.g. Armyworm), crops (e.g. Cotton)..."
            className="w-full text-base text-slate-800 placeholder-slate-400 outline-hidden"
            id="modal-search-input"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-96 overflow-y-auto p-4 divide-y divide-slate-50">
          {!query.trim() ? (
            <div className="py-8 text-center text-xs text-slate-400">
              Type keywords such as "Pesticide", "NPK", "Bayer", "Cotton", or "Rust"
            </div>
          ) : results.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">
              No matching agro products found for "{query}".
            </div>
          ) : (
            results.map((p) => (
              <div
                key={p.id}
                onClick={() => {
                  onSelectProduct(p);
                  onClose();
                }}
                className="py-3 px-2 hover:bg-emerald-50/70 rounded-xl cursor-pointer flex items-center justify-between gap-3 group transition-colors"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 object-contain rounded-md bg-white p-1 border border-emerald-50"
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
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="bg-slate-50 px-4 py-2.5 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Bukhari Agro Multi-Brand Agrochemical Index</span>
          <span>Press ESC to close</span>
        </div>

      </div>
    </div>
  );
};
