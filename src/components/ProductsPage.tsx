import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Check, 
  MessageCircle, 
  ArrowRight, 
  RotateCcw, 
  CheckCircle2, 
  Info,
  Sparkles,
  Image as ImageIcon
} from 'lucide-react';
import { Product, ProductCategory } from '../types';

interface ProductsPageProps {
  products: Product[];
  initialCategoryFilter?: string;
  onSelectProduct: (product: Product) => void;
  onAddToInquiry: (product: Product) => void;
  inquiryProductIds: string[];
  onOpenInquiryTray: () => void;
  isAdmin?: boolean;
  onChangeProductImage?: (product: Product) => void;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({
  products,
  initialCategoryFilter,
  onSelectProduct,
  onAddToInquiry,
  inquiryProductIds,
  onOpenInquiryTray,
  isAdmin,
  onChangeProductImage
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategoryFilter || 'all');
  const [selectedCompany, setSelectedCompany] = useState<string>('all');
  const [selectedCrop, setSelectedCrop] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'pesticides', label: 'Pesticides' },
    { id: 'fertilizers', label: 'Fertilizers' },
    { id: 'herbicides', label: 'Herbicides' },
    { id: 'fungicides', label: 'Fungicides' },
    { id: 'growth-regulators', label: 'Plant Growth Regulators' },
    { id: 'micronutrients', label: 'Micronutrients' },
  ];

  // Extract unique partner companies from data
  const companies = useMemo(() => {
    const set = new Set<string>();
    products.forEach(p => set.add(p.company));
    return ['all', ...Array.from(set)];
  }, [products]);

  // Extract common crops
  const commonCrops = ['all', 'Cotton', 'Wheat', 'Rice', 'Maize', 'Sugarcane', 'Citrus', 'Vegetables', 'Tomato'];

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (selectedCategory !== 'all' && p.category !== selectedCategory) {
        return false;
      }
      // Company filter
      if (selectedCompany !== 'all' && !p.company.toLowerCase().includes(selectedCompany.toLowerCase())) {
        return false;
      }
      // Crop filter
      if (selectedCrop !== 'all' && !p.targetCrops.some(c => c.toLowerCase() === selectedCrop.toLowerCase())) {
        return false;
      }
      // Text search
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchActive = p.activeIngredient.toLowerCase().includes(q);
        const matchCompany = p.company.toLowerCase().includes(q);
        const matchCrops = p.targetCrops.some(c => c.toLowerCase().includes(q));
        const matchPests = p.targetPestsOrRole.some(pest => pest.toLowerCase().includes(q));
        if (!matchName && !matchActive && !matchCompany && !matchCrops && !matchPests) {
          return false;
        }
      }
      return true;
    });
  }, [products, selectedCategory, selectedCompany, selectedCrop, searchQuery]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedCompany('all');
    setSelectedCrop('all');
  };

  return (
    <div className="bg-[#F8FAF6] min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Multi-Brand Agricultural Catalog</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Agricultural Products & <span className="text-[#16A34A]">Formulations</span>
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-1 max-w-3xl">
            Explore authentic crop protection chemistry, water-soluble fertilizers, herbicides, and growth stimulants sourced directly from leading manufacturers.
          </p>
        </div>

        {/* Filter Controls Card */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-emerald-100 shadow-xs mb-8 space-y-4">
          
          {/* Top Row: Search + Quick Stats */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by product name, active ingredient, crop (e.g. Wheat, Cotton), or pest..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 text-sm text-slate-800 placeholder-slate-400 transition-all outline-hidden"
                id="products-search-input"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-semibold"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 text-xs text-slate-500">
              <span className="font-semibold text-slate-700">
                Showing <strong className="text-emerald-800 text-sm">{filteredProducts.length}</strong> of {products.length} Products
              </span>
              {(selectedCategory !== 'all' || selectedCompany !== 'all' || selectedCrop !== 'all' || searchQuery) && (
                <button
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-900 font-bold ml-2 underline"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Filters</span>
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Filter by Category:
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-[#1B5E20] text-white shadow-xs'
                      : 'bg-emerald-50/70 hover:bg-emerald-100/70 text-slate-700 border border-emerald-100'
                  }`}
                  id={`filter-category-${cat.id}`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Dropdown Filters: Company Brand & Target Crop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Partner Company / Manufacturer:
              </label>
              <select
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 outline-hidden"
                id="filter-company-select"
              >
                <option value="all">All Manufacturers & Brands</option>
                {companies.filter(c => c !== 'all').map((c, idx) => (
                  <option key={idx} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Target Crop:
              </label>
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 outline-hidden"
                id="filter-crop-select"
              >
                <option value="all">All Crops (Wheat, Cotton, Rice, Maize, etc.)</option>
                {commonCrops.filter(cr => cr !== 'all').map((cr, idx) => (
                  <option key={idx} value={cr}>{cr}</option>
                ))}
              </select>
            </div>
          </div>

        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-emerald-100 max-w-md mx-auto my-12">
            <Info className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-900">No Products Match Your Criteria</h3>
            <p className="text-sm text-slate-500 mt-1">
              Try adjusting your search terms or clearing the selected company/crop filters.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-4 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-full transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => {
              const isAdded = inquiryProductIds.includes(product.id);
              const whatsappOrderUrl = `https://wa.me/923116666600?text=${encodeURIComponent(
                `Assalam-o-Alaikum Bukhari Agro, I would like to inquire/order product: *${product.name}* (${product.company}, Pack: ${product.packSizes[0] || 'Standard'}). Please provide price and availability.`
              )}`;

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl p-5 border border-emerald-100/90 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
                  id={`product-card-${product.id}`}
                >
                  <div>
                    {/* Top Row: Category Pill & Brand */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {product.categoryLabel}
                      </span>
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md truncate max-w-[140px]">
                        {product.company}
                      </span>
                    </div>

                    {/* Product Image Stage */}
                    <div
                      onClick={() => onSelectProduct(product)}
                      className="w-full h-48 rounded-xl bg-[#FAFDF7] border border-emerald-50 mb-4 p-4 flex items-center justify-center cursor-pointer overflow-hidden relative group/img"
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
                      <div className="absolute inset-0 bg-emerald-950/0 group-hover/img:bg-emerald-950/5 transition-colors" />

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

                      <div className="absolute bottom-2 right-2 opacity-0 group-hover/img:opacity-100 transition-opacity bg-white/90 text-[10px] font-bold text-emerald-800 px-2 py-0.5 rounded-md shadow-xs">
                        Click for Specs
                      </div>
                    </div>

                    {/* Title & Brand Formulation */}
                    <h3
                      onClick={() => onSelectProduct(product)}
                      className="text-lg font-bold text-slate-900 group-hover:text-emerald-800 transition-colors cursor-pointer"
                    >
                      {product.name}
                    </h3>
                    
                    <div className="text-xs font-semibold text-emerald-600 mt-0.5">
                      {product.brandName}
                    </div>

                    <p className="text-xs text-slate-600 mt-2 line-clamp-2 min-h-[32px]">
                      {product.shortDescription}
                    </p>

                    {/* Active Ingredient */}
                    <div className="mt-3 py-2 px-2.5 rounded-lg bg-slate-50 border border-slate-100 text-[11px] space-y-1">
                      <div>
                        <span className="font-bold text-slate-700">Active Compound:</span>{' '}
                        <span className="text-slate-600">{product.activeIngredient}</span>
                      </div>
                      <div>
                        <span className="font-bold text-slate-700">Formulation:</span>{' '}
                        <span className="text-slate-600">{product.formulation}</span>
                      </div>
                    </div>

                    {/* Target Crops Badges */}
                    <div className="mt-3 flex flex-wrap gap-1">
                      {product.targetCrops.slice(0, 4).map((crop, i) => (
                        <span
                          key={i}
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700"
                        >
                          {crop}
                        </span>
                      ))}
                      {product.targetCrops.length > 4 && (
                        <span className="text-[10px] text-slate-400 font-bold self-center">
                          +{product.targetCrops.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="mt-5 pt-3 border-t border-slate-100 space-y-2.5">
                    {/* Price Display */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline gap-2">
                        <span className="text-base font-extrabold text-emerald-800">{product.price || 'PKR 2,500'}</span>
                        {product.originalPrice && (
                          <span className="text-xs text-slate-400 line-through">{product.originalPrice}</span>
                        )}
                      </div>
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> In Stock
                      </span>
                    </div>

                    {/* Pack Sizes & Stock */}
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>Packs: <strong className="text-slate-700">{product.packSizes.join(', ')}</strong></span>
                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Original Formulations</span>
                    </div>

                    {/* Interactive Action Buttons */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      {/* View Details */}
                      <button
                        onClick={() => onSelectProduct(product)}
                        className="w-full py-2 px-3 rounded-xl border border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-emerald-800 text-xs font-bold transition-all text-center"
                        id={`btn-view-details-${product.id}`}
                      >
                        Technical Specs
                      </button>

                      {/* Add to Inquiry List */}
                      <button
                        onClick={() => onAddToInquiry(product)}
                        className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                          isAdded
                            ? 'bg-emerald-700 text-white shadow-xs'
                            : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                        }`}
                        id={`btn-add-inquiry-${product.id}`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>In Quote</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add to Quote</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Direct WhatsApp Order Link */}
                    <a
                      href={whatsappOrderUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-1.5 px-3 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-emerald-200 hover:text-white text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors"
                      id={`btn-whatsapp-order-${product.id}`}
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Order on WhatsApp (+92 311 6666600)</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};
