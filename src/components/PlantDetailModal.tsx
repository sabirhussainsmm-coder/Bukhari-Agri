import React, { useState } from 'react';
import { 
  X, 
  Check, 
  MessageCircle, 
  ShoppingBag, 
  ShieldCheck, 
  Sun, 
  Droplets, 
  Layers, 
  Clock, 
  Sparkles, 
  Plus, 
  Minus,
  CheckCircle2,
  TreePine
} from 'lucide-react';
import { PlantItem } from '../types';

interface PlantDetailModalProps {
  plant: PlantItem | null;
  onClose: () => void;
  onAddToInquiry: (plant: PlantItem, quantity: number) => void;
  isInInquiry?: boolean;
}

export const PlantDetailModal: React.FC<PlantDetailModalProps> = ({
  plant,
  onClose,
  onAddToInquiry,
  isInInquiry = false
}) => {
  const [quantity, setQuantity] = useState(10);
  const [addedNotice, setAddedNotice] = useState(false);

  if (!plant) return null;

  const totalPrice = plant.price * quantity;
  const formattedTotalPrice = `Rs. ${totalPrice.toLocaleString()}`;

  const handleAdd = () => {
    onAddToInquiry(plant, quantity);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2500);
  };

  const whatsAppUrl = `https://wa.me/923116666600?text=${encodeURIComponent(
    `Assalam-o-Alaikum Bukhari Agro (Pvt) Ltd,\nI want to inquire about purchasing *${plant.name}* (${plant.urduName}).\n• Quantity: *${quantity} Plants*\n• Estimated Price: *${formattedTotalPrice}* (${plant.formattedPrice} per plant)\n• Rootstock: ${plant.heightOrAge}\n\nPlease confirm availability and delivery to my farm.`
  )}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-emerald-100 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-emerald-100/80 px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
              <TreePine className="w-3.5 h-3.5 text-emerald-600" />
              <span>{plant.categoryLabel}</span>
            </span>
            {plant.inStock && (
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                In Stock & Ready for Planting
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            id="modal-close-plant-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* Top Grid: Image + Core Specs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-start">
            <div className="relative rounded-xl overflow-hidden bg-slate-100 aspect-4/3 sm:aspect-square border border-emerald-100 shadow-inner">
              <img
                src={plant.imageUrl}
                alt={plant.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2 bg-emerald-900/90 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-md shadow-xs">
                {plant.survivalRate}
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                  {plant.name}
                </h2>
                <div className="text-base sm:text-lg font-bold text-emerald-700 mt-0.5" dir="rtl">
                  {plant.urduName}
                </div>
                {plant.scientificName && (
                  <div className="text-xs text-slate-400 italic">
                    {plant.scientificName}
                  </div>
                )}
              </div>

              {/* Price Tag */}
              <div className="bg-emerald-50/70 border border-emerald-200/60 p-3 rounded-xl">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-emerald-900">
                    {plant.formattedPrice}
                  </span>
                  <span className="text-xs text-slate-500">
                    {plant.unit}
                  </span>
                  {plant.originalPrice && (
                    <span className="text-xs text-slate-400 line-through ml-auto">
                      {plant.originalPrice}
                    </span>
                  )}
                </div>
                {plant.bulkPrice && (
                  <div className="mt-1.5 text-xs font-semibold text-emerald-700 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Wholesale Rate: {plant.bulkPrice}</span>
                  </div>
                )}
              </div>

              {/* Quick Specs List */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <div className="text-slate-400 font-medium flex items-center gap-1">
                    <Layers className="w-3 h-3 text-emerald-600" />
                    <span>Sapling Age/Height</span>
                  </div>
                  <div className="font-bold text-slate-800 mt-0.5">{plant.heightOrAge}</div>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <div className="text-slate-400 font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3 text-emerald-600" />
                    <span>Bearing Time</span>
                  </div>
                  <div className="font-bold text-slate-800 mt-0.5">{plant.fruitingTime}</div>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <div className="text-slate-400 font-medium flex items-center gap-1">
                    <Droplets className="w-3 h-3 text-emerald-600" />
                    <span>Watering Needs</span>
                  </div>
                  <div className="font-semibold text-slate-800 mt-0.5 truncate">{plant.watering}</div>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <div className="text-slate-400 font-medium flex items-center gap-1">
                    <Sun className="w-3 h-3 text-emerald-600" />
                    <span>Sunlight & Soil</span>
                  </div>
                  <div className="font-semibold text-slate-800 mt-0.5 truncate">{plant.soilType}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-emerald-900">
              Plant Profile & Agronomic Guidance
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {plant.fullDescription}
            </p>
          </div>

          {/* Key Certified Features */}
          {plant.features && plant.features.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-emerald-900">
                Nursery Certification & Guarantees
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {plant.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 bg-emerald-50/40 p-2 rounded-lg border border-emerald-100/50">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Calculator */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Order Quantity (پودوں کی تعداد)
                </span>
                <p className="text-[11px] text-slate-500">
                  Minimum recommended for orchard or boundary planting: 10 saplings
                </p>
              </div>

              {/* Quantity Counter */}
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center border border-slate-300 rounded-lg bg-white overflow-hidden shadow-xs">
                  <button
                    type="button"
                    onClick={() => setQuantity(prev => Math.max(1, prev - 5))}
                    className="px-2.5 py-1.5 text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-14 text-center text-sm font-bold text-slate-900 focus:outline-hidden py-1"
                  />
                  <button
                    type="button"
                    onClick={() => setQuantity(prev => prev + 5)}
                    className="px-2.5 py-1.5 text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-right">
                  <div className="text-xs text-slate-400">Total Price</div>
                  <div className="text-base font-black text-emerald-800">{formattedTotalPrice}</div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Sticky Actions Footer */}
        <div className="sticky bottom-0 bg-white border-t border-emerald-100 p-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Root-ball intact with certified nursery guarantee</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleAdd}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm bg-slate-900 hover:bg-slate-800 text-white transition-all shadow-xs cursor-pointer"
              id="modal-add-plant-cart-btn"
            >
              {addedNotice ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Added {quantity} Plants!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4 text-emerald-400" />
                  <span>Add to Order List</span>
                </>
              )}
            </button>

            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-xs cursor-pointer"
              id="modal-plant-whatsapp-btn"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Inquiry</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
