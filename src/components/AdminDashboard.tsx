import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Layers, 
  ShoppingCart, 
  FileText, 
  Image as ImageIcon, 
  Settings, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Upload, 
  RefreshCw, 
  Phone, 
  MessageSquare, 
  Check, 
  X, 
  LogOut, 
  DollarSign, 
  BarChart3, 
  Database,
  Eye,
  Users
} from 'lucide-react';
import { Product, AdminOrder, CustomPage, CategoryRecord, SiteSettings, TeamMember } from '../types';
import { 
  fetchProductsFromDb, 
  saveProductToDb, 
  deleteProductFromDb,
  fetchCategoriesFromDb,
  saveCategoryToDb,
  deleteCategoryFromDb,
  fetchOrdersFromDb,
  updateOrderStatusInDb,
  fetchCustomPagesFromDb,
  saveCustomPageToDb,
  deleteCustomPageFromDb,
  uploadMediaToSupabase,
  listMediaFromSupabase,
  saveSiteSettingsToDb,
  fetchTeamFromDb
} from '../services/supabaseService';
import { getSupabaseCredentials, resetSupabaseClient, testSupabaseConnection } from '../lib/supabase';
import { AdminTeamManager } from './AdminTeamManager';
import { AdminPagesEditor } from './AdminPagesEditor';

interface AdminDashboardProps {
  onClose: () => void;
  siteSettings: SiteSettings;
  onSiteSettingsUpdated: (newSettings: SiteSettings) => void;
  onProductsUpdated?: (products: Product[]) => void;
  teamMembers?: TeamMember[];
  onTeamUpdated?: (team: TeamMember[]) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onClose,
  siteSettings,
  onSiteSettingsUpdated,
  onProductsUpdated,
  teamMembers = [],
  onTeamUpdated
}) => {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'categories' | 'orders' | 'pages' | 'team' | 'media' | 'supabase'>('dashboard');

  // Connection status
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [connectionMessage, setConnectionMessage] = useState<string>('');
  const [testingConnection, setTestingConnection] = useState(false);

  // Credentials config
  const [supabaseUrl, setSupabaseUrl] = useState(() => getSupabaseCredentials().url);
  const [supabaseAnonKey, setSupabaseAnonKey] = useState(() => getSupabaseCredentials().anonKey);
  const [copiedSql, setCopiedSql] = useState(false);

  // Data states
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryRecord[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [pages, setPages] = useState<CustomPage[]>([]);
  const [team, setTeam] = useState<TeamMember[]>(teamMembers);
  const [mediaList, setMediaList] = useState<Array<{ name: string; publicUrl: string; size?: number }>>([]);
  const [loading, setLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Product Edit/Create modal
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Category Edit/Create modal
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Partial<CategoryRecord> | null>(null);

  // Page Edit/Create modal
  const [isPageModalOpen, setIsPageModalOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<Partial<CustomPage> | null>(null);

  // Order Details Modal
  const [viewingOrder, setViewingOrder] = useState<AdminOrder | null>(null);

  // Initial load
  useEffect(() => {
    checkConnection();
    loadAllData();
  }, []);

  useEffect(() => {
    if (teamMembers !== undefined) {
      setTeam(teamMembers);
    }
  }, [teamMembers]);

  const checkConnection = async () => {
    setTestingConnection(true);
    const res = await testSupabaseConnection();
    setIsConnected(res.success);
    setConnectionMessage(res.message);
    setTestingConnection(false);
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [prods, cats, ords, pgs, media, teamData] = await Promise.all([
        fetchProductsFromDb(),
        fetchCategoriesFromDb(),
        fetchOrdersFromDb(),
        fetchCustomPagesFromDb(),
        listMediaFromSupabase('bukhari-media'),
        fetchTeamFromDb()
      ]);
      setProducts(prods);
      setCategories(cats);
      setOrders(ords);
      setPages(pgs);
      setMediaList(media);
      if (Array.isArray(teamData)) {
        setTeam(teamData);
        onTeamUpdated?.(teamData);
      }
      if (onProductsUpdated) {
        onProductsUpdated(prods);
      }
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg: string, isErr = false) => {
    if (isErr) {
      setActionError(msg);
      setTimeout(() => setActionError(null), 4000);
    } else {
      setActionSuccess(msg);
      setTimeout(() => setActionSuccess(null), 3500);
    }
  };

  // Save Credentials
  const handleSaveCredentials = () => {
    resetSupabaseClient(supabaseUrl, supabaseAnonKey);
    checkConnection();
    loadAllData();
    showToast('Supabase credentials saved and reconnected!');
  };

  // Product CRUD
  const handleOpenNewProduct = () => {
    setEditingProduct({
      name: '',
      brandName: 'Bukhari Agro',
      company: 'Bukhari Agro (Pvt) Ltd',
      category: (categories[0]?.slug as any) || 'pesticides',
      categoryLabel: categories[0]?.name || 'Pesticides & Insecticides',
      price: 'Rs. ',
      originalPrice: '',
      inStock: true,
      tagline: '',
      shortDescription: '',
      fullDescription: '',
      activeIngredient: '',
      formulation: '',
      targetCrops: ['Cotton', 'Wheat'],
      targetPestsOrRole: ['Bollworm'],
      packSizes: ['500 ml', '1 L'],
      dosage: '250 ml per acre',
      applicationMethod: 'Foliar spray',
      precautions: ['Wear gloves', 'Do not spray in extreme heat'],
      imageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d69102a47?auto=format&fit=crop&w=800&q=80',
      featured: false
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.name) {
      showToast('Product title is required', true);
      return;
    }
    const isEdit = Boolean(editingProduct.id);
    const res = await saveProductToDb(editingProduct, editingProduct.id);
    if (res.success) {
      showToast(isEdit ? 'Product updated successfully!' : 'New product created in Supabase database!');
      setIsProductModalOpen(false);
      setEditingProduct(null);
      loadAllData();
    } else {
      showToast(res.error || 'Failed to save product', true);
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}" from the database?`)) return;
    const res = await deleteProductFromDb(id);
    if (res.success) {
      showToast('Product deleted from database');
      loadAllData();
    } else {
      showToast(res.error || 'Failed to delete product', true);
    }
  };

  // Image Upload handler for product
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    const res = await uploadMediaToSupabase(file, 'bukhari-media');
    setUploadingImage(false);
    if (res.success && res.publicUrl) {
      setEditingProduct(prev => prev ? ({ ...prev, imageUrl: res.publicUrl }) : null);
      showToast('Image uploaded directly to Supabase Storage!');
      // reload media tab
      listMediaFromSupabase('bukhari-media').then(setMediaList);
    } else {
      showToast(res.error || 'Image upload failed. Check Supabase Storage bucket.', true);
    }
  };

  // Category CRUD
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory?.name || !editingCategory?.slug) {
      showToast('Name and Slug are required', true);
      return;
    }
    const res = await saveCategoryToDb(editingCategory, editingCategory.id);
    if (res.success) {
      showToast('Category saved successfully!');
      setIsCategoryModalOpen(false);
      setEditingCategory(null);
      loadAllData();
    } else {
      showToast(res.error || 'Failed to save category', true);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!window.confirm('Delete this category?')) return;
    const res = await deleteCategoryFromDb(id);
    if (res.success) {
      showToast('Category deleted');
      loadAllData();
    } else {
      showToast(res.error || 'Failed to delete', true);
    }
  };

  // Orders CRUD
  const handleUpdateOrderStatus = async (id: string, status: string) => {
    const res = await updateOrderStatusInDb(id, status);
    if (res.success) {
      showToast(`Order status marked as ${status}`);
      loadAllData();
      if (viewingOrder && viewingOrder.id === id) {
        setViewingOrder(prev => prev ? { ...prev, status: status as any } : null);
      }
    } else {
      showToast(res.error || 'Failed to update order', true);
    }
  };

  // Custom Page CRUD
  const handleSavePage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPage?.title || !editingPage?.slug) {
      showToast('Title and Slug are required', true);
      return;
    }
    const res = await saveCustomPageToDb(editingPage, editingPage.id);
    if (res.success) {
      showToast('Page saved successfully!');
      setIsPageModalOpen(false);
      setEditingPage(null);
      loadAllData();
    } else {
      showToast(res.error || 'Failed to save page', true);
    }
  };

  const handleDeletePage = async (id: string) => {
    if (!window.confirm('Delete this custom page?')) return;
    const res = await deleteCustomPageFromDb(id);
    if (res.success) {
      showToast('Page deleted');
      loadAllData();
    } else {
      showToast(res.error || 'Failed to delete', true);
    }
  };

  // Filtered Products
  const filteredProducts = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.activeIngredient || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = categoryFilter === 'all' || p.category === categoryFilter;
    return matchSearch && matchCat;
  });

  return (
    <div className="fixed inset-0 z-50 flex bg-slate-950/80 backdrop-blur-md overflow-hidden font-['Plus_Jakarta_Sans',sans-serif]">
      {/* SIDEBAR (WordPress / WooCommerce Admin style) */}
      <aside className="w-64 bg-[#1d2327] text-[#c3c4c7] flex flex-col shrink-0 border-r border-[#2c3338] shadow-2xl">
        {/* Admin Brand Header */}
        <div className="p-4 border-b border-[#2c3338] flex items-center justify-between bg-[#1d2327]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow">
              BA
            </div>
            <div>
              <h1 className="text-sm font-bold text-white tracking-wide">Bukhari Agro</h1>
              <p className="text-[11px] text-emerald-400 font-medium">WooCommerce & Supabase CMS</p>
            </div>
          </div>
        </div>

        {/* Supabase Status Chip */}
        <div className="px-4 py-2.5 bg-[#101517] border-b border-[#2c3338] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <span className="text-white font-medium">
              {isConnected ? 'Supabase Live' : 'Local / Setup'}
            </span>
          </div>
          <button 
            onClick={() => setActiveTab('supabase')} 
            className="text-[11px] text-emerald-400 hover:text-emerald-300 underline"
          >
            Config
          </button>
        </div>

        {/* Sidebar Nav Items */}
        <nav className="flex-1 overflow-y-auto py-2 space-y-0.5 text-[13px] font-medium">
          <button
            type="button"
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
              activeTab === 'dashboard' ? 'bg-[#2271b1] text-white font-semibold' : 'hover:bg-[#2c3338] hover:text-white'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center justify-between px-4 py-2.5 text-left transition-colors ${
              activeTab === 'products' ? 'bg-[#2271b1] text-white font-semibold' : 'hover:bg-[#2c3338] hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <Package className="w-4 h-4" />
              <span>Products</span>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
              {products.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('categories')}
            className={`w-full flex items-center justify-between px-4 py-2.5 text-left transition-colors ${
              activeTab === 'categories' ? 'bg-[#2271b1] text-white font-semibold' : 'hover:bg-[#2c3338] hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <Layers className="w-4 h-4" />
              <span>Categories</span>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
              {categories.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center justify-between px-4 py-2.5 text-left transition-colors ${
              activeTab === 'orders' ? 'bg-[#2271b1] text-white font-semibold' : 'hover:bg-[#2c3338] hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <ShoppingCart className="w-4 h-4" />
              <span>Orders & Inquiries</span>
            </div>
            {orders.filter(o => o.status === 'pending').length > 0 && (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-600 text-white">
                {orders.filter(o => o.status === 'pending').length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('pages')}
            className={`w-full flex items-center justify-between px-4 py-2.5 text-left transition-colors ${
              activeTab === 'pages' ? 'bg-[#2271b1] text-white font-semibold' : 'hover:bg-[#2c3338] hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <FileText className="w-4 h-4" />
              <span>Pages (CMS)</span>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
              {pages.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('team')}
            className={`w-full flex items-center justify-between px-4 py-2.5 text-left transition-colors ${
              activeTab === 'team' ? 'bg-[#2271b1] text-white font-semibold' : 'hover:bg-[#2c3338] hover:text-white'
            }`}
            id="admin-nav-team-btn"
          >
            <div className="flex items-center gap-3">
              <Users className="w-4 h-4" />
              <span>Team & Agronomists</span>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
              {team.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('media')}
            className={`w-full flex items-center justify-between px-4 py-2.5 text-left transition-colors ${
              activeTab === 'media' ? 'bg-[#2271b1] text-white font-semibold' : 'hover:bg-[#2c3338] hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <ImageIcon className="w-4 h-4" />
              <span>Media Library</span>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
              {mediaList.length}
            </span>
          </button>

          <div className="pt-4 mt-2 border-t border-[#2c3338] px-3">
            <p className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold px-2 mb-1">
              Configuration
            </p>
            <button
              type="button"
              onClick={() => setActiveTab('supabase')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded text-left transition-colors ${
                activeTab === 'supabase' ? 'bg-[#2271b1] text-white font-semibold' : 'hover:bg-[#2c3338] hover:text-white'
              }`}
            >
              <Database className="w-4 h-4 text-emerald-400" />
              <span>Supabase SQL & Sync</span>
            </button>
          </div>
        </nav>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-[#2c3338] bg-[#1d2327] flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-2 text-xs font-semibold text-emerald-400 hover:text-emerald-300 px-3 py-1.5 rounded hover:bg-[#2c3338] transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Website</span>
          </button>

          <button
            type="button"
            onClick={() => {
              localStorage.removeItem('bukhari_admin_auth');
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-rose-400 rounded hover:bg-[#2c3338] transition-colors"
            title="Log out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* MAIN ADMIN WORKSPACE */}
      <main className="flex-1 flex flex-col bg-[#f0f0f1] text-[#2c3338] overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between shadow-xs shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold text-slate-900 capitalize">
              {activeTab === 'supabase' ? 'Supabase Database & Storage Settings' : `${activeTab} Management`}
            </h2>
            {loading && (
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                <span>Syncing Supabase...</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={loadAllData}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
              title="Refresh Data from Supabase"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh</span>
            </button>

            {activeTab === 'products' && (
              <button
                type="button"
                onClick={handleOpenNewProduct}
                className="px-3.5 py-1.5 bg-[#2271b1] hover:bg-[#135e96] text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </button>
            )}

            {activeTab === 'categories' && (
              <button
                type="button"
                onClick={() => {
                  setEditingCategory({
                    slug: '',
                    name: '',
                    description: '',
                    accent_color: 'emerald',
                    icon: 'Sprout'
                  });
                  setIsCategoryModalOpen(true);
                }}
                className="px-3.5 py-1.5 bg-[#2271b1] hover:bg-[#135e96] text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Category</span>
              </button>
            )}

            {activeTab === 'pages' && (
              <button
                type="button"
                onClick={() => {
                  setEditingPage({
                    slug: '',
                    title: '',
                    content: '<p>Write your page content here...</p>',
                    is_published: true
                  });
                  setIsPageModalOpen(true);
                }}
                className="px-3.5 py-1.5 bg-[#2271b1] hover:bg-[#135e96] text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Page</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors ml-2"
              title="Close Admin Panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Feedback Toasts */}
        {actionSuccess && (
          <div className="bg-emerald-600 text-white px-6 py-2.5 text-xs font-semibold flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{actionSuccess}</span>
            </div>
            <button onClick={() => setActionSuccess(null)} className="hover:opacity-75">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
        {actionError && (
          <div className="bg-rose-600 text-white px-6 py-2.5 text-xs font-semibold flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>{actionError}</span>
            </div>
            <button onClick={() => setActionError(null)} className="hover:opacity-75">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* TAB 1: DASHBOARD OVERVIEW */}
        {activeTab === 'dashboard' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Quick Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Products</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{products.length}</p>
                  <span className="text-[11px] text-emerald-600 font-medium">Synced with Supabase</span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Package className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer Inquiries</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{orders.length}</p>
                  <span className="text-[11px] text-rose-600 font-medium">
                    {orders.filter(o => o.status === 'pending').length} Pending Review
                  </span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Categories</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{categories.length}</p>
                  <span className="text-[11px] text-slate-500 font-medium">Crop Care Taxonomy</span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Layers className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Media Assets</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{mediaList.length}</p>
                  <span className="text-[11px] text-purple-600 font-medium">Supabase Storage</span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <ImageIcon className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Supabase Status Banner */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    isConnected ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      PostgreSQL Database: {isConnected ? 'Connected & Operational' : 'Awaiting Supabase Connection'}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {connectionMessage || 'Connect your Supabase project using URL and Anon Key to enable live cloud persistence.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={checkConnection}
                    disabled={testingConnection}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${testingConnection ? 'animate-spin' : ''}`} />
                    <span>Test Connection</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('supabase')}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors shadow-xs"
                  >
                    View SQL Setup Code
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Orders / Inquiries Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">Recent Customer Inquiries & Orders</h3>
                <button
                  type="button"
                  onClick={() => setActiveTab('orders')}
                  className="text-xs text-[#2271b1] hover:underline font-semibold"
                >
                  View All ({orders.length})
                </button>
              </div>

              {orders.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  No inquiries received yet. When farmers submit an inquiry from the frontend, it appears here immediately!
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
                      <tr>
                        <th className="p-3">Order #</th>
                        <th className="p-3">Farmer Name</th>
                        <th className="p-3">Phone</th>
                        <th className="p-3">Location / Crop</th>
                        <th className="p-3">Requested Items</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {orders.slice(0, 5).map(o => (
                        <tr key={o.id} className="hover:bg-slate-50/80">
                          <td className="p-3 font-mono font-bold text-slate-700">{o.order_number}</td>
                          <td className="p-3 font-medium text-slate-900">{o.customer_name}</td>
                          <td className="p-3 text-slate-600">{o.phone}</td>
                          <td className="p-3 text-slate-500">{o.location || '—'} {o.crop_type ? `(${o.crop_type})` : ''}</td>
                          <td className="p-3 text-slate-600 font-medium">
                            {o.items?.length || 0} product(s)
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              o.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                              o.status === 'contacted' ? 'bg-blue-100 text-blue-800' :
                              o.status === 'completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                            }`}>
                              {o.status}
                            </span>
                          </td>
                          <td className="p-3">
                            <button
                              type="button"
                              onClick={() => setViewingOrder(o)}
                              className="text-[#2271b1] hover:underline font-semibold"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCTS MANAGER */}
        {activeTab === 'products' && (
          <div className="flex-1 flex flex-col overflow-hidden p-6 space-y-4">
            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex flex-1 items-center gap-3 w-full">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products by title, active ingredient..."
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:bg-white"
                  />
                </div>

                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  aria-label="Filter products by category"
                  className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-emerald-500"
                >
                  <option value="all">All Categories ({products.length})</option>
                  {categories.map(c => (
                    <option key={c.slug} value={c.slug}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="text-xs text-slate-500 font-medium shrink-0">
                Showing {filteredProducts.length} of {products.length} products
              </div>
            </div>

            {/* Products Table */}
            <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-xs overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 sticky top-0 z-10">
                  <tr>
                    <th className="p-3 w-16">Image</th>
                    <th className="p-3">Product Name</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Price / Sale</th>
                    <th className="p-3">Stock Status</th>
                    <th className="p-3">Active Ingredient</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50/80">
                      <td className="p-3">
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          className="w-12 h-12 object-cover rounded-lg border border-slate-200 shadow-xs bg-slate-100"
                        />
                      </td>
                      <td className="p-3">
                        <div className="font-bold text-slate-900 text-[13px]">{p.name}</div>
                        <div className="text-[11px] text-slate-400 line-clamp-1">{p.tagline}</div>
                        {p.featured && (
                          <span className="inline-block mt-1 px-1.5 py-0.5 bg-amber-100 text-amber-800 text-[9px] font-bold rounded">
                            FEATURED
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-slate-600 font-medium">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px]">
                          {p.categoryLabel || p.category}
                        </span>
                      </td>
                      <td className="p-3 font-semibold text-slate-900">
                        {p.price || 'Contact for Price'}
                        {p.originalPrice && (
                          <span className="text-[10px] text-slate-400 line-through ml-1.5 block">
                            {p.originalPrice}
                          </span>
                        )}
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          p.inStock ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {p.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </td>
                      <td className="p-3 text-slate-500 font-mono text-[11px]">
                        {p.activeIngredient || '—'}
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingProduct(p);
                              setIsProductModalOpen(true);
                            }}
                            className="p-1.5 text-slate-500 hover:text-[#2271b1] hover:bg-blue-50 rounded-md transition-colors"
                            title="Edit Product"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteProduct(p.id, p.name)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                            title="Delete Product"
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

        {/* TAB 3: CATEGORIES MANAGER */}
        {activeTab === 'categories' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map(c => (
                <div key={c.slug} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                        slug: {c.slug}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingCategory(c);
                            setIsCategoryModalOpen(true);
                          }}
                          className="p-1 text-slate-400 hover:text-[#2271b1] rounded"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteCategory(c.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <h4 className="text-base font-bold text-slate-900">{c.name}</h4>
                    <p className="text-xs text-slate-500 mt-1.5 line-clamp-2">{c.description}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>{products.filter(p => p.category === c.slug).length} products</span>
                    <span className="text-emerald-600 font-semibold">Active in Catalog</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: ORDERS & INQUIRIES VIEWER */}
        {activeTab === 'orders' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="p-3">Order Number</th>
                    <th className="p-3">Customer / Farmer</th>
                    <th className="p-3">Contact</th>
                    <th className="p-3">Location & Farm</th>
                    <th className="p-3">Products Requested</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Date</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.map(o => (
                    <tr key={o.id} className="hover:bg-slate-50/80">
                      <td className="p-3 font-mono font-bold text-slate-900">{o.order_number}</td>
                      <td className="p-3 font-semibold text-slate-900">{o.customer_name}</td>
                      <td className="p-3">
                        <div className="text-slate-700 font-medium">{o.phone}</div>
                        {o.email && <div className="text-[10px] text-slate-400">{o.email}</div>}
                      </td>
                      <td className="p-3 text-slate-600">
                        <div>{o.location || '—'}</div>
                        {o.crop_type && <div className="text-[10px] text-emerald-700">Crop: {o.crop_type}</div>}
                      </td>
                      <td className="p-3">
                        <div className="font-semibold text-slate-900">{o.items?.length || 0} Item(s)</div>
                        <div className="text-[10px] text-slate-400 line-clamp-1">
                          {o.items?.map(i => i.name).join(', ') || 'General Crop Consultation'}
                        </div>
                      </td>
                      <td className="p-3">
                        <select
                          value={o.status}
                          onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                          className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border focus:outline-none ${
                            o.status === 'pending' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                            o.status === 'contacted' ? 'bg-blue-50 text-blue-800 border-blue-200' :
                            o.status === 'completed' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                            'bg-slate-50 text-slate-700 border-slate-200'
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="contacted">Contacted</option>
                          <option value="processing">Processing</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="p-3 text-slate-400 text-[11px]">
                        {new Date(o.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setViewingOrder(o)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded transition-colors"
                          >
                            View
                          </button>
                          <a
                            href={`https://wa.me/${o.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Assalam-o-Alaikum ${o.customer_name}, this is Bukhari Agro (Pvt) Ltd regarding your inquiry ${o.order_number}.`)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded transition-colors"
                            title="Message on WhatsApp"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: PAGES / CMS (Page by Page Builder) */}
        {activeTab === 'pages' && (
          <AdminPagesEditor
            siteSettings={siteSettings}
            onSiteSettingsUpdated={onSiteSettingsUpdated}
            pages={pages}
            onPagesUpdated={setPages}
            onNavigateToTeam={() => setActiveTab('team')}
            teamMembersCount={team.length}
            showToast={showToast}
            onOpenPageModal={(page) => {
              setEditingPage(page || { title: '', slug: '', content: '', is_published: true });
              setIsPageModalOpen(true);
            }}
          />
        )}

        {/* TAB 6: TEAM & AGRONOMISTS MANAGER */}
        {activeTab === 'team' && (
          <AdminTeamManager
            teamMembers={team}
            onTeamUpdated={(updatedTeam) => {
              setTeam(updatedTeam);
              onTeamUpdated?.(updatedTeam);
            }}
            showToast={showToast}
          />
        )}

        {/* TAB 7: MEDIA LIBRARY */}
        {activeTab === 'media' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Upload Box */}
            <div className="bg-white p-6 rounded-xl border-2 border-dashed border-slate-300 hover:border-emerald-500 text-center transition-colors">
              <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-slate-800">Upload Media to Supabase Storage Bucket</h4>
              <p className="text-xs text-slate-500 mt-1 mb-4">Supported formats: JPG, PNG, WEBP, SVG (Max 10MB)</p>
              
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-[#2271b1] hover:bg-[#135e96] text-white text-xs font-bold rounded-lg shadow-xs transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span>{uploadingImage ? 'Uploading...' : 'Select File from Device'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setUploadingImage(true);
                    const res = await uploadMediaToSupabase(file, 'bukhari-media');
                    setUploadingImage(false);
                    if (res.success) {
                      showToast('Image uploaded successfully to Supabase Storage!');
                      const updated = await listMediaFromSupabase('bukhari-media');
                      setMediaList(updated);
                    } else {
                      showToast(res.error || 'Upload failed', true);
                    }
                  }}
                  className="hidden"
                />
              </label>
            </div>

            {/* Media Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {mediaList.map((m, idx) => (
                <div key={idx} className="bg-white rounded-xl border border-slate-200 p-2 shadow-xs group flex flex-col justify-between">
                  <div className="aspect-square bg-slate-100 rounded-lg overflow-hidden relative">
                    <img src={m.publicUrl} alt={m.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="mt-2">
                    <p className="text-[11px] font-semibold text-slate-800 truncate" title={m.name}>
                      {m.name}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(m.publicUrl);
                        showToast('Image URL copied to clipboard!');
                      }}
                      className="mt-1.5 w-full py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold rounded flex items-center justify-center gap-1 transition-colors"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Copy URL</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: SUPABASE SQL & CONFIG */}
        {activeTab === 'supabase' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Credentials Form */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
              <h3 className="text-base font-bold text-slate-900 mb-1">Supabase PostgreSQL Connection</h3>
              <p className="text-xs text-slate-500 mb-4">
                Enter your Supabase Project URL and Anon Public Key below (or set in Vercel environment variables).
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Supabase Project URL
                  </label>
                  <input
                    type="text"
                    value={supabaseUrl}
                    onChange={(e) => setSupabaseUrl(e.target.value)}
                    placeholder="https://your-project.supabase.co"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Supabase Anon Public API Key
                  </label>
                  <input
                    type="password"
                    value={supabaseAnonKey}
                    onChange={(e) => setSupabaseAnonKey(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:bg-white font-mono"
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleSaveCredentials}
                  className="px-4 py-2 bg-[#2271b1] hover:bg-[#135e96] text-white font-bold text-xs rounded-lg transition-colors shadow-xs"
                >
                  Save & Connect Supabase
                </button>
                <button
                  type="button"
                  onClick={checkConnection}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition-colors"
                >
                  Test Connection
                </button>
              </div>
            </div>

            {/* SQL Script Box */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">1-Click Supabase PostgreSQL Database Schema</h3>
                  <p className="text-xs text-slate-500">
                    Open your <strong>Supabase Dashboard &gt; SQL Editor</strong>, paste this complete script, and hit <strong>Run</strong>.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    fetch('/supabase_schema.sql')
                      .then(r => r.text())
                      .then(text => {
                        navigator.clipboard.writeText(text);
                        setCopiedSql(true);
                        setTimeout(() => setCopiedSql(false), 3000);
                      });
                  }}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
                >
                  {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSql ? 'SQL Copied!' : 'Copy SQL Schema'}</span>
                </button>
              </div>

              <div className="bg-slate-900 text-slate-200 p-4 rounded-lg font-mono text-[11px] max-h-72 overflow-y-auto leading-relaxed border border-slate-800">
                <pre>{`-- Tables created:
-- 1. products (Title, Category, Price, Stock, Formulation, Dosage, Crops, Pests, Image)
-- 2. categories (Slug, Name, Description, Color, Icon)
-- 3. orders (Order Number, Customer Name, Phone, Location, Items, Status, Message)
-- 4. custom_pages (Slug, Title, Content HTML/Markdown, SEO, Published)
-- 5. site_settings (Company info, Logo, Phone, WhatsApp, Helpline)
-- 6. storage.buckets ('bukhari-media', 'product-images', 'banners') with RLS public read policies

-- Click "Copy SQL Schema" button above to get the complete script!`}</pre>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ========================================================= */}
      {/* MODAL: ADD / EDIT PRODUCT */}
      {/* ========================================================= */}
      {isProductModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                {editingProduct.id ? `Edit Product: ${editingProduct.name}` : 'Add New Agricultural Product'}
              </h3>
              <button
                type="button"
                onClick={() => setIsProductModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    placeholder="e.g. Emamectin Ultra 1.9% EC"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-emerald-500 focus:bg-white font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category *</label>
                  <select
                    value={editingProduct.category || ''}
                    onChange={(e) => {
                      const selectedCat = categories.find(c => c.slug === e.target.value);
                      setEditingProduct({
                        ...editingProduct,
                        category: e.target.value as any,
                        categoryLabel: selectedCat?.name || e.target.value
                      });
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-emerald-500"
                  >
                    {categories.map(c => (
                      <option key={c.slug} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Partner / Manufacturer Company</label>
                  <input
                    type="text"
                    value={editingProduct.company || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, company: e.target.value })}
                    placeholder="e.g. Bukhari Agro / Swat Agro"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Price (Regular)</label>
                  <input
                    type="text"
                    value={editingProduct.price || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                    placeholder="e.g. Rs. 2,450"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Original / Sale Price</label>
                  <input
                    type="text"
                    value={editingProduct.originalPrice || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, originalPrice: e.target.value })}
                    placeholder="e.g. Rs. 2,800"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Tagline / Subheading</label>
                  <input
                    type="text"
                    value={editingProduct.tagline || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, tagline: e.target.value })}
                    placeholder="Short summary e.g. Advanced stomach and contact insecticide for tough lepidopteran pests"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Active Ingredient</label>
                  <input
                    type="text"
                    value={editingProduct.activeIngredient || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, activeIngredient: e.target.value })}
                    placeholder="e.g. Emamectin Benzoate 1.9% w/v"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Formulation</label>
                  <input
                    type="text"
                    value={editingProduct.formulation || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, formulation: e.target.value })}
                    placeholder="e.g. Emulsifiable Concentrate (EC)"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Dosage</label>
                  <input
                    type="text"
                    value={editingProduct.dosage || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, dosage: e.target.value })}
                    placeholder="e.g. 200 - 250 ml per acre"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Application Method</label>
                  <input
                    type="text"
                    value={editingProduct.applicationMethod || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, applicationMethod: e.target.value })}
                    placeholder="e.g. Foliar spray / Flood irrigation"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Target Crops & Pests */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target Crops (Comma-separated)</label>
                  <input
                    type="text"
                    value={(editingProduct.targetCrops || []).join(', ')}
                    onChange={(e) => setEditingProduct({
                      ...editingProduct,
                      targetCrops: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                    })}
                    placeholder="Cotton, Wheat, Rice, Maize"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target Pests or Deficiencies</label>
                  <input
                    type="text"
                    value={(editingProduct.targetPestsOrRole || []).join(', ')}
                    onChange={(e) => setEditingProduct({
                      ...editingProduct,
                      targetPestsOrRole: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                    })}
                    placeholder="Bollworm, Armyworm, Thrips"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Image Upload section */}
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Product Photo URL or Supabase Upload</label>
                  <div className="flex gap-3 items-center">
                    <input
                      type="text"
                      value={editingProduct.imageUrl || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, imageUrl: e.target.value })}
                      placeholder="https://..."
                      className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-emerald-500 font-mono"
                    />
                    <label className="cursor-pointer px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shrink-0 flex items-center gap-1.5 transition-colors">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploadingImage ? 'Uploading...' : 'Upload Image'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {editingProduct.imageUrl && (
                    <div className="mt-2 flex items-center gap-3">
                      <img
                        src={editingProduct.imageUrl}
                        alt="Preview"
                        className="w-16 h-16 object-cover rounded-lg border border-slate-200"
                      />
                      <span className="text-[11px] text-slate-500">Live preview (will render on frontend layout)</span>
                    </div>
                  )}
                </div>

                {/* Stock & Featured Toggles */}
                <div className="sm:col-span-2 flex items-center gap-6 pt-2 border-t border-slate-100">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingProduct.inStock !== false}
                      onChange={(e) => setEditingProduct({ ...editingProduct, inStock: e.target.checked })}
                      className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                    />
                    <span className="font-bold text-slate-800">In Stock (Available for Farmers)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(editingProduct.featured)}
                      onChange={(e) => setEditingProduct({ ...editingProduct, featured: e.target.checked })}
                      className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                    />
                    <span className="font-bold text-slate-800">Featured Product (Show on Homepage)</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#2271b1] hover:bg-[#135e96] text-white font-bold rounded-lg shadow-xs transition-colors"
                >
                  Save Product to Supabase
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: ADD / EDIT CATEGORY */}
      {/* ========================================================= */}
      {isCategoryModalOpen && editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900">
                {editingCategory.id ? 'Edit Category' : 'Add New Crop Category'}
              </h3>
              <button onClick={() => setIsCategoryModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={editingCategory.name || ''}
                  onChange={(e) => setEditingCategory({
                    ...editingCategory,
                    name: e.target.value,
                    slug: editingCategory.slug || e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-')
                  })}
                  placeholder="e.g. Bio-Stimulants & Micronutrients"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">URL Slug *</label>
                <input
                  type="text"
                  required
                  value={editingCategory.slug || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                  placeholder="e.g. micronutrients"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingCategory.description || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                  placeholder="Category explanation for farmers..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#2271b1] text-white font-bold rounded-lg"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: ADD / EDIT CUSTOM PAGE (CMS) */}
      {/* ========================================================= */}
      {isPageModalOpen && editingPage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                {editingPage.id ? `Edit Page: ${editingPage.title}` : 'Create Custom Page'}
              </h3>
              <button onClick={() => setIsPageModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePage} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Page Title *</label>
                  <input
                    type="text"
                    required
                    value={editingPage.title || ''}
                    onChange={(e) => setEditingPage({
                      ...editingPage,
                      title: e.target.value,
                      slug: editingPage.slug || e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-')
                    })}
                    placeholder="e.g. Agronomy Services & Advisory"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Page URL Slug *</label>
                  <input
                    type="text"
                    required
                    value={editingPage.slug || ''}
                    onChange={(e) => setEditingPage({ ...editingPage, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                    placeholder="e.g. agronomy-services"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
              </div>

              {/* Rich Text Editor Toolbar */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Page Content (HTML / Rich Text)</label>
                <div className="flex items-center gap-1.5 p-2 bg-slate-100 border border-b-0 border-slate-200 rounded-t-lg">
                  <button
                    type="button"
                    onClick={() => setEditingPage({ ...editingPage, content: (editingPage.content || '') + '<h2>Subheading</h2>' })}
                    className="px-2 py-1 bg-white border border-slate-200 rounded text-[11px] font-bold"
                  >
                    H2
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingPage({ ...editingPage, content: (editingPage.content || '') + '<h3>Heading 3</h3>' })}
                    className="px-2 py-1 bg-white border border-slate-200 rounded text-[11px] font-bold"
                  >
                    H3
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingPage({ ...editingPage, content: (editingPage.content || '') + '<p>Paragraph text...</p>' })}
                    className="px-2 py-1 bg-white border border-slate-200 rounded text-[11px] font-bold"
                  >
                    Paragraph
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingPage({ ...editingPage, content: (editingPage.content || '') + '<ul><li>Point 1</li><li>Point 2</li></ul>' })}
                    className="px-2 py-1 bg-white border border-slate-200 rounded text-[11px] font-bold"
                  >
                    Bullet List
                  </button>
                </div>
                <textarea
                  rows={8}
                  value={editingPage.content || ''}
                  onChange={(e) => setEditingPage({ ...editingPage, content: e.target.value })}
                  placeholder="Enter HTML or text content..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-b-lg font-mono text-xs focus:outline-none focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingPage.is_published !== false}
                    onChange={(e) => setEditingPage({ ...editingPage, is_published: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <span className="font-bold text-slate-800">Publish this page immediately</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPageModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#2271b1] text-white font-bold rounded-lg"
                >
                  Save Page to Supabase
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: VIEW ORDER / INQUIRY DETAILS */}
      {/* ========================================================= */}
      {viewingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Inquiry {viewingOrder.order_number}</h3>
                <p className="text-xs text-slate-400">{new Date(viewingOrder.created_at).toLocaleString()}</p>
              </div>
              <button onClick={() => setViewingOrder(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div>
                  <span className="text-slate-400 block text-[10px]">Farmer / Customer Name</span>
                  <span className="font-bold text-slate-900">{viewingOrder.customer_name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Phone Number</span>
                  <span className="font-bold text-slate-900">{viewingOrder.phone}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Location</span>
                  <span className="font-bold text-slate-900">{viewingOrder.location || '—'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Crop / Farm Size</span>
                  <span className="font-bold text-slate-900">{viewingOrder.crop_type || '—'} {viewingOrder.farm_size_acres ? `(${viewingOrder.farm_size_acres} Acres)` : ''}</span>
                </div>
              </div>

              {viewingOrder.message && (
                <div className="p-3 bg-emerald-50/50 rounded-lg border border-emerald-100">
                  <span className="text-[10px] text-emerald-800 font-bold block mb-0.5">Farmer Note / Query:</span>
                  <p className="text-slate-700 leading-relaxed">{viewingOrder.message}</p>
                </div>
              )}

              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
                  Selected Products ({viewingOrder.items?.length || 0}):
                </span>
                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {viewingOrder.items?.map((item, i) => (
                    <div key={i} className="p-2 bg-slate-50 rounded border border-slate-200 flex items-center justify-between">
                      <span className="font-semibold text-slate-800">{item.name}</span>
                      <span className="text-emerald-700 font-bold">{item.price || ''}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <a
                href={`https://wa.me/${viewingOrder.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Assalam-o-Alaikum ${viewingOrder.customer_name}, this is Bukhari Agro (Pvt) Ltd regarding your inquiry ${viewingOrder.order_number}.`)}`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg flex items-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Contact via WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={() => setViewingOrder(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold text-xs rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
