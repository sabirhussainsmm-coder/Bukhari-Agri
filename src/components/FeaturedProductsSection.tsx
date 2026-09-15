import React from 'react';
import { ArrowRight, Plus, Check, MessageCircle, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { Product } from '../types';

interface FeaturedProductsSectionProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onViewAll: () => void;
  onAddToInquiry: (product: Product) => void;
  inquiryProductIds: string[];
  isAdmin?: boolean;
  onChangeProductImage?: (product: Product) => void;
}

export const FeaturedProductsSection: React.FC<FeaturedProductsSectionProps> = ({
  products,
  onSelectProduct,
  onViewAll,
  onAddToInquiry,
  inquiryProductIds,
  isAdmin,
  onChangeProductImage
}) => {
  const featured = products.filter(p => p.featured).slice(0, 4);

  return (
    <section className="py-16 sm:py-20 bg-emerald-50/40 border-t border-emerald-100/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header (Matching image.png) */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="text-xs sm:text-sm font-bold tracking-wider text-emerald-800 uppercase mb-1">
              FEATURED PRODUCTS
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Trusted Brands, <span className="text-[#16A34A]">Proven Results</span>
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-1">
              Authorized multi-brand stock tested for maximum potency in local soil conditions.
            </p>
          </div>

          <button
            onClick={onViewAll}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-800 hover:text-emerald-950 transition-colors group shrink-0"
            id="featured-view-all-btn"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* 4 Cards Grid (Matching image.png horizontal cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((product) => {
            const isAdded = inquiryProductIds.includes(product.id);
            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
                id={`featured-card-${product.id}`}
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {product.categoryLabel}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-500 truncate max-w-[120px]">
                      {product.company}
                    </span>
                  </div>

                  {/* Product Pack Mockup (Product packaging from image.png) */}
                  <div 
                    onClick={() => onSelectProduct(product)}
                    className="w-full h-44 rounded-xl bg-[#F8FAF6] border border-emerald-50 mb-4 p-3 flex items-center justify-center cursor-pointer overflow-hidden relative group/img"
                  >
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="max-h-full max-w-full object-contain transform group-hover/img:scale-110 transition-transform duration-300 drop-shadow-md"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/pesticide-bottle.jpg';
                      }}
                    />
                    <div className="absolute inset-0 bg-emerald-900/0 group-hover/img:bg-emerald-900/5 transition-colors" />

                    {/* WordPress-style Quick Image Editor */}
                    {isAdmin && onChangeProductImage && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onChangeProductImage(product);
                        }}
                        className="absolute top-2 right-2 z-10 px-2 py-1 bg-[#2271b1] hover:bg-[#135e96] text-white text-[10px] font-bold rounded shadow-md flex items-center gap-1 opacity-90 hover:opacity-100 transition-all"
                        title="Change Image via WordPress Media Library"
                      >
                        <ImageIcon className="w-3 h-3" />
                        <span>Change Image</span>
                      </button>
                    )}
                  </div>

                  {/* Title */}
                  <h3 
                    onClick={() => onSelectProduct(product)}
                    className="text-base font-bold text-slate-900 group-hover:text-emerald-800 transition-colors cursor-pointer line-clamp-1"
                  >
                    {product.name}
                  </h3>

                  {/* Tagline / Subtitle */}
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2 min-h-[32px]">
                    {product.tagline}
                  </p>

                  {/* Active Ingredient & Price Display */}
                  <div className="mt-3 pt-3 border-t border-emerald-50 flex items-center justify-between gap-2">
                    <div className="text-[11px] text-slate-500 truncate">
                      <span className="font-semibold text-slate-700">Active:</span> {product.activeIngredient}
                    </div>
                    {product.price && (
                      <div className="text-right shrink-0">
                        <span className="text-xs font-extrabold text-emerald-800">{product.price}</span>
                        {product.originalPrice && (
                          <span className="block text-[10px] text-slate-400 line-through leading-none">{product.originalPrice}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Actions (Matching "View Details →" as in image.png + Inquiry trigger) */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onSelectProduct(product)}
                    className="text-xs font-bold text-emerald-800 hover:text-emerald-950 inline-flex items-center gap-1 group/btn"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                  </button>

                  <button
                    onClick={() => onAddToInquiry(product)}
                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      isAdded 
                        ? 'bg-emerald-600 text-white shadow-xs' 
                        : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                    }`}
                    title="Add to quotation inquiry"
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3 h-3" />
                        <span>Added</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3 h-3" />
                        <span>Quote</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
