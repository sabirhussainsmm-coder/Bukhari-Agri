import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { initialTeamMembers, categoriesData, contactInfo } from './src/data/agroData.ts';
import { TeamMember, InquiryFormPayload, Product, PartnerBrand, SiteSettings } from './src/types.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, 'src', 'data', 'backendDb.json');

// Interface for persisted database
interface BackendDatabase {
  siteSettings: SiteSettings;
  brands: PartnerBrand[];
  products: Product[];
  team: TeamMember[];
}

// Load database from file or initialize with defaults
function loadDatabase(): BackendDatabase {
  try {
    if (fs.existsSync(DB_PATH)) {
      const raw = fs.readFileSync(DB_PATH, 'utf-8');
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed.team)) {
        parsed.team = [];
      }
      if (!parsed.siteSettings.address) {
        parsed.siteSettings.address = "Head Office & Regional Distribution Hub, Jhangi Syedan, Islamabad, Pakistan";
      }
      return parsed;
    }
  } catch (err) {
    console.error("[Bukhari Agro Server] Error reading backendDb.json, falling back:", err);
  }

  // Fallback defaults
  return {
    siteSettings: {
      logo: {
        type: "svg",
        imageUrl: "",
        companyName: "Bukhari Agro (Pvt) Ltd",
        tagline: "Healthy Crops, Brighter Future",
        height: 48
      },
      headerButtons: [
        { id: "btn-home", label: "Home", targetTab: "home", visible: true, hasDropdown: false },
        { id: "btn-about", label: "About Us", targetTab: "about", visible: true, hasDropdown: false },
        { id: "btn-products", label: "Products", targetTab: "products", visible: true, hasDropdown: false },
        { id: "btn-categories", label: "Categories", targetTab: "categories", visible: true, hasDropdown: true },
        { id: "btn-brands", label: "Agro Brands", targetTab: "brands", visible: true, hasDropdown: false },
        { id: "btn-contact", label: "Contact", targetTab: "contact", visible: true, hasDropdown: false }
      ],
      topBarText: "Healthy Crops, Brighter Future",
      helplinePhone: "+92 311 6666600",
      whatsappNumber: "+92 311 6666600",
      email: "bukhariagropvtltd@gmail.com",
      address: "Head Office & Regional Distribution Hub, Jhangi Syedan, Islamabad, Pakistan",
      ctaButtonText: "bukhariagro.com",
      ctaButtonAction: "contact",
      ctaCustomUrl: ""
    },
    brands: [],
    products: [],
    team: []
  };
}

let db = loadDatabase();

function saveDatabase() {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf-8');
    console.log("[Bukhari Agro Server] Changes persisted successfully to", DB_PATH);
  } catch (err) {
    console.error("[Bukhari Agro Server] Failed to save backendDb.json:", err);
  }
}

// Store received inquiries
interface ServerInquiry extends InquiryFormPayload {
  id: string;
  receivedAt: string;
  status: 'new' | 'reviewed' | 'dispatched';
}

const serverInquiries: ServerInquiry[] = [];

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Support JSON bodies up to 20MB for direct image uploads
  app.use(express.json({ limit: '20mb' }));

  // Directly serve public/images statically so uploads are immediately accessible
  const publicImagesDir = path.join(__dirname, 'public', 'images');
  if (!fs.existsSync(publicImagesDir)) {
    fs.mkdirSync(publicImagesDir, { recursive: true });
  }
  app.use('/images', express.static(publicImagesDir, {
    etag: true,
    lastModified: true,
    setHeaders: (res) => {
      // Prevent stale browser caching when images are updated
      res.setHeader('Cache-Control', 'no-cache, must-revalidate');
    }
  }));

  // Admin Passcode Authentication Endpoint (Strictly protected, no hints)
  app.post('/api/admin/login', (req, res) => {
    const { password } = req.body;
    if (password === '7467') {
      return res.json({
        success: true,
        token: 'admin-auth-7467-active',
        message: 'Admin authentication successful.'
      });
    }
    return res.status(401).json({
      success: false,
      error: 'Invalid password. Access denied.'
    });
  });

  // === API ENDPOINTS (Defined BEFORE Vite / Static Handlers) ===

  // 1. Site Settings & Header Configuration API
  app.get('/api/site-settings', (req, res) => {
    res.json({
      success: true,
      data: db.siteSettings
    });
  });

  app.put('/api/site-settings', (req, res) => {
    const newSettings = req.body;
    if (!newSettings) {
      return res.status(400).json({ success: false, error: "Settings payload required." });
    }
    db.siteSettings = {
      ...db.siteSettings,
      ...newSettings,
      logo: {
        ...db.siteSettings.logo,
        ...(newSettings.logo || {})
      }
    };
    saveDatabase();
    res.json({
      success: true,
      message: "Site settings and header configuration updated successfully.",
      data: db.siteSettings
    });
  });

  // 2. Products API (Full CRUD + Search & Filters)
  app.get('/api/products', (req, res) => {
    const { category, company, search } = req.query;
    let filtered = [...db.products];

    if (category && typeof category === 'string' && category !== 'all') {
      filtered = filtered.filter(p => p.category?.toLowerCase() === category.toLowerCase());
    }

    if (company && typeof company === 'string' && company !== 'all') {
      filtered = filtered.filter(p => p.company?.toLowerCase().includes(company.toLowerCase()));
    }

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      filtered = filtered.filter(p => 
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.brandName && p.brandName.toLowerCase().includes(q)) ||
        (p.activeIngredient && p.activeIngredient.toLowerCase().includes(q)) ||
        (p.company && p.company.toLowerCase().includes(q)) ||
        (p.targetCrops && p.targetCrops.some(c => c.toLowerCase().includes(q))) ||
        (p.targetPestsOrRole && p.targetPestsOrRole.some(pest => pest.toLowerCase().includes(q)))
      );
    }

    res.json({
      success: true,
      total: filtered.length,
      data: filtered
    });
  });

  // Add new product
  app.post('/api/products', (req, res) => {
    const item: Partial<Product> = req.body;
    if (!item.name || !item.category) {
      return res.status(400).json({ success: false, error: "Product name and category are required." });
    }

    const newProduct: Product = {
      id: item.id || `prod-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: item.name,
      brandName: item.brandName || item.name,
      company: item.company || "Bukhari Agro",
      category: item.category,
      categoryLabel: item.categoryLabel || item.category.charAt(0).toUpperCase() + item.category.slice(1),
      price: item.price || "PKR 2,500",
      originalPrice: item.originalPrice || "",
      tagline: item.tagline || "Quality agricultural solution",
      shortDescription: item.shortDescription || "Effective formulation for enhanced farm output.",
      fullDescription: item.fullDescription || item.shortDescription || "Quality crop care formulation.",
      activeIngredient: item.activeIngredient || "Standard Active Matrix",
      formulation: item.formulation || "EC / SC Liquid",
      targetCrops: item.targetCrops || ["Wheat", "Cotton", "Rice", "Vegetables"],
      targetPestsOrRole: item.targetPestsOrRole || ["Crop Protection", "Vigor Enhancement"],
      packSizes: item.packSizes || ["500 ml", "1 Liter"],
      dosage: item.dosage || "250-400 ml per acre",
      applicationMethod: item.applicationMethod || "Foliar spray with recommended water volume.",
      precautions: item.precautions || ["Wear protective gear during handling", "Keep away from children"],
      imageUrl: item.imageUrl || "/images/pesticide-bottle.jpg",
      featured: Boolean(item.featured),
      inStock: item.inStock !== false
    };

    db.products.unshift(newProduct);
    saveDatabase();

    res.status(201).json({
      success: true,
      message: "Product added successfully.",
      data: newProduct
    });
  });

  // Update existing product
  app.put('/api/products/:id', (req, res) => {
    const { id } = req.params;
    const index = db.products.findIndex(p => p.id === id);

    if (index === -1) {
      return res.status(404).json({ success: false, error: `Product with ID '${id}' not found.` });
    }

    const updated = {
      ...db.products[index],
      ...req.body,
      id // preserve ID
    };

    db.products[index] = updated;
    saveDatabase();

    res.json({
      success: true,
      message: `Product '${updated.name}' updated successfully.`,
      data: updated
    });
  });

  // Delete product
  app.delete('/api/products/:id', (req, res) => {
    const { id } = req.params;
    const index = db.products.findIndex(p => p.id === id);

    if (index === -1) {
      return res.status(404).json({ success: false, error: `Product with ID '${id}' not found.` });
    }

    const removed = db.products.splice(index, 1)[0];
    saveDatabase();

    res.json({
      success: true,
      message: `Product '${removed.name}' removed successfully.`,
      removedId: id
    });
  });

  // 3. Partner Brands API (Full CRUD)
  app.get('/api/partners', (req, res) => {
    res.json({
      success: true,
      total: db.brands.length,
      data: db.brands
    });
  });

  // Add new brand
  app.post('/api/partners', (req, res) => {
    const brand: Partial<PartnerBrand> = req.body;
    if (!brand.name) {
      return res.status(400).json({ success: false, error: "Brand name is required." });
    }

    const newBrand: PartnerBrand = {
      id: brand.id || `brand-${brand.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`,
      name: brand.name,
      country: brand.country || "Pakistan",
      tier: brand.tier || "Authorized Partner",
      badge: brand.badge || "Certified Agri Solutions",
      description: brand.description || "Trusted manufacturer of quality agricultural inputs.",
      logoUrl: brand.logoUrl || "",
      website: brand.website || "",
      isFeatured: brand.isFeatured !== false
    };

    db.brands.push(newBrand);
    saveDatabase();

    res.status(201).json({
      success: true,
      message: `Brand '${newBrand.name}' added successfully.`,
      data: newBrand
    });
  });

  // Update brand
  app.put('/api/partners/:id', (req, res) => {
    const { id } = req.params;
    const index = db.brands.findIndex(b => b.id === id);

    if (index === -1) {
      return res.status(404).json({ success: false, error: `Brand with ID '${id}' not found.` });
    }

    const updated = {
      ...db.brands[index],
      ...req.body,
      id // preserve ID
    };

    db.brands[index] = updated;
    saveDatabase();

    res.json({
      success: true,
      message: `Brand '${updated.name}' updated successfully.`,
      data: updated
    });
  });

  // Delete brand
  app.delete('/api/partners/:id', (req, res) => {
    const { id } = req.params;
    const index = db.brands.findIndex(b => b.id === id);

    if (index === -1) {
      return res.status(404).json({ success: false, error: `Brand with ID '${id}' not found.` });
    }

    const removed = db.brands.splice(index, 1)[0];
    saveDatabase();

    res.json({
      success: true,
      message: `Brand '${removed.name}' removed successfully.`,
      removedId: id
    });
  });

  // 4. Image Upload & Asset Management API
  app.post('/api/upload-image', (req, res) => {
    try {
      const { base64Data, filename, prefix = 'img' } = req.body;
      if (!base64Data) {
        return res.status(400).json({ success: false, error: "base64Data is required." });
      }

      // Strip potential data URL prefix
      const matches = base64Data.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
      const buffer = Buffer.from(matches ? matches[2] : base64Data, 'base64');

      let ext = 'png';
      if (matches && matches[1]) {
        const mime = matches[1].toLowerCase();
        if (mime.includes('jpeg') || mime.includes('jpg')) ext = 'jpg';
        else if (mime.includes('png')) ext = 'png';
        else if (mime.includes('webp')) ext = 'webp';
        else if (mime.includes('svg')) ext = 'svg';
      } else if (filename && filename.includes('.')) {
        ext = filename.split('.').pop() || 'jpg';
      }

      const timestamp = Date.now();
      const rawBase = filename ? filename.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_') : `${prefix}_${timestamp}`;
      const safeName = `${prefix}_${rawBase}_${timestamp}.${ext}`;

      const uploadDir = path.join(__dirname, 'public', 'images');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const filePath = path.join(uploadDir, safeName);
      fs.writeFileSync(filePath, buffer);

      const publicUrl = `/images/${safeName}`;
      console.log(`[Bukhari Agro Server] New image uploaded and saved: ${publicUrl}`);

      res.json({
        success: true,
        message: "Image uploaded and stored successfully.",
        url: publicUrl,
        file: { url: publicUrl },
        filename: safeName
      });
    } catch (err) {
      console.error("[Bukhari Agro Server] Image upload failed:", err);
      res.status(500).json({ success: false, error: "Failed to process image upload." });
    }
  });

  // Get list of available image assets
  app.get('/api/images', (req, res) => {
    try {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      const imgDir = path.join(__dirname, 'public', 'images');
      if (!fs.existsSync(imgDir)) {
        return res.json({ success: true, images: [] });
      }
      const files = fs.readdirSync(imgDir);
      const imageFiles = files
        .filter(f => /\.(jpg|jpeg|png|webp|svg|gif)$/i.test(f))
        .map(f => ({
          filename: f,
          url: `/images/${f}`
        }));
      res.json({ success: true, images: imageFiles });
    } catch (err) {
      res.status(500).json({ success: false, error: "Failed to list images." });
    }
  });

  // Delete image asset from media library
  app.delete('/api/images/:filename', (req, res) => {
    try {
      const { filename } = req.params;
      const safeName = path.basename(filename);
      const filePath = path.join(__dirname, 'public', 'images', safeName);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        return res.json({ success: true, message: `Image ${safeName} deleted successfully.` });
      }
      return res.status(404).json({ success: false, error: "File not found." });
    } catch (err) {
      console.error("Failed to delete image:", err);
      res.status(500).json({ success: false, error: "Failed to delete image." });
    }
  });

  // 5. Team API (Controlled centrally from backend and CMS with disk persistence)
  app.get('/api/team', (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    if (!Array.isArray(db.team)) {
      db.team = [];
      saveDatabase();
    }
    res.json({
      success: true,
      data: db.team,
      backendManagedNotice: "Team members and imagery are controlled centrally via Bukhari Agro backend infrastructure."
    });
  });

  app.post('/api/team', (req, res) => {
    try {
      const member = req.body;
      const newMember: TeamMember = {
        id: member.id || `team-${Date.now()}`,
        name: member.name || 'New Team Member',
        role: member.role || 'Agronomist',
        department: member.department || 'Agronomy & Advisory',
        qualification: member.qualification || '',
        experience: member.experience || '',
        bio: member.bio || '',
        imageUrl: member.imageUrl || '/images/team-agronomist.jpg',
        specialty: member.specialty || '',
        email: member.email || 'bukhariagropvtltd@gmail.com'
      };
      if (!Array.isArray(db.team)) db.team = [];
      db.team.push(newMember);
      saveDatabase();
      res.status(201).json({ success: true, data: newMember });
    } catch (err) {
      res.status(500).json({ success: false, error: 'Failed to add team member' });
    }
  });

  app.put('/api/team/:id', (req, res) => {
    const { id } = req.params;
    if (!Array.isArray(db.team)) db.team = [];
    const index = db.team.findIndex(m => m.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Member not found' });
    }
    db.team[index] = { ...db.team[index], ...req.body, id };
    saveDatabase();
    res.json({ success: true, data: db.team[index] });
  });

  app.delete('/api/team/:id', (req, res) => {
    const { id } = req.params;
    if (!Array.isArray(db.team)) db.team = [];
    db.team = db.team.filter(m => m.id !== id);
    saveDatabase();
    res.json({ success: true, message: 'Member deleted', remainingCount: db.team.length });
  });

  app.delete('/api/team', (req, res) => {
    db.team = [];
    saveDatabase();
    res.json({ success: true, message: 'All team members cleared' });
  });

  // 6. Categories API
  app.get('/api/categories', (req, res) => {
    res.json({
      success: true,
      data: categoriesData
    });
  });

  // 7. Official Contact Details API
  app.get('/api/contact-info', (req, res) => {
    res.json({
      success: true,
      data: contactInfo
    });
  });

  // 8. Farmer Inquiry / Quote Request Handler
  app.post('/api/inquiry', (req, res) => {
    const payload: InquiryFormPayload = req.body;
    if (!payload.farmerName || !payload.phone) {
      return res.status(400).json({
        success: false,
        error: "Farmer name and contact phone number are required."
      });
    }

    const newInquiry: ServerInquiry = {
      ...payload,
      id: `INQ-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      receivedAt: new Date().toISOString(),
      status: 'new'
    };

    serverInquiries.unshift(newInquiry);
    console.log(`[Bukhari Agro Server] New farmer inquiry received from ${newInquiry.farmerName} (${newInquiry.phone}) for ${newInquiry.cropType || 'crops'}`);

    res.json({
      success: true,
      message: "Thank you for contacting Bukhari Agro. Your inquiry has been registered with our regional agronomic team.",
      inquiryId: newInquiry.id,
      whatsappDirectLink: `https://wa.me/923116666600?text=${encodeURIComponent(`Assalam-o-Alaikum Bukhari Agro, I am ${payload.farmerName} (${payload.phone}). I would like to inquire about agro products for my ${payload.cropType || 'crop'}. Message: ${payload.message}`)}`
    });
  });

  // 9. Health Check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'Bukhari Agro Agrochemical Distribution Platform',
      version: '1.2.0',
      totalProducts: db.products.length,
      totalBrands: db.brands.length,
      timestamp: new Date().toISOString()
    });
  });

  // === Vite Middleware Setup ===
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Bukhari Agro Server] running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
