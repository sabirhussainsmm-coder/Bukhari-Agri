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
import { BackendStudioModal } from './components/BackendStudioModal';
import { WordPressAuthModal } from './components/WordPressAuthModal';
import { initialProducts, partnerBrands, contactInfo } from './data/agroData';
import { Product, ProductCategory, PartnerBrand, SiteSettings } from './types';
import { MessageCircle, ArrowUp } from 'lucide-react';

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

export default function App() {
  const [currentTab, setCurrentTab] = useState<'home' | 'about' | 'products' | 'categories' | 'brands' | 'contact'>('home');
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [brands, setBrands] = useState<PartnerBrand[]>(partnerBrands);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(defaultSiteSettings);
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [inquiryProductIds, setInquiryProductIds] = useState<string[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isInquiryTrayOpen, setIsInquiryTrayOpen] = useState(false);
  const [isBackendStudioOpen, setIsBackendStudioOpen] = useState(false);
  const [studioInitialTab, setStudioInitialTab] = useState<'header' | 'products' | 'brands' | 'images'>('header');
  const [productCategoryFilter, setProductCategoryFilter] = useState<string>('all');
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Admin Authentication (Password: 7467)
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem('bukhari_admin_auth') === '7467';
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authPendingAction, setAuthPendingAction] = useState<(() => void) | null>(null);

  // 1. Fetch live data from backend API
  useEffect(() => {
    let isMounted = true;

    // Load Site Settings
    async function loadSiteSettings() {
      try {
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

    loadSiteSettings();
    loadProducts();
    loadBrands();

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

  // Scroll to top on tab change
  const navigateToTab = (tab: 'home' | 'about' | 'products' | 'categories' | 'brands' | 'contact', categoryFilter?: string) => {
    if (categoryFilter) {
      setProductCategoryFilter(categoryFilter);
    }
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Inquiry toggle
  const handleToggleInquiry = (product: Product) => {
    setInquiryProductIds(prev => {
      if (prev.includes(product.id)) {
        return prev.filter(id => id !== product.id);
      } else {
        return [...prev, product.id];
      }
    });
  };

  const handleRemoveFromInquiry = (productId: string) => {
    setInquiryProductIds(prev => prev.filter(id => id !== productId));
  };

  const handleClearInquiry = () => {
    setInquiryProductIds([]);
  };

  // When user clicks a category card on Home or Categories page
  const handleSelectCategoryFromCard = (catId: ProductCategory) => {
    setProductCategoryFilter(catId);
    setCurrentTab('products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // When user clicks "View All Products"
  const handleViewAllProducts = () => {
    setProductCategoryFilter('all');
    setCurrentTab('products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open Backend Studio with password protection (triggered from Footer "Open Studio Backend Hub")
  const handleOpenBackendStudio = (tab: 'header' | 'products' | 'brands' | 'images' = 'header') => {
    if (!isAdmin) {
      setAuthPendingAction(() => () => {
        setStudioInitialTab(tab);
        setIsBackendStudioOpen(true);
      });
      setIsAuthModalOpen(true);
      return;
    }
    setStudioInitialTab(tab);
    setIsBackendStudioOpen(true);
  };

  // Admin Logout
  const handleLogout = () => {
    localStorage.removeItem('bukhari_admin_auth');
    setIsAdmin(false);
  };

  const inquiryProducts = products.filter(p => inquiryProductIds.includes(p.id));

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-emerald-200 selection:text-emerald-950 font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Header (Clean, responsive header without admin banners or studio triggers) */}
      <Header
        currentTab={currentTab}
        onNavigate={navigateToTab}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenInquiryTray={() => setIsInquiryTrayOpen(true)}
        inquiryCount={inquiryProductIds.length}
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
              onSelectBrand={(brandName) => {
                setProductCategoryFilter('all');
                setCurrentTab('products');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onViewAllBrands={() => navigateToTab('brands')}
            />
          </>
        )}

        {currentTab === 'about' && (
          <AboutPage
            onNavigateToProducts={handleViewAllProducts}
            onNavigateToContact={() => navigateToTab('contact')}
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
            onSelectBrandFilter={(brandName) => {
              setProductCategoryFilter('all');
              setCurrentTab('products');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectProduct={(p) => setSelectedProduct(p)}
            onNavigateToContact={() => navigateToTab('contact')}
          />
        )}

        {currentTab === 'contact' && (
          <ContactPage />
        )}
      </main>

      {/* Footer (Dynamic brands & backend hub button) */}
      <Footer
        onNavigate={navigateToTab}
        brands={brands}
        siteSettings={siteSettings}
        onOpenBackendStudio={() => handleOpenBackendStudio('header')}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToInquiry={handleToggleInquiry}
        isAddedToInquiry={selectedProduct ? inquiryProductIds.includes(selectedProduct.id) : false}
      />

      {/* Inquiry / Quotation Tray Modal */}
      <InquiryTrayModal
        isOpen={isInquiryTrayOpen}
        onClose={() => setIsInquiryTrayOpen(false)}
        inquiryProducts={inquiryProducts}
        onRemoveFromInquiry={handleRemoveFromInquiry}
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

      {/* Backend Studio CMS Hub Modal */}
      <BackendStudioModal
        isOpen={isBackendStudioOpen}
        onClose={() => setIsBackendStudioOpen(false)}
        siteSettings={siteSettings}
        products={products}
        brands={brands}
        onSettingsUpdated={(newSettings) => setSiteSettings(newSettings)}
        onProductsUpdated={(newProducts) => setProducts(newProducts)}
        onBrandsUpdated={(newBrands) => setBrands(newBrands)}
        initialTab={studioInitialTab}
        onLogout={handleLogout}
      />

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
