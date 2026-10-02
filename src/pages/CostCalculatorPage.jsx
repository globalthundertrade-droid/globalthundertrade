import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead';
import { useCms } from '../context/CmsContext';
import {
  Calculator,
  ArrowRight,
  Check,
  Sparkles,
  Layers,
  Box,
  Tag,
  ShieldCheck,
  Send,
  AlertCircle,
  RefreshCw,
  Info,
  ChevronRight
} from 'lucide-react';

export default function CostCalculatorPage() {
  const { calculatorSettings: cmsCalcSettings } = useCms();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  // User Selections
  const [selectedProduct, setSelectedProduct] = useState('hoodie');
  const [quantity, setQuantity] = useState(100);
  const [selectedFabric, setSelectedFabric] = useState('french-terry');
  const [selectedGsm, setSelectedGsm] = useState('gsm-460');
  const [selectedFit, setSelectedFit] = useState('oversized-boxy');
  const [selectedColor, setSelectedColor] = useState('standard-black-white');
  const [selectedPrinting, setSelectedPrinting] = useState('screen-print-1-2');
  const [selectedEmbroidery, setSelectedEmbroidery] = useState('embroidery-none');
  const [selectedEmbellishment, setSelectedEmbellishment] = useState('embellish-none');
  const [selectedLabel, setSelectedLabel] = useState('woven-neck-damask');
  const [selectedTag, setSelectedTag] = useState('matte-hangtag');
  const [selectedWash, setSelectedWash] = useState('wash-enzyme');
  const [selectedPackaging, setSelectedPackaging] = useState('pack-frosted-ziplock');

  // Calculation Result
  const [estimate, setEstimate] = useState(null);
  const [calculating, setCalculating] = useState(false);

  // Quote Request Modal
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [quoteForm, setQuoteForm] = useState({
    name: '',
    email: '',
    company: '',
    country: '',
    phone: '',
    message: ''
  });
  const [submittingQuote, setSubmittingQuote] = useState(false);
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);
  const [quoteError, setQuoteError] = useState(null);

  // Sync with live CMS context
  useEffect(() => {
    if (cmsCalcSettings) {
      setSettings(cmsCalcSettings);
    }
  }, [cmsCalcSettings]);

  // Fetch live pricing rules from CMS and listen to real-time events
  useEffect(() => {
    fetchPricingSettings();
    const handleSync = () => fetchPricingSettings();
    window.addEventListener('gtt_cms_updated', handleSync);
    return () => window.removeEventListener('gtt_cms_updated', handleSync);
  }, []);

  const fetchPricingSettings = async () => {
    try {
      const res = await fetch('/api/cms/calculator');
      const data = await res.json();
      if (data.success && data.settings) {
        setSettings(data.settings);
        if (data.settings.products?.[0]) setSelectedProduct(data.settings.products[0].id);
        if (data.settings.fabrics?.[0]) setSelectedFabric(data.settings.fabrics[0].id);
        if (data.settings.gsmWeights?.[0]) setSelectedGsm(data.settings.gsmWeights[0].id);
      }
    } catch (err) {
      console.error('[Cost Calculator] Error fetching settings:', err);
    } finally {
      setLoading(false);
    }
  };

  // Compute live estimate on any option change
  useEffect(() => {
    if (!settings) return;

    const runEstimate = async () => {
      setCalculating(true);
      try {
        const payload = {
          productId: selectedProduct,
          quantity,
          fabricId: selectedFabric,
          gsmId: selectedGsm,
          fitId: selectedFit,
          colorId: selectedColor,
          printingId: selectedPrinting,
          embroideryId: selectedEmbroidery,
          embellishmentId: selectedEmbellishment,
          labelId: selectedLabel,
          tagId: selectedTag,
          washId: selectedWash,
          packagingId: selectedPackaging
        };

        const res = await fetch('/api/cms/calculator/estimate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const data = await res.json();
        if (data.success) {
          setEstimate(data);
        }
      } catch (err) {
        console.error('[Cost Calculator] Estimate compute error:', err);
      } finally {
        setCalculating(false);
      }
    };

    runEstimate();
  }, [
    settings,
    selectedProduct,
    quantity,
    selectedFabric,
    selectedGsm,
    selectedFit,
    selectedColor,
    selectedPrinting,
    selectedEmbroidery,
    selectedEmbellishment,
    selectedLabel,
    selectedTag,
    selectedWash,
    selectedPackaging
  ]);

  const handleSubmitQuote = async (e) => {
    e.preventDefault();
    if (!quoteForm.name || !quoteForm.email) return;

    setSubmittingQuote(true);
    setQuoteError(null);

    try {
      const activeProd = (settings?.products || []).find(p => p.id === selectedProduct);
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: quoteForm.name,
          email: quoteForm.email,
          companyName: quoteForm.company,
          country: quoteForm.country,
          phone: quoteForm.phone,
          message: quoteForm.message,
          type: 'cost_calculator',
          selectedProduct: activeProd?.name || selectedProduct,
          quantity,
          estimatedCost: estimate?.estimatedUnitCost,
          estimatedTotal: estimate?.estimatedTotal,
          configuration: {
            product: activeProd?.name,
            quantity,
            quantityTier: estimate?.quantityTier,
            fabric: (settings?.fabrics || []).find(f => f.id === selectedFabric)?.name,
            gsm: (settings?.gsmWeights || []).find(g => g.id === selectedGsm)?.label,
            fit: (settings?.fits || []).find(f => f.id === selectedFit)?.name,
            color: (settings?.colorDyes || []).find(c => c.id === selectedColor)?.name,
            printing: (settings?.printing || []).find(p => p.id === selectedPrinting)?.name,
            embroidery: (settings?.embroidery || []).find(e => e.id === selectedEmbroidery)?.name,
            embellishments: (settings?.embellishments || []).find(em => em.id === selectedEmbellishment)?.name,
            labels: (settings?.labels || []).find(l => l.id === selectedLabel)?.name,
            tags: (settings?.tags || []).find(t => t.id === selectedTag)?.name,
            wash: (settings?.washFinishing || []).find(w => w.id === selectedWash)?.name,
            packaging: (settings?.packaging || []).find(p => p.id === selectedPackaging)?.name
          }
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit quote request.');

      setQuoteSubmitted(true);
    } catch (err) {
      setQuoteError(err.message);
    } finally {
      setSubmittingQuote(false);
    }
  };

  const currentProductObj = (settings?.products || []).find(p => p.id === selectedProduct) || settings?.products?.[0];

  return (
    <div style={{ paddingTop: 'var(--nav-h)' }}>
      <SEOHead
        title="Custom Apparel Cost Calculator | Global Thunder Trade"
        description="Estimate custom clothing manufacturing costs based on product silhouette, fabric, GSM weight, customization, trims, and order volume. Transparent factory pricing."
        canonicalUrl="https://globalthundertrade.com/cost-calculator"
      />

      {/* Header Banner */}
      <section className="section section-dark" style={{ borderBottom: '1px solid var(--line-dark)', padding: '60px 0 40px' }}>
        <div className="wrap">
          <p className="eyebrow">FACTORY DIRECT ESTIMATION &middot; TRANSPARENT MANUFACTURING</p>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 64px)', marginTop: 16, letterSpacing: '-.02em', textTransform: 'uppercase' }}>
            CLOTHING MANUFACTURING COST CALCULATOR.
          </h1>
          <p style={{ color: 'var(--gray)', fontSize: 16, maxWidth: 680, marginTop: 14, lineHeight: 1.65 }}>
            Configure your garment silhouette, fabric composition, GSM density, embellishments, and order volume to generate an approximate manufacturing estimate.
          </p>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            marginTop: 18,
            padding: '8px 14px',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 2,
            fontSize: 12,
            color: 'var(--gray-light)'
          }}>
            <Info size={14} style={{ color: '#60a5fa' }} />
            <span>
              <strong>ESTIMATED COST</strong> &middot; Final pricing varies based on technical specs, pattern grading, and production requirements.
            </span>
          </div>
        </div>
      </section>

      {/* Calculator Body Stage */}
      <section className="section" style={{ padding: '60px 0 100px', background: 'var(--white)' }}>
        <div className="wrap" style={{ display: 'grid', gridTemplateColumns: '1.45fr 1fr', gap: 60, alignItems: 'flex-start' }}>

          {/* Left Column: Configurator Controls */}
          <div>
            {loading ? (
              <div style={{ padding: 60, textAlign: 'center', color: 'var(--gray)' }}>Loading production parameters...</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

                {/* 1. PRODUCT SILHOUETTE */}
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 800, letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 12 }}>
                    1. SELECT PRODUCT SILHOUETTE
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: 10 }}>
                    {(settings?.products || []).map((prod) => (
                      <button
                        key={prod.id}
                        type="button"
                        onClick={() => setSelectedProduct(prod.id)}
                        style={{
                          padding: '14px 16px',
                          textAlign: 'left',
                          background: selectedProduct === prod.id ? 'var(--black)' : 'var(--off-white)',
                          color: selectedProduct === prod.id ? 'var(--white)' : 'var(--black)',
                          border: `1px solid ${selectedProduct === prod.id ? 'var(--black)' : 'var(--line-light)'}`,
                          borderRadius: 2,
                          cursor: 'pointer',
                          transition: 'all .15s ease'
                        }}
                      >
                        <div style={{ fontSize: 13, fontWeight: 700 }}>{prod.name}</div>
                        <div style={{ fontSize: 11, opacity: 0.7, marginTop: 4 }}>Base: ${prod.baseCost.toFixed(2)}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. ORDER QUANTITY */}
                <div style={{ background: 'var(--off-white)', padding: 24, borderRadius: 2, border: '1px solid var(--line-light)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <label style={{ fontSize: 12, fontWeight: 800, letterSpacing: '.08em', textTransform: 'uppercase' }}>
                      2. ORDER QUANTITY (PIECES)
                    </label>
                    <span style={{ fontSize: 18, fontWeight: 900, color: 'var(--black)' }}>
                      {quantity} PCS
                    </span>
                  </div>

                  <input
                    type="range"
                    min={25}
                    max={1000}
                    step={25}
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
                    style={{ width: '100%', accentColor: 'var(--black)', cursor: 'pointer' }}
                  />

                  {/* Quantity Break Buttons */}
                  <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
                    {[25, 50, 100, 250, 500, 1000].map((qtyVal) => (
                      <button
                        key={qtyVal}
                        type="button"
                        onClick={() => setQuantity(qtyVal)}
                        style={{
                          padding: '6px 12px',
                          fontSize: 11,
                          fontWeight: 700,
                          borderRadius: 2,
                          border: `1px solid ${quantity === qtyVal ? 'var(--black)' : 'var(--line-light)'}`,
                          background: quantity === qtyVal ? 'var(--black)' : 'var(--white)',
                          color: quantity === qtyVal ? 'var(--white)' : 'var(--black)',
                          cursor: 'pointer'
                        }}
                      >
                        {qtyVal} pcs
                      </button>
                    ))}
                  </div>

                  {estimate?.quantityTier && (
                    <div style={{ fontSize: 11, color: 'var(--gray-dark)', marginTop: 10 }}>
                      Active Volume Pricing Tier: <strong>{estimate.quantityTier}</strong>
                    </div>
                  )}
                </div>

                {/* 3. FABRIC & GSM */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 800, letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 8 }}>
                      3. FABRIC COMPOSITION
                    </label>
                    <select
                      value={selectedFabric}
                      onChange={(e) => setSelectedFabric(e.target.value)}
                      className="adm-select"
                      style={{ background: 'var(--off-white)', borderColor: 'var(--line-light)', color: 'var(--black)', padding: '12px' }}
                    >
                      {(settings?.fabrics || []).map(f => (
                        <option key={f.id} value={f.id}>
                          {f.name} {f.costModifier ? `(+${f.costModifier > 0 ? '$' : '-$'}${Math.abs(f.costModifier).toFixed(2)})` : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 800, letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 8 }}>
                      4. GSM WEIGHT
                    </label>
                    <select
                      value={selectedGsm}
                      onChange={(e) => setSelectedGsm(e.target.value)}
                      className="adm-select"
                      style={{ background: 'var(--off-white)', borderColor: 'var(--line-light)', color: 'var(--black)', padding: '12px' }}
                    >
                      {(settings?.gsmWeights || []).map(g => (
                        <option key={g.id} value={g.id}>
                          {g.label} {g.costModifier ? `(+${g.costModifier > 0 ? '$' : '-$'}${Math.abs(g.costModifier).toFixed(2)})` : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 5. FIT & COLOR */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 800, letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 8 }}>
                      5. SILHOUETTE FIT
                    </label>
                    <select
                      value={selectedFit}
                      onChange={(e) => setSelectedFit(e.target.value)}
                      className="adm-select"
                      style={{ background: 'var(--off-white)', borderColor: 'var(--line-light)', color: 'var(--black)', padding: '12px' }}
                    >
                      {(settings?.fits || []).map(fit => (
                        <option key={fit.id} value={fit.id}>{fit.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 800, letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 8 }}>
                      6. COLORWAY / DYE PROCESS
                    </label>
                    <select
                      value={selectedColor}
                      onChange={(e) => setSelectedColor(e.target.value)}
                      className="adm-select"
                      style={{ background: 'var(--off-white)', borderColor: 'var(--line-light)', color: 'var(--black)', padding: '12px' }}
                    >
                      {(settings?.colorDyes || []).map(col => (
                        <option key={col.id} value={col.id}>{col.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 7. PRINTING & EMBROIDERY */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 800, letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 8 }}>
                      7. PRINTING METHOD
                    </label>
                    <select
                      value={selectedPrinting}
                      onChange={(e) => setSelectedPrinting(e.target.value)}
                      className="adm-select"
                      style={{ background: 'var(--off-white)', borderColor: 'var(--line-light)', color: 'var(--black)', padding: '12px' }}
                    >
                      {(settings?.printing || []).map(p => (
                        <option key={p.id} value={p.id}>
                          {p.name} {p.costModifier ? `(+$${p.costModifier.toFixed(2)})` : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 800, letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 8 }}>
                      8. EMBROIDERY
                    </label>
                    <select
                      value={selectedEmbroidery}
                      onChange={(e) => setSelectedEmbroidery(e.target.value)}
                      className="adm-select"
                      style={{ background: 'var(--off-white)', borderColor: 'var(--line-light)', color: 'var(--black)', padding: '12px' }}
                    >
                      {(settings?.embroidery || []).map(em => (
                        <option key={em.id} value={em.id}>
                          {em.name} {em.costModifier ? `(+$${em.costModifier.toFixed(2)})` : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 9. EMBELLISHMENTS & TRIMS */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 800, letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 8 }}>
                      9. HARDWARE / EMBELLISHMENTS
                    </label>
                    <select
                      value={selectedEmbellishment}
                      onChange={(e) => setSelectedEmbellishment(e.target.value)}
                      className="adm-select"
                      style={{ background: 'var(--off-white)', borderColor: 'var(--line-light)', color: 'var(--black)', padding: '12px' }}
                    >
                      {(settings?.embellishments || []).map(item => (
                        <option key={item.id} value={item.id}>
                          {item.name} {item.costModifier ? `(+$${item.costModifier.toFixed(2)})` : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 800, letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 8 }}>
                      10. WASH &amp; FINISHING
                    </label>
                    <select
                      value={selectedWash}
                      onChange={(e) => setSelectedWash(e.target.value)}
                      className="adm-select"
                      style={{ background: 'var(--off-white)', borderColor: 'var(--line-light)', color: 'var(--black)', padding: '12px' }}
                    >
                      {(settings?.washFinishing || []).map(w => (
                        <option key={w.id} value={w.id}>
                          {w.name} {w.costModifier ? `(+$${w.costModifier.toFixed(2)})` : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 11. LABELS, TAGS & PACKAGING */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 800, letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 8 }}>
                      11. LABELS
                    </label>
                    <select
                      value={selectedLabel}
                      onChange={(e) => setSelectedLabel(e.target.value)}
                      className="adm-select"
                      style={{ background: 'var(--off-white)', borderColor: 'var(--line-light)', color: 'var(--black)' }}
                    >
                      {(settings?.labels || []).map(l => (
                        <option key={l.id} value={l.id}>{l.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 800, letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 8 }}>
                      12. HANGTAGS
                    </label>
                    <select
                      value={selectedTag}
                      onChange={(e) => setSelectedTag(e.target.value)}
                      className="adm-select"
                      style={{ background: 'var(--off-white)', borderColor: 'var(--line-light)', color: 'var(--black)' }}
                    >
                      {(settings?.tags || []).map(t => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 800, letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 8 }}>
                      13. PACKAGING
                    </label>
                    <select
                      value={selectedPackaging}
                      onChange={(e) => setSelectedPackaging(e.target.value)}
                      className="adm-select"
                      style={{ background: 'var(--off-white)', borderColor: 'var(--line-light)', color: 'var(--black)' }}
                    >
                      {(settings?.packaging || []).map(pkg => (
                        <option key={pkg.id} value={pkg.id}>{pkg.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* Right Column: Dynamic Price Summary Box */}
          <div style={{ position: 'sticky', top: 100 }}>
            <div style={{
              background: 'var(--off-white)',
              border: '2px solid var(--black)',
              borderRadius: 2,
              padding: 32,
              boxShadow: '0 12px 24px rgba(0,0,0,0.06)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <span className="eyebrow" style={{ color: 'var(--gray-dark)' }}>ESTIMATED PRODUCTION COST</span>
                <span style={{ fontSize: 11, background: 'var(--black)', color: 'var(--white)', padding: '2px 8px', fontWeight: 800, letterSpacing: '.06em' }}>
                  {quantity} PCS
                </span>
              </div>

              {/* Price Figures */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 12, color: 'var(--gray-dark)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 2 }}>
                  ESTIMATED UNIT COST
                </div>
                <div style={{ fontSize: 'clamp(36px, 4vw, 54px)', fontWeight: 900, letterSpacing: '-.02em', color: 'var(--black)' }}>
                  ${estimate?.estimatedUnitCost?.toFixed(2) || '0.00'}
                  <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--gray)' }}> / pc</span>
                </div>
              </div>

              <div style={{
                padding: '14px 16px',
                background: 'var(--white)',
                border: '1px solid var(--line-light)',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 20
              }}>
                <span style={{ fontSize: 13, fontWeight: 700 }}>ESTIMATED BATCH TOTAL:</span>
                <span style={{ fontSize: 20, fontWeight: 900, color: 'var(--black)' }}>
                  ${estimate?.estimatedTotal ? estimate.estimatedTotal.toLocaleString() : '0.00'}
                </span>
              </div>

              {/* Selected Configuration Spec Summary */}
              <div style={{ borderTop: '1px solid var(--line-light)', paddingTop: 16, marginBottom: 24, fontSize: 12, lineHeight: 1.8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--gray)' }}>Product:</span>
                  <span style={{ fontWeight: 700 }}>{currentProductObj?.name}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--gray)' }}>Fabric / Weight:</span>
                  <span style={{ fontWeight: 700 }}>
                    {(settings?.fabrics || []).find(f => f.id === selectedFabric)?.name?.slice(0, 20)} &middot; {selectedGsm.replace('gsm-', '')} GSM
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--gray)' }}>Volume Tier:</span>
                  <span style={{ fontWeight: 700 }}>{estimate?.quantityTier || `${quantity} pcs`}</span>
                </div>
              </div>

              {/* Mandatory Prompt Disclaimer */}
              <p style={{
                fontSize: 11,
                color: 'var(--gray)',
                lineHeight: 1.55,
                marginBottom: 24,
                fontStyle: 'italic',
                borderLeft: '2px solid var(--gray)',
                paddingLeft: 10
              }}>
                “Final pricing may vary based on materials, customization, quantity, specifications, and final production requirements.”
              </p>

              {/* Request a Quote CTA */}
              <button
                type="button"
                onClick={() => { setQuoteModalOpen(true); setQuoteSubmitted(false); }}
                className="btn btn-primary"
                style={{ width: '100%', padding: '16px 20px', fontSize: 14 }}
              >
                Request a Formal Quote <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* REQUEST QUOTE MODAL */}
      {quoteModalOpen && (
        <div className="adm-modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) setQuoteModalOpen(false); }}>
          <div className="adm-modal" style={{ maxWidth: 540, background: 'var(--white)', color: 'var(--black)', border: '2px solid var(--black)' }}>
            <div className="adm-modal-header" style={{ borderColor: 'var(--line-light)', background: 'var(--off-white)' }}>
              <div>
                <span className="eyebrow">FACTORY DIRECT &middot; RFQ INTAKE</span>
                <h3 style={{ fontSize: 18, fontWeight: 900, marginTop: 4 }}>REQUEST FORMAL PRODUCTION QUOTE</h3>
              </div>
              <button
                type="button"
                onClick={() => setQuoteModalOpen(false)}
                className="adm-btn adm-btn-secondary adm-btn-icon adm-btn-sm"
              >
                &times;
              </button>
            </div>

            {quoteSubmitted ? (
              <div style={{ padding: 40, textAlign: 'center' }}>
                <div style={{
                  width: 50,
                  height: 50,
                  borderRadius: '50%',
                  background: 'var(--black)',
                  color: 'var(--white)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px'
                }}>
                  <Check size={24} />
                </div>
                <h4 style={{ fontSize: 18, fontWeight: 800 }}>QUOTE REQUEST SUBMITTED</h4>
                <p style={{ color: 'var(--gray)', fontSize: 13, marginTop: 8, lineHeight: 1.6 }}>
                  Our production engineering team has received your configuration for <strong>{quantity} pcs of {currentProductObj?.name}</strong>. We will review your specifications and reply via email.
                </p>
                <button
                  type="button"
                  onClick={() => setQuoteModalOpen(false)}
                  className="btn btn-primary"
                  style={{ marginTop: 24 }}
                >
                  Close Window
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitQuote}>
                <div className="adm-modal-body">
                  {quoteError && (
                    <div style={{
                      padding: 10,
                      background: '#fee2e2',
                      color: '#b91c1c',
                      borderRadius: 4,
                      fontSize: 12,
                      marginBottom: 14
                    }}>
                      {quoteError}
                    </div>
                  )}

                  <div style={{
                    background: 'var(--off-white)',
                    padding: 12,
                    borderRadius: 2,
                    fontSize: 12,
                    marginBottom: 16,
                    border: '1px solid var(--line-light)'
                  }}>
                    Attached Estimate: <strong>{quantity}x {currentProductObj?.name}</strong> &middot; ~${estimate?.estimatedUnitCost}/pc (Total: ~${estimate?.estimatedTotal})
                  </div>

                  <div className="adm-form-group">
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 800, marginBottom: 4 }}>YOUR NAME *</label>
                    <input
                      type="text"
                      required
                      value={quoteForm.name}
                      onChange={(e) => setQuoteForm({ ...quoteForm, name: e.target.value })}
                      placeholder="Sarah Vance"
                      className="adm-input"
                      style={{ background: 'var(--off-white)', borderColor: 'var(--line-light)', color: 'var(--black)' }}
                    />
                  </div>

                  <div className="adm-form-group">
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 800, marginBottom: 4 }}>EMAIL ADDRESS *</label>
                    <input
                      type="email"
                      required
                      value={quoteForm.email}
                      onChange={(e) => setQuoteForm({ ...quoteForm, email: e.target.value })}
                      placeholder="founder@brand.com"
                      className="adm-input"
                      style={{ background: 'var(--off-white)', borderColor: 'var(--line-light)', color: 'var(--black)' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div className="adm-form-group">
                      <label style={{ display: 'block', fontSize: 11, fontWeight: 800, marginBottom: 4 }}>BRAND / COMPANY</label>
                      <input
                        type="text"
                        value={quoteForm.company}
                        onChange={(e) => setQuoteForm({ ...quoteForm, company: e.target.value })}
                        placeholder="Atelier Label"
                        className="adm-input"
                        style={{ background: 'var(--off-white)', borderColor: 'var(--line-light)', color: 'var(--black)' }}
                      />
                    </div>
                    <div className="adm-form-group">
                      <label style={{ display: 'block', fontSize: 11, fontWeight: 800, marginBottom: 4 }}>COUNTRY</label>
                      <input
                        type="text"
                        value={quoteForm.country}
                        onChange={(e) => setQuoteForm({ ...quoteForm, country: e.target.value })}
                        placeholder="United States"
                        className="adm-input"
                        style={{ background: 'var(--off-white)', borderColor: 'var(--line-light)', color: 'var(--black)' }}
                      />
                    </div>
                  </div>

                  <div className="adm-form-group">
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 800, marginBottom: 4 }}>ADDITIONAL PRODUCTION NOTES</label>
                    <textarea
                      rows={3}
                      value={quoteForm.message}
                      onChange={(e) => setQuoteForm({ ...quoteForm, message: e.target.value })}
                      placeholder="Details on tech pack readiness, sample deadline, custom aglets, etc."
                      className="adm-textarea"
                      style={{ background: 'var(--off-white)', borderColor: 'var(--line-light)', color: 'var(--black)' }}
                    />
                  </div>
                </div>

                <div className="adm-modal-footer" style={{ background: 'var(--off-white)', borderColor: 'var(--line-light)' }}>
                  <button
                    type="button"
                    onClick={() => setQuoteModalOpen(false)}
                    className="btn btn-ghost"
                    style={{ padding: '10px 16px' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingQuote}
                    className="btn btn-primary"
                    style={{ padding: '10px 20px' }}
                  >
                    {submittingQuote ? 'Sending Specifications...' : 'Submit Quote Request'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
