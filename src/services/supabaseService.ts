import { getSupabaseClient } from '../lib/supabase';
import { Product, SiteSettings, AdminOrder, CustomPage, CategoryRecord, InquiryFormPayload, PartnerBrand, TeamMember } from '../types';
import { initialProducts, categoriesData, contactInfo, partnerBrands, initialTeamMembers } from '../data/agroData';

export const defaultSiteSettings: SiteSettings = {
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

// Map PostgreSQL snake_case columns to Product model
export function mapDbToProduct(row: any): Product {
  return {
    id: String(row.id),
    name: row.name || 'Untitled Product',
    brandName: row.brand_name || 'Bukhari Agro',
    company: row.company || 'Bukhari Agro (Pvt) Ltd',
    category: (row.category_slug || 'pesticides') as any,
    categoryLabel: row.category_label || 'Agricultural Product',
    price: row.price || '',
    originalPrice: row.sale_price || '',
    tagline: row.tagline || '',
    shortDescription: row.short_description || '',
    fullDescription: row.full_description || '',
    activeIngredient: row.active_ingredient || '',
    formulation: row.formulation || '',
    targetCrops: Array.isArray(row.target_crops) ? row.target_crops : [],
    targetPestsOrRole: Array.isArray(row.target_pests) ? row.target_pests : [],
    packSizes: Array.isArray(row.pack_sizes) ? row.pack_sizes : [],
    dosage: row.dosage || '',
    applicationMethod: row.application_method || '',
    precautions: Array.isArray(row.precautions) ? row.precautions : [],
    imageUrl: row.image_url || 'https://images.unsplash.com/photo-1592417817098-8f3d69102a47?auto=format&fit=crop&w=800&q=80',
    featured: Boolean(row.featured),
    inStock: row.in_stock !== false
  };
}

// Map Product model to DB snake_case columns
export function mapProductToDb(p: Partial<Product>) {
  return {
    name: p.name,
    brand_name: p.brandName,
    company: p.company || 'Bukhari Agro (Pvt) Ltd',
    category_slug: p.category,
    category_label: p.categoryLabel,
    price: p.price,
    sale_price: p.originalPrice,
    stock_status: p.inStock ? 'in_stock' : 'out_of_stock',
    in_stock: p.inStock !== false,
    tagline: p.tagline,
    short_description: p.shortDescription,
    full_description: p.fullDescription,
    active_ingredient: p.activeIngredient,
    formulation: p.formulation,
    target_crops: p.targetCrops || [],
    target_pests: p.targetPestsOrRole || [],
    pack_sizes: p.packSizes || [],
    dosage: p.dosage,
    application_method: p.applicationMethod,
    precautions: p.precautions || [],
    image_url: p.imageUrl,
    featured: Boolean(p.featured),
    updated_at: new Date().toISOString()
  };
}

// ==========================================
// 1. PRODUCTS API
// ==========================================

export async function fetchProductsFromDb(): Promise<Product[]> {
  const client = getSupabaseClient();
  if (!client) {
    // Fallback if Supabase not configured yet
    return initialProducts;
  }

  try {
    const { data, error } = await client
      .from('products')
      .select('*')
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('[Supabase] Products query error, using local data:', error.message);
      return initialProducts;
    }

    if (data && data.length > 0) {
      return data.map(mapDbToProduct);
    }
    return initialProducts;
  } catch (err) {
    console.error('[Supabase] Failed to fetch products:', err);
    return initialProducts;
  }
}

export async function saveProductToDb(product: Partial<Product>, isEditingId?: string): Promise<{ success: boolean; data?: Product; error?: string }> {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, error: 'Supabase client not connected. Please check Settings.' };
  }

  try {
    const dbPayload = mapProductToDb(product);

    if (isEditingId) {
      const { data, error } = await client
        .from('products')
        .update(dbPayload)
        .eq('id', isEditingId)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data: mapDbToProduct(data) };
    } else {
      const { data, error } = await client
        .from('products')
        .insert([{ ...dbPayload, created_at: new Date().toISOString() }])
        .select()
        .single();

      if (error) throw error;
      return { success: true, data: mapDbToProduct(data) };
    }
  } catch (err: any) {
    console.error('[Supabase saveProduct error]:', err);
    return { success: false, error: err?.message || 'Database insert failed' };
  }
}

export async function deleteProductFromDb(id: string): Promise<{ success: boolean; error?: string }> {
  const client = getSupabaseClient();
  if (!client) return { success: false, error: 'Supabase not connected' };

  try {
    const { error } = await client.from('products').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

// ==========================================
// 2. CATEGORIES API
// ==========================================

export async function fetchCategoriesFromDb(): Promise<CategoryRecord[]> {
  const client = getSupabaseClient();
  if (!client) {
    return categoriesData.map(c => ({
      id: c.id,
      slug: c.id,
      name: c.title,
      description: c.description,
      icon: c.icon,
      accent_color: c.accentColor
    }));
  }

  try {
    const { data, error } = await client
      .from('categories')
      .select('*')
      .order('order_index', { ascending: true });

    if (error || !data || data.length === 0) {
      return categoriesData.map(c => ({
        id: c.id,
        slug: c.id,
        name: c.title,
        description: c.description,
        icon: c.icon,
        accent_color: c.accentColor
      }));
    }

    return data.map(c => ({
      id: c.id,
      slug: c.slug,
      name: c.name,
      description: c.description,
      icon: c.icon,
      accent_color: c.accent_color,
      image_url: c.image_url,
      order_index: c.order_index
    }));
  } catch (err) {
    console.warn('[Supabase Categories Error]:', err);
    return [];
  }
}

export async function saveCategoryToDb(category: Partial<CategoryRecord>, isEditingId?: string): Promise<{ success: boolean; error?: string }> {
  const client = getSupabaseClient();
  if (!client) return { success: false, error: 'Supabase not connected' };

  try {
    const payload = {
      slug: category.slug,
      name: category.name,
      description: category.description,
      icon: category.icon || 'Sprout',
      accent_color: category.accent_color || 'emerald',
      image_url: category.image_url,
      order_index: category.order_index || 0,
      updated_at: new Date().toISOString()
    };

    if (isEditingId) {
      const { error } = await client.from('categories').update(payload).eq('id', isEditingId);
      if (error) throw error;
    } else {
      const { error } = await client.from('categories').insert([{ ...payload, created_at: new Date().toISOString() }]);
      if (error) throw error;
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

export async function deleteCategoryFromDb(id: string): Promise<{ success: boolean; error?: string }> {
  const client = getSupabaseClient();
  if (!client) return { success: false, error: 'Supabase not connected' };
  try {
    const { error } = await client.from('categories').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

// ==========================================
// 3. ORDERS & INQUIRIES API (From Frontend Forms)
// ==========================================

export async function submitOrderOrInquiry(
  payload: InquiryFormPayload,
  selectedProductObjects: any[] = []
): Promise<{ success: boolean; orderNumber: string; error?: string }> {
  const client = getSupabaseClient();
  const orderNumber = `BKA-${Math.floor(100000 + Math.random() * 900000)}`;

  const items = selectedProductObjects.map((item: any) => {
    // If it's an InquiryCartItem with { product, selectedPackSize, quantity }
    if (item.product) {
      return {
        id: item.product.id || item.productId,
        name: item.product.name,
        price: item.product.price,
        category: item.product.categoryLabel,
        packSize: item.selectedPackSize || item.packSize || item.product.packSizes?.[0] || 'Standard',
        quantity: item.quantity || 1
      };
    }
    // Standard Product object fallback
    return {
      id: item.id,
      name: item.name,
      price: item.price,
      category: item.categoryLabel,
      packSize: item.selectedPackSize || item.packSize || item.packSizes?.[0] || 'Standard',
      quantity: item.quantity || 1
    };
  });

  const orderRecord = {
    order_number: orderNumber,
    customer_name: payload.farmerName || 'Customer',
    phone: payload.phone || '',
    email: '',
    location: payload.location || '',
    crop_type: payload.cropType || '',
    farm_size_acres: payload.farmSizeAcres || '',
    preferred_brand: payload.preferredBrand || '',
    status: 'pending',
    items,
    total_amount: 0,
    message: payload.message || '',
    created_at: new Date().toISOString()
  };

  if (!client) {
    // Save to local storage cache so admin can still see it
    try {
      const localOrders = JSON.parse(localStorage.getItem('bukhari_local_orders') || '[]');
      localOrders.unshift({ ...orderRecord, id: `local-${Date.now()}` });
      localStorage.setItem('bukhari_local_orders', JSON.stringify(localOrders.slice(0, 50)));
    } catch (e) {
      console.warn(e);
    }
    return { success: true, orderNumber };
  }

  try {
    const { error } = await client.from('orders').insert([orderRecord]);
    if (error) {
      console.error('[Supabase order insert error]:', error);
      // fallback to local storage
      const localOrders = JSON.parse(localStorage.getItem('bukhari_local_orders') || '[]');
      localOrders.unshift({ ...orderRecord, id: `local-${Date.now()}` });
      localStorage.setItem('bukhari_local_orders', JSON.stringify(localOrders.slice(0, 50)));
    }
    return { success: true, orderNumber };
  } catch (err: any) {
    console.error('[Order submit exception]:', err);
    return { success: true, orderNumber }; // return success so user UX isn't blocked
  }
}

export async function fetchOrdersFromDb(): Promise<AdminOrder[]> {
  const client = getSupabaseClient();
  if (!client) {
    try {
      return JSON.parse(localStorage.getItem('bukhari_local_orders') || '[]');
    } catch {
      return [];
    }
  }

  try {
    const { data, error } = await client
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('[Fetch orders error]:', error.message);
      return JSON.parse(localStorage.getItem('bukhari_local_orders') || '[]');
    }
    return data || [];
  } catch (err) {
    console.error('[Fetch orders err]:', err);
    return [];
  }
}

export async function updateOrderStatusInDb(id: string, status: string, notes?: string): Promise<{ success: boolean; error?: string }> {
  const client = getSupabaseClient();
  if (!client) {
    try {
      const orders: AdminOrder[] = JSON.parse(localStorage.getItem('bukhari_local_orders') || '[]');
      const updated = orders.map(o => o.id === id ? { ...o, status: status as any, admin_notes: notes } : o);
      localStorage.setItem('bukhari_local_orders', JSON.stringify(updated));
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }

  try {
    const { error } = await client
      .from('orders')
      .update({ status, admin_notes: notes, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

// ==========================================
// 4. CUSTOM PAGES API (CMS / Page Builder)
// ==========================================

export async function fetchCustomPagesFromDb(): Promise<CustomPage[]> {
  const client = getSupabaseClient();
  if (!client) {
    return [
      {
        id: '1',
        slug: 'about-us',
        title: 'About Bukhari Agro (Pvt) Ltd',
        content: 'Headquartered in Mian Channu, Punjab, Bukhari Agro (Pvt) Ltd is a trusted distributor and provider of premium crop protection, high-yield fertilizers, and precision agronomy services across Pakistan.',
        is_published: true,
        created_at: new Date().toISOString()
      },
      {
        id: '2',
        slug: 'terms-conditions',
        title: 'Terms & Conditions',
        content: 'All agricultural chemicals must be used in accordance with the recommended dosage on the official label. Bukhari Agro guarantees original packaging and genuine batch verification.',
        is_published: true,
        created_at: new Date().toISOString()
      }
    ];
  }

  try {
    const { data, error } = await client
      .from('custom_pages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('[Fetch custom pages error]:', err);
    return [];
  }
}

export async function saveCustomPageToDb(page: Partial<CustomPage>, isEditingId?: string): Promise<{ success: boolean; error?: string }> {
  const client = getSupabaseClient();
  if (!client) return { success: false, error: 'Supabase client not connected' };

  try {
    const payload = {
      slug: page.slug,
      title: page.title,
      content: page.content,
      meta_title: page.meta_title,
      meta_description: page.meta_description,
      featured_image: page.featured_image,
      is_published: page.is_published !== false,
      updated_at: new Date().toISOString()
    };

    if (isEditingId) {
      const { error } = await client.from('custom_pages').update(payload).eq('id', isEditingId);
      if (error) throw error;
    } else {
      const { error } = await client.from('custom_pages').insert([{ ...payload, created_at: new Date().toISOString() }]);
      if (error) throw error;
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

export async function deleteCustomPageFromDb(id: string): Promise<{ success: boolean; error?: string }> {
  const client = getSupabaseClient();
  if (!client) return { success: false, error: 'Supabase client not connected' };
  try {
    const { error } = await client.from('custom_pages').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

// ==========================================
// 5. STORAGE / MEDIA LIBRARY API
// ==========================================

export async function uploadMediaToSupabase(
  file: File,
  bucket: string = 'bukhari-media'
): Promise<{ success: boolean; publicUrl?: string; error?: string }> {
  const client = getSupabaseClient();
  if (client) {
    try {
      const ext = file.name.split('.').pop() || 'jpg';
      const cleanName = file.name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
      const filePath = `${Date.now()}_${cleanName}.${ext}`;

      const { data, error } = await client.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (!error && data) {
        const { data: urlData } = client.storage
          .from(bucket)
          .getPublicUrl(data.path);

        return {
          success: true,
          publicUrl: urlData.publicUrl
        };
      }
    } catch (err: any) {
      console.warn('[Supabase Storage upload error, falling back to server]:', err);
    }
  }

  // Fallback: Direct server upload to /api/upload-image (saved persistently to public/images/)
  try {
    const base64Data = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    const res = await fetch('/api/upload-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        base64Data,
        filename: file.name,
        prefix: 'media'
      })
    });

    if (res.ok) {
      const json = await res.json();
      const url = json.url || json.file?.url;
      if (json.success && url) {
        return { success: true, publicUrl: url };
      }
    }
  } catch (backendErr: any) {
    console.error('[Backend upload fallback error]:', backendErr);
  }

  return { success: false, error: 'Failed to upload media to storage.' };
}

export async function listMediaFromSupabase(bucket: string = 'bukhari-media'): Promise<Array<{ name: string; publicUrl: string; size?: number; createdAt?: string }>> {
  const client = getSupabaseClient();
  if (!client) return [];

  try {
    const { data, error } = await client.storage
      .from(bucket)
      .list('', { limit: 100, sortBy: { column: 'created_at', order: 'desc' } });

    if (error || !data) return [];

    return data
      .filter(item => item.name !== '.emptyFolderPlaceholder')
      .map(item => {
        const { data: urlData } = client.storage.from(bucket).getPublicUrl(item.name);
        return {
          name: item.name,
          publicUrl: urlData.publicUrl,
          size: (item as any).metadata?.size || 0,
          createdAt: item.created_at
        };
      });
  } catch (err) {
    console.warn('[List media error]:', err);
    return [];
  }
}

// ==========================================
// 6. SITE SETTINGS API
// ==========================================

export async function fetchSiteSettingsFromDb(): Promise<SiteSettings> {
  const client = getSupabaseClient();
  if (!client) return defaultSiteSettings;

  try {
    const { data, error } = await client
      .from('site_settings')
      .select('*')
      .eq('id', 'general')
      .maybeSingle();

    if (error || !data) return defaultSiteSettings;

    return {
      logo: {
        type: (data.logo_type as any) || 'svg',
        imageUrl: data.logo_url || '',
        companyName: data.company_name || 'Bukhari Agro (Pvt) Ltd',
        tagline: data.tagline || 'Healthy Crops, Brighter Future',
        height: data.logo_height || 48
      },
      headerButtons: defaultSiteSettings.headerButtons,
      topBarText: data.top_bar_text || defaultSiteSettings.topBarText,
      helplinePhone: data.helpline_phone || defaultSiteSettings.helplinePhone,
      whatsappNumber: data.whatsapp_number || defaultSiteSettings.whatsappNumber,
      email: data.email || defaultSiteSettings.email,
      address: data.address || defaultSiteSettings.address,
      ctaButtonText: data.cta_button_text || defaultSiteSettings.ctaButtonText
    };
  } catch (err) {
    return defaultSiteSettings;
  }
}

export async function saveSiteSettingsToDb(settings: SiteSettings): Promise<{ success: boolean; error?: string }> {
  const client = getSupabaseClient();
  if (!client) return { success: false, error: 'Supabase not connected' };

  try {
    const payload = {
      id: 'general',
      company_name: settings.logo.companyName,
      tagline: settings.logo.tagline,
      logo_type: settings.logo.type,
      logo_url: settings.logo.imageUrl,
      logo_height: settings.logo.height,
      helpline_phone: settings.helplinePhone,
      whatsapp_number: settings.whatsappNumber,
      email: settings.email,
      address: settings.address,
      top_bar_text: settings.topBarText,
      cta_button_text: settings.ctaButtonText,
      updated_at: new Date().toISOString()
    };

    const { error } = await client.from('site_settings').upsert(payload);
    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

// ==========================================
// 7. PARTNER BRANDS API
// ==========================================

export async function fetchBrandsFromDb(): Promise<PartnerBrand[]> {
  const client = getSupabaseClient();
  if (!client) return partnerBrands;

  try {
    const { data, error } = await client
      .from('partner_brands')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return partnerBrands;
    }

    return data.map((b: any) => ({
      id: b.id || b.slug,
      name: b.name || 'Brand Partner',
      country: b.country || 'Pakistan / Global',
      tier: b.tier || 'Authorized Distributor',
      badge: b.badge || 'Verified Partner',
      description: b.description || '',
      logoUrl: b.logo_url,
      website: b.website,
      isFeatured: Boolean(b.is_featured)
    }));
  } catch (err) {
    console.warn('[Fetch brands error - using local data]:', err);
    return partnerBrands;
  }
}

export async function saveBrandToDb(brand: Partial<PartnerBrand>, isEditingId?: string): Promise<{ success: boolean; error?: string }> {
  const client = getSupabaseClient();
  if (!client) return { success: false, error: 'Supabase not connected' };

  try {
    const payload = {
      name: brand.name,
      country: brand.country,
      tier: brand.tier,
      badge: brand.badge,
      description: brand.description,
      logo_url: brand.logoUrl,
      website: brand.website,
      is_featured: brand.isFeatured !== false,
      updated_at: new Date().toISOString()
    };

    if (isEditingId) {
      const { error } = await client.from('partner_brands').update(payload).eq('id', isEditingId);
      if (error) throw error;
    } else {
      const { error } = await client.from('partner_brands').insert([{
        ...payload,
        id: brand.id || brand.name?.toLowerCase().replace(/[^a-z0-9]/g, '-') || `brand-${Date.now()}`,
        created_at: new Date().toISOString()
      }]);
      if (error) throw error;
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

export async function deleteBrandFromDb(id: string): Promise<{ success: boolean; error?: string }> {
  const client = getSupabaseClient();
  if (!client) return { success: false, error: 'Supabase not connected' };

  try {
    const { error } = await client.from('partner_brands').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

// ==========================================
// 8. TEAM MEMBERS API (Leadership & Agronomists)
// ==========================================

export async function fetchTeamFromDb(): Promise<TeamMember[]> {
  const client = getSupabaseClient();

  // Try Supabase first
  if (client) {
    try {
      const { data, error } = await client
        .from('team_members')
        .select('*')
        .order('sort_order', { ascending: true });

      if (!error && Array.isArray(data)) {
        return data.map((m: any) => ({
          id: m.id || m.member_key,
          name: m.name || 'Team Member',
          role: m.role || 'Agronomist',
          department: m.department || 'Technical Division',
          qualification: m.qualification || '',
          experience: m.experience || '',
          bio: m.bio || '',
          imageUrl: m.image_url || '/images/team-agronomist.jpg',
          specialty: m.specialty || 'Crop Protection & Advisory',
          email: m.email || 'bukhariagropvtltd@gmail.com'
        }));
      }
    } catch (err) {
      console.warn('[Fetch team from Supabase error]:', err);
    }
  }

  // Fallback to Express backend /api/team
  try {
    const res = await fetch(`/api/team?_t=${Date.now()}`, { cache: 'no-store' });
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        try {
          localStorage.setItem('bukhari_team_members', JSON.stringify(json.data));
          localStorage.setItem('bukhari_team_fetched', 'true');
        } catch {}
        return json.data;
      }
    }
  } catch (err) {
    console.warn('[Fetch team from /api/team error]:', err);
  }

  // Fallback to localStorage
  try {
    const cached = localStorage.getItem('bukhari_team_members');
    const fetched = localStorage.getItem('bukhari_team_fetched');
    if (cached && fetched) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch {}

  // If no backend team configured or user cleared all, return empty array
  return [];
}

export async function saveTeamMemberToDb(
  member: Partial<TeamMember>,
  isEditingId?: string
): Promise<{ success: boolean; data?: TeamMember; error?: string }> {
  const client = getSupabaseClient();

  const payload = {
    name: member.name,
    role: member.role,
    department: member.department || 'Agronomy & Advisory',
    qualification: member.qualification || '',
    experience: member.experience || '',
    bio: member.bio || '',
    image_url: member.imageUrl || '/images/team-agronomist.jpg',
    specialty: member.specialty || 'Crop Care & Agronomic Solutions',
    email: member.email || 'bukhariagropvtltd@gmail.com',
    updated_at: new Date().toISOString()
  };

  let savedMember: TeamMember | null = null;

  // 1. Save to Supabase if connected
  if (client) {
    try {
      if (isEditingId) {
        const { data, error } = await client
          .from('team_members')
          .update(payload)
          .eq('id', isEditingId)
          .select()
          .maybeSingle();

        if (error) {
          console.warn('[Supabase update team error]:', error.message);
        } else if (data) {
          savedMember = {
            id: data.id,
            name: data.name,
            role: data.role,
            department: data.department,
            qualification: data.qualification,
            experience: data.experience,
            bio: data.bio,
            imageUrl: data.image_url,
            specialty: data.specialty,
            email: data.email
          };
        }
      } else {
        const { data, error } = await client
          .from('team_members')
          .insert([{
            ...payload,
            member_key: member.name?.toLowerCase().replace(/[^a-z0-9]/g, '-') || `member-${Date.now()}`,
            created_at: new Date().toISOString()
          }])
          .select()
          .maybeSingle();

        if (error) {
          console.warn('[Supabase insert team error]:', error.message);
        } else if (data) {
          savedMember = {
            id: data.id,
            name: data.name,
            role: data.role,
            department: data.department,
            qualification: data.qualification,
            experience: data.experience,
            bio: data.bio,
            imageUrl: data.image_url,
            specialty: data.specialty,
            email: data.email
          };
        }
      }
    } catch (e) {
      console.warn('[Supabase save team error]:', e);
    }
  }

  // 2. Also sync to Express backend /api/team
  try {
    if (isEditingId) {
      await fetch(`/api/team/${isEditingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(member)
      });
    } else {
      await fetch('/api/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(member)
      });
    }
  } catch (err) {
    console.warn('[Sync to /api/team error]:', err);
  }

  // 3. Cache to localStorage
  try {
    const currentTeam = await fetchTeamFromDb();
    let updatedTeam: TeamMember[];
    if (isEditingId) {
      updatedTeam = currentTeam.map(m => m.id === isEditingId ? { ...m, ...member } as TeamMember : m);
    } else {
      const newMember: TeamMember = savedMember || {
        id: member.id || `member-${Date.now()}`,
        name: member.name || 'New Member',
        role: member.role || 'Agronomist',
        department: member.department || 'Technical Division',
        qualification: member.qualification || '',
        experience: member.experience || '',
        bio: member.bio || '',
        imageUrl: member.imageUrl || '/images/team-agronomist.jpg',
        specialty: member.specialty || '',
        email: member.email || 'bukhariagropvtltd@gmail.com'
      };
      updatedTeam = [...currentTeam, newMember];
    }
    localStorage.setItem('bukhari_team_members', JSON.stringify(updatedTeam));
    return { success: true, data: savedMember || undefined };
  } catch (err: any) {
    return { success: true };
  }
}

export async function deleteTeamMemberFromDb(id: string): Promise<{ success: boolean; error?: string }> {
  const client = getSupabaseClient();

  if (client) {
    try {
      await client.from('team_members').delete().eq('id', id);
    } catch (err) {
      console.warn('[Supabase delete team member error]:', err);
    }
  }

  try {
    await fetch(`/api/team/${id}`, { method: 'DELETE' });
  } catch (err) {
    console.warn('API delete team error:', err);
  }

  try {
    const cached = localStorage.getItem('bukhari_team_members');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed)) {
        const updated = parsed.filter((m: any) => m.id !== id);
        localStorage.setItem('bukhari_team_members', JSON.stringify(updated));
        localStorage.setItem('bukhari_team_fetched', 'true');
      }
    } else {
      localStorage.setItem('bukhari_team_members', JSON.stringify([]));
      localStorage.setItem('bukhari_team_fetched', 'true');
    }
  } catch {}

  return { success: true };
}
