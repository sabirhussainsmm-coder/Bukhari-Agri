import React from 'react';
import { X, Trash2, MessageCircle, Send, ShoppingBag, ArrowRight } from 'lucide-react';
import { Product } from '../types';

interface InquiryTrayModalProps {
  isOpen: boolean;
  onClose: () => void;
  inquiryProducts: Product[];
  onRemoveFromInquiry: (productId: string) => void;
  onClearInquiry: () => void;
  onProceedToContact: () => void;
}

export const InquiryTrayModal: React.FC<InquiryTrayModalProps> = ({
  isOpen,
  onClose,
  inquiryProducts,
  onRemoveFromInquiry,
  onClearInquiry,
  onProceedToContact
}) => {
  if (!isOpen) return null;

  const productListSummary = inquiryProducts.map(p => `- ${p.name} (${p.company}, Pack: ${p.packSizes[0] || 'Standard'})`).join('\n');
  const whatsAppQuoteUrl = `https://wa.me/923116666600?text=${encodeURIComponent(
    `Assalam-o-Alaikum Bukhari Agro (Pvt) Ltd,\nI would like to request an official wholesale quotation for the following ${inquiryProducts.length} product(s):\n\n${productListSummary}\n\nPlease confirm rates and delivery timeline to my farm.`
  )}`;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200">
        
        {/* Tray Header */}
        <div className="bg-[#0B3D1D] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="font-extrabold text-base">Quotation List</h3>
              <div className="text-xs text-emerald-300">
                {inquiryProducts.length} Product(s) Selected
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-emerald-900 text-emerald-200 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tray Body */}
        <div className="p-5 flex-1 overflow-y-auto space-y-3">
          {inquiryProducts.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
              <h4 className="font-bold text-slate-700 text-base">Your Inquiry List is Empty</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Browse our multi-brand catalog and click "Quote" on products to compile a customized price request.
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs text-slate-500">
                <span>Selected Formulations</span>
                <button
                  onClick={onClearInquiry}
                  className="text-red-600 hover:text-red-700 font-semibold"
                >
                  Clear All
                </button>
              </div>

              {inquiryProducts.map((p) => (
                <div
                  key={p.id}
                  className="p-3 rounded-xl border border-emerald-100 bg-[#F9FBF8] flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 object-contain rounded-lg bg-white p-1 border border-emerald-50"
                    />
                    <div>
                      <div className="text-xs font-extrabold text-slate-900 line-clamp-1">{p.name}</div>
                      <div className="text-[10px] text-emerald-700 font-semibold">{p.company}</div>
                      <div className="text-[10px] text-slate-500">Pack: {p.packSizes[0]}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => onRemoveFromInquiry(p.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Tray Footer Actions */}
        {inquiryProducts.length > 0 && (
          <div className="p-5 bg-slate-50 border-t border-slate-100 space-y-3">
            <a
              href={whatsAppQuoteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 bg-[#1B5E20] hover:bg-[#154b1a] text-white font-bold py-3 px-4 rounded-xl text-xs transition-colors shadow-md"
            >
              <MessageCircle className="w-4 h-4 text-emerald-300" />
              <span>Send Quotation on WhatsApp (+92 311 6666600)</span>
            </a>

            <button
              onClick={() => {
                onClose();
                onProceedToContact();
              }}
              className="w-full inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-slate-800 font-bold py-2.5 px-4 rounded-xl text-xs border border-slate-200 transition-colors"
            >
              <span>Submit via Contact Form</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
