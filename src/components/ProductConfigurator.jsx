import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BUILDER_PRODUCTS } from '../data/builderData';
import Product3DViewer from './Product3DViewer';
import ProductCreationWorkflows from './ProductCreationWorkflows';
import { 
  Check, ArrowRight, ArrowLeft, Sliders, Sparkles, Send, RotateCw, 
  Layers, ChevronRight, CheckCircle2, RefreshCw, Eye, Package, ShieldCheck
} from 'lucide-react';

export default function ProductConfigurator({
  initialProductId = 'hoodie',
  incomingBlank = null,
  incomingSideProduct = null,
  onClearBlank = null,
  onClearSideProduct = null,
  mode = 'full', // 'full' | 'compact'
  onConfigurationChange = null
}) {
  const navigate = useNavigate();

  // 1. Current Product Selection
  const [selectedProductId, setSelectedProductId] = useState(() => {
    if (incomingBlank?.builderProductId && BUILDER_PRODUCTS.some(p => p.id === incomingBlank.builderProductId)) {
      return incomingBlank.builderProductId;
    }
    return initialProductId;
  });
  const currentProduct = BUILDER_PRODUCTS.find(p => p.id === selectedProductId) || BUILDER_PRODUCTS[0];

  // 2. Active Step in 01-08 Workflow
  const [currentStep, setCurrentStep] = useState(1);

  // 3. Configuration State
  const [selectedColor, setSelectedColor] = useState(() => incomingBlank?.colorHex || currentProduct.availableColors[0].hex);
  const [selectedFabric, setSelectedFabric] = useState(currentProduct.availableFabrics[0]);
  const [selectedGsm, setSelectedGsm] = useState(currentProduct.availableGsm ? currentProduct.availableGsm[0] : 'Standard');
  const [selectedFit, setSelectedFit] = useState(currentProduct.availableFits ? currentProduct.availableFits[0] : 'Classic');
  const [selectedPrint, setSelectedPrint] = useState(currentProduct.availablePrint ? currentProduct.availablePrint[0] : 'None');
  const [selectedEmbroidery, setSelectedEmbroidery] = useState(currentProduct.availableEmbroidery ? currentProduct.availableEmbroidery[0] : 'None');
  const [selectedEmbellishments, setSelectedEmbellishments] = useState(currentProduct.availableEmbellishments ? currentProduct.availableEmbellishments[0] : 'None');
  const [selectedHardware, setSelectedHardware] = useState(currentProduct.availableHardware ? currentProduct.availableHardware[0] : (currentProduct.availableZippers ? currentProduct.availableZippers[0] : 'None'));
  const [selectedLabels, setSelectedLabels] = useState(currentProduct.availableLabels ? currentProduct.availableLabels[0] : 'Custom Woven Neck Label');
  const [selectedTags, setSelectedTags] = useState(currentProduct.availableTags ? currentProduct.availableTags[0] : 'Matte Black Hangtag');
  const [selectedWashes, setSelectedWashes] = useState(currentProduct.availableWashes ? currentProduct.availableWashes[0] : 'Standard Clean Pre-Shrunk');
  const [selectedPackaging, setSelectedPackaging] = useState(currentProduct.availablePackaging ? currentProduct.availablePackaging[0] : 'Frosted Custom Polybag');

  // Sync incoming blank preset if passed dynamically
  useEffect(() => {
    if (incomingBlank) {
      if (incomingBlank.builderProductId && BUILDER_PRODUCTS.some(p => p.id === incomingBlank.builderProductId)) {
        setSelectedProductId(incomingBlank.builderProductId);
      }
      if (incomingBlank.colorHex) {
        setSelectedColor(incomingBlank.colorHex);
      }
    }
  }, [incomingBlank]);

  // Sync incoming side product preset if passed dynamically
  useEffect(() => {
    if (incomingSideProduct) {
      const { builderCategory, builderValue, name } = incomingSideProduct;
      const targetVal = builderValue || name;
      if (builderCategory === 'hardware') setSelectedHardware(targetVal);
      else if (builderCategory === 'labels') setSelectedLabels(targetVal);
      else if (builderCategory === 'tags') setSelectedTags(targetVal);
      else if (builderCategory === 'embellishments') setSelectedEmbellishments(targetVal);
      else if (builderCategory === 'packaging') setSelectedPackaging(targetVal);
    }
  }, [incomingSideProduct]);

  // Handle Product Switch: Update defaults cleanly
  const handleProductChange = (productId) => {
    const prod = BUILDER_PRODUCTS.find(p => p.id === productId);
    if (!prod) return;
    setSelectedProductId(productId);
    setSelectedColor(prod.availableColors[0].hex);
    setSelectedFabric(prod.availableFabrics[0]);
    setSelectedGsm(prod.availableGsm ? prod.availableGsm[0] : 'Standard');
    setSelectedFit(prod.availableFits ? prod.availableFits[0] : 'Classic');
    setSelectedPrint(prod.availablePrint ? prod.availablePrint[0] : 'None');
    setSelectedEmbroidery(prod.availableEmbroidery ? prod.availableEmbroidery[0] : 'None');
    setSelectedEmbellishments(prod.availableEmbellishments ? prod.availableEmbellishments[0] : 'None');
    setSelectedHardware(prod.availableHardware ? prod.availableHardware[0] : (prod.availableZippers ? prod.availableZippers[0] : 'None'));
    setSelectedLabels(prod.availableLabels ? prod.availableLabels[0] : 'Custom Woven Neck Label');
    setSelectedTags(prod.availableTags ? prod.availableTags[0] : 'Matte Black Hangtag');
    setSelectedWashes(prod.availableWashes ? prod.availableWashes[0] : 'Standard Clean Pre-Shrunk');
    setSelectedPackaging(prod.availablePackaging ? prod.availablePackaging[0] : 'Frosted Custom Polybag');
  };

  // Helper for relevant controls
  const isRelevant = (controlName) => {
    if (!currentProduct.relevantControls) return true;
    return currentProduct.relevantControls.includes(controlName);
  };

  // Structured Configuration Object for Live Summary & Submissions
  const currentConfigObject = {
    productId: currentProduct.id,
    product: currentProduct.name,
    category: currentProduct.category,
    color: currentProduct.availableColors.find(c => c.hex === selectedColor)?.name || selectedColor,
    colorHex: selectedColor,
    fabric: selectedFabric,
    gsm: selectedGsm,
    fit: selectedFit,
    print: selectedPrint,
    embroidery: selectedEmbroidery,
    embellishments: selectedEmbellishments,
    hardware: selectedHardware,
    labels: selectedLabels,
    tags: selectedTags,
    washes: selectedWashes,
    packaging: selectedPackaging
  };

  useEffect(() => {
    if (onConfigurationChange) {
      onConfigurationChange(currentConfigObject);
    }
  }, [selectedProductId, selectedColor, selectedFabric, selectedGsm, selectedFit, selectedPrint, selectedEmbroidery, selectedEmbellishments, selectedHardware, selectedLabels, selectedTags, selectedWashes, selectedPackaging]);

  // Request Product / RFQ Handler
  const handleRequestProduct = () => {
    navigate('/contact', {
      state: {
        prefilledSubject: `RFQ & Custom Sample Request — ${currentProduct.name}`,
        configuredProductSpec: currentConfigObject
      }
    });
  };

  // Handle Incoming parsed prompt from AI
  const handleApplyParsedPrompt = (parsed) => {
    if (!parsed) return;
    if (parsed.productId && BUILDER_PRODUCTS.some(p => p.id === parsed.productId)) {
      handleProductChange(parsed.productId);
    }
    if (parsed.color) setSelectedColor(parsed.color);
    if (parsed.fabric) setSelectedFabric(parsed.fabric);
    if (parsed.gsm) setSelectedGsm(parsed.gsm);
    if (parsed.fit) setSelectedFit(parsed.fit);
    if (parsed.print) setSelectedPrint(parsed.print);
    if (parsed.embroidery) setSelectedEmbroidery(parsed.embroidery);
    if (parsed.embellishments) setSelectedEmbellishments(parsed.embellishments);
    if (parsed.hardware) setSelectedHardware(parsed.hardware);
    if (parsed.labels) setSelectedLabels(parsed.labels);
    if (parsed.washes) setSelectedWashes(parsed.washes);
    if (parsed.packaging) setSelectedPackaging(parsed.packaging);
  };

  // Steps Definition
  const STEPS = [
    { num: 1, id: 'product', title: 'PRODUCT' },
    { num: 2, id: 'fabric', title: 'FABRIC' },
    { num: 3, id: 'fit', title: 'FIT' },
    { num: 4, id: 'colour', title: 'COLOUR' },
    { num: 5, id: 'branding', title: 'BRANDING' },
    { num: 6, id: 'finishing', title: 'FINISHING' },
    { num: 7, id: 'packaging', title: 'PACKAGING' },
    { num: 8, id: 'review', title: 'REVIEW' }
  ];

  return (
    <div className="gtt-configurator-container">
      {/* 2-Column Grid: 3D Product Viewer (Left) + Step Configurator & Summary (Right) */}
      <div className="configurator-main-grid">
        
        {/* Left Column: 3D Product Configurator Canvas */}
        <div className="configurator-viewport-col">
          <div className="viewport-sticky-wrap">
            <div className="viewport-card">
              <Product3DViewer
                productType={currentProduct.id}
                selectedColor={selectedColor}
                selectedFit={selectedFit}
                selectedFabric={selectedFabric}
                selectedGsm={selectedGsm}
                print={selectedPrint}
                embroidery={selectedEmbroidery}
                hardware={selectedHardware}
              />
            </div>

            {/* Quick Live Spec Bar under 3D Viewer */}
            <div className="viewport-quick-spec">
              <div className="spec-pill">
                <span className="spec-label">SILHOUETTE:</span>
                <span className="spec-val">{currentProduct.name}</span>
              </div>
              <div className="spec-pill">
                <span className="spec-label">COLOUR:</span>
                <span className="spec-val" style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: selectedColor, display: 'inline-block', border: '1px solid rgba(255,255,255,0.4)' }} />
                  {currentProduct.availableColors.find(c => c.hex === selectedColor)?.name || 'Custom'}
                </span>
              </div>
              <div className="spec-pill">
                <span className="spec-label">FABRIC:</span>
                <span className="spec-val">{selectedFabric} ({selectedGsm})</span>
              </div>
              <div className="spec-pill">
                <span className="spec-label">FIT:</span>
                <span className="spec-val">{selectedFit}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: 01-08 Step Flow & Controls */}
        <div className="configurator-controls-col">

          {/* Incoming Blank Preset Alert */}
          {incomingBlank && (
            <div 
              style={{ 
                background: 'rgba(255, 255, 255, 0.05)', 
                border: '1px solid rgba(255, 255, 255, 0.2)', 
                borderRadius: 2, 
                padding: '12px 16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 16,
                flexWrap: 'wrap',
                gap: 10
              }}
            >
              <div>
                <span style={{ fontSize: 9.5, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--gray, #888)', fontWeight: 800 }}>
                  CATALOG BLANK ACTIVE //
                </span>
                <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--white, #fff)', marginTop: 2 }}>
                  {incomingBlank.name} {incomingBlank.color ? `(${incomingBlank.color})` : ''}
                </div>
              </div>
              {onClearBlank && (
                <button
                  type="button"
                  onClick={onClearBlank}
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: '.06em',
                    textTransform: 'uppercase',
                    color: 'var(--gray, #aaa)',
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.2)',
                    padding: '4px 8px',
                    borderRadius: 2,
                    cursor: 'pointer'
                  }}
                >
                  Clear Preset &times;
                </button>
              )}
            </div>
          )}

          {/* Incoming Side Product Preset Alert */}
          {incomingSideProduct && (
            <div 
              style={{ 
                background: 'rgba(255, 255, 255, 0.05)', 
                border: '1px solid rgba(255, 255, 255, 0.2)', 
                borderRadius: 2, 
                padding: '12px 16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 16,
                flexWrap: 'wrap',
                gap: 10
              }}
            >
              <div>
                <span style={{ fontSize: 9.5, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--gray, #888)', fontWeight: 800 }}>
                  TRIM &amp; HARDWARE ATTACHED //
                </span>
                <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--white, #fff)', marginTop: 2 }}>
                  {incomingSideProduct.name} ({incomingSideProduct.builderCategory?.toUpperCase() || 'CUSTOM'})
                </div>
              </div>
              {onClearSideProduct && (
                <button
                  type="button"
                  onClick={onClearSideProduct}
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: '.06em',
                    textTransform: 'uppercase',
                    color: 'var(--gray, #aaa)',
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.2)',
                    padding: '4px 8px',
                    borderRadius: 2,
                    cursor: 'pointer'
                  }}
                >
                  Clear Trim &times;
                </button>
              )}
            </div>
          )}

          {/* Compact Mode Direct Link to Full Studio */}
          {mode === 'compact' && (
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '10px 14px', borderRadius: 2 }}>
              <span style={{ fontSize: 11, color: 'var(--gray, #888)', letterSpacing: '.04em' }}>
                HOMEPAGE ENTRY BUILDER &middot; FAST SPEC
              </span>
              <Link to="/cost-calculator" style={{ fontSize: 11, fontWeight: 800, color: 'var(--white, #fff)', letterSpacing: '.06em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 4 }}>
                CALCULATE COST <ArrowRight size={12} />
              </Link>
            </div>
          )}
          
          {/* Step Progress Header */}
          <div className="config-steps-nav">
            {STEPS.map((step) => {
              const isCurrent = currentStep === step.num;
              const isDone = currentStep > step.num;
              return (
                <button
                  key={step.num}
                  type="button"
                  onClick={() => setCurrentStep(step.num)}
                  className={`step-btn ${isCurrent ? 'is-active' : ''} ${isDone ? 'is-done' : ''}`}
                >
                  <span className="step-number">0{step.num}</span>
                  <span className="step-title">{step.title}</span>
                </button>
              );
            })}
          </div>

          {/* Active Step Panel */}
          <div className="config-step-card">
            
            {/* ================= STEP 01: PRODUCT ================= */}
            {currentStep === 1 && (
              <div className="step-pane">
                <div className="pane-header">
                  <span className="pane-eyebrow">STEP 01 &middot; SILHOUETTE ARCHITECTURE</span>
                  <h3 className="pane-title">SELECT PRODUCT SILHOUETTE</h3>
                  <p className="pane-desc">Choose your base garment category. Each silhouette unlocks dedicated technical specifications, fabric GSM weights, and trim tolerances.</p>
                </div>

                <div className="product-cards-grid">
                  {BUILDER_PRODUCTS.map((prod) => {
                    const isSelected = selectedProductId === prod.id;
                    return (
                      <button
                        key={prod.id}
                        type="button"
                        onClick={() => handleProductChange(prod.id)}
                        className={`product-select-card ${isSelected ? 'is-selected' : ''}`}
                      >
                        <div className="card-media">
                          <img src={prod.mockupImage} alt={prod.name} loading="lazy" />
                          {isSelected && (
                            <span className="selected-badge">
                              <Check size={12} /> ACTIVE 3D
                            </span>
                          )}
                        </div>
                        <div className="card-info">
                          <div className="card-category">{prod.category}</div>
                          <div className="card-name">{prod.name}</div>
                          <div className="card-tagline">{prod.tagline}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ================= STEP 02: FABRIC ================= */}
            {currentStep === 2 && (
              <div className="step-pane">
                <div className="pane-header">
                  <span className="pane-eyebrow">STEP 02 &middot; MATERIAL COMPOSITION</span>
                  <h3 className="pane-title">FABRIC &amp; GSM CALIBRATION</h3>
                  <p className="pane-desc">Milled from combed long-staple cotton, French terry loopbacks, raw selvedge, and full-grain hides engineered specifically for {currentProduct.name}.</p>
                </div>

                <div className="options-section">
                  <label className="section-label">FABRIC WEAVE &amp; FINISH</label>
                  <div className="pill-options-grid">
                    {currentProduct.availableFabrics.map((fab) => (
                      <button
                        key={fab}
                        type="button"
                        onClick={() => setSelectedFabric(fab)}
                        className={`pill-option ${selectedFabric === fab ? 'is-selected' : ''}`}
                      >
                        <span className="pill-text">{fab}</span>
                        {selectedFabric === fab && <Check size={14} />}
                      </button>
                    ))}
                  </div>
                </div>

                {currentProduct.availableGsm && (
                  <div className="options-section" style={{ marginTop: 24 }}>
                    <label className="section-label">TARGET WEIGHT (GSM / THICKNESS)</label>
                    <div className="pill-options-grid">
                      {currentProduct.availableGsm.map((gsm) => (
                        <button
                          key={gsm}
                          type="button"
                          onClick={() => setSelectedGsm(gsm)}
                          className={`pill-option ${selectedGsm === gsm ? 'is-selected' : ''}`}
                        >
                          <span className="pill-text">{gsm}</span>
                          {selectedGsm === gsm && <Check size={14} />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ================= STEP 03: FIT ================= */}
            {currentStep === 3 && (
              <div className="step-pane">
                <div className="pane-header">
                  <span className="pane-eyebrow">STEP 03 &middot; PATTERN SILHOUETTE</span>
                  <h3 className="pane-title">FIT PROFILE &amp; DRAPE</h3>
                  <p className="pane-desc">Bespoke grading patterns developed with dropped shoulders, architectural volume, and modern luxury drape.</p>
                </div>

                <div className="options-section">
                  <label className="section-label">AVAILABLE FIT PROFILES</label>
                  <div className="segmented-fit-grid">
                    {currentProduct.availableFits.map((fit) => (
                      <button
                        key={fit}
                        type="button"
                        onClick={() => setSelectedFit(fit)}
                        className={`fit-option-card ${selectedFit === fit ? 'is-selected' : ''}`}
                      >
                        <div className="fit-name">{fit}</div>
                        <div className="fit-indicator">{selectedFit === fit ? 'SELECTED PROFILE' : 'CHOOSE FIT'}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ================= STEP 04: COLOUR ================= */}
            {currentStep === 4 && (
              <div className="step-pane">
                <div className="pane-header">
                  <span className="pane-eyebrow">STEP 04 &middot; DYE &amp; PALETTE</span>
                  <h3 className="pane-title">REACTIVE DYE COLOR PALETTE</h3>
                  <p className="pane-desc">Reactive vat dyed and pigment washed. Live 3D materials adapt instantly to your selected shade.</p>
                </div>

                <div className="options-section">
                  <label className="section-label">CURATED SHADES FOR {currentProduct.name.toUpperCase()}</label>
                  <div className="color-swatch-grid">
                    {currentProduct.availableColors.map((color) => {
                      const isSelected = selectedColor === color.hex;
                      return (
                        <button
                          key={color.name}
                          type="button"
                          onClick={() => setSelectedColor(color.hex)}
                          className={`color-swatch-card ${isSelected ? 'is-selected' : ''}`}
                        >
                          <span className="swatch-circle" style={{ background: color.hex }} />
                          <span className="swatch-name">{color.name}</span>
                          {isSelected && <Check size={13} className="swatch-check" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ================= STEP 05: BRANDING ================= */}
            {currentStep === 5 && (
              <div className="step-pane">
                <div className="pane-header">
                  <span className="pane-eyebrow">STEP 05 &middot; CUSTOMIZATION &amp; BRANDING</span>
                  <h3 className="pane-title">PRINTING, EMBROIDERY &amp; HARDWARE</h3>
                  <p className="pane-desc">Add tactile dimension to your garment. Industrial screenprinting, high-density 3D puff embroidery, and cast YKK hardware.</p>
                </div>

                {isRelevant('print') && currentProduct.availablePrint && (
                  <div className="options-section">
                    <label className="section-label">SCREEN PRINTING &amp; DTF</label>
                    <div className="pill-options-grid">
                      {currentProduct.availablePrint.map((pr) => (
                        <button
                          key={pr}
                          type="button"
                          onClick={() => setSelectedPrint(pr)}
                          className={`pill-option ${selectedPrint === pr ? 'is-selected' : ''}`}
                        >
                          <span>{pr}</span>
                          {selectedPrint === pr && <Check size={14} />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {isRelevant('embroidery') && currentProduct.availableEmbroidery && (
                  <div className="options-section" style={{ marginTop: 22 }}>
                    <label className="section-label">EMBROIDERY SPECIFICATION</label>
                    <div className="pill-options-grid">
                      {currentProduct.availableEmbroidery.map((em) => (
                        <button
                          key={em}
                          type="button"
                          onClick={() => setSelectedEmbroidery(em)}
                          className={`pill-option ${selectedEmbroidery === em ? 'is-selected' : ''}`}
                        >
                          <span>{em}</span>
                          {selectedEmbroidery === em && <Check size={14} />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {isRelevant('embellishments') && currentProduct.availableEmbellishments && (
                  <div className="options-section" style={{ marginTop: 22 }}>
                    <label className="section-label">RHINESTONES &amp; EMBELLISHMENTS</label>
                    <div className="pill-options-grid">
                      {currentProduct.availableEmbellishments.map((emb) => (
                        <button
                          key={emb}
                          type="button"
                          onClick={() => setSelectedEmbellishments(emb)}
                          className={`pill-option ${selectedEmbellishments === emb ? 'is-selected' : ''}`}
                        >
                          <span>{emb}</span>
                          {selectedEmbellishments === emb && <Check size={14} />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {(isRelevant('zippers') || isRelevant('hardware')) && (currentProduct.availableZippers || currentProduct.availableHardware) && (
                  <div className="options-section" style={{ marginTop: 22 }}>
                    <label className="section-label">HARDWARE &amp; ZIPPERS</label>
                    <div className="pill-options-grid">
                      {(currentProduct.availableZippers || currentProduct.availableHardware).map((hw) => (
                        <button
                          key={hw}
                          type="button"
                          onClick={() => setSelectedHardware(hw)}
                          className={`pill-option ${selectedHardware === hw ? 'is-selected' : ''}`}
                        >
                          <span>{hw}</span>
                          {selectedHardware === hw && <Check size={14} />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ================= STEP 06: FINISHING ================= */}
            {currentStep === 6 && (
              <div className="step-pane">
                <div className="pane-header">
                  <span className="pane-eyebrow">STEP 06 &middot; WASHES &amp; DISTRESSING</span>
                  <h3 className="pane-title">WASH TREATMENTS &amp; FINISHING</h3>
                  <p className="pane-desc">Vintage acid washing, silicone enzyme softening, sun-bleached treatments, and pre-shrunk stabilizing baths.</p>
                </div>

                <div className="options-section">
                  <label className="section-label">WASH TECHNIQUES</label>
                  <div className="pill-options-grid">
                    {currentProduct.availableWashes.map((wash) => (
                      <button
                        key={wash}
                        type="button"
                        onClick={() => setSelectedWashes(wash)}
                        className={`pill-option ${selectedWashes === wash ? 'is-selected' : ''}`}
                      >
                        <span>{wash}</span>
                        {selectedWashes === wash && <Check size={14} />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ================= STEP 07: PACKAGING ================= */}
            {currentStep === 7 && (
              <div className="step-pane">
                <div className="pane-header">
                  <span className="pane-eyebrow">STEP 07 &middot; UNBOXING &amp; LABELS</span>
                  <h3 className="pane-title">LABELS, TAGS &amp; PACKAGING</h3>
                  <p className="pane-desc">Turnkey retail presentation. High-density woven damask neck labels, 700 GSM embossed hangtags, and frosted soft-touch polybags.</p>
                </div>

                <div className="options-section">
                  <label className="section-label">PRIVATE RELABELING</label>
                  <div className="pill-options-grid">
                    {currentProduct.availableLabels.map((lbl) => (
                      <button
                        key={lbl}
                        type="button"
                        onClick={() => setSelectedLabels(lbl)}
                        className={`pill-option ${selectedLabels === lbl ? 'is-selected' : ''}`}
                      >
                        <span>{lbl}</span>
                        {selectedLabels === lbl && <Check size={14} />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="options-section" style={{ marginTop: 22 }}>
                  <label className="section-label">HANGTAG SPECIFICATION</label>
                  <div className="pill-options-grid">
                    {currentProduct.availableTags.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => setSelectedTags(tag)}
                        className={`pill-option ${selectedTags === tag ? 'is-selected' : ''}`}
                      >
                        <span>{tag}</span>
                        {selectedTags === tag && <Check size={14} />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="options-section" style={{ marginTop: 22 }}>
                  <label className="section-label">RETAIL PACKAGING</label>
                  <div className="pill-options-grid">
                    {currentProduct.availablePackaging.map((pkg) => (
                      <button
                        key={pkg}
                        type="button"
                        onClick={() => setSelectedPackaging(pkg)}
                        className={`pill-option ${selectedPackaging === pkg ? 'is-selected' : ''}`}
                      >
                        <span>{pkg}</span>
                        {selectedPackaging === pkg && <Check size={14} />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ================= STEP 08: REVIEW ================= */}
            {currentStep === 8 && (
              <div className="step-pane">
                <div className="pane-header">
                  <span className="pane-eyebrow">STEP 08 &middot; PRODUCTION SPECIFICATION</span>
                  <h3 className="pane-title">REVIEW YOUR PRODUCT SPEC SHEET</h3>
                  <p className="pane-desc">Every parameter is calibrated and ready for technical sampling and mass garment manufacturing with GTT.</p>
                </div>

                <div className="spec-review-grid">
                  <div className="spec-review-card">
                    <span className="spec-k">PRODUCT</span>
                    <span className="spec-v">{currentProduct.name}</span>
                  </div>
                  <div className="spec-review-card">
                    <span className="spec-k">COLOUR</span>
                    <span className="spec-v" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ width: 12, height: 12, borderRadius: '50%', background: selectedColor, display: 'inline-block', border: '1px solid #fff' }} />
                      {currentProduct.availableColors.find(c => c.hex === selectedColor)?.name || selectedColor}
                    </span>
                  </div>
                  <div className="spec-review-card">
                    <span className="spec-k">FABRIC</span>
                    <span className="spec-v">{selectedFabric}</span>
                  </div>
                  <div className="spec-review-card">
                    <span className="spec-k">GSM / WEIGHT</span>
                    <span className="spec-v">{selectedGsm}</span>
                  </div>
                  <div className="spec-review-card">
                    <span className="spec-k">FIT PROFILE</span>
                    <span className="spec-v">{selectedFit}</span>
                  </div>
                  <div className="spec-review-card">
                    <span className="spec-k">PRINTING</span>
                    <span className="spec-v">{selectedPrint}</span>
                  </div>
                  <div className="spec-review-card">
                    <span className="spec-k">EMBROIDERY</span>
                    <span className="spec-v">{selectedEmbroidery}</span>
                  </div>
                  <div className="spec-review-card">
                    <span className="spec-k">HARDWARE</span>
                    <span className="spec-v">{selectedHardware}</span>
                  </div>
                  <div className="spec-review-card">
                    <span className="spec-k">WASH / FINISH</span>
                    <span className="spec-v">{selectedWashes}</span>
                  </div>
                  <div className="spec-review-card">
                    <span className="spec-k">LABELS &amp; TAGS</span>
                    <span className="spec-v">{selectedLabels} &middot; {selectedTags}</span>
                  </div>
                  <div className="spec-review-card" style={{ gridColumn: 'span 2' }}>
                    <span className="spec-k">PACKAGING</span>
                    <span className="spec-v">{selectedPackaging}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginTop: 24 }}>
                  <button
                    type="button"
                    onClick={handleRequestProduct}
                    className="btn btn-primary"
                    style={{ background: 'var(--white, #fff)', color: 'var(--black, #000)', padding: '16px 32px', fontSize: 13, fontWeight: 800 }}
                  >
                    Request Physical Sample / RFQ <ArrowRight size={14} />
                  </button>

                  <a 
                    href="#workflows-section" 
                    className="btn btn-ghost"
                    style={{ padding: '16px 26px', fontSize: 13 }}
                  >
                    Send to GTT / AI Studio <ChevronRight size={14} />
                  </a>
                </div>
              </div>
            )}

            {/* Stepper Navigation Buttons */}
            <div className="stepper-footer-nav">
              <button
                type="button"
                disabled={currentStep === 1}
                onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
                className="step-nav-btn prev-btn"
              >
                <ArrowLeft size={14} /> PREVIOUS STEP
              </button>

              <div className="step-counter-indicator">
                STEP {currentStep} OF {STEPS.length}
              </div>

              <button
                type="button"
                disabled={currentStep === STEPS.length}
                onClick={() => setCurrentStep(prev => Math.min(STEPS.length, prev + 1))}
                className="step-nav-btn next-btn"
              >
                NEXT STEP <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Sticky Compact Live Product Summary */}
          <div className="sticky-product-summary">
            <div className="summary-header">
              <span className="summary-eyebrow">LIVE SPECIFICATION</span>
              <h4 className="summary-title">YOUR PRODUCT</h4>
            </div>

            <div className="summary-items">
              <div className="summary-row">
                <span className="sum-label">Product:</span>
                <span className="sum-val">{selectedGsm} {currentProduct.name}</span>
              </div>
              <div className="summary-row">
                <span className="sum-label">Colour:</span>
                <span className="sum-val">
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: selectedColor, display: 'inline-block', marginRight: 5 }} />
                  {currentProduct.availableColors.find(c => c.hex === selectedColor)?.name || selectedColor}
                </span>
              </div>
              <div className="summary-row">
                <span className="sum-label">Fit:</span>
                <span className="sum-val">{selectedFit}</span>
              </div>
              <div className="summary-row">
                <span className="sum-label">Customization:</span>
                <span className="sum-val">
                  {selectedPrint !== 'None' ? selectedPrint : ''}
                  {selectedPrint !== 'None' && selectedEmbroidery !== 'None' ? ' + ' : ''}
                  {selectedEmbroidery !== 'None' ? selectedEmbroidery : ''}
                  {selectedPrint === 'None' && selectedEmbroidery === 'None' ? 'Plain / Factory Blank' : ''}
                </span>
              </div>
              <div className="summary-row">
                <span className="sum-label">Labels:</span>
                <span className="sum-val">{selectedLabels}</span>
              </div>
              <div className="summary-row">
                <span className="sum-label">Packaging:</span>
                <span className="sum-val">{selectedPackaging}</span>
              </div>
            </div>

            <div className="summary-actions">
              <button
                type="button"
                onClick={handleRequestProduct}
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', background: 'var(--white, #fff)', color: 'var(--black, #000)', fontSize: 12, padding: '13px 18px', fontWeight: 800 }}
              >
                Request Product Spec <Send size={13} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded Section: Two Ways to Build (AI Generate & Send Prompt to GTT) */}
      <div id="workflows-section" style={{ marginTop: 60 }}>
        <div style={{ marginBottom: 24 }}>
          <p className="eyebrow" style={{ color: 'var(--gray, #888)' }}>TWO CREATION PATHWAYS</p>
          <h2 style={{ fontSize: 'clamp(26px, 3.4vw, 42px)', fontWeight: 900, textTransform: 'uppercase', color: 'var(--white, #fff)', marginTop: 12 }}>
            CHOOSE HOW YOU DEVELOP YOUR IDEA.
          </h2>
          <p style={{ color: 'var(--gray, #aaa)', fontSize: 15, maxWidth: 640, marginTop: 8, lineHeight: 1.6 }}>
            Whether you want to visualize your concept in real time or have our apparel engineers review your prompt directly, we make manufacturing seamless.
          </p>
        </div>

        <ProductCreationWorkflows
          currentConfiguration={currentConfigObject}
          onApplyPromptToConfigurator={handleApplyParsedPrompt}
        />
      </div>

      <style>{`
        .gtt-configurator-container {
          width: 100%;
        }

        .configurator-main-grid {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 40px;
          align-items: start;
        }

        .viewport-sticky-wrap {
          position: sticky;
          top: calc(var(--nav-h, 72px) + 20px);
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .viewport-card {
          width: 100%;
          height: 540px;
          background: #0d0d0d;
          border: 1px solid var(--line-dark, rgba(255,255,255,0.12));
          border-radius: 2px;
          overflow: hidden;
          position: relative;
        }

        .viewport-quick-spec {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .spec-pill {
          background: var(--near-black, #141414);
          border: 1px solid var(--line-dark, rgba(255,255,255,0.1));
          padding: 7px 12px;
          border-radius: 2px;
          font-size: 11px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .spec-label {
          color: var(--gray, #777);
          font-weight: 700;
          letter-spacing: .06em;
          text-transform: uppercase;
        }

        .spec-val {
          color: var(--white, #fff);
          font-weight: 700;
        }

        .config-steps-nav {
          display: flex;
          overflow-x: auto;
          gap: 4px;
          border-bottom: 1px solid var(--line-dark, rgba(255,255,255,0.12));
          padding-bottom: 10px;
          margin-bottom: 24px;
          scrollbar-width: none;
        }

        .step-btn {
          flex: 0 0 auto;
          background: transparent;
          border: 1px solid transparent;
          color: var(--gray, #777);
          padding: 8px 12px;
          border-radius: 2px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: .08em;
          transition: all .2s ease;
        }

        .step-btn:hover {
          color: var(--white, #fff);
          background: rgba(255,255,255,0.04);
        }

        .step-btn.is-active {
          background: var(--white, #fff);
          color: var(--black, #000);
          border-color: var(--white, #fff);
        }

        .step-btn.is-done:not(.is-active) {
          color: var(--white, #fff);
          border-color: rgba(255,255,255,0.15);
        }

        .step-number {
          font-size: 10px;
          opacity: 0.8;
        }

        .config-step-card {
          background: var(--near-black, #121212);
          border: 1px solid var(--line-dark, rgba(255,255,255,0.12));
          border-radius: 2px;
          padding: 28px;
        }

        .pane-eyebrow {
          font-size: 10.5px;
          letter-spacing: .16em;
          text-transform: uppercase;
          color: var(--gray, #888);
          font-weight: 800;
        }

        .pane-title {
          font-size: clamp(20px, 2.2vw, 26px);
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: -0.01em;
          color: var(--white, #fff);
          margin: 6px 0 10px;
        }

        .pane-desc {
          color: var(--gray, #aaa);
          font-size: 13.5px;
          line-height: 1.6;
          margin-bottom: 24px;
        }

        .product-cards-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
        }

        .product-select-card {
          background: rgba(0,0,0,0.5);
          border: 1px solid var(--line-dark, rgba(255,255,255,0.12));
          border-radius: 2px;
          padding: 12px;
          text-align: left;
          cursor: pointer;
          transition: all .25s ease;
          display: flex;
          flex-direction: column;
        }

        .product-select-card:hover {
          border-color: rgba(255,255,255,0.4);
          transform: translateY(-2px);
        }

        .product-select-card.is-selected {
          border-color: var(--white, #fff);
          background: rgba(255,255,255,0.06);
        }

        .card-media {
          width: 100%;
          aspect-ratio: 1/1;
          overflow: hidden;
          background: #000;
          border-radius: 2px;
          position: relative;
        }

        .card-media img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .selected-badge {
          position: absolute;
          top: 8px;
          left: 8px;
          background: var(--white, #fff);
          color: var(--black, #000);
          font-size: 9px;
          font-weight: 900;
          letter-spacing: .08em;
          padding: 3px 6px;
          border-radius: 2px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .card-info {
          margin-top: 10px;
        }

        .card-category {
          font-size: 9.5px;
          letter-spacing: .12em;
          text-transform: uppercase;
          color: var(--gray, #777);
          font-weight: 700;
        }

        .card-name {
          font-size: 13px;
          font-weight: 800;
          color: var(--white, #fff);
          margin: 3px 0;
          text-transform: uppercase;
        }

        .card-tagline {
          font-size: 11px;
          color: var(--gray, #999);
          line-height: 1.4;
        }

        .options-section {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .section-label {
          font-size: 10.5px;
          letter-spacing: .12em;
          text-transform: uppercase;
          color: var(--gray, #888);
          font-weight: 800;
        }

        .pill-options-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .pill-option {
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--line-dark, rgba(255,255,255,0.12));
          color: var(--gray, #ccc);
          padding: 10px 16px;
          border-radius: 2px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all .2s ease;
        }

        .pill-option:hover {
          border-color: rgba(255,255,255,0.4);
          color: var(--white, #fff);
        }

        .pill-option.is-selected {
          background: var(--white, #fff);
          color: var(--black, #000);
          border-color: var(--white, #fff);
          font-weight: 800;
        }

        .segmented-fit-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }

        .fit-option-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--line-dark, rgba(255,255,255,0.12));
          padding: 16px 14px;
          border-radius: 2px;
          text-align: center;
          cursor: pointer;
          transition: all .2s ease;
        }

        .fit-option-card:hover {
          border-color: rgba(255,255,255,0.4);
        }

        .fit-option-card.is-selected {
          background: var(--white, #fff);
          color: var(--black, #000);
          border-color: var(--white, #fff);
        }

        .fit-name {
          font-size: 12.5px;
          font-weight: 800;
          text-transform: uppercase;
        }

        .fit-indicator {
          font-size: 9.5px;
          margin-top: 4px;
          letter-spacing: .08em;
          opacity: 0.7;
        }

        .color-swatch-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }

        .color-swatch-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--line-dark, rgba(255,255,255,0.12));
          padding: 10px 12px;
          border-radius: 2px;
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          transition: all .2s ease;
        }

        .color-swatch-card:hover {
          border-color: rgba(255,255,255,0.4);
        }

        .color-swatch-card.is-selected {
          border-color: var(--white, #fff);
          background: rgba(255,255,255,0.08);
        }

        .swatch-circle {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.3);
          flex-shrink: 0;
        }

        .swatch-name {
          font-size: 12px;
          font-weight: 700;
          color: var(--white, #fff);
          text-align: left;
        }

        .swatch-check {
          margin-left: auto;
          color: var(--white, #fff);
        }

        .spec-review-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }

        .spec-review-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--line-dark, rgba(255,255,255,0.1));
          padding: 12px 14px;
          border-radius: 2px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .spec-k {
          font-size: 9.5px;
          letter-spacing: .12em;
          text-transform: uppercase;
          color: var(--gray, #777);
          font-weight: 800;
        }

        .spec-v {
          font-size: 13px;
          font-weight: 700;
          color: var(--white, #fff);
        }

        .stepper-footer-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 32px;
          border-top: 1px solid var(--line-dark, rgba(255,255,255,0.1));
          padding-top: 20px;
        }

        .step-nav-btn {
          background: transparent;
          border: 1px solid var(--line-dark, rgba(255,255,255,0.18));
          color: var(--white, #fff);
          padding: 10px 18px;
          border-radius: 2px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: .08em;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all .2s ease;
        }

        .step-nav-btn:hover:not(:disabled) {
          background: var(--white, #fff);
          color: var(--black, #000);
          border-color: var(--white, #fff);
        }

        .step-nav-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .step-counter-indicator {
          font-size: 11px;
          letter-spacing: .12em;
          color: var(--gray, #888);
          font-weight: 800;
        }

        .sticky-product-summary {
          background: var(--near-black, #141414);
          border: 1px solid var(--line-dark, rgba(255,255,255,0.12));
          border-radius: 2px;
          padding: 22px;
          margin-top: 24px;
        }

        .summary-eyebrow {
          font-size: 10px;
          letter-spacing: .16em;
          text-transform: uppercase;
          color: var(--gray, #777);
          font-weight: 800;
        }

        .summary-title {
          font-size: 18px;
          font-weight: 900;
          text-transform: uppercase;
          color: var(--white, #fff);
          margin: 4px 0 16px;
        }

        .summary-items {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 20px;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12.5px;
          padding-bottom: 8px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        .sum-label {
          color: var(--gray, #888);
        }

        .sum-val {
          color: var(--white, #fff);
          font-weight: 700;
          text-align: right;
          max-width: 60%;
        }

        @media (max-width: 1080px) {
          .configurator-main-grid {
            grid-template-columns: 1fr;
          }
          .viewport-sticky-wrap {
            position: relative;
            top: 0;
          }
          .viewport-card {
            height: 440px;
          }
        }

        @media (max-width: 640px) {
          .product-cards-grid,
          .color-swatch-grid,
          .segmented-fit-grid,
          .spec-review-grid {
            grid-template-columns: 1fr;
          }
          .spec-review-card {
            grid-column: span 1 !important;
          }
        }
      `}</style>
    </div>
  );
}
