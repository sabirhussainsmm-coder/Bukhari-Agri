import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { ValuePropositionBar } from './components/ValuePropositionBar';
import { CategoryCards } from './components/CategoryCards';
import { GrowingTogetherSection } from './components/GrowingTogetherSection';
import { FeaturedProductsSection } from './components/FeaturedProductsSection';
import { PartnerBrandsBar } from './components/PartnerBrandsBar';
import { AboutPage } from './components/AboutPage';
import { ProductsPage } from './components/ProductsPage';
import { CategoriesPage } from './components/CategoriesPage';
import { BrandsPage } from './components/BrandsPage';
import { ContactPage } from './components/ContactPage';
import { Footer } from './components/Footer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { InquiryTrayModal } from './components/InquiryTrayModal';
import { SearchModal } from './components/SearchModal';
import { WordPressAuthModal } from './components/WordPressAuthModal';
import { AdminDashboard } from './components/AdminDashboard';
import { initialProducts, partnerBrands, contactInfo, initialTeamMembers } from './data/agroData';
import { Product, ProductCategory, PartnerBrand, SiteSettings, InquiryCartItem, TeamMember } from './types';
import { MessageCircle, ArrowUp } from 'lucide-react';
import { fetchProductsFromDb, fetchBrandsFromDb, fetchSiteSettingsFromDb, fetchTeamFromDb } from './services/supabaseService';

const defaultSiteSettings: SiteSettings = {
  headerButtons: [
    { id: 'btn-home', label: 'Home', targetTab: 'home', visible: true, hasDropdown: false },
    { id: 'btn-about', label: 'About Us', targetTab: 'about', visible: true, hasDropdown: false },
    { id: 'btn-products', label: 'Products', targetTab: 'products', visible: true, hasDropdown: false },
    { id: 'btn-categories', label: 'Categories', targetTab: 'categories', visible: true, hasDropdown: true },
    { id: 'btn-brands', label: 'Agro Brands', targetTab: 'brands', visible: true, hasDropdown: false },
    { id: 'btn-contact', label: 'Contact', targetTab: 'contact', visible: true, hasDropdown: false }
  ],
  logo: {
    type: 'svg',
    companyName: 'Bukhari Agro (Pvt) Ltd',
    tagline: 'Healthy Crops, Brighter Future'
  },
  topBarText: 'Healthy Crops, Brighter Future',
  helplinePhone: contactInfo.phone,
  whatsappNumber: contactInfo.whatsapp,
  email: contactInfo.email,
  address: contactInfo.address,
  ctaButtonText: 'bukhariagro.com'
};

function getTabFromPath(pathname: string): 'home' | 'about' | 'products' | 'categories' | 'brands' | 'contact' {
  const clean = pathname.replace(/^\//, '').toLowerCase().split('/')[0];
  if (clean === 'about' || clean === 'about-us') return 'about';
  if (clean === 'products' || clean === 'product') return 'products';
  if (clean === 'categories' || clean === 'category') return 'categories';
  if (clean === 'brands' || clean === 'brand') return 'brands';
  if (clean === 'contact' || clean === 'contact-us') return 'contact';
  return 'home';
}

export default function App() {
  const [currentTab, setCurrentTab] = useState<'home' | 'about' | 'products' | 'categories' | 'brands' | 'contact'>(() => {
    return getTabFromPath(window.location.pathname);
  });
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [brands, setBrands] = useState<PartnerBrand[]>(partnerBrands);
  const [team, setTeam] = useState<TeamMember[]>(initialTeamMembers);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(defaultSiteSettings);
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Inquiry Cart with Pack Size & Quantity support
  const [inquiryItems, setInquiryItems] = useState<InquiryCartItem[]>(() => {
    try {
      const saved = localStorage.getItem('bukhari_inquiry_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isInquiryTrayOpen, setIsInquiryTrayOpen] = useState(false);
  const [productCategoryFilter, setProductCategoryFilter] = useState<string>('all');
  const [showScrollTop, setShowScrollTop] = useState(false);

  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);

  // Admin Authentication (Password: 7467)
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem('bukhari_admin_auth') === '7467';
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authPendingAction, setAuthPendingAction] = useState<(() => void) | null>(null);

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('bukhari_inquiry_cart', JSON.stringify(inquiryItems));
    } catch {
      // Ignore storage errors
    }
  }, [inquiryItems]);

  // Sync document.title with current page tab
  useEffect(() => {
    const titles: Record<string, string> = {
      home: 'Bukhari Agro (Pvt) Ltd - Healthy Crops, Brighter Future',
      about: 'About Us & Agronomists Team - Bukhari Agro (Pvt) Ltd',
      products: 'Certified Crop Protection Products - Bukhari Agro',
      categories: 'Crop Solutions & Categories - Bukhari Agro',
      brands: 'Partner Agro Brands - Bukhari Agro',
      contact: 'Contact & Agronomy Helpline - Bukhari Agro'
    };
    document.title = titles[currentTab] || 'Bukhari Agro (Pvt) Ltd';
  }, [currentTab]);

  // Check initial URL for /admin or #admin on startup
  useEffect(() => {
    const isDirectAdminRoute = 
      window.location.pathname === '/admin' || 
      window.location.pathname.startsWith('/admin') || 
      window.location.hash === '#admin';

    if (isDirectAdminRoute) {
      if (isAdmin) {
        setIsAdminDashboardOpen(true);
      } else {
        setAuthPendingAction(() => () => setIsAdminDashboardOpen(true));
        setIsAuthModalOpen(true);
      }
    }
  }, [isAdmin]);

  // Handle browser Back & Forward buttons (popstate)
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/admin' || path.startsWith('/admin')) {
        if (isAdmin) {
          setIsAdminDashboardOpen(true);
        } else {
          setAuthPendingAction(() => () => setIsAdminDashboardOpen(true));
          setIsAuthModalOpen(true);
        }
        return;
      }
      setIsAdminDashboardOpen(false);
      const tab = getTabFromPath(path);
      setCurrentTab(tab);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isAdmin]);

  // 1. Fetch live data from Supabase & Backend API
  useEffect(() => {
    let isMounted = true;

    // Load Site Settings
    async function loadSiteSettings() {
      try {
        const settings = await fetchSiteSettingsFromDb();
        if (settings && isMounted) {
          setSiteSettings(settings);
          return;
        }
        const res = await fetch('/api/site-settings');
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data && isMounted) {
            setSiteSettings(json.data);
          }
        }
      } catch (err) {
        console.warn("Using default site settings", err);
      }
    }

    // Load Products
    async function loadProducts() {
      try {
        const dbProducts = await fetchProductsFromDb();
        if (dbProducts && dbProducts.length > 0 && isMounted) {
          setProducts(dbProducts);
          return;
        }
        const res = await fetch('/api/products');
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data) && isMounted) {
            setProducts(json.data);
          }
        }
      } catch (err) {
        console.warn("Using local product dataset", err);
      }
    }

    // Load Partner Brands
    async function loadBrands() {
      try {
        const dbBrands = await fetchBrandsFromDb();
        if (dbBrands && dbBrands.length > 0 && isMounted) {
          setBrands(dbBrands);
          return;
        }
        const res = await fetch('/api/partners');
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data) && isMounted) {
            setBrands(json.data);
          }
        }
      } catch (err) {
        console.warn("Using local brands dataset", err);
      }
    }

    // Load Team
    async function loadTeam() {
      try {
        const dbTeam = await fetchTeamFromDb();
        if (dbTeam && dbTeam.length > 0 && isMounted) {
          setTeam(dbTeam);
          return;
        }
        const res = await fetch('/api/team');
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data) && isMounted) {
            setTeam(json.data);
          }
        }
      } catch (err) {
        console.warn("Using default team dataset", err);
      }
    }

    loadSiteSettings();
    loadProducts();
    loadBrands();
    loadTeam();

    return () => { isMounted = false; };
  }, []);

  // Monitor scroll for scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navigate to tab with browser URL history updates
  const navigateToTab = (tab: 'home' | 'about' | 'products' | 'categories' | 'brands' | 'contact', categoryFilter?: string) => {
    if (categoryFilter) {
      setProductCategoryFilter(categoryFilter);
    }
    setCurrentTab(tab);
    
    // Update browser URL (e.g. /about, /products, /contact, /)
    const targetPath = tab === 'home' ? '/' : `/${tab}`;
    if (window.location.pathname !== targetPath) {
      window.history.pushState({ tab }, '', targetPath);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open Admin Dashboard with /admin URL sync
  const handleOpenAdmin = () => {
    if (!isAdmin) {
      setAuthPendingAction(() => () => {
        setIsAdminDashboardOpen(true);
        if (window.location.pathname !== '/admin') {
          window.history.pushState({ admin: true }, '', '/admin');
        }
      });
      setIsAuthModalOpen(true);
      return;
    }
    setIsAdminDashboardOpen(true);
    if (window.location.pathname !== '/admin') {
      window.history.pushState({ admin: true }, '', '/admin');
    }
  };

  // Close Admin Dashboard and restore page URL
  const handleCloseAdmin = () => {
    setIsAdminDashboardOpen(false);
    const targetPath = currentTab === 'home' ? '/' : `/${currentTab}`;
    if (window.location.pathname !== targetPath) {
      window.history.pushState({ tab: currentTab }, '', targetPath);
    }
  };

  // Inquiry & Pack Size Cart Handlers
  const handleAddToInquiry = (product: Product, selectedPackSize?: string, quantity: number = 1) => {
    const packSize = selectedPackSize || (product.packSizes && product.packSizes.length > 0 ? product.packSizes[0] : 'Standard');
    setInquiryItems(prev => {
      const existingIndex = prev.findIndex(item => item.product.id === product.id && item.selectedPackSize === packSize);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: (updated[existingIndex].quantity || 1) + quantity
        };
        return updated;
      } else {
        const newItem: InquiryCartItem = {
          cartItemId: `${product.id}-${packSize.replace(/[^a-zA-Z0-9]/g, '')}-${Date.now()}`,
          productId: product.id,
          product,
          selectedPackSize: packSize,
          quantity: Math.max(1, quantity)
        };
        return [...prev, newItem];
      }
    });
  };

  // Quick toggle (for card buttons)
  const handleToggleInquiry = (product: Product) => {
    setInquiryItems(prev => {
      const exists = prev.some(item => item.product.id === product.id);
      if (exists) {
        return prev.filter(item => item.product.id !== product.id);
      } else {
        const defaultPack = product.packSizes && product.packSizes.length > 0 ? product.packSizes[0] : 'Standard';
        return [...prev, {
          cartItemId: `${product.id}-${Date.now()}`,
          productId: product.id,
          product,
          selectedPackSize: defaultPack,
          quantity: 1
        }];
      }
    });
  };

  const handleRemoveCartItem = (cartItemId: string) => {
    setInquiryItems(prev => prev.filter(item => item.cartItemId !== cartItemId));
  };

  const handleUpdatePackSize = (cartItemId: string, newPackSize: string) => {
    setInquiryItems(prev => prev.map(item => item.cartItemId === cartItemId ? { ...item, selectedPackSize: newPackSize } : item));
  };

  const handleUpdateQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveCartItem(cartItemId);
      return;
    }
    setInquiryItems(prev => prev.map(item => item.cartItemId === cartItemId ? { ...item, quantity: newQty } : item));
  };

  const handleClearInquiry = () => {
    setInquiryItems([]);
  };

  // When user clicks a category card on Home or Categories page
  const handleSelectCategoryFromCard = (catId: ProductCategory) => {
    setProductCategoryFilter(catId);
    navigateToTab('products');
  };

  // When user clicks "View All Products"
  const handleViewAllProducts = () => {
    setProductCategoryFilter('all');
    navigateToTab('products');
  };

  const inquiryProductIds = inquiryItems.map(i => i.product.id);
  const totalInquiryUnits = inquiryItems.reduce((acc, i) => acc + (i.quantity || 1), 0);

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-emerald-200 selection:text-emerald-950 font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Header (Clean, responsive header without admin banners or studio triggers) */}
      <Header
        currentTab={currentTab}
        onNavigate={navigateToTab}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenInquiryTray={() => setIsInquiryTrayOpen(true)}
        inquiryCount={totalInquiryUnits}
        siteSettings={siteSettings}
      />

      {/* Main Content Area based on Selected Tab */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <>
            {/* 1. Hero Section */}
            <HeroSection
              onExploreProducts={handleViewAllProducts}
              onLearnMore={() => navigateToTab('about')}
            />

            {/* 2. Value Proposition Pillars Bar (Deep Green: 4 Pillars) */}
            <ValuePropositionBar />

            {/* 3. Our Products / Complete Crop Care Solutions (5 Categories Grid) */}
            <CategoryCards
              onSelectCategory={handleSelectCategoryFromCard}
              onViewAllProducts={handleViewAllProducts}
            />

            {/* 4. About Bukhari Agro / Growing Agriculture Together */}
            <GrowingTogetherSection
              onLearnMore={() => navigateToTab('about')}
            />

            {/* 5. Featured Products Section */}
            <FeaturedProductsSection
              products={products}
              onSelectProduct={(p) => setSelectedProduct(p)}
              onViewAll={handleViewAllProducts}
              onAddToInquiry={handleToggleInquiry}
              inquiryProductIds={inquiryProductIds}
            />

            {/* 6. Partner Brands Showcase */}
            <PartnerBrandsBar
              brands={brands}
              onSelectBrand={() => {
                setProductCategoryFilter('all');
                navigateToTab('products');
              }}
              onViewAllBrands={() => navigateToTab('brands')}
            />
          </>
        )}

        {currentTab === 'about' && (
          <AboutPage
            onNavigateToProducts={handleViewAllProducts}
            onNavigateToContact={() => navigateToTab('contact')}
            teamMembers={team}
          />
        )}

        {currentTab === 'products' && (
          <ProductsPage
            products={products}
            initialCategoryFilter={productCategoryFilter}
            onSelectProduct={(p) => setSelectedProduct(p)}
            onAddToInquiry={handleToggleInquiry}
            inquiryProductIds={inquiryProductIds}
            onOpenInquiryTray={() => setIsInquiryTrayOpen(true)}
          />
        )}

        {currentTab === 'categories' && (
          <CategoriesPage
            onSelectCategoryFilter={handleSelectCategoryFromCard}
          />
        )}

        {currentTab === 'brands' && (
          <BrandsPage
            brands={brands}
            products={products}
            onSelectBrandFilter={() => {
              setProductCategoryFilter('all');
              navigateToTab('products');
            }}
            onSelectProduct={(p) => setSelectedProduct(p)}
            onNavigateToContact={() => navigateToTab('contact')}
          />
        )}

        {currentTab === 'contact' && (
          <ContactPage />
        )}
      </main>

      {/* Footer (Dynamic brands & studio backend hub button) */}
      <Footer
        onNavigate={navigateToTab}
        brands={brands}
        siteSettings={siteSettings}
        onOpenBackendStudio={handleOpenAdmin}
      />

      {/* Product Detail Modal (Allows Weight / Pack Size & Quantity selection) */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToInquiry={handleAddToInquiry}
        isAddedToInquiry={selectedProduct ? inquiryProductIds.includes(selectedProduct.id) : false}
      />

      {/* Inquiry / Quotation Tray Modal (Displays itemized pack size & quantity controls) */}
      <InquiryTrayModal
        isOpen={isInquiryTrayOpen}
        onClose={() => setIsInquiryTrayOpen(false)}
        inquiryItems={inquiryItems}
        onRemoveItem={handleRemoveCartItem}
        onUpdatePackSize={handleUpdatePackSize}
        onUpdateQuantity={handleUpdateQuantity}
        onClearInquiry={handleClearInquiry}
        onProceedToContact={() => {
          setIsInquiryTrayOpen(false);
          navigateToTab('contact');
        }}
      />

      {/* Quick Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={products}
        onSelectProduct={(p) => setSelectedProduct(p)}
      />

      {/* WooCommerce / WordPress Style Admin CMS Dashboard (Supabase PostgreSQL + Storage) */}
      {isAdminDashboardOpen && (
        <AdminDashboard
          onClose={handleCloseAdmin}
          siteSettings={siteSettings}
          onSiteSettingsUpdated={(newSettings) => setSiteSettings(newSettings)}
          onProductsUpdated={(newProducts) => setProducts(newProducts)}
          teamMembers={team}
          onTeamUpdated={(updatedTeam) => setTeam(updatedTeam)}
        />
      )}

      {/* Password Protection Modal for Backend Access (Password: 7467, strictly no hints) */}
      <WordPressAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => {
          setIsAuthModalOpen(false);
          setAuthPendingAction(null);
        }}
        onAuthenticated={() => {
          setIsAdmin(true);
          if (authPendingAction) {
            authPendingAction();
            setAuthPendingAction(null);
          }
        }}
      />

      {/* Floating WhatsApp Quick-Action Button */}
      <aside aria-label="Quick Actions" className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
        {showScrollTop && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="w-10 h-10 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105"
            title="Scroll to Top"
            id="btn-scroll-top"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        )}

        <a
          href={`https://wa.me/${(siteSettings.whatsappNumber || '+923116666600').replace(/[^0-9]/g, '')}?text=Assalam-o-Alaikum%20Bukhari%20Agro%2C%20I%20need%20assistance%20with%20crop%20care%20products.`}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white py-3 px-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105"
          id="btn-floating-whatsapp"
        >
          <MessageCircle className="w-6 h-6 fill-current" />
          <span className="text-xs font-bold tracking-wide pr-1 hidden sm:inline-block">
            Chat on WhatsApp ({siteSettings.helplinePhone || '+92 311 6666600'})
          </span>
        </a>
      </aside>

    </div>
  );
}
