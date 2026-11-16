import { Router, Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import { db, supabase, STORAGE_BUCKET, hashPassword, generateToken, verifyToken, PageSection } from './db';

export const apiRouter = Router();

// Middleware to protect admin routes
function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Accès non autorisé. Veuillez vous connecter.' });
  }

  const token = authHeader.substring(7);
  const admin = db.getAdmin();
  const result = verifyToken(token, admin.tokenSecret);

  if (!result.valid) {
    return res.status(401).json({ error: 'Session expirée ou invalide.' });
  }

  (req as any).adminUser = result.username;
  next();
}

// Helper to check if request is from admin (optional)
function checkAdminToken(req: Request): boolean {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return false;
  const token = authHeader.substring(7);
  const admin = db.getAdmin();
  return verifyToken(token, admin.tokenSecret).valid;
}

// -----------------------------------------------------------------------------
// 1. AUTH ROUTES
// -----------------------------------------------------------------------------

apiRouter.post('/auth/login', (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Identifiant et mot de passe requis.' });
  }

  const admin = db.getAdmin();
  const inputHash = hashPassword(password, admin.salt);

  if (username !== admin.username || inputHash !== admin.hash) {
    return res.status(401).json({ error: 'Identifiant ou mot de passe incorrect.' });
  }

  const token = generateToken(admin.username, admin.tokenSecret);
  return res.json({
    token,
    user: {
      username: admin.username,
      role: 'administrateur',
    },
  });
});

apiRouter.get('/auth/verify', requireAdmin, (req: Request, res: Response) => {
  return res.json({
    valid: true,
    user: {
      username: (req as any).adminUser,
      role: 'administrateur',
    },
  });
});

apiRouter.post('/auth/change-password', requireAdmin, (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Veuillez renseigner tous les champs.' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'Le nouveau mot de passe doit contenir au moins 6 caractères.' });
  }

  const admin = db.getAdmin();
  const currentHash = hashPassword(currentPassword, admin.salt);

  if (currentHash !== admin.hash) {
    return res.status(401).json({ error: 'Mot de passe actuel incorrect.' });
  }

  db.updateAdminPassword(newPassword);
  return res.json({ success: true, message: 'Mot de passe mis à jour avec succès.' });
});

// -----------------------------------------------------------------------------
// 2. PRODUCTS API
// -----------------------------------------------------------------------------

// Public & Admin Products listing
apiRouter.get('/products', (req: Request, res: Response) => {
  const isAdmin = checkAdminToken(req);
  const products = db.getProducts(isAdmin);
  return res.json(products);
});

// Single product by slug or id
apiRouter.get('/products/:id', (req: Request, res: Response) => {
  const product = db.getProductById(req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Produit introuvable.' });
  }
  return res.json(product);
});

// Create product (Admin only)
apiRouter.post('/products', requireAdmin, (req: Request, res: Response) => {
  const name = req.body.name || req.body.title;
  const { category, brand, tagline, summary, description, image } = req.body;

  if (!name || !category || !brand) {
    return res.status(400).json({ error: 'Nom, marque et catégorie sont obligatoires.' });
  }

  const newProduct = db.createProduct({
    name,
    slug: req.body.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    category,
    categorySlug: req.body.categorySlug || category,
    categoryLabel: req.body.categoryLabel || category,
    brand,
    tagline: tagline || '',
    summary: summary || '',
    description: description || '',
    image: image || '/assets/images/solar_photovoltaic_panels_1793967416715.jpg',
    gallery: req.body.gallery || (image ? [image] : []),
    specs: req.body.specs || [],
    keyFeatures: req.body.keyFeatures || [],
    warranty: req.body.warranty || 'Garantie constructeur officielle',
    application: req.body.application || 'Résidentiel et professionnel',
    availabilityNote: req.body.availabilityNote || 'Disponible sur commande et devis',
    isPublished: req.body.isPublished !== undefined ? req.body.isPublished : true,
  });

  return res.status(201).json(newProduct);
});

// Update product (Admin only)
apiRouter.put('/products/:id', requireAdmin, (req: Request, res: Response) => {
  const updates = { ...req.body };
  if (updates.published !== undefined && updates.isPublished === undefined) {
    updates.isPublished = updates.published;
  }
  if (updates.title && !updates.name) {
    updates.name = updates.title;
  }
  const updated = db.updateProduct(req.params.id, updates);
  if (!updated) {
    return res.status(404).json({ error: 'Produit introuvable.' });
  }
  return res.json(updated);
});

// Delete product (Admin only)
apiRouter.delete('/products/:id', requireAdmin, (req: Request, res: Response) => {
  const success = db.deleteProduct(req.params.id);
  if (!success) {
    return res.status(404).json({ error: 'Produit introuvable ou déjà supprimé.' });
  }
  return res.json({ success: true, message: 'Produit supprimé avec succès.' });
});

// -----------------------------------------------------------------------------
// 3. QUOTES & INQUIRIES API
// -----------------------------------------------------------------------------

// Submit quote/inquiry (Public)
apiRouter.post('/quotes', (req: Request, res: Response) => {
  const { fullName, phone, email, clientType, category, productName, region, message, type } = req.body;

  if (!fullName || !phone) {
    return res.status(400).json({ error: 'Nom et téléphone sont obligatoires.' });
  }

  const newQuote = db.createQuote({
    type: type === 'contact' ? 'contact' : 'devis',
    fullName: fullName.trim(),
    phone: phone.trim(),
    email: email?.trim() || '',
    clientType: clientType || 'Particulier',
    category: category || '',
    productName: productName || '',
    region: region || 'Dakar',
    message: message || '',
  });

  return res.status(201).json({
    success: true,
    id: newQuote.id,
    message: 'Votre demande a été enregistrée avec succès. Notre équipe vous contactera sous 24h.',
  });
});

// List all quotes (Admin only)
apiRouter.get('/quotes', requireAdmin, (req: Request, res: Response) => {
  const quotes = db.getQuotes();
  return res.json(quotes);
});

// Update quote status or note (Admin only)
apiRouter.patch('/quotes/:id', requireAdmin, (req: Request, res: Response) => {
  const { status, notes } = req.body;
  if (!status) {
    return res.status(400).json({ error: 'Statut requis.' });
  }

  const updated = db.updateQuoteStatus(req.params.id, status, notes);
  if (!updated) {
    return res.status(404).json({ error: 'Demande introuvable.' });
  }
  return res.json(updated);
});

// Delete quote (Admin only)
apiRouter.delete('/quotes/:id', requireAdmin, (req: Request, res: Response) => {
  const success = db.deleteQuote(req.params.id);
  if (!success) {
    return res.status(404).json({ error: 'Demande introuvable.' });
  }
  return res.json({ success: true, message: 'Demande supprimée.' });
});

// -----------------------------------------------------------------------------
// 4. SITE SETTINGS API
// -----------------------------------------------------------------------------

apiRouter.get('/settings', (req: Request, res: Response) => {
  const settings = db.getSettings();
  return res.json(settings);
});

apiRouter.put('/settings', requireAdmin, (req: Request, res: Response) => {
  const updated = db.updateSettings(req.body);
  return res.json(updated);
});

// -----------------------------------------------------------------------------
// 5. ADMIN DASHBOARD STATS
// -----------------------------------------------------------------------------

apiRouter.get('/admin/stats', requireAdmin, (req: Request, res: Response) => {
  const products = db.getProducts(true);
  const quotes = db.getQuotes();

  const totalProducts = products.length;
  const publishedProducts = products.filter((p) => p.isPublished).length;
  const draftProducts = totalProducts - publishedProducts;

  const totalQuotes = quotes.length;
  const pendingQuotes = quotes.filter((q) => q.status === 'nouveau').length;
  const inProgressQuotes = quotes.filter((q) => q.status === 'en_cours').length;
  const completedQuotes = quotes.filter((q) => q.status === 'traite' || q.status === 'devis_envoye').length;

  return res.json({
    totalProducts,
    publishedProducts,
    draftProducts,
    totalQuotes,
    pendingQuotes,
    inProgressQuotes,
    completedQuotes,
    recentQuotes: quotes.slice(0, 5),
  });
});

// -----------------------------------------------------------------------------
// 6. VISUAL BUILDER / LAYOUT API (WordPress-like Drag & Drop)
// -----------------------------------------------------------------------------

apiRouter.get('/layout', (_req: Request, res: Response) => {
  const layout = db.getLayout();
  return res.json(layout);
});

apiRouter.put('/layout', requireAdmin, (req: Request, res: Response) => {
  const sections = req.body.sections || req.body;
  if (!Array.isArray(sections)) {
    return res.status(400).json({ error: 'Format invalide. Liste de sections attendue.' });
  }
  const updated = db.updateLayout(sections);
  return res.json(updated);
});

apiRouter.patch('/layout/sections/:id', requireAdmin, (req: Request, res: Response) => {
  const updated = db.updateSection(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Section introuvable.' });
  }
  return res.json(updated);
});

apiRouter.post('/layout/reset', requireAdmin, (_req: Request, res: Response) => {
  const reset = db.resetLayout();
  return res.json({ success: true, layout: reset });
});

// -----------------------------------------------------------------------------
// 7. FILE UPLOAD & MEDIA LIBRARY API (Direct from Phone or PC)
// -----------------------------------------------------------------------------

const UPLOADS_DIR = path.resolve(process.cwd(), 'public/uploads');

function ensureUploadsDir() {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
}

const IMAGE_REGEX = /\.(jpg|jpeg|png|webp|svg|gif)$/i;
const MIME_BY_EXT: Record<string, string> = {
  jpg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  svg: 'image/svg+xml',
  gif: 'image/gif',
};

apiRouter.post('/upload', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { filename, fileData, mimeType } = req.body;

    if (!fileData) {
      return res.status(400).json({ error: 'Aucun fichier transmis.' });
    }

    let base64Content = fileData;
    let detectedExt = 'jpg';

    if (fileData.startsWith('data:')) {
      const match = fileData.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.*)$/);
      if (match) {
        const type = match[1].toLowerCase();
        base64Content = match[2];
        if (type.includes('png')) detectedExt = 'png';
        else if (type.includes('webp')) detectedExt = 'webp';
        else if (type.includes('svg')) detectedExt = 'svg';
        else if (type.includes('gif')) detectedExt = 'gif';
        else detectedExt = 'jpg';
      }
    } else if (mimeType) {
      const type = mimeType.toLowerCase();
      if (type.includes('png')) detectedExt = 'png';
      else if (type.includes('webp')) detectedExt = 'webp';
      else if (type.includes('svg')) detectedExt = 'svg';
      else if (type.includes('gif')) detectedExt = 'gif';
    }

    const rawName = (filename || 'image').replace(/\.[^/.]+$/, '');
    const cleanName = rawName.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 30);
    const uniqueName = `solex_${Date.now()}_${cleanName}.${detectedExt}`;
    const buffer = Buffer.from(base64Content, 'base64');

    let publicUrl: string;

    if (supabase) {
      const { error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(uniqueName, buffer, { contentType: MIME_BY_EXT[detectedExt], upsert: false });
      if (error) {
        console.error('Supabase upload error:', error.message);
        return res.status(500).json({ error: `Échec de l'envoi vers le stockage : ${error.message}` });
      }
      publicUrl = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(uniqueName).data.publicUrl;
    } else {
      ensureUploadsDir();
      fs.writeFileSync(path.join(UPLOADS_DIR, uniqueName), buffer);
      publicUrl = `/uploads/${uniqueName}`;
    }

    return res.status(201).json({
      success: true,
      url: publicUrl,
      filename: uniqueName,
      size: buffer.length,
      uploadedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('Upload error:', err);
    return res.status(500).json({ error: "Erreur lors de l'enregistrement de l'image." });
  }
});

apiRouter.get('/media', requireAdmin, async (_req: Request, res: Response) => {
  try {
    if (supabase) {
      const { data, error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .list('', { limit: 500, sortBy: { column: 'created_at', order: 'desc' } });
      if (error) throw new Error(error.message);

      const mediaList = (data || [])
        .filter((f) => IMAGE_REGEX.test(f.name))
        .map((f) => ({
          filename: f.name,
          url: supabase!.storage.from(STORAGE_BUCKET).getPublicUrl(f.name).data.publicUrl,
          size: (f.metadata as any)?.size || 0,
          createdAt: f.created_at || new Date().toISOString(),
        }));
      return res.json(mediaList);
    }

    ensureUploadsDir();
    const files = fs.readdirSync(UPLOADS_DIR);
    const mediaList = files
      .filter((file) => IMAGE_REGEX.test(file))
      .map((file) => {
        const stats = fs.statSync(path.join(UPLOADS_DIR, file));
        return {
          filename: file,
          url: `/uploads/${file}`,
          size: stats.size,
          createdAt: stats.birthtime.toISOString(),
        };
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return res.json(mediaList);
  } catch (err) {
    console.error('Media listing error:', err);
    return res.status(500).json({ error: 'Impossible de lire les médias.' });
  }
});

apiRouter.delete('/media/:filename', requireAdmin, async (req: Request, res: Response) => {
  try {
    const filename = path.basename(req.params.filename);

    if (supabase) {
      const { error } = await supabase.storage.from(STORAGE_BUCKET).remove([filename]);
      if (error) throw new Error(error.message);
      return res.json({ success: true, message: 'Image supprimée avec succès.' });
    }

    const filePath = path.join(UPLOADS_DIR, filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return res.json({ success: true, message: 'Image supprimée avec succès.' });
    }
    return res.status(404).json({ error: 'Fichier introuvable.' });
  } catch (err) {
    return res.status(500).json({ error: 'Erreur lors de la suppression.' });
  }
});
