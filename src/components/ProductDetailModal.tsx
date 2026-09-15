import React from 'react';
import { 
  X, 
  Plus, 
  Check, 
  MessageCircle, 
  ShieldCheck, 
  Droplets, 
  AlertTriangle, 
  CheckCircle2, 
  Package,
  Layers
} from 'lucide-react';
import { Product } from '../types';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToInquiry: (product: Product) => void;
  isAddedToInquiry: boolean;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToInquiry,
  isAddedToInquiry
}) => {
  if (!product) return null;

  const directWhatsAppUrl = `https://wa.me/923116666600?text=${encodeURIComponent(
    `Assalam-o-Alaikum Bukhari Agro, I am inquiring about product *${product.name}* (${product.company}). Active Ingredient: ${product.activeIngredient}. Please provide pricing for pack size: ${product.packSizes[0] || 'Standard'}.`
  )}`;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-emerald-100 my-8 animate-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="bg-[#0B3D1D] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 bg-emerald-900/80 px-2.5 py-0.5 rounded-full border border-emerald-700/50">
              {product.categoryLabel}
            </span>
            <span className="text-xs text-emerald-200">
              {product.company}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-emerald-900 text-emerald-200 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 max-h-[80vh] overflow-y-auto space-y-6">
          
          {/* Top Section: Photo & Title */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="w-40 h-44 rounded-2xl bg-[#F8FAF6] p-4 flex items-center justify-center shrink-0 border border-emerald-50 shadow-inner">
              <img
                src={product.imageUrl}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="max-h-full max-w-full object-contain drop-shadow-md"
              />
            </div>

            <div className="space-y-2 text-center sm:text-left flex-1">
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {product.name}
              </h2>
              <div className="text-xs font-semibold text-[#16A34A]">
                {product.brandName}
              </div>

              {/* Price Banner */}
              {product.price && (
                <div className="inline-flex items-baseline gap-2.5 py-1 px-3 rounded-xl bg-emerald-50 border border-emerald-200">
                  <span className="text-xl font-extrabold text-emerald-950">{product.price}</span>
                  {product.originalPrice && (
                    <span className="text-xs text-slate-400 line-through">{product.originalPrice}</span>
                  )}
                  <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-200/60 px-1.5 py-0.5 rounded">
                    Authentic Formulation
                  </span>
                </div>
              )}

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {product.fullDescription}
              </p>
              
              <div className="pt-2 flex flex-wrap gap-2 items-center justify-center sm:justify-start text-xs text-slate-500">
                <span className="inline-flex items-center gap-1 font-bold text-emerald-800">
                  <Package className="w-3.5 h-3.5" /> Pack Sizes:
                </span>
                {product.packSizes.map((size, idx) => (
                  <span key={idx} className="bg-slate-100 px-2 py-0.5 rounded-md font-semibold text-slate-700">
                    {size}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Technical Specifications Matrix */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100">
            <div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Active Ingredient
              </div>
              <div className="text-xs sm:text-sm font-extrabold text-slate-900 mt-0.5">
                {product.activeIngredient}
              </div>
            </div>

            <div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Formulation Type
              </div>
              <div className="text-xs sm:text-sm font-extrabold text-slate-900 mt-0.5">
                {product.formulation}
              </div>
            </div>

            <div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Recommended Dosage
              </div>
              <div className="text-xs sm:text-sm font-extrabold text-emerald-900 mt-0.5">
                {product.dosage}
              </div>
            </div>

            <div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Application Method
              </div>
              <div className="text-xs sm:text-sm font-medium text-slate-800 mt-0.5">
                {product.applicationMethod}
              </div>
            </div>
          </div>

          {/* Target Crops */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Registered Target Crops:</span>
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {product.targetCrops.map((crop, idx) => (
                <span
                  key={idx}
                  className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-100/70 text-emerald-900"
                >
                  {crop}
                </span>
              ))}
            </div>
          </div>

          {/* Target Pests or Role */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Target Pests / Agronomic Impact:</span>
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {product.targetPestsOrRole.map((pest, idx) => (
                <span
                  key={idx}
                  className="text-xs font-medium px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800"
                >
                  {pest}
                </span>
              ))}
            </div>
          </div>

          {/* Safety & Precautions */}
          {product.precautions && product.precautions.length > 0 && (
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/60 text-xs">
              <div className="font-bold text-amber-900 flex items-center gap-1.5 mb-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-700" />
                <span>Handling & Safety Instructions:</span>
              </div>
              <ul className="space-y-1 text-amber-950/90 list-disc list-inside">
                {product.precautions.map((p, idx) => (
                  <li key={idx}>{p}</li>
                ))}
              </ul>
            </div>
          )}

        </div>

        {/* Modal Action Bar */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={() => onAddToInquiry(product)}
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              isAddedToInquiry
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200'
            }`}
          >
            {isAddedToInquiry ? (
              <>
                <Check className="w-4 h-4" />
                <span>Added to Quotation List</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Add to Quotation List</span>
              </>
            )}
          </button>

          <a
            href={directWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#1B5E20] hover:bg-[#154b1a] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md transition-colors"
          >
            <MessageCircle className="w-4 h-4 text-emerald-300" />
            <span>Inquire on WhatsApp (+92 311 6666600)</span>
          </a>
        </div>

      </div>
    </div>
  );
};
