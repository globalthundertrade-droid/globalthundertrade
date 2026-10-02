import { getDb, saveDb } from '../db/cmsStorage.js';
import { requireAuth } from '../auth.js';
import { getSupabaseServerClient } from '../db/supabaseBackend.js';

export function handleCalculatorRoutes(req, res, url, body) {
  const db = getDb();

  // 1. GET /api/cms/calculator — Get all calculator configuration
  if (req.method === 'GET' && url === '/api/cms/calculator') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      settings: db.calculatorSettings || {}
    }));
    return true;
  }

  // 2. PUT /api/cms/calculator — Update pricing rules in Admin
  if (req.method === 'PUT' && url === '/api/cms/calculator') {
    requireAuth(req, res, async () => {
      const updates = body || {};

      db.calculatorSettings = {
        ...(db.calculatorSettings || {}),
        ...updates
      };

      await saveDb(db);

      // Sync to Supabase
      try {
        const client = getSupabaseServerClient();
        await client.from('calculator_settings').upsert({
          id: 'default',
          currency: db.calculatorSettings.currency || 'USD',
          min_moq: db.calculatorSettings.minMoq || 25,
          disclaimer: db.calculatorSettings.disclaimer || '',
          products: db.calculatorSettings.products || [],
          fabrics: db.calculatorSettings.fabrics || [],
          gsm_weights: db.calculatorSettings.gsmWeights || [],
          fits: db.calculatorSettings.fits || [],
          color_dyes: db.calculatorSettings.colorDyes || [],
          printing: db.calculatorSettings.printing || [],
          embroidery: db.calculatorSettings.embroidery || [],
          embellishments: db.calculatorSettings.embellishments || [],
          labels: db.calculatorSettings.labels || [],
          tags: db.calculatorSettings.tags || [],
          wash_finishing: db.calculatorSettings.washFinishing || [],
          packaging: db.calculatorSettings.packaging || [],
          quantity_breaks: db.calculatorSettings.quantityBreaks || [],
          updated_at: new Date().toISOString()
        }, { onConflict: 'id' });
      } catch (e) {}

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        message: 'Calculator pricing engine updated successfully.',
        settings: db.calculatorSettings
      }));
    });
    return true;
  }

  // 3. POST /api/cms/calculator/estimate — Compute estimate with itemized breakdown
  if (req.method === 'POST' && url === '/api/cms/calculator/estimate') {
    const config = body || {};
    const settings = db.calculatorSettings || {};

    const {
      productId,
      quantity = 100,
      fabricId,
      gsmId,
      fitId,
      colorId,
      printingId,
      embroideryId,
      embellishmentId,
      labelId,
      tagId,
      washId,
      packagingId
    } = config;

    const qty = Math.max(1, parseInt(quantity, 10) || 100);

    // 1. Base Product Cost
    const product = (settings.products || []).find(p => p.id === productId) || settings.products?.[0] || { baseCost: 15.00, name: 'Custom Apparel' };
    const baseCost = Number(product.baseCost || 15.00);

    // 2. Add-on Modifiers
    const findModifier = (list, id) => {
      if (!id) return 0;
      const item = (list || []).find(x => x.id === id);
      return item ? Number(item.costModifier || 0) : 0;
    };

    const fabricMod = findModifier(settings.fabrics, fabricId);
    const gsmMod = findModifier(settings.gsmWeights, gsmId);
    const fitMod = findModifier(settings.fits, fitId);
    const colorMod = findModifier(settings.colorDyes, colorId);
    const printingMod = findModifier(settings.printing, printingId);
    const embroideryMod = findModifier(settings.embroidery, embroideryId);
    const embellishMod = findModifier(settings.embellishments, embellishmentId);
    const labelMod = findModifier(settings.labels, labelId);
    const tagMod = findModifier(settings.tags, tagId);
    const washMod = findModifier(settings.washFinishing, washId);
    const packagingMod = findModifier(settings.packaging, packagingId);

    // Subtotal before quantity scale
    const rawUnitCost = baseCost +
      fabricMod +
      gsmMod +
      fitMod +
      colorMod +
      printingMod +
      embroideryMod +
      embellishMod +
      labelMod +
      tagMod +
      washMod +
      packagingMod;

    // 3. Quantity Rule Multiplier
    const breaks = settings.quantityBreaks || [];
    const matchedBreak = breaks.find(b => qty >= b.min && qty <= b.max) || { multiplier: 1.0, label: `${qty} pcs` };
    const quantityMultiplier = Number(matchedBreak.multiplier || 1.0);

    const estimatedUnitCost = Math.round(rawUnitCost * quantityMultiplier * 100) / 100;
    const estimatedTotal = Math.round(estimatedUnitCost * qty * 100) / 100;

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      currency: settings.currency || 'USD',
      quantity: qty,
      quantityTier: matchedBreak.label,
      estimatedUnitCost,
      estimatedTotal,
      disclaimer: settings.disclaimer?.includes('ESTIMATED COST —') 
        ? settings.disclaimer 
        : `ESTIMATED COST — ${settings.disclaimer || 'Final pricing may vary based on materials, customization, quantity, specifications, and final production requirements.'}`,
      breakdown: {
        product: { name: product.name, cost: baseCost },
        fabric: { id: fabricId, cost: fabricMod },
        gsm: { id: gsmId, cost: gsmMod },
        fit: { id: fitId, cost: fitMod },
        color: { id: colorId, cost: colorMod },
        printing: { id: printingId, cost: printingMod },
        embroidery: { id: embroideryId, cost: embroideryMod },
        embellishment: { id: embellishmentId, cost: embellishMod },
        labels: { id: labelId, cost: labelMod },
        tags: { id: tagId, cost: tagMod },
        wash: { id: washId, cost: washMod },
        packaging: { id: packagingId, cost: packagingMod },
        quantityAdjustment: {
          multiplier: quantityMultiplier,
          tier: matchedBreak.label
        }
      }
    }));
    return true;
  }

  return false;
}
