import React, { useState } from 'react';
import { 
  X, 
  Check, 
  MessageCircle, 
  ShoppingBag, 
  ShieldCheck, 
  Wrench, 
  Cpu, 
  Zap, 
  Sparkles, 
  CheckCircle2,
  Tractor,
  HelpCircle
} from 'lucide-react';
import { AgriMachine } from '../types';

interface MachineDetailModalProps {
  machine: AgriMachine | null;
  onClose: () => void;
  onAddToInquiry: (machine: AgriMachine, quantity: number) => void;
}

export const MachineDetailModal: React.FC<MachineDetailModalProps> = ({
  machine,
  onClose,
  onAddToInquiry
}) => {
  const [quantity, setQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);

  if (!machine) return null;

  const handleAdd = () => {
    onAddToInquiry(machine, quantity);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2500);
  };

  const whatsAppUrl = `https://wa.me/923116666600?text=${encodeURIComponent(
    `Assalam-o-Alaikum Bukhari Agro (Pvt) Ltd,\nI want to inquire about purchasing *${machine.name}* (${machine.urduName}).\n• Brand: ${machine.brand}\n• Pricing: Inquiring for best farm price / quotation\n• Power: ${machine.powerSource}\n• Capacity: ${machine.capacityOrSize}\n• Warranty: ${machine.warranty}\n\nPlease share price, delivery terms, operator training, and field demo details.`
  )}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-emerald-100 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-emerald-100/80 px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900">
              <Tractor className="w-3.5 h-3.5 text-amber-700" />
              <span>{machine.categoryLabel}</span>
            </span>
            <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
              {machine.brand}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            id="modal-close-machine-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* Top Grid: Image + Core Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-start">
            <div className="relative rounded-xl overflow-hidden bg-slate-100 aspect-4/3 sm:aspect-square border border-emerald-100 shadow-inner">
              <img
                src={machine.imageUrl}
                alt={machine.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2 bg-slate-900/90 backdrop-blur-xs text-emerald-400 text-[11px] font-bold px-2.5 py-1 rounded-md shadow-xs">
                {machine.warranty}
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                  {machine.name}
                </h2>
                <div className="text-base sm:text-lg font-bold text-emerald-700 mt-0.5" dir="rtl">
                  {machine.urduName}
                </div>
              </div>

              {/* WhatsApp Pricing Banner */}
              <div className="bg-emerald-50 border border-emerald-200/80 p-3.5 rounded-xl">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-emerald-600" />
                    <div>
                      <div className="text-sm font-extrabold text-emerald-950">
                        قیمت واٹس ایپ پر دستیاب ہے
                      </div>
                      <div className="text-xs text-emerald-700 font-semibold">
                        Official Price & Quotation on WhatsApp
                      </div>
                    </div>
                  </div>
                  <a
                    href={whatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 text-xs font-bold px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors inline-flex items-center gap-1"
                  >
                    <span>Get Price</span>
                  </a>
                </div>
                <div className="mt-2 text-xs text-emerald-800 font-medium">
                  {machine.tagline}
                </div>
              </div>

              {/* Quick Specs Cards */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <div className="text-slate-400 font-medium flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-600" />
                    <span>Power / Engine</span>
                  </div>
                  <div className="font-bold text-slate-800 mt-0.5">{machine.powerSource}</div>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <div className="text-slate-400 font-medium flex items-center gap-1">
                    <Cpu className="w-3 h-3 text-emerald-600" />
                    <span>Capacity / Size</span>
                  </div>
                  <div className="font-bold text-slate-800 mt-0.5">{machine.capacityOrSize}</div>
                </div>
              </div>

              {/* Warranty Guarantee */}
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-amber-50/70 border border-amber-200/60 text-xs text-amber-900">
                <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
                <span className="font-semibold">{machine.warranty}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-emerald-900">
              Machine Overview & Operational Efficiency
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {machine.fullDescription}
            </p>
          </div>

          {/* Technical Specifications Table */}
          {machine.specifications && Object.keys(machine.specifications).length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                <Wrench className="w-4 h-4 text-emerald-600" />
                <span>Technical Specifications (تکنیکی تفصیلات)</span>
              </h3>
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white text-xs divide-y divide-slate-100">
                {Object.entries(machine.specifications).map(([key, val], idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-2.5 hover:bg-slate-50 transition-colors">
                    <span className="font-bold text-slate-700 sm:w-1/3">{key}</span>
                    <span className="text-slate-600 sm:w-2/3 sm:text-right font-medium">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Key Features */}
          {machine.keyFeatures && machine.keyFeatures.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-emerald-900">
                Key Performance Advantages
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {machine.keyFeatures.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Suitable Tasks / Crops */}
          {machine.suitableFor && machine.suitableFor.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-emerald-900">
                Recommended Agricultural Applications
              </h3>
              <div className="flex flex-wrap gap-2">
                {machine.suitableFor.map((task, idx) => (
                  <span key={idx} className="text-xs bg-emerald-50 text-emerald-800 font-medium px-3 py-1.5 rounded-lg border border-emerald-100">
                    {task}
                  </span>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Sticky Actions Footer */}
        <div className="sticky bottom-0 bg-white border-t border-emerald-100 p-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <HelpCircle className="w-4 h-4 text-emerald-600" />
            <span>Spare parts and on-field demonstration available</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleAdd}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm bg-slate-900 hover:bg-slate-800 text-white transition-all shadow-xs cursor-pointer"
              id="modal-add-machine-cart-btn"
            >
              {addedNotice ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Added to Quotation!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4 text-emerald-400" />
                  <span>Add to Quotation</span>
                </>
              )}
            </button>

            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-xs cursor-pointer"
              id="modal-machine-whatsapp-btn"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Direct Quote</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
