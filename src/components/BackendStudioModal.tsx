import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Save, 
  Plus, 
  Trash2, 
  Edit3, 
  Image as ImageIcon, 
  Check, 
  Upload, 
  ShieldCheck, 
  RefreshCw, 
  Layers, 
  Package, 
  Tag, 
  Sliders, 
  Eye, 
  EyeOff, 
  Building2, 
  ArrowUpRight,
  AlertCircle,
  LogOut
} from 'lucide-react';
import { Product, PartnerBrand, SiteSettings, HeaderNavButton, ProductCategory } from '../types';
import { MediaLibraryModal } from './MediaLibraryModal';

interface BackendStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  siteSettings: SiteSettings;
  products: Product[];
  brands: PartnerBrand[];
  onSettingsUpdated: (newSettings: SiteSettings) => void;
  onProductsUpdated: (newProducts: Product[]) => void;
  onBrandsUpdated: (newBrands: PartnerBrand[]) => void;
  initialTab?: 'header' | 'products' | 'brands' | 'images';
  editingProductId?: string | null;
  onLogout?: () => void;
}

export const BackendStudioModal: React.FC<BackendStudioModalProps> = ({
  isOpen,
  onClose,
  siteSettings,
  products,
  brands,
  onSettingsUpdated,
  onProductsUpdated,
  onBrandsUpdated,
  initialTab = 'header',
  editingProductId = null,
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState<'header' | 'products' | 'brands' | 'images'>(initialTab);
  const [saving, setSaving] = useState(false);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<string | null>(null);

  // --- Header & Logo State ---
  const [headerSettings, setHeaderSettings] = useState<SiteSettings>(siteSettings);

  // --- Product Editing State ---
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isNewProduct, setIsNewProduct] = useState(false);

  // --- Brand Editing State ---
  const [editingBrand, setEditingBrand] = useState<Partial<PartnerBrand> | null>(null);
  const [isNewBrand, setIsNewBrand] = useState(false);

  // --- Image Upload & WordPress Media Integration State ---
  const [uploadedImages, setUploadedImages] = useState<Array<{ filename: string; url: string }>>([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [mediaTarget, setMediaTarget] = useState<'logo' | 'product' | 'brand' | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync initial tab and siteSettings when props change
  useEffect(() => {
    if (initialTab) setActiveTab(initialTab);
    setHeaderSettings(siteSettings);
  }, [initialTab, siteSettings, isOpen]);

  useEffect(() => {
    if (editingProductId) {
      const prod = products.find(p => p.id === editingProductId);
      if (prod) {
        setEditingProduct(prod);
        setActiveTab('products');
        setIsNewProduct(false);
      }
    }
  }, [editingProductId, products]);

  const handleMediaSelect = (imageUrl: string) => {
    if (mediaTarget === 'logo') {
      setHeaderSettings(prev => ({
        ...prev,
        logo: {
          ...prev.logo,
          type: 'image',
          imageUrl: imageUrl
        }
      }));
    } else if (mediaTarget === 'product' && editingProduct) {
      setEditingProduct(prev => prev ? ({ ...prev, imageUrl }) : null);
    } else if (mediaTarget === 'brand' && editingBrand) {
      setEditingBrand(prev => prev ? ({ ...prev, logoUrl: imageUrl }) : null);
    }
    setIsMediaModalOpen(false);
    setMediaTarget(null);
  };

  // Fetch images list
  const loadImages = async () => {
    try {
      const res = await fetch('/api/images');
      if (res.ok) {
        const json = await res.json();
        if (json.images) setUploadedImages(json.images);
      }
    } catch (err) {
      console.error("Failed to load images", err);
    }
  };

  React.useEffect(() => {
    if (isOpen) {
      setHeaderSettings(siteSettings);
      loadImages();
    }
  }, [isOpen, siteSettings]);

  if (!isOpen) return null;

  const showNotification = (msg: string) => {
    setSaveSuccessNotice(msg);
    setTimeout(() => setSaveSuccessNotice(null), 3500);
  };

  // 1. SAVE HEADER & SITE SETTINGS TO BACKEND
  const handleSaveHeaderSettings = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/site-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(headerSettings)
      });
      if (res.ok) {
        const json = await res.json();
        onSettingsUpdated(json.data);
        showNotification("Header & Site Settings saved to backend successfully!");
      }
    } catch (err) {
      console.error("Save failed:", err);
      alert("Failed to save settings to backend.");
    } finally {
      setSaving(false);
    }
  };

  // 2. PRODUCT ACTIONS
  const handleSaveProduct = async () => {
    if (!editingProduct || !editingProduct.name || !editingProduct.category) {
      alert("Please fill in at least the product name and category.");
      return;
    }
    setSaving(true);
    try {
      if (isNewProduct) {
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingProduct)
        });
        if (res.ok) {
          const json = await res.json();
          onProductsUpdated([json.data, ...products]);
          setEditingProduct(null);
          setIsNewProduct(false);
          showNotification(`New product "${json.data.name}" added and saved to backend!`);
        }
      } else {
        const res = await fetch(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingProduct)
        });
        if (res.ok) {
          const json = await res.json();
          onProductsUpdated(products.map(p => p.id === json.data.id ? json.data : p));
          setEditingProduct(null);
          showNotification(`Product "${json.data.name}" updated successfully on backend!`);
        }
      }
    } catch (err) {
      console.error("Product save failed:", err);
      alert("Failed to save product.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete product "${name}" from backend storage?`)) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        onProductsUpdated(products.filter(p => p.id !== id));
        if (editingProduct?.id === id) setEditingProduct(null);
        showNotification(`Product "${name}" deleted from backend.`);
      }
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete product.");
    } finally {
      setSaving(false);
    }
  };

  // 3. BRAND ACTIONS
  const handleSaveBrand = async () => {
    if (!editingBrand || !editingBrand.name) {
      alert("Please specify a brand name.");
      return;
    }
    setSaving(true);
    try {
      if (isNewBrand) {
        const res = await fetch('/api/partners', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingBrand)
        });
        if (res.ok) {
          const json = await res.json();
          onBrandsUpdated([...brands, json.data]);
          setEditingBrand(null);
          setIsNewBrand(false);
          showNotification(`Brand "${json.data.name}" added and saved to backend!`);
        }
      } else {
        const res = await fetch(`/api/partners/${editingBrand.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingBrand)
        });
        if (res.ok) {
          const json = await res.json();
          onBrandsUpdated(brands.map(b => b.id === json.data.id ? json.data : b));
          setEditingBrand(null);
          showNotification(`Brand "${json.data.name}" updated successfully!`);
        }
      }
    } catch (err) {
      console.error("Brand save failed:", err);
      alert("Failed to save brand.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteBrand = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete brand "${name}" from backend storage?`)) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/partners/${id}`, { method: 'DELETE' });
      if (res.ok) {
        onBrandsUpdated(brands.filter(b => b.id !== id));
        if (editingBrand?.id === id) setEditingBrand(null);
        showNotification(`Brand "${name}" removed from backend.`);
      }
    } catch (err) {
      console.error("Delete brand failed:", err);
      alert("Failed to delete brand.");
    } finally {
      setSaving(false);
    }
  };

  // 4. IMAGE UPLOAD HANDLER
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const reader = new FileReader();
    reader.onload = async (uploadEvent) => {
      const base64Data = uploadEvent.target?.result as string;
      try {
        const res = await fetch('/api/upload-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            base64Data,
            filename: file.name.replace(/\.[^/.]+$/, ''),
            prefix: 'asset'
          })
        });
        if (res.ok) {
          const json = await res.json();
          showNotification(`Image "${json.filename}" uploaded successfully to ${json.url}!`);
          loadImages();
        }
      } catch (err) {
        console.error("Upload failed:", err);
        alert("Failed to upload image.");
      } finally {
        setUploadingImage(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-5xl w-full shadow-2xl border border-emerald-200 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-150">
        
        {/* Studio Modal Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center font-black text-white text-sm shadow-md">
              BA
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-extrabold tracking-tight text-white">
                  Bukhari Agro Studio Backend Hub
                </h2>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Direct Disk Persistence
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Manage Header buttons, logo, product pricing & details, and agro brands directly on the backend.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onLogout && (
              <button
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="text-slate-400 hover:text-rose-300 text-xs font-semibold px-3 py-1.5 rounded-xl hover:bg-rose-950/40 border border-slate-800 hover:border-rose-900 transition-colors flex items-center gap-1.5"
                title="Log out and lock the Studio"
                id="studio-logout-btn"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Log Out</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors"
              title="Close Backend Studio"
              id="close-studio-btn"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Success Toast Notice */}
        {saveSuccessNotice && (
          <div className="bg-emerald-600 text-white px-6 py-2.5 text-xs sm:text-sm font-semibold flex items-center justify-between shrink-0 animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>{saveSuccessNotice}</span>
            </div>
            <button onClick={() => setSaveSuccessNotice(null)} className="text-emerald-100 hover:text-white">✕</button>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="bg-slate-100 px-6 pt-3 flex items-center gap-2 border-b border-slate-200 shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('header')}
            className={`px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'header'
                ? 'bg-white text-emerald-800 shadow-xs border-t-2 border-emerald-600'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Header & Logo Setup</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'products'
                ? 'bg-white text-emerald-800 shadow-xs border-t-2 border-emerald-600'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Products & Prices ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('brands')}
            className={`px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'brands'
                ? 'bg-white text-emerald-800 shadow-xs border-t-2 border-emerald-600'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Agro Brands ({brands.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('images')}
            className={`px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'images'
                ? 'bg-white text-emerald-800 shadow-xs border-t-2 border-emerald-600'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Image Assets</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
          
          {/* TAB 1: HEADER & LOGO CONFIGURATION */}
          {activeTab === 'header' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              
              {/* Logo Settings Card */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                      <ImageIcon className="w-5 h-5 text-emerald-600" />
                      <span>Header Logo Customization</span>
                    </h3>
                    <p className="text-xs text-slate-500">
                      Switch between the official SVG Bukhari Agro Logo or provide an uploaded image URL.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Logo Format Type
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setHeaderSettings({
                          ...headerSettings,
                          logo: { ...headerSettings.logo, type: 'svg' }
                        })}
                        className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                          headerSettings.logo.type === 'svg'
                            ? 'bg-emerald-50 border-emerald-600 text-emerald-900 shadow-xs'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        Official SVG Brand Logo
                      </button>

                      <button
                        type="button"
                        onClick={() => setHeaderSettings({
                          ...headerSettings,
                          logo: { ...headerSettings.logo, type: 'image' }
                        })}
                        className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                          headerSettings.logo.type === 'image'
                            ? 'bg-emerald-50 border-emerald-600 text-emerald-900 shadow-xs'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        Custom Image URL
                      </button>
                    </div>

                    {headerSettings.logo.type === 'image' && (
                      <div className="mt-4 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2.5">
                        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                          Custom Logo Image (WordPress Media Integration)
                        </label>
                        <div className="flex items-center gap-3">
                          <div className="h-14 w-28 rounded-xl bg-white border border-slate-300 p-1.5 flex items-center justify-center shrink-0 overflow-hidden shadow-xs">
                            {headerSettings.logo.imageUrl ? (
                              <img
                                src={headerSettings.logo.imageUrl}
                                alt="Logo Preview"
                                referrerPolicy="no-referrer"
                                className="max-h-full max-w-full object-contain"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = '/images/hero-sprout.jpg';
                                }}
                              />
                            ) : (
                              <span className="text-[10px] text-slate-400 font-medium">No Logo Image</span>
                            )}
                          </div>

                          <div className="flex-1 space-y-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                setMediaTarget('logo');
                                setIsMediaModalOpen(true);
                              }}
                              className="px-3.5 py-1.5 bg-[#2271b1] hover:bg-[#135e96] text-white text-xs font-bold rounded-xl transition-colors shadow-xs flex items-center gap-1.5"
                            >
                              <ImageIcon className="w-3.5 h-3.5" />
                              <span>Select or Upload Logo</span>
                            </button>
                            <input
                              type="text"
                              value={headerSettings.logo.imageUrl || ''}
                              onChange={(e) => setHeaderSettings({
                                ...headerSettings,
                                logo: { ...headerSettings.logo, imageUrl: e.target.value }
                              })}
                              placeholder="/images/custom-logo.png or https://..."
                              className="w-full text-xs p-2 rounded-xl border border-slate-300 bg-white"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Displayed Company Title & Tagline
                    </label>
                    <input
                      type="text"
                      value={headerSettings.logo.companyName}
                      onChange={(e) => setHeaderSettings({
                        ...headerSettings,
                        logo: { ...headerSettings.logo, companyName: e.target.value }
                      })}
                      placeholder="Bukhari Agro (Pvt) Ltd"
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 mb-2 focus:border-emerald-600"
                    />
                    <input
                      type="text"
                      value={headerSettings.logo.tagline}
                      onChange={(e) => setHeaderSettings({
                        ...headerSettings,
                        logo: { ...headerSettings.logo, tagline: e.target.value }
                      })}
                      placeholder="Healthy Crops, Brighter Future"
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:border-emerald-600"
                    />
                  </div>
                </div>
              </div>

              {/* Navigation Buttons Card */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                      <Sliders className="w-5 h-5 text-emerald-600" />
                      <span>Header Navigation Buttons</span>
                    </h3>
                    <p className="text-xs text-slate-500">
                      Toggle, rename, or reorder the buttons displayed in the website header.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {headerSettings.headerButtons.map((btn, index) => (
                    <div 
                      key={btn.id}
                      className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-slate-400 w-5">#{index + 1}</span>
                        <input
                          type="text"
                          value={btn.label}
                          onChange={(e) => {
                            const updated = [...headerSettings.headerButtons];
                            updated[index].label = e.target.value;
                            setHeaderSettings({ ...headerSettings, headerButtons: updated });
                          }}
                          className="text-xs font-bold p-1.5 rounded-lg border border-slate-300 bg-white"
                        />
                        <span className="text-xs text-slate-500">
                          Target: <code className="bg-slate-200 px-1 py-0.5 rounded text-[11px]">{btn.targetTab}</code>
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...headerSettings.headerButtons];
                            updated[index].visible = !updated[index].visible;
                            setHeaderSettings({ ...headerSettings, headerButtons: updated });
                          }}
                          className={`p-1.5 rounded-lg text-xs font-bold inline-flex items-center gap-1 border transition-colors ${
                            btn.visible
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-slate-200 text-slate-500 border-slate-300'
                          }`}
                        >
                          {btn.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                          <span>{btn.visible ? 'Visible' : 'Hidden'}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Bar Contacts & CTA Button Card */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
                <h3 className="text-base font-extrabold text-slate-900 mb-3 border-b border-slate-100 pb-2">
                  Top Utility Bar & Header CTA Button
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Helpline Phone</label>
                    <input
                      type="text"
                      value={headerSettings.helplinePhone}
                      onChange={(e) => setHeaderSettings({ ...headerSettings, helplinePhone: e.target.value })}
                      className="w-full text-xs p-2 rounded-lg border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email</label>
                    <input
                      type="text"
                      value={headerSettings.email}
                      onChange={(e) => setHeaderSettings({ ...headerSettings, email: e.target.value })}
                      className="w-full text-xs p-2 rounded-lg border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">CTA Button Text</label>
                    <input
                      type="text"
                      value={headerSettings.ctaButtonText}
                      onChange={(e) => setHeaderSettings({ ...headerSettings, ctaButtonText: e.target.value })}
                      className="w-full text-xs p-2 rounded-lg border border-slate-300"
                    />
                  </div>
                </div>
              </div>

              {/* Action Save Button */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveHeaderSettings}
                  disabled={saving}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-6 py-3 rounded-full text-sm inline-flex items-center gap-2 shadow-lg transition-transform hover:scale-105"
                  id="save-header-backend-btn"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Saving to Backend...' : 'Save Header Changes to Backend'}</span>
                </button>
              </div>

            </div>
          )}

          {/* TAB 2: PRODUCTS & PRICING MANAGEMENT */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              
              {/* Product Edit / Add Form Drawer */}
              {editingProduct ? (
                <div className="bg-white rounded-2xl p-6 border-2 border-emerald-500 shadow-md animate-in fade-in duration-150">
                  <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                    <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                      <Edit3 className="w-5 h-5 text-emerald-600" />
                      <span>{isNewProduct ? 'Add New Product to Backend' : `Edit: ${editingProduct.name}`}</span>
                    </h3>
                    <button
                      onClick={() => setEditingProduct(null)}
                      className="text-slate-400 hover:text-slate-700 text-xs font-bold px-3 py-1 bg-slate-100 rounded-lg"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Product Name *</label>
                      <input
                        type="text"
                        value={editingProduct.name || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                        placeholder="e.g. Broad Spectrum Pesticide"
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:border-emerald-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Brand Name</label>
                      <input
                        type="text"
                        value={editingProduct.brandName || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, brandName: e.target.value })}
                        placeholder="e.g. AgroShield Pro 5% EC"
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Manufacturer / Agro Brand</label>
                      <input
                        type="text"
                        value={editingProduct.company || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, company: e.target.value })}
                        placeholder="e.g. Bayer Crop Science / Bukhari Agro"
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-emerald-800 uppercase mb-1">Price (PKR) *</label>
                      <input
                        type="text"
                        value={editingProduct.price || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                        placeholder="e.g. PKR 3,450"
                        className="w-full text-xs p-2.5 rounded-xl border-2 border-emerald-500 font-bold text-emerald-950"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Original Price (Strikeout)</label>
                      <input
                        type="text"
                        value={editingProduct.originalPrice || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, originalPrice: e.target.value })}
                        placeholder="e.g. PKR 3,800"
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Category *</label>
                      <select
                        value={editingProduct.category || 'pesticides'}
                        onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value as ProductCategory })}
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                      >
                        <option value="pesticides">Pesticides</option>
                        <option value="fertilizers">Fertilizers</option>
                        <option value="herbicides">Herbicides</option>
                        <option value="fungicides">Fungicides</option>
                        <option value="growth-regulators">Plant Growth Regulators</option>
                        <option value="micronutrients">Micronutrients</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2 bg-slate-100/80 p-4 rounded-2xl border border-slate-200">
                      <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                        Product Image (WordPress Media Integration)
                      </label>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <div className="w-20 h-20 rounded-xl bg-white border border-slate-300 p-1 flex items-center justify-center shrink-0 overflow-hidden shadow-xs">
                          <img
                            src={editingProduct.imageUrl || '/images/pesticide-bottle.jpg'}
                            alt="Product preview"
                            referrerPolicy="no-referrer"
                            className="max-h-full max-w-full object-contain"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/images/pesticide-bottle.jpg';
                            }}
                          />
                        </div>

                        <div className="flex-1 w-full space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setMediaTarget('product');
                                setIsMediaModalOpen(true);
                              }}
                              className="px-4 py-2 bg-[#2271b1] hover:bg-[#135e96] text-white text-xs font-bold rounded-xl transition-colors shadow-xs flex items-center gap-1.5"
                            >
                              <ImageIcon className="w-4 h-4" />
                              <span>Select or Upload Image (Media Library)</span>
                            </button>

                            {editingProduct.imageUrl && (
                              <button
                                type="button"
                                onClick={() => setEditingProduct({ ...editingProduct, imageUrl: '' })}
                                className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-medium rounded-xl transition-colors"
                              >
                                Clear
                              </button>
                            )}
                          </div>

                          <input
                            type="text"
                            value={editingProduct.imageUrl || ''}
                            onChange={(e) => setEditingProduct({ ...editingProduct, imageUrl: e.target.value })}
                            placeholder="/images/pesticide-bottle.jpg or https://..."
                            className="w-full text-xs p-2 rounded-xl border border-slate-300 bg-white"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Tagline / Short Hook</label>
                      <input
                        type="text"
                        value={editingProduct.tagline || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, tagline: e.target.value })}
                        placeholder="e.g. Fast contact knock-down"
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Active Ingredient</label>
                      <input
                        type="text"
                        value={editingProduct.activeIngredient || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, activeIngredient: e.target.value })}
                        placeholder="e.g. Emamectin Benzoate 1.9%"
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Formulation</label>
                      <input
                        type="text"
                        value={editingProduct.formulation || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, formulation: e.target.value })}
                        placeholder="e.g. Emulsifiable Concentrate (EC)"
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Recommended Dosage</label>
                      <input
                        type="text"
                        value={editingProduct.dosage || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, dosage: e.target.value })}
                        placeholder="e.g. 250-400 ml per acre"
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingProduct.featured || false}
                        onChange={(e) => setEditingProduct({ ...editingProduct, featured: e.target.checked })}
                        className="rounded text-emerald-600"
                      />
                      <span>Feature on Homepage 4-card showcase</span>
                    </label>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingProduct(null)}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveProduct}
                        disabled={saving}
                        className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 inline-flex items-center gap-1.5 shadow-md"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save Product to Backend</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200">
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">Current Agrochemical Catalogue</h3>
                    <p className="text-xs text-slate-500">Edit prices, formulations, agro brands, or delete old products.</p>
                  </div>
                  <button
                    onClick={() => {
                      setIsNewProduct(true);
                      setEditingProduct({
                        name: '',
                        brandName: '',
                        company: 'Bukhari Agro',
                        category: 'pesticides',
                        price: 'PKR 2,800',
                        originalPrice: 'PKR 3,100',
                        tagline: 'Effective crop care formulation',
                        imageUrl: '/images/pesticide-bottle.jpg',
                        featured: false,
                        inStock: true
                      });
                    }}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2 rounded-xl inline-flex items-center gap-1.5 shadow-xs"
                    id="btn-add-product"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Product</span>
                  </button>
                </div>
              )}

              {/* Products Table */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-100 text-slate-900 uppercase font-bold text-[11px] border-b border-slate-200">
                    <tr>
                      <th className="p-3">Product</th>
                      <th className="p-3">Company / Brand</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Price</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.imageUrl}
                              alt={p.name}
                              className="w-10 h-10 object-contain rounded-lg bg-slate-50 border border-slate-200 p-1"
                            />
                            <div>
                              <div className="font-bold text-slate-900">{p.name}</div>
                              <div className="text-[11px] text-slate-400">{p.brandName}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 font-medium text-slate-800">
                          {p.company}
                        </td>
                        <td className="p-3">
                          <span className="capitalize px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-medium text-[11px]">
                            {p.category}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className="font-bold text-emerald-800">{p.price || 'PKR 2,500'}</span>
                          {p.originalPrice && (
                            <span className="text-[10px] text-slate-400 line-through ml-1.5">{p.originalPrice}</span>
                          )}
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setIsNewProduct(false);
                                setEditingProduct(p);
                              }}
                              className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-emerald-50"
                              title="Edit product"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id, p.name)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                              title="Delete product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* TAB 3: AGRO BRANDS (PARTNERS) MANAGEMENT */}
          {activeTab === 'brands' && (
            <div className="space-y-6">
              
              {/* Add / Edit Brand Form */}
              {editingBrand ? (
                <div className="bg-white rounded-2xl p-6 border-2 border-emerald-500 shadow-md">
                  <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                    <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-emerald-600" />
                      <span>{isNewBrand ? 'Register New Agro Brand' : `Edit: ${editingBrand.name}`}</span>
                    </h3>
                    <button
                      onClick={() => setEditingBrand(null)}
                      className="text-slate-400 hover:text-slate-700 text-xs font-bold px-3 py-1 bg-slate-100 rounded-lg"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Brand / Company Name *</label>
                      <input
                        type="text"
                        value={editingBrand.name || ''}
                        onChange={(e) => setEditingBrand({ ...editingBrand, name: e.target.value })}
                        placeholder="e.g. FMC Corporation"
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Country / Origin</label>
                      <input
                        type="text"
                        value={editingBrand.country || ''}
                        onChange={(e) => setEditingBrand({ ...editingBrand, country: e.target.value })}
                        placeholder="e.g. USA / Global or Pakistan"
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Partnership Tier</label>
                      <input
                        type="text"
                        value={editingBrand.tier || ''}
                        onChange={(e) => setEditingBrand({ ...editingBrand, tier: e.target.value })}
                        placeholder="e.g. Authorized Distribution Partner"
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Badge / Key Specialty</label>
                      <input
                        type="text"
                        value={editingBrand.badge || ''}
                        onChange={(e) => setEditingBrand({ ...editingBrand, badge: e.target.value })}
                        placeholder="e.g. Advanced Insect Protection"
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Description</label>
                      <textarea
                        rows={2}
                        value={editingBrand.description || ''}
                        onChange={(e) => setEditingBrand({ ...editingBrand, description: e.target.value })}
                        placeholder="Specialized crop protection chemistry..."
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Official Website URL (Optional)</label>
                      <input
                        type="text"
                        value={editingBrand.website || ''}
                        onChange={(e) => setEditingBrand({ ...editingBrand, website: e.target.value })}
                        placeholder="https://www.example.com"
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                      />
                    </div>

                    <div className="sm:col-span-2 bg-slate-100/80 p-4 rounded-2xl border border-slate-200">
                      <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                        Brand Logo Image (WordPress Media Integration)
                      </label>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <div className="w-24 h-16 rounded-xl bg-white border border-slate-300 p-1.5 flex items-center justify-center shrink-0 overflow-hidden shadow-xs">
                          {editingBrand.logoUrl ? (
                            <img
                              src={editingBrand.logoUrl}
                              alt="Brand preview"
                              referrerPolicy="no-referrer"
                              className="max-h-full max-w-full object-contain"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <span className="text-[10px] text-slate-400 font-medium">No Logo</span>
                          )}
                        </div>

                        <div className="flex-1 w-full space-y-2">
                          <button
                            type="button"
                            onClick={() => {
                              setMediaTarget('brand');
                              setIsMediaModalOpen(true);
                            }}
                            className="px-4 py-2 bg-[#2271b1] hover:bg-[#135e96] text-white text-xs font-bold rounded-xl transition-colors shadow-xs flex items-center gap-1.5"
                          >
                            <ImageIcon className="w-4 h-4" />
                            <span>Select or Upload Brand Logo</span>
                          </button>

                          <input
                            type="text"
                            value={editingBrand.logoUrl || ''}
                            onChange={(e) => setEditingBrand({ ...editingBrand, logoUrl: e.target.value })}
                            placeholder="/images/brand-logo.png or https://..."
                            className="w-full text-xs p-2 rounded-xl border border-slate-300 bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => setEditingBrand(null)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveBrand}
                      disabled={saving}
                      className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 inline-flex items-center gap-1.5 shadow-md"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Brand to Backend</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200">
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">Partner Agro Brands & Multinationals</h3>
                    <p className="text-xs text-slate-500">Add new partner brands or delete legacy companies.</p>
                  </div>
                  <button
                    onClick={() => {
                      setIsNewBrand(true);
                      setEditingBrand({
                        name: '',
                        country: 'Pakistan',
                        tier: 'Authorized Partner',
                        badge: 'Certified Agri Formulations',
                        description: 'High-efficacy plant protection formulations.'
                      });
                    }}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2 rounded-xl inline-flex items-center gap-1.5 shadow-xs"
                    id="btn-add-brand"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Brand</span>
                  </button>
                </div>
              )}

              {/* Brands Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {brands.map((b) => (
                  <div 
                    key={b.id}
                    className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-start justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-slate-900 text-sm">{b.name}</h4>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-100">
                          {b.country}
                        </span>
                      </div>
                      <div className="text-xs text-emerald-700 font-semibold mt-0.5">{b.tier}</div>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{b.description}</p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => {
                          setIsNewBrand(false);
                          setEditingBrand(b);
                        }}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-emerald-50"
                        title="Edit brand"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteBrand(b.id, b.name)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                        title="Delete brand"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 4: IMAGE ASSETS & UPLOADER */}
          {activeTab === 'images' && (
            <div className="space-y-6">
              
              {/* Uploader Card */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
                <h3 className="text-sm font-extrabold text-slate-900 mb-2">Upload New Image Asset</h3>
                <p className="text-xs text-slate-500 mb-4">
                  Upload logos, product pictures, or banners. They are saved to <code className="bg-slate-100 px-1 py-0.5 rounded text-emerald-800">public/images/</code> on the backend and become instantly usable.
                </p>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />

                <button
                  type="button"
                  disabled={uploadingImage}
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-8 border-2 border-dashed border-emerald-300 rounded-2xl bg-emerald-50/50 hover:bg-emerald-50 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Upload className="w-8 h-8 text-emerald-600 animate-bounce" />
                  <span className="text-xs font-bold text-emerald-950">
                    {uploadingImage ? 'Uploading and persisting image to backend...' : 'Click or Drag to Upload Image File'}
                  </span>
                  <span className="text-[11px] text-slate-400">Supports PNG, JPG, WEBP, SVG</span>
                </button>
              </div>

              {/* Existing Images Gallery */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-extrabold text-slate-900">Stored Image Assets ({uploadedImages.length})</h3>
                  <button
                    onClick={loadImages}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-900 inline-flex items-center gap-1"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Refresh</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {uploadedImages.map((img, i) => (
                    <div key={i} className="group relative rounded-xl border border-slate-200 overflow-hidden bg-slate-50 p-2 text-center">
                      <div className="h-28 flex items-center justify-center overflow-hidden mb-2">
                        <img
                          src={img.url}
                          alt={img.filename}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <div className="text-[11px] font-mono text-slate-700 truncate px-1" title={img.filename}>
                        {img.filename}
                      </div>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(img.url);
                          showNotification(`Copied path "${img.url}" to clipboard!`);
                        }}
                        className="mt-1 w-full text-[10px] font-bold py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 rounded-md transition-colors"
                      >
                        Copy Path
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-100 px-6 py-3.5 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>All modifications are safely committed directly into backend storage (<code className="text-slate-700 font-mono">backendDb.json</code>).</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full font-bold bg-slate-800 text-white hover:bg-slate-900 transition-colors"
          >
            Done / Close Hub
          </button>
        </div>

      </div>

      {/* WordPress Media Library Modal Integration */}
      <MediaLibraryModal
        isOpen={isMediaModalOpen}
        onClose={() => {
          setIsMediaModalOpen(false);
          setMediaTarget(null);
        }}
        onSelectImage={handleMediaSelect}
        title={
          mediaTarget === 'logo'
            ? "WordPress Media: Select or Upload Logo"
            : mediaTarget === 'product'
            ? "WordPress Media: Select or Upload Product Image"
            : "WordPress Media: Select or Upload Brand Logo"
        }
        currentImageUrl={
          mediaTarget === 'logo'
            ? headerSettings.logo.imageUrl
            : mediaTarget === 'product'
            ? editingProduct?.imageUrl
            : editingBrand?.logoUrl
        }
      />
    </div>
  );
};
