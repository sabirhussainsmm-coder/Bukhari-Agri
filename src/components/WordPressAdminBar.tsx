import React, { useState } from 'react';
import { 
  Sliders, 
  Plus, 
  Image as ImageIcon, 
  LogOut, 
  Lock, 
  Layout, 
  Package, 
  Building2,
  ChevronDown,
  Sparkles
} from 'lucide-react';

interface WordPressAdminBarProps {
  isAuthenticated: boolean;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenStudioTab: (tab: 'header' | 'products' | 'brands' | 'images') => void;
  onOpenMediaLibrary: () => void;
  onAddNewProduct: () => void;
}

export const WordPressAdminBar: React.FC<WordPressAdminBarProps> = ({
  isAuthenticated,
  onOpenAuth,
  onLogout,
  onOpenStudioTab,
  onOpenMediaLibrary,
  onAddNewProduct
}) => {
  const [newDropdownOpen, setNewDropdownOpen] = useState(false);

  // If not logged in, show small top bar badge or helper
  if (!isAuthenticated) {
    return (
      <div className="bg-[#101517] text-slate-400 text-[11px] py-1 px-4 sm:px-8 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-full bg-[#2271b1] text-white flex items-center justify-center font-bold text-[9px]">
            W
          </span>
          <span className="hidden sm:inline font-medium text-slate-300">
            Bukhari Agro Management System
          </span>
        </div>

        <button
          onClick={onOpenAuth}
          className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-semibold transition-colors px-2 py-0.5 rounded hover:bg-slate-800"
          id="wp-topbar-login-trigger"
        >
          <Lock className="w-3 h-3" />
          <span>Admin Login</span>
        </button>
      </div>
    );
  }

  // Classic WordPress Top Admin Bar (When Logged in with password 7467)
  return (
    <div className="bg-[#1d2327] text-[#c3c4c7] text-xs font-sans border-b border-[#2c3338] sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-8">
        
        {/* Left Links */}
        <div className="flex items-center space-x-1 sm:space-x-3">
          
          {/* WordPress Logo / Site Name */}
          <div className="flex items-center gap-1.5 px-2 py-1 text-white hover:bg-[#2271b1] rounded transition-colors cursor-pointer"
               onClick={() => onOpenStudioTab('header')}>
            <span className="w-4 h-4 rounded-full bg-[#2271b1] text-white flex items-center justify-center font-bold text-[9px] border border-white/30">
              W
            </span>
            <span className="font-semibold text-white hidden sm:inline">Bukhari Agro</span>
          </div>

          {/* Customize Button */}
          <button
            onClick={() => onOpenStudioTab('header')}
            className="flex items-center gap-1 px-2 py-1 hover:text-white hover:bg-[#2c3338] rounded transition-colors font-medium"
            id="wp-admin-customize-btn"
            title="Customize Header, Logo & Settings"
          >
            <Sliders className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline">Customize</span>
          </button>

          {/* Media Library */}
          <button
            onClick={onOpenMediaLibrary}
            className="flex items-center gap-1 px-2 py-1 hover:text-white hover:bg-[#2c3338] rounded transition-colors font-medium text-emerald-300"
            id="wp-admin-media-btn"
            title="Open WordPress Media Library to change or upload images"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Media Library</span>
          </button>

          {/* Edit Products & Pricing */}
          <button
            onClick={() => onOpenStudioTab('products')}
            className="hidden sm:flex items-center gap-1 px-2 py-1 hover:text-white hover:bg-[#2c3338] rounded transition-colors font-medium"
            id="wp-admin-products-btn"
          >
            <Package className="w-3.5 h-3.5 text-amber-400" />
            <span>Edit Products</span>
          </button>

          {/* Edit Brands */}
          <button
            onClick={() => onOpenStudioTab('brands')}
            className="hidden lg:flex items-center gap-1 px-2 py-1 hover:text-white hover:bg-[#2c3338] rounded transition-colors font-medium"
            id="wp-admin-brands-btn"
          >
            <Building2 className="w-3.5 h-3.5 text-sky-400" />
            <span>Agro Brands</span>
          </button>

          {/* + New Dropdown */}
          <div className="relative">
            <button
              onClick={() => setNewDropdownOpen(!newDropdownOpen)}
              className="flex items-center gap-1 px-2 py-1 hover:text-white hover:bg-[#2c3338] rounded transition-colors font-medium text-white"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">New</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {newDropdownOpen && (
              <div 
                className="absolute left-0 mt-1 w-44 bg-[#2c3338] text-slate-200 rounded-md shadow-xl border border-slate-700 py-1 z-50 text-xs"
                onMouseLeave={() => setNewDropdownOpen(false)}
              >
                <button
                  onClick={() => {
                    setNewDropdownOpen(false);
                    onAddNewProduct();
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#2271b1] hover:text-white flex items-center gap-2"
                >
                  <Package className="w-3.5 h-3.5" />
                  <span>Product / Price</span>
                </button>
                <button
                  onClick={() => {
                    setNewDropdownOpen(false);
                    onOpenStudioTab('brands');
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#2271b1] hover:text-white flex items-center gap-2"
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Agro Brand</span>
                </button>
                <button
                  onClick={() => {
                    setNewDropdownOpen(false);
                    onOpenMediaLibrary();
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#2271b1] hover:text-white flex items-center gap-2 border-t border-slate-700 mt-1 pt-1.5"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Upload Image</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right User & Logout Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Admin Active</span>
          </span>

          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-2.5 py-1 text-slate-300 hover:text-rose-300 hover:bg-rose-950/60 rounded transition-colors text-[11px] font-semibold"
            id="wp-admin-logout-btn"
            title="Lock admin session"
          >
            <LogOut className="w-3 h-3" />
            <span>Log Out</span>
          </button>
        </div>

      </div>
    </div>
  );
};
