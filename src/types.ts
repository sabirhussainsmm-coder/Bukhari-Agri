export type ProductCategory = 
  | 'pesticides' 
  | 'fertilizers' 
  | 'herbicides' 
  | 'fungicides' 
  | 'growth-regulators' 
  | 'micronutrients';

export interface Product {
  id: string;
  name: string;
  brandName?: string;
  company: string; // The partner company that manufactures or licenses the product
  category: ProductCategory;
  categoryLabel: string;
  price?: string; // e.g. "Rs. 3,450"
  originalPrice?: string; // e.g. "Rs. 3,850"
  tagline: string;
  shortDescription: string;
  fullDescription: string;
  activeIngredient: string;
  formulation: string;
  targetCrops: string[];
  targetPestsOrRole: string[];
  packSizes: string[];
  dosage: string;
  applicationMethod: string;
  precautions: string[];
  imageUrl: string;
  featured?: boolean;
  inStock: boolean;
}

export interface PartnerBrand {
  id: string;
  name: string;
  country: string;
  tier: string;
  badge: string;
  description: string;
  logoUrl?: string;
  website?: string;
  isFeatured?: boolean;
}

export interface HeaderNavButton {
  id: string;
  label: string;
  targetTab: 'home' | 'about' | 'products' | 'categories' | 'brands' | 'contact' | 'studio';
  categoryFilter?: string;
  hasDropdown?: boolean;
  visible: boolean;
  isCustom?: boolean;
  customUrl?: string;
  badgeText?: string;
}

export interface SiteSettings {
  logo: {
    type: 'svg' | 'image';
    imageUrl?: string;
    companyName: string;
    tagline: string;
    height?: number;
  };
  headerButtons: HeaderNavButton[];
  topBarText: string;
  helplinePhone: string;
  whatsappNumber: string;
  email: string;
  address?: string;
  ctaButtonText: string;
  ctaButtonAction?: 'contact' | 'quote' | 'whatsapp' | 'custom' | 'studio';
  ctaCustomUrl?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  qualification: string;
  experience: string;
  bio: string;
  imageUrl: string;
  specialty: string;
  email?: string;
}

export interface CategoryDetail {
  id: ProductCategory;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  accentColor: string;
  targetFocus: string;
  keyBenefits: string[];
  commonTargetPestsOrNeeds: string[];
  applicationGuide: string;
  popularFormulations: string[];
}

export interface ContactInfo {
  companyName: string;
  legalName: string;
  tagline: string;
  subTagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  businessHours: string;
  emergencyAgronomySupport: string;
  partnerCount: number;
  productsCount: number;
  farmersServed: string;
}

export interface InquiryFormPayload {
  farmerName: string;
  phone: string;
  location: string;
  cropType: string;
  farmSizeAcres?: string;
  preferredBrand?: string;
  selectedProducts?: string[];
  message: string;
}
