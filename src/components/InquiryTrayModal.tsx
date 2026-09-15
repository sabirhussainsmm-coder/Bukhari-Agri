import React from 'react';
import { X, Trash2, MessageCircle, Send, ShoppingBag, ArrowRight, Package, Plus, Minus } from 'lucide-react';
import { Product, InquiryCartItem } from '../types';
import { submitOrderOrInquiry } from '../services/supabaseService';

interface InquiryTrayModalProps {
  isOpen: boolean;
  onClose: () => void;
  inquiryItems: InquiryCartItem[];
  onRemoveItem: (cartItemId: string) => void;
  onUpdatePackSize: (cartItemId: string, newPackSize: string) => void;
  onUpdateQuantity: (cartItemId: string, newQty: number) => void;
  onClearInquiry: () => void;
  onProceedToContact: () => void;
}

export const InquiryTrayModal: React.FC<InquiryTrayModalProps> = ({
  isOpen,
  onClose,
  inquiryItems,
  onRemoveItem,
  onUpdatePackSize,
  onUpdateQuantity,
  onClearInquiry,
  onProceedToContact
}) => {
  if (!isOpen) return null;

  const totalItemsCount = inquiryItems.reduce((acc, item) => acc + (item.quantity || 1), 0);

  const productListSummary = inquiryItems
    .map((item, idx) => 
      `${idx + 1}. *${item.product.name}* (${item.product.company})\n   • Weight / Pack Size: *${item.selectedPackSize}*\n   • Quantity: *${item.quantity} Unit(s)*`
    )
    .join('\n\n');

  const whatsAppQuoteUrl = `https://wa.me/923116666600?text=${encodeURIComponent(
    `Assalam-o-Alaikum Bukhari Agro (Pvt) Ltd,\nI would like to request an official wholesale quotation for the following ${inquiryItems.length} product(s) (${totalItemsCount} total units):\n\n${productListSummary}\n\nPlease confirm rates and delivery timeline to my farm.`
  )}`;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200">
        
        {/* Tray Header */}
        <div className="bg-[#0B3D1D] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="font-extrabold text-base">Quotation & Order List</h3>
              <div className="text-xs text-emerald-300">
                {inquiryItems.length} Product(s) • {totalItemsCount} Unit(s) Selected
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-emerald-900 text-emerald-200 hover:text-white transition-colors cursor-pointer"
            title="Close quotation tray"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tray Body */}
        <div className="p-5 flex-1 overflow-y-auto space-y-3">
          {inquiryItems.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
              <h4 className="font-bold text-slate-700 text-base">Your Quotation List is Empty</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                Browse our pesticide, herbicide, fungicide, and fertilizer catalog and click "Quote" to select specific weight/pack sizes.
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs text-slate-500">
                <span>Selected Formulations & Weights</span>
                <button
                  onClick={onClearInquiry}
                  className="text-red-600 hover:text-red-700 font-semibold cursor-pointer"
                >
                  Clear All
                </button>
              </div>

              {inquiryItems.map((item) => (
                <div
                  key={item.cartItemId}
                  className="p-3 rounded-xl border border-emerald-100 bg-[#F9FBF8] flex flex-col gap-2.5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 object-contain rounded-lg bg-white p-1 border border-emerald-50 shrink-0"
                      />
                      <div>
                        <div className="text-xs font-extrabold text-slate-900 line-clamp-1">{item.product.name}</div>
                        <div className="text-[10px] text-emerald-700 font-semibold">{item.product.company}</div>
                        <div className="text-[10px] text-slate-400">{item.product.categoryLabel}</div>
                      </div>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.cartItemId)}
                      className="p-1 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Weight / Pack Size Selector & Quantity Controls */}
                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-1 min-w-0">
                      <Package className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <label className="text-[10px] font-bold text-slate-600 shrink-0">Weight:</label>
                      <select
                        value={item.selectedPackSize}
                        onChange={(e) => onUpdatePackSize(item.cartItemId, e.target.value)}
                        className="text-xs font-bold text-emerald-900 bg-white border border-emerald-300 rounded-lg px-2 py-1 focus:ring-1 focus:ring-emerald-500 outline-hidden w-full cursor-pointer"
                      >
                        {item.product.packSizes && item.product.packSizes.length > 0 ? (
                          item.product.packSizes.map((size, sIdx) => (
                            <option key={sIdx} value={size}>
                              {size}
                            </option>
                          ))
                        ) : (
                          <option value="Standard">Standard Pack</option>
                        )}
                      </select>
                    </div>

                    {/* Quantity counter */}
                    <div className="flex items-center border border-slate-200 rounded-lg bg-white overflow-hidden shrink-0">
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.cartItemId, Math.max(1, item.quantity - 1))}
                        className="w-6 h-6 flex items-center justify-center text-slate-600 hover:bg-slate-100 font-bold text-xs transition-colors"
                        title="Decrease"
                      >
                        -
                      </button>
                      <span className="w-6 text-center text-xs font-bold text-slate-900">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.cartItemId, item.quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center text-slate-600 hover:bg-slate-100 font-bold text-xs transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Tray Footer Actions */}
        {inquiryItems.length > 0 && (
          <div className="p-5 bg-slate-50 border-t border-slate-100 space-y-3">
            <a
              href={whatsAppQuoteUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                submitOrderOrInquiry({
                  farmerName: 'WhatsApp Inquiry',
                  phone: '+92 311 6666600',
                  location: 'Punjab',
                  cropType: 'Multi-Product Inquiry',
                  message: `Quotation requested for:\n${productListSummary}`
                }, inquiryItems).catch(() => {});
              }}
              className="w-full inline-flex items-center justify-center gap-2 bg-[#1B5E20] hover:bg-[#154b1a] text-white font-bold py-3 px-4 rounded-xl text-xs transition-colors shadow-md cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-emerald-300" />
              <span>Send Quotation on WhatsApp (+92 311 6666600)</span>
            </a>

            <button
              onClick={() => {
                onClose();
                onProceedToContact();
              }}
              className="w-full inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-slate-800 font-bold py-2.5 px-4 rounded-xl text-xs border border-slate-200 transition-colors cursor-pointer"
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
