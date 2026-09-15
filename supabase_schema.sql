-- ==============================================================================
-- BUKHARI AGRO (PVT) LTD - SUPABASE DATABASE SCHEMA & STORAGE SETUP
-- PostgreSQL Schema for Products, Categories, Orders, Custom Pages & Site Settings
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 2. TABLE: CATEGORIES
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(100) DEFAULT 'Sprout',
    accent_color VARCHAR(50) DEFAULT 'emerald',
    image_url TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for category lookups
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);

-- ==============================================================================
-- 3. TABLE: PRODUCTS (WooCommerce Style)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    brand_name VARCHAR(255),
    company VARCHAR(255) DEFAULT 'Bukhari Agro (Pvt) Ltd',
    category_slug VARCHAR(100) REFERENCES public.categories(slug) ON UPDATE CASCADE ON DELETE SET NULL,
    category_label VARCHAR(100),
    price VARCHAR(100),              -- e.g. "Rs. 3,450" or numeric string
    sale_price VARCHAR(100),         -- e.g. "Rs. 2,950"
    stock_status VARCHAR(50) DEFAULT 'in_stock', -- in_stock, out_of_stock, backorder
    in_stock BOOLEAN DEFAULT true,
    tagline TEXT,
    short_description TEXT,
    full_description TEXT,
    active_ingredient VARCHAR(255),
    formulation VARCHAR(150),
    target_crops TEXT[] DEFAULT '{}',
    target_pests TEXT[] DEFAULT '{}',
    pack_sizes TEXT[] DEFAULT '{}',
    dosage TEXT,
    application_method TEXT,
    precautions TEXT[] DEFAULT '{}',
    image_url TEXT,
    gallery_images TEXT[] DEFAULT '{}',
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_slug);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(featured);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products(created_at DESC);

-- ==============================================================================
-- 4. TABLE: ORDERS & INQUIRIES
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    location VARCHAR(255),
    crop_type VARCHAR(255),
    farm_size_acres VARCHAR(100),
    preferred_brand VARCHAR(255),
    status VARCHAR(50) DEFAULT 'pending', -- pending, contacted, processing, completed, cancelled
    items JSONB DEFAULT '[]'::jsonb,      -- Array of products: [{ id, name, price, quantity, packSize }]
    total_amount NUMERIC(12,2) DEFAULT 0,
    message TEXT,
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

-- ==============================================================================
-- 5. TABLE: CUSTOM PAGES (CMS / Page Builder)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.custom_pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(150) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,                -- Supports HTML or Markdown
    meta_title VARCHAR(255),
    meta_description TEXT,
    featured_image TEXT,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_custom_pages_slug ON public.custom_pages(slug);

-- ==============================================================================
-- 6. TABLE: SITE SETTINGS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.site_settings (
    id VARCHAR(50) PRIMARY KEY DEFAULT 'general',
    company_name VARCHAR(255) DEFAULT 'Bukhari Agro (Pvt) Ltd',
    tagline TEXT DEFAULT 'Healthy Crops, Brighter Future',
    logo_type VARCHAR(50) DEFAULT 'svg',
    logo_url TEXT DEFAULT '',
    logo_height INTEGER DEFAULT 48,
    helpline_phone VARCHAR(50) DEFAULT '+92 311 6666600',
    whatsapp_number VARCHAR(50) DEFAULT '+92 311 6666600',
    email VARCHAR(255) DEFAULT 'bukhariagropvtltd@gmail.com',
    address TEXT DEFAULT 'Main Kacha Khoh Road, Mian Channu, Punjab, Pakistan',
    top_bar_text TEXT DEFAULT 'Healthy Crops, Brighter Future',
    cta_button_text VARCHAR(100) DEFAULT 'bukhariagro.com',
    header_buttons JSONB DEFAULT '[]'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 7. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Public can READ categories, products, published pages, and site settings
CREATE POLICY "Public Read Categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public Read Products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public Read Pages" ON public.custom_pages FOR SELECT USING (is_published = true);
CREATE POLICY "Public Read Settings" ON public.site_settings FOR SELECT USING (true);

-- Public Frontend can INSERT Orders/Inquiries
CREATE POLICY "Public Insert Orders" ON public.orders FOR INSERT WITH CHECK (true);

-- Allow authenticated / service_role / anon admin operations
-- (In Supabase, anon key with full policy or authenticated dashboard access)
CREATE POLICY "Admin Full Access Categories" ON public.categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin Full Access Products" ON public.products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin Full Access Orders" ON public.orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin Full Access Pages" ON public.custom_pages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin Full Access Settings" ON public.site_settings FOR ALL USING (true) WITH CHECK (true);

-- ==============================================================================
-- 8. SUPABASE STORAGE SETUP
-- Run in Supabase SQL editor or create via Supabase Dashboard -> Storage
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('bukhari-media', 'bukhari-media', true),
  ('product-images', 'product-images', true),
  ('banners', 'banners', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage RLS: Anyone can view images (Public Read)
CREATE POLICY "Public Access Media" ON storage.objects
FOR SELECT USING (bucket_id IN ('bukhari-media', 'product-images', 'banners'));

-- Storage RLS: Upload access
CREATE POLICY "Public Upload Media" ON storage.objects
FOR INSERT WITH CHECK (bucket_id IN ('bukhari-media', 'product-images', 'banners'));

-- Storage RLS: Delete access
CREATE POLICY "Public Delete Media" ON storage.objects
FOR DELETE USING (bucket_id IN ('bukhari-media', 'product-images', 'banners'));

-- ==============================================================================
-- 9. SEED DATA - INITIAL CATEGORIES
-- ==============================================================================
INSERT INTO public.categories (slug, name, description, icon, accent_color, order_index)
VALUES
  ('pesticides', 'Pesticides & Insecticides', 'Broad-spectrum pest defense, sucking and chewing pest control for cotton, rice, and maize.', 'ShieldAlert', 'emerald', 1),
  ('fertilizers', 'Fertilizers & Plant Nutrition', 'Targeted macro and micronutrient blends engineered for soil fertility and maximum yield.', 'Leaf', 'amber', 2),
  ('herbicides', 'Weedicides & Herbicides', 'Pre-emergence and post-emergence weed eradication formulations safeguarding vital nutrients.', 'Flame', 'rose', 3),
  ('fungicides', 'Fungicides & Disease Control', 'Preventive and systemic fungal cures safeguarding against blights, rusts, and powdery mildew.', 'Droplet', 'sky', 4),
  ('growth-regulators', 'Plant Growth Regulators (PGR)', 'Hormonal bio-stimulants promoting vigorous root systems, early flowering, and fruit set.', 'Zap', 'teal', 5),
  ('micronutrients', 'Bio-Stimulants & Micronutrients', 'Chelated zinc, boron, sulfur, and humic acid blends revitalizing stressed soils.', 'Sparkles', 'lime', 6)
ON CONFLICT (slug) DO UPDATE 
SET name = EXCLUDED.name, description = EXCLUDED.description;

-- ==============================================================================
-- 10. SEED DATA - INITIAL SITE SETTINGS
-- ==============================================================================
INSERT INTO public.site_settings (id, company_name, tagline, helpline_phone, whatsapp_number, email, address, top_bar_text, cta_button_text)
VALUES (
  'general',
  'Bukhari Agro (Pvt) Ltd',
  'Healthy Crops, Brighter Future',
  '+92 311 6666600',
  '+92 311 6666600',
  'bukhariagropvtltd@gmail.com',
  'Main Kacha Khoh Road, Mian Channu, Punjab, Pakistan',
  'Healthy Crops, Brighter Future',
  'bukhariagro.com'
) ON CONFLICT (id) DO NOTHING;

-- ==============================================================================
-- 11. SEED DATA - INITIAL PRODUCTS
-- ==============================================================================
INSERT INTO public.products (
  name, brand_name, company, category_slug, category_label, price, sale_price, in_stock,
  tagline, short_description, full_description, active_ingredient, formulation,
  target_crops, target_pests, pack_sizes, dosage, application_method, precautions,
  image_url, featured
)
VALUES
(
  'Emamectin Ultra 1.9% EC',
  'Bukhari Crop Protection',
  'Bukhari Agro (Pvt) Ltd',
  'pesticides',
  'Pesticides & Insecticides',
  'Rs. 2,450',
  'Rs. 2,200',
  true,
  'Advanced stomach and contact insecticide for tough lepidopteran pests',
  'Fast-acting neurotoxin targeting bollworms, armyworms, and diamondback moths with low environmental impact.',
  'Emamectin Ultra 1.9% EC penetrates plant foliage via translaminar action. Ingested by larvae, it immediately halts feeding within 2 hours, preventing further crop defoliation.',
  'Emamectin Benzoate 1.9% w/v',
  'Emulsifiable Concentrate (EC)',
  ARRAY['Cotton', 'Rice', 'Maize', 'Vegetables', 'Citrus'],
  ARRAY['Spotted Bollworm', 'American Bollworm', 'Armyworm', 'Diamondback Moth', 'Thrips'],
  ARRAY['200 ml', '500 ml', '1000 ml'],
  '200 - 250 ml per acre in 100-120 Liters of water',
  'Foliar spray during early instar infestation in evening hours',
  ARRAY['Avoid spraying in extreme mid-day heat', 'Wear protective gloves and mask', 'Store away from direct sunlight and children'],
  'https://images.unsplash.com/photo-1592417817098-8f3d69102a47?auto=format&fit=crop&w=800&q=80',
  true
),
(
  'Chlorpyrifos Super 40% EC',
  'Swat Agro Chemicals Partner',
  'Swat Agro Chemicals',
  'pesticides',
  'Pesticides & Insecticides',
  'Rs. 3,100',
  'Rs. 2,850',
  true,
  'Proven organophosphate for soil treatment, termites, and stem borers',
  'Reliable contact, stomach, and vapor-action pesticide for destructive soil-borne insects, termites, and foliage borers.',
  'Chlorpyrifos Super provides vapor action that permeates soil pores to neutralize termites, cutworms, and root grubs around wheat, sugarcane, and orchards.',
  'Chlorpyrifos 40% EC',
  'Emulsifiable Concentrate (EC)',
  ARRAY['Sugarcane', 'Cotton', 'Wheat', 'Mango', 'Citrus'],
  ARRAY['Termites', 'Cutworms', 'Stem Borers', 'Aphids', 'Root Grubs'],
  ARRAY['1000 ml', '5000 ml Canister'],
  '1000 ml per acre via flood irrigation or soil drenching',
  'Flood irrigation / soil drenching or targeted tree trunk wash',
  ARRAY['Highly toxic to aquatic life', 'Maintain safe harvesting interval of 21 days', 'Wash skin thoroughly after handling'],
  'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=800&q=80',
  true
),
(
  'BioPotash Soluble 0-0-50',
  'Tara Crop Sciences Quality Line',
  'Tara Group Pakistan',
  'fertilizers',
  'Fertilizers & Plant Nutrition',
  'Rs. 5,800',
  'Rs. 5,400',
  true,
  '100% water-soluble Potassium Sulphate with active bio-catalysts',
  'Premium sulfate of potash enriched with sulfur for grain filling, bold fruit sizing, and stress resistance.',
  'BioPotash Soluble accelerates carbohydrate translocation into grains, cotton bolls, and citrus fruits. It significantly enhances crop weight, brix sweetness, and shelf life.',
  'Potassium (K2O) 50% + Sulphur (S) 17.5%',
  '100% Water Soluble Micro-Crystals',
  ARRAY['Wheat', 'Cotton', 'Potato', 'Sugarcane', 'Mango', 'Citrus'],
  ARRAY['Potassium Deficiency', 'Grain Shriveling', 'Drought Stress', 'Tip Burn'],
  ARRAY['5 kg Bag', '25 kg Sack'],
  '5 kg per acre through fertigation or 1 kg in 100 L foliar spray',
  'Drip irrigation, flood fertigation, or foliar nutrition spray',
  ARRAY['Do not mix directly with concentrated calcium fertilizers', 'Keep bag tightly sealed after use'],
  'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=800&q=80',
  true
),
(
  'TopGun Weed-Kill 71% SG',
  'Bukhari Agro Selective Weed Care',
  'Bukhari Agro (Pvt) Ltd',
  'herbicides',
  'Weedicides & Herbicides',
  'Rs. 1,650',
  'Rs. 1,450',
  true,
  'Non-selective systemic broad-spectrum herbicide in easy soluble granules',
  'Complete eradication of stubborn perennial deep-rooted weeds in orchards, field borders, and fallow land.',
  'TopGun Weed-Kill is absorbed through the green foliage and translocated downwards to root rhizomes, ensuring complete eradication without regrowth.',
  'Ammonium Salt of Glyphosate 71% SG',
  'Soluble Granules (SG)',
  ARRAY['Orchards', 'Non-Crop Land', 'Field Borders', 'Sugarcane Inter-row'],
  ARRAY['Deela (Cyperus)', 'Khabbal Grass', 'Dhaba', 'Parthenium', 'Wild Sorghum'],
  ARRAY['100 gm sachet', '500 gm pack', '1 kg container'],
  '1000 gm per acre in 120 Liters clean water',
  'Directed foliar spray with flood-jet nozzle avoiding drift on crop green parts',
  ARRAY['Use clean pond/canal water; do not use muddy water', 'Do not spray when rain is expected within 4 hours'],
  'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=800&q=80',
  true
),
(
  'Azoxy-Plus Duo 32.5% SC',
  'Kanzo AG Certified Line',
  'Kanzo Quality Crop Care',
  'fungicides',
  'Fungicides & Disease Control',
  'Rs. 4,200',
  'Rs. 3,850',
  true,
  'Broad-spectrum dual systemic fungicide for blights, rusts, and powdery mildew',
  'Synergistic strobilurin + triazole chemistry providing preventive, curative, and eradicative protection.',
  'Azoxy-Plus Duo inhibits fungal spore germination while curing established fungal mycelium inside leaf tissue. It exhibits a greening effect that boosts photosynthesis.',
  'Azoxystrobin 20% + Difenoconazole 12.5% SC',
  'Suspension Concentrate (SC)',
  ARRAY['Rice', 'Wheat', 'Chili', 'Tomato', 'Citrus', 'Mango'],
  ARRAY['Rice Blast', 'Sheath Blight', 'Wheat Rust', 'Anthracnose', 'Powdery Mildew'],
  ARRAY['200 ml', '500 ml'],
  '200 ml per acre in 100-120 Liters water',
  'Preventive or early curative foliar spray',
  ARRAY['Rotate with different mode-of-action fungicides to prevent resistance', 'Safe pre-harvest interval: 14 days'],
  'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=800&q=80',
  true
),
(
  'Humic Gold Max 85% SP',
  'Bukhari Bio-Nutrition',
  'Bukhari Agro (Pvt) Ltd',
  'micronutrients',
  'Bio-Stimulants & Micronutrients',
  'Rs. 1,950',
  'Rs. 1,750',
  true,
  'High-grade active Potassium Humate + Fulvic Acid soil energizer',
  'Improves soil cation exchange capacity (CEC), mobilizes locked phosphorus, and stimulates deep root growth.',
  'Humic Gold Max conditions alkaline Pakistani soils, chelatizes micronutrients, and improves moisture retention in hot summer conditions.',
  'Potassium Humate 80% + Fulvic Acid 5% + K2O 10%',
  '100% Soluble Black Powder (SP)',
  ARRAY['Cotton', 'Wheat', 'Rice', 'Sugarcane', 'Citrus', 'Vegetables'],
  ARRAY['Soil Compaction', 'Low Fertilizer Efficiency', 'Root Weakness', 'Salinity Stress'],
  ARRAY['1 kg Pouch', '5 kg Bucket'],
  '1 - 2 kg per acre with initial irrigation or mixed with granular urea/DAP',
  'Soil application via flood irrigation or fertilizer seed dressing',
  ARRAY['Store in cool dry conditions', 'Dissolve completely before pouring into irrigation channel'],
  'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=800&q=80',
  true
)
ON CONFLICT DO NOTHING;

-- ==============================================================================
-- 12. TABLE: TEAM MEMBERS (About Us Leadership & Agronomists)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_key VARCHAR(100) UNIQUE,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    department VARCHAR(255) NOT NULL,
    qualification VARCHAR(255),
    experience VARCHAR(255),
    bio TEXT,
    image_url TEXT,
    specialty TEXT,
    email VARCHAR(255),
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read team members" ON public.team_members FOR SELECT USING (true);
CREATE POLICY "Admin manage team members" ON public.team_members FOR ALL USING (true) WITH CHECK (true);

-- ==============================================================================
-- 13. SEED DATA - INITIAL CUSTOM PAGES
-- ==============================================================================
INSERT INTO public.custom_pages (slug, title, content, meta_title, meta_description, is_published)
VALUES
(
  'about-us',
  'About Bukhari Agro (Pvt) Ltd',
  '<h2>Welcome to Bukhari Agro (Pvt) Ltd</h2><p>Headquartered in Mian Channu, Punjab, Bukhari Agro (Pvt) Ltd is a trusted distributor and provider of premium crop protection, high-yield fertilizers, and precision agronomy services across Pakistan.</p><h3>Our Commitment</h3><p>We empower farmers with authentic, tested, and high-potency agrochemical solutions from renowned national and multinational partners.</p>',
  'About Bukhari Agro - Leaders in Agrochemicals',
  'Learn about Bukhari Agro history, mission, leadership, and agronomy services.',
  true
),
(
  'terms-conditions',
  'Terms & Conditions',
  '<h2>Agro Product Advisory & Terms</h2><p>All agricultural chemicals must be used in accordance with the recommended dosage on the official label. Bukhari Agro guarantees original packaging and genuine batch verification.</p>',
  'Terms & Conditions - Bukhari Agro',
  'Official terms and agronomy advisory guidelines.',
  true
)
ON CONFLICT (slug) DO NOTHING;

-- ==============================================================================
-- 14. SEED DATA - INITIAL TEAM MEMBERS
-- ==============================================================================
INSERT INTO public.team_members (member_key, name, role, department, qualification, experience, bio, image_url, specialty, sort_order)
VALUES
(
  'syed-bukhari',
  'Syed Bukhari',
  'Managing Director & Founder',
  'Executive Leadership',
  'M.Sc. Agribusiness & Rural Economy',
  '18+ Years Experience in Agrochemical Supply Chains',
  'Visionary agribusiness leader dedicated to connecting Punjab and Sindh farmers with authentic, unadulterated crop protection from the world''s most reputable manufacturers.',
  '/images/team-director.jpg',
  'Agri-Enterprise Strategy, Multi-Brand Procurement & Farmer Alliances',
  1
),
(
  'dr-tariq-mahmood',
  'Dr. Tariq Mahmood',
  'Chief Agronomist & Technical Director',
  'Research & Agronomic Advisory',
  'Ph.D. in Plant Pathology & Crop Protection',
  '15+ Years in Field Diagnostics & Resistance Management',
  'Specializes in fungal epidemiology, pest life-cycle forecasting, and calibrated tank-mix optimization for cotton, wheat, and citrus orchards.',
  '/images/team-agronomist.jpg',
  'Crop Diagnostics, Tank-Mix Chemistry & Integrated Pest Management (IPM)',
  2
),
(
  'engr-muhammad-imran',
  'Engr. Muhammad Imran',
  'Head of Supply Chain & Quality Assurance',
  'Logistics & Regulatory Compliance',
  'B.Sc. Chemical Engineering, MBA Operations',
  '12+ Years Multi-brand Warehousing & Quality Verification',
  'Ensures that every pesticide bottle and fertilizer batch distributed through Bukhari Agro maintains strict batch certification, optimum storage temperature, and genuine tamper-evident sealing.',
  '/images/team-director.jpg',
  'Cold Chain Storage, Batch Traceability & Anti-Counterfeit Auditing',
  3
),
(
  'ch-usman-rafiq',
  'Ch. Usman Rafiq',
  'Senior Regional Field Agronomist',
  'Field Extension & Farmer Outreach',
  'B.Sc. (Hons) Agronomy, UAF',
  '10+ Years On-Farm Consultations',
  'Conducts weekly field seminars, soil sample assessments, and on-farm demonstrations helping progressive and smallholder growers maximize harvest tonnage.',
  '/images/team-agronomist.jpg',
  'Wheat Weed Control, Cotton Pink Bollworm Mitigation & Drip Fertigation',
  4
)
ON CONFLICT (member_key) DO NOTHING;
