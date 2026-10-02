import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, ArrowDown, Check, CheckCircle2, ShieldCheck, Factory, 
  Layers, Sparkles, UploadCloud, AlertCircle, RefreshCw, Compass, Building2,
  FileText, Globe, Send, MessageSquare
} from 'lucide-react';
import SEOHead from '../components/SEOHead';

export default function BeASupplierPage() {
  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    email: '',
    phone: '',
    country: '',
    city: '',
    supplierType: 'Garment Manufacturer',
    whatYouSupply: '',
    website: '',
    instagram: '',
    linkedin: '',
    capabilities: '',
    certifications: '',
    yearsInBusiness: '',
    whyGtt: ''
  });

  const [productImagesFile, setProductImagesFile] = useState(null);
  const [portfolioFile, setPortfolioFile] = useState(null);

  // Status State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const handleFileUpload = (e, setFileState) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit: 12MB
    if (file.size > 12 * 1024 * 1024) {
      alert('File size exceeds 12MB limit. Please upload a smaller file or send via wetransfer/link in the form.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFileState({
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
        dataUrl: reader.result
      });
    };
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const errors = {};
    if (!formData.fullName.trim()) errors.fullName = 'Full Name is required.';
    if (!formData.companyName.trim()) errors.companyName = 'Company Name is required.';
    if (!formData.email.trim() || !formData.email.includes('@')) errors.email = 'A valid business email address is required.';
    if (!formData.country.trim()) errors.country = 'Country is required.';
    if (!formData.supplierType.trim()) errors.supplierType = 'Supplier Type is required.';
    if (!formData.whatYouSupply.trim()) errors.whatYouSupply = 'Please describe what you manufacture or supply.';
    if (!formData.capabilities.trim()) errors.capabilities = 'Please describe your production capabilities.';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      const firstErrorEl = document.querySelector('.has-error');
      if (firstErrorEl) {
        firstErrorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/supplier-application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          productImagesFile,
          portfolioFile
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmittedSuccess({
          companyName: formData.companyName,
          email: formData.email,
          applicationId: result.applicationId
        });
      } else {
        setSubmitError(result.message || "We couldn't submit your application right now. Please try again or contact GTT directly at globalthundertrade@gmail.com.");
      }
    } catch (err) {
      console.error('Supplier Application Submission Error:', err);
      setSubmitError("We couldn't submit your application right now. Please check your connection or contact GTT directly at globalthundertrade@gmail.com.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToForm = (e) => {
    e?.preventDefault();
    const el = document.getElementById('supplier-form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToCapabilities = (e) => {
    e?.preventDefault();
    const el = document.getElementById('who-should-apply');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="supplier-page-root" style={{ background: '#090909', color: 'var(--white, #fff)', minHeight: '100vh', paddingTop: 'var(--nav-h, 72px)' }}>
      <SEOHead />
      {/* ============================================================== */}
      {/* 1. HERO SECTION */}
      {/* ============================================================== */}
      <section className="supplier-hero-section">
        <div className="wrap">
          <div className="supplier-hero-inner">
            <div className="supplier-badge">
              <Building2 size={13} />
              <span>GTT PARTNER INTAKE &middot; SUPPLY CHAIN NETWORK</span>
            </div>

            <p className="eyebrow" style={{ color: 'var(--gray, #888)', marginBottom: 12 }}>
              BE A SUPPLIER
            </p>

            <h1 className="supplier-hero-title">
              LET'S BUILD THE SUPPLY CHAIN TOGETHER.
            </h1>

            <p className="supplier-hero-sub">
              “Are you a manufacturer, supplier, factory, workshop, or specialist producer? Tell us what you make, what you can supply, and how you can work with GTT.”
            </p>

            <div className="supplier-hero-ctas">
              <button 
                type="button" 
                onClick={scrollToForm} 
                className="btn btn-primary"
                style={{ background: 'var(--white, #fff)', color: 'var(--black, #000)', padding: '16px 32px', fontSize: 12.5, fontWeight: 800, letterSpacing: '.08em', textTransform: 'uppercase' }}
              >
                BECOME A SUPPLIER <ArrowDown size={14} />
              </button>

              <button 
                type="button" 
                onClick={scrollToCapabilities} 
                className="btn btn-ghost"
                style={{ padding: '16px 28px', fontSize: 12.5, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase' }}
              >
                TELL US ABOUT YOUR CAPABILITIES <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 2. WHO SHOULD APPLY? */}
      {/* ============================================================== */}
      <section id="who-should-apply" className="section section-dark" style={{ borderTop: '1px solid var(--line-dark, rgba(255,255,255,0.1))', padding: '90px 0' }}>
        <div className="wrap">
          <div style={{ maxWidth: 760, marginBottom: 50 }}>
            <p className="eyebrow" style={{ color: 'var(--gray, #888)' }}>SUPPLIER PROFILES</p>
            <h2 style={{ fontSize: 'clamp(28px, 4.2vw, 48px)', textTransform: 'uppercase', letterSpacing: '-.02em', marginTop: 12 }}>
              WHO SHOULD APPLY?
            </h2>
            <p style={{ color: 'var(--gray, #aaa)', fontSize: 15, lineHeight: 1.65, marginTop: 14 }}>
              We collaborate with established mills, specialized dye houses, high-precision finishing facilities, and component suppliers across the globe. These categories outline common supplier profiles we welcome into our prospective supplier database.
            </p>
            <p style={{ fontSize: 11.5, color: '#777', textTransform: 'uppercase', letterSpacing: '.08em', marginTop: 10 }}>
              * Note: These represent supplier application categories, not claims that GTT currently purchases or requires every category.
            </p>
          </div>

          <div className="supplier-cards-grid">
            <div className="supplier-type-card">
              <div className="card-num">01</div>
              <div className="card-icon"><Factory size={22} /></div>
              <h3>GARMENT MANUFACTURERS</h3>
              <p>Factories and production units capable of manufacturing apparel across knitwear, heavy fleece, denim, tailoring, or medical uniforms with disciplined QA.</p>
              <div className="card-tags">
                <span>Cut &amp; Sew</span>
                <span>Knits</span>
                <span>Wovens</span>
                <span>Outerwear</span>
              </div>
            </div>

            <div className="supplier-type-card">
              <div className="card-num">02</div>
              <div className="card-icon"><Layers size={22} /></div>
              <h3>FABRIC &amp; MATERIAL SUPPLIERS</h3>
              <p>Businesses supplying raw or finished textiles, combed long-staple cottons, loopback French terry, raw selvedge denim, technical blends, and linings.</p>
              <div className="card-tags">
                <span>Yarn / Cotton</span>
                <span>Denim Mills</span>
                <span>Performance Knits</span>
                <span>Linings</span>
              </div>
            </div>

            <div className="supplier-type-card">
              <div className="card-num">03</div>
              <div className="card-icon"><Sparkles size={22} /></div>
              <h3>PRINTING &amp; EMBROIDERY</h3>
              <p>Specialized production partners offering precision screen printing, jumbo DTG, puff embroidery, rhinestones, heat transfers, and artisan garment washing.</p>
              <div className="card-tags">
                <span>Screen Print</span>
                <span>3D Puff</span>
                <span>Acid Wash</span>
                <span>Specialty Inks</span>
              </div>
            </div>

            <div className="supplier-type-card">
              <div className="card-num">04</div>
              <div className="card-icon"><Compass size={22} /></div>
              <h3>ACCESSORIES &amp; COMPONENTS</h3>
              <p>Suppliers of high-grade metal zippers, custom molded buttons, woven damask neck labels, matte black hangtags, drawcords, and custom retail packaging.</p>
              <div className="card-tags">
                <span>YKK Hardware</span>
                <span>Woven Labels</span>
                <span>Hangtags</span>
                <span>Zip Packaging</span>
              </div>
            </div>

            <div className="supplier-type-card full-span-card">
              <div className="card-num">05</div>
              <div className="card-icon"><ShieldCheck size={22} /></div>
              <div>
                <h3>SPECIALIST MANUFACTURERS</h3>
                <p>Workshops and producers offering specialized manufacturing or production capabilities relevant to GTT's ongoing international apparel operations.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. TELL US WHAT YOU DO & WHAT WE LOOK FOR */}
      {/* ============================================================== */}
      <section className="section" style={{ background: '#111111', borderTop: '1px solid var(--line-dark, rgba(255,255,255,0.1))', padding: '90px 0' }}>
        <div className="wrap">
          <div className="what-grid">
            
            {/* Left: What To Tell Us */}
            <div className="what-col">
              <p className="eyebrow" style={{ color: 'var(--gray, #888)' }}>TRANSPARENT PROFILE</p>
              <h2 style={{ fontSize: 'clamp(28px, 3.8vw, 44px)', textTransform: 'uppercase', letterSpacing: '-.02em', marginTop: 12 }}>
                TELL US WHAT YOU DO.
              </h2>
              <p style={{ color: 'var(--gray, #aaa)', fontSize: 15, lineHeight: 1.65, marginTop: 14 }}>
                A clear, precise introduction helps our technical procurement team immediately recognize when a project matches your exact capacity and machinery.
              </p>

              <div className="tell-us-list">
                <div className="tell-item">
                  <Check size={15} className="tell-check" />
                  <div>
                    <strong>What you manufacture or supply:</strong> Specific garments, fabrics, trims, or finishes.
                  </div>
                </div>
                <div className="tell-item">
                  <Check size={15} className="tell-check" />
                  <div>
                    <strong>Materials &amp; product categories:</strong> Weights, yarn gauges, compositions, and specialties.
                  </div>
                </div>
                <div className="tell-item">
                  <Check size={15} className="tell-check" />
                  <div>
                    <strong>Production &amp; customization capabilities:</strong> Printing presses, embroidery heads, laser cutters, wash tanks.
                  </div>
                </div>
                <div className="tell-item">
                  <Check size={15} className="tell-check" />
                  <div>
                    <strong>Location &amp; facilities:</strong> Factory cities, production footprint, and shipping ports.
                  </div>
                </div>
                <div className="tell-item">
                  <Check size={15} className="tell-check" />
                  <div>
                    <strong>Digital footprint &amp; portfolio:</strong> Website, LinkedIn, factory images, or catalog profiles.
                  </div>
                </div>
                <div className="tell-item">
                  <Check size={15} className="tell-check" />
                  <div>
                    <strong>Relevant certifications (if applicable):</strong> OEKO-TEX, GOTS, ISO, Sedex, or specific factory standards.
                  </div>
                </div>
              </div>
            </div>

            {/* Right: What We Look For */}
            <div className="lookfor-col">
              <p className="eyebrow" style={{ color: 'var(--gray, #888)' }}>PARTNER EXPECTATIONS</p>
              <h2 style={{ fontSize: 'clamp(28px, 3.8vw, 44px)', textTransform: 'uppercase', letterSpacing: '-.02em', marginTop: 12 }}>
                WHAT WE LOOK FOR
              </h2>
              <p style={{ color: 'var(--gray, #aaa)', fontSize: 15, lineHeight: 1.65, marginTop: 14 }}>
                “We're interested in connecting with businesses that take quality, consistency, communication, and production seriously.”
              </p>

              <div className="pillars-wrap">
                <div className="pillar-row">
                  <div className="pillar-name">QUALITY</div>
                  <div className="pillar-desc">Strict in-line inspection and honest craftsmanship in every stitch and component.</div>
                </div>

                <div className="pillar-row">
                  <div className="pillar-name">CONSISTENCY</div>
                  <div className="pillar-desc">Replicable tolerances from initial sample strike-off to 50,000-piece bulk export.</div>
                </div>

                <div className="pillar-row">
                  <div className="pillar-name">CAPABILITY</div>
                  <div className="pillar-desc">Demonstrated technical ability to manufacture to exact specs and tech sheets.</div>
                </div>

                <div className="pillar-row">
                  <div className="pillar-name">COMMUNICATION</div>
                  <div className="pillar-desc">Transparent timelines, prompt responses, and upfront production status reporting.</div>
                </div>

                <div className="pillar-row">
                  <div className="pillar-name">RELIABILITY</div>
                  <div className="pillar-desc">Commitment to agreed delivery dates, packaging specs, and export packaging standards.</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 4. THREE-STEP PROCESS */}
      {/* ============================================================== */}
      <section className="section section-dark" style={{ borderTop: '1px solid var(--line-dark, rgba(255,255,255,0.1))', padding: '80px 0' }}>
        <div className="wrap">
          <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 50px' }}>
            <p className="eyebrow" style={{ color: 'var(--gray, #888)' }}>HOW WE ENGAGE</p>
            <h2 style={{ fontSize: 'clamp(28px, 3.8vw, 44px)', textTransform: 'uppercase', letterSpacing: '-.02em', marginTop: 10 }}>
              OUR INTAKE PROCESS
            </h2>
            <p style={{ color: 'var(--gray, #aaa)', fontSize: 15, marginTop: 10 }}>
              A disciplined, straightforward approach to reviewing and onboarding prospective suppliers.
            </p>
          </div>

          <div className="process-three-grid">
            <div className="process-step-box">
              <div className="step-badge">STEP 01</div>
              <h3>INTRODUCE YOUR BUSINESS</h3>
              <p>Tell us what you manufacture or supply using the application form below. Share your machinery, location, and references.</p>
            </div>

            <div className="process-step-box">
              <div className="step-badge">STEP 02</div>
              <h3>WE REVIEW</h3>
              <p>Our technical team reviews your capabilities, profile, and certifications against our ongoing and upcoming brand production orders.</p>
            </div>

            <div className="process-step-box">
              <div className="step-badge">STEP 03</div>
              <h3>CONNECT</h3>
              <p>If there is an active or upcoming project alignment, our procurement lead reaches out directly via email to begin discussions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 5. SUPPLIER APPLICATION FORM */}
      {/* ============================================================== */}
      <section id="supplier-form" className="section" style={{ background: '#0c0c0c', borderTop: '1px solid var(--line-dark, rgba(255,255,255,0.1))', padding: '90px 0 120px' }}>
        <div className="wrap" style={{ maxWidth: 940 }}>
          
          <div style={{ marginBottom: 40 }}>
            <span style={{ fontSize: 11, letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--gray, #888)', fontWeight: 800 }}>
              SUPPLIER INTAKE &middot; REGISTRATION
            </span>
            <h2 style={{ fontSize: 'clamp(30px, 4.4vw, 52px)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-.02em', marginTop: 10 }}>
              SUPPLIER APPLICATION
            </h2>
            <p style={{ color: 'var(--gray, #aaa)', fontSize: 15, lineHeight: 1.6, marginTop: 10 }}>
              Complete the profile below to introduce your factory, mill, or workshop. All submissions are sent directly to the GTT sourcing desk and stored securely.
            </p>
          </div>

          {submittedSuccess ? (
            /* SUCCESS STATE */
            <div className="supplier-success-box">
              <div className="success-icon-wrap">
                <CheckCircle2 size={44} color="#00ff88" />
              </div>
              <h3 style={{ fontSize: 'clamp(24px, 3.2vw, 36px)', textTransform: 'uppercase', fontWeight: 900, margin: '16px 0 10px' }}>
                APPLICATION RECEIVED.
              </h3>
              <p style={{ color: '#d0d0d0', fontSize: 16, lineHeight: 1.65, maxWidth: 580, margin: '0 auto 20px' }}>
                “Thanks for introducing your business to GTT. We've received your supplier information and will review your application.”
              </p>
              <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', padding: '16px 24px', borderRadius: 2, display: 'inline-block', fontSize: 13, color: 'var(--gray, #888)', textAlign: 'left' }}>
                <div><strong>Company Registered:</strong> <span style={{ color: '#fff' }}>{submittedSuccess.companyName}</span></div>
                <div><strong>Contact Email:</strong> <span style={{ color: '#fff' }}>{submittedSuccess.email}</span></div>
                <div><strong>Submission Reference:</strong> <span style={{ color: '#fff' }}>{submittedSuccess.applicationId}</span></div>
              </div>

              <div style={{ marginTop: 32 }}>
                <button
                  type="button"
                  onClick={() => {
                    setSubmittedSuccess(null);
                    setFormData({
                      fullName: '',
                      companyName: '',
                      email: '',
                      phone: '',
                      country: '',
                      city: '',
                      supplierType: 'Garment Manufacturer',
                      whatYouSupply: '',
                      website: '',
                      instagram: '',
                      linkedin: '',
                      capabilities: '',
                      certifications: '',
                      yearsInBusiness: '',
                      whyGtt: ''
                    });
                    setProductImagesFile(null);
                    setPortfolioFile(null);
                  }}
                  className="btn btn-ghost"
                  style={{ fontSize: 12, padding: '12px 24px' }}
                >
                  Submit Another Application &rarr;
                </button>
              </div>
            </div>
          ) : (
            /* FORM STATE */
            <form onSubmit={handleSubmit} className="supplier-form-card" noValidate>
              
              {submitError && (
                <div className="form-error-banner">
                  <AlertCircle size={16} color="#ff5555" />
                  <span>{submitError}</span>
                </div>
              )}

              {/* ---------------- 1. CONTACT INFORMATION ---------------- */}
              <div className="form-section-block">
                <div className="section-title-wrap">
                  <span className="section-step-num">01</span>
                  <h4 className="section-block-title">CONTACT INFORMATION</h4>
                </div>

                <div className="fields-grid-two">
                  <div className={`form-group ${validationErrors.fullName ? 'has-error' : ''}`}>
                    <label className="form-label">Full Name <span className="req">*</span></label>
                    <input 
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="e.g. Elena Rostova"
                      className="form-input"
                    />
                    {validationErrors.fullName && <span className="err-msg">{validationErrors.fullName}</span>}
                  </div>

                  <div className={`form-group ${validationErrors.companyName ? 'has-error' : ''}`}>
                    <label className="form-label">Company Name <span className="req">*</span></label>
                    <input 
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      placeholder="e.g. Apex Textiles &amp; Garments Ltd."
                      className="form-input"
                    />
                    {validationErrors.companyName && <span className="err-msg">{validationErrors.companyName}</span>}
                  </div>

                  <div className={`form-group ${validationErrors.email ? 'has-error' : ''}`}>
                    <label className="form-label">Email <span className="req">*</span></label>
                    <input 
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="e.g. elena@apextextiles.com"
                      className="form-input"
                    />
                    {validationErrors.email && <span className="err-msg">{validationErrors.email}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Phone / WhatsApp</label>
                    <input 
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="e.g. +44 7700 900123"
                      className="form-input"
                    />
                  </div>

                  <div className={`form-group ${validationErrors.country ? 'has-error' : ''}`}>
                    <label className="form-label">Country <span className="req">*</span></label>
                    <input 
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      placeholder="e.g. Portugal, Turkey, Pakistan, Italy"
                      className="form-input"
                    />
                    {validationErrors.country && <span className="err-msg">{validationErrors.country}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">City</label>
                    <input 
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="e.g. Porto, Istanbul, Sialkot, Prato"
                      className="form-input"
                    />
                  </div>
                </div>
              </div>

              {/* ---------------- 2. BUSINESS INFORMATION ---------------- */}
              <div className="form-section-block">
                <div className="section-title-wrap">
                  <span className="section-step-num">02</span>
                  <h4 className="section-block-title">BUSINESS INFORMATION</h4>
                </div>

                <div className="fields-grid-two">
                  <div className={`form-group full-row ${validationErrors.supplierType ? 'has-error' : ''}`}>
                    <label className="form-label">Supplier Type <span className="req">*</span></label>
                    <select
                      name="supplierType"
                      value={formData.supplierType}
                      onChange={handleInputChange}
                      className="form-select"
                    >
                      <option value="Garment Manufacturer">Garment Manufacturer</option>
                      <option value="Fabric / Material Supplier">Fabric / Material Supplier</option>
                      <option value="Printing / Embroidery">Printing / Embroidery</option>
                      <option value="Accessories / Components">Accessories / Components</option>
                      <option value="Packaging">Packaging</option>
                      <option value="Specialist Manufacturer">Specialist Manufacturer</option>
                      <option value="Other">Other</option>
                    </select>
                    {validationErrors.supplierType && <span className="err-msg">{validationErrors.supplierType}</span>}
                  </div>

                  <div className={`form-group full-row ${validationErrors.whatYouSupply ? 'has-error' : ''}`}>
                    <label className="form-label">What do you manufacture / supply? <span className="req">*</span></label>
                    <textarea 
                      rows={3}
                      name="whatYouSupply"
                      value={formData.whatYouSupply}
                      onChange={handleInputChange}
                      placeholder="e.g. 400–600 GSM French terry fleece hoodies, 280 GSM oversized t-shirts, custom YKK metal zippers, or raw selvedge denim fabrics..."
                      className="form-textarea"
                    />
                    {validationErrors.whatYouSupply && <span className="err-msg">{validationErrors.whatYouSupply}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Company Website</label>
                    <input 
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      placeholder="https://..."
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Instagram</label>
                    <input 
                      type="text"
                      name="instagram"
                      value={formData.instagram}
                      onChange={handleInputChange}
                      placeholder="@companyprofile"
                      className="form-input"
                    />
                  </div>

                  <div className="form-group full-row">
                    <label className="form-label">LinkedIn</label>
                    <input 
                      type="text"
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleInputChange}
                      placeholder="linkedin.com/company/..."
                      className="form-input"
                    />
                  </div>
                </div>
              </div>

              {/* ---------------- 3. CAPABILITIES ---------------- */}
              <div className="form-section-block">
                <div className="section-title-wrap">
                  <span className="section-step-num">03</span>
                  <h4 className="section-block-title">CAPABILITIES</h4>
                </div>

                <div className="fields-grid-two">
                  <div className={`form-group full-row ${validationErrors.capabilities ? 'has-error' : ''}`}>
                    <label className="form-label">Describe your capabilities <span className="req">*</span></label>
                    <textarea 
                      rows={4}
                      name="capabilities"
                      value={formData.capabilities}
                      onChange={handleInputChange}
                      placeholder="Outline your factory setup, machinery, daily/monthly capacity, available sewing lines, print stations, fabric milling tolerances, and turnaround times..."
                      className="form-textarea"
                    />
                    {validationErrors.capabilities && <span className="err-msg">{validationErrors.capabilities}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Relevant Certifications</label>
                    <input 
                      type="text"
                      name="certifications"
                      value={formData.certifications}
                      onChange={handleInputChange}
                      placeholder="e.g. OEKO-TEX, GOTS, ISO 9001, BSCI, Sedex (if applicable)"
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Years in Business</label>
                    <input 
                      type="text"
                      name="yearsInBusiness"
                      value={formData.yearsInBusiness}
                      onChange={handleInputChange}
                      placeholder="e.g. 8 years"
                      className="form-input"
                    />
                  </div>
                </div>
              </div>

              {/* ---------------- 4. PORTFOLIO & REFERENCES ---------------- */}
              <div className="form-section-block">
                <div className="section-title-wrap">
                  <span className="section-step-num">04</span>
                  <h4 className="section-block-title">PORTFOLIO &amp; FACTORY IMAGES</h4>
                </div>

                <div className="fields-grid-two">
                  <div className="form-group">
                    <label className="form-label">Upload Product / Factory Images</label>
                    <div className="file-drop-area">
                      <input 
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => handleFileUpload(e, setProductImagesFile)}
                        id="product-images-input"
                        style={{ display: 'none' }}
                      />
                      <label htmlFor="product-images-input" className="file-drop-label">
                        <UploadCloud size={20} />
                        <span>{productImagesFile ? productImagesFile.name : 'Choose Images or PDF'}</span>
                        <span className="file-subtext">Max 12MB</span>
                      </label>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Upload Portfolio / Company Profile</label>
                    <div className="file-drop-area">
                      <input 
                        type="file"
                        accept=".pdf,.doc,.docx,image/*"
                        onChange={(e) => handleFileUpload(e, setPortfolioFile)}
                        id="portfolio-input"
                        style={{ display: 'none' }}
                      />
                      <label htmlFor="portfolio-input" className="file-drop-label">
                        <FileText size={20} />
                        <span>{portfolioFile ? portfolioFile.name : 'Choose Company Profile'}</span>
                        <span className="file-subtext">PDF or Presentation (Max 12MB)</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* ---------------- 5. FINAL MESSAGE ---------------- */}
              <div className="form-section-block">
                <div className="section-title-wrap">
                  <span className="section-step-num">05</span>
                  <h4 className="section-block-title">FINAL MESSAGE</h4>
                </div>

                <div className="form-group full-row">
                  <label className="form-label">Why would you like to work with GTT?</label>
                  <textarea 
                    rows={4}
                    name="whyGtt"
                    value={formData.whyGtt}
                    onChange={handleInputChange}
                    placeholder="Tell us what makes your production unit stand out, your communication approach, or specific garment lines where you excel..."
                    className="form-textarea"
                  />
                </div>
              </div>

              {/* Form Submission Action */}
              <div style={{ marginTop: 36, display: 'flex', flexDirection: 'column', gap: 14 }}>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary"
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    padding: '18px 28px',
                    fontSize: 13,
                    fontWeight: 800,
                    letterSpacing: '.1em',
                    textTransform: 'uppercase',
                    background: 'var(--white, #fff)',
                    color: 'var(--black, #000)',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw size={15} className="spin" /> SUBMITTING APPLICATION...
                    </>
                  ) : (
                    <>
                      SUBMIT SUPPLIER APPLICATION <Send size={14} />
                    </>
                  )}
                </button>

                <p style={{ fontSize: 11.5, color: 'var(--gray, #777)', textAlign: 'center', margin: 0 }}>
                  By submitting, you agree that GTT may review your provided details and store your contact information for potential procurement inquiries.
                </p>
              </div>

            </form>
          )}

        </div>
      </section>

      {/* ============================================================== */}
      {/* 6. FINAL BOTTOM CTA */}
      {/* ============================================================== */}
      <section className="supplier-bottom-cta">
        <div className="wrap" style={{ textAlign: 'center', maxWidth: 760 }}>
          <p className="eyebrow" style={{ color: 'var(--gray, #888)' }}>PARTNER WITH US</p>
          <h2 style={{ fontSize: 'clamp(32px, 4.8vw, 62px)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-.03em', marginTop: 12, lineHeight: 1.05 }}>
            HAVE SOMETHING WORTH SUPPLYING?
          </h2>
          <p style={{ fontSize: 'clamp(18px, 2.4vw, 24px)', color: '#d0d0d0', fontStyle: 'italic', margin: '14px 0 32px' }}>
            “Tell us what you make.”
          </p>

          <button
            type="button"
            onClick={scrollToForm}
            className="btn btn-primary"
            style={{ background: 'var(--white, #fff)', color: 'var(--black, #000)', padding: '16px 36px', fontSize: 13, fontWeight: 800, letterSpacing: '.08em', textTransform: 'uppercase' }}
          >
            BECOME A SUPPLIER <ArrowDown size={14} />
          </button>
        </div>
      </section>

      {/* ============================================================== */}
      {/* STYLES */}
      {/* ============================================================== */}
      <style>{`
        .supplier-hero-section {
          padding: 80px 0 70px;
          background: linear-gradient(180deg, #111111 0%, #090909 100%);
          border-bottom: 1px solid var(--line-dark, rgba(255,255,255,0.1));
        }

        .supplier-hero-inner {
          max-width: 860px;
        }

        .supplier-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.14);
          border-radius: 2px;
          font-size: 10.5px;
          font-weight: 800;
          letter-spacing: .14em;
          text-transform: uppercase;
          color: var(--gray, #aaa);
          margin-bottom: 24px;
        }

        .supplier-hero-title {
          font-size: clamp(38px, 5.8vw, 76px);
          font-weight: 900;
          letter-spacing: -.03em;
          line-height: 1.02;
          text-transform: uppercase;
          color: var(--white, #fff);
          margin: 0 0 18px 0;
        }

        .supplier-hero-sub {
          font-size: clamp(17px, 2.2vw, 22px);
          font-weight: 400;
          line-height: 1.55;
          color: #cccccc;
          max-width: 780px;
          margin: 0 0 36px 0;
          font-style: italic;
        }

        .supplier-hero-ctas {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }

        /* WHO SHOULD APPLY GRID */
        .supplier-cards-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
        }

        .supplier-type-card {
          background: #111111;
          border: 1px solid var(--line-dark, rgba(255,255,255,0.1));
          padding: 34px 30px;
          border-radius: 2px;
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .card-num {
          position: absolute;
          top: 24px;
          right: 28px;
          font-size: 13px;
          font-weight: 800;
          color: rgba(255,255,255,0.2);
          letter-spacing: .1em;
        }

        .card-icon {
          color: var(--white, #fff);
          margin-bottom: 6px;
        }

        .supplier-type-card h3 {
          font-size: 16px;
          font-weight: 800;
          letter-spacing: .08em;
          text-transform: uppercase;
          margin: 0;
          color: var(--white, #fff);
        }

        .supplier-type-card p {
          font-size: 14px;
          line-height: 1.6;
          color: var(--gray, #aaa);
          margin: 0;
        }

        .card-tags {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-top: 10px;
        }

        .card-tags span {
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: .06em;
          text-transform: uppercase;
          padding: 4px 10px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 2px;
          color: #bbb;
        }

        .full-span-card {
          grid-column: span 2;
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 24px;
        }

        /* WHAT TO TELL US & WHAT WE LOOK FOR */
        .what-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: start;
        }

        .tell-us-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-top: 26px;
        }

        .tell-item {
          display: flex;
          gap: 14px;
          align-items: flex-start;
          font-size: 14px;
          line-height: 1.55;
          color: #ccc;
        }

        .tell-check {
          color: var(--white, #fff);
          flex-shrink: 0;
          margin-top: 4px;
        }

        .pillars-wrap {
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin-top: 26px;
        }

        .pillar-row {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          padding: 16px 20px;
          border-radius: 2px;
        }

        .pillar-name {
          font-size: 13px;
          font-weight: 800;
          letter-spacing: .1em;
          text-transform: uppercase;
          color: var(--white, #fff);
          margin-bottom: 4px;
        }

        .pillar-desc {
          font-size: 13px;
          color: var(--gray, #999);
          line-height: 1.5;
        }

        /* PROCESS 3-STEP */
        .process-three-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        .process-step-box {
          background: #111111;
          border: 1px solid var(--line-dark, rgba(255,255,255,0.1));
          padding: 34px 26px;
          border-radius: 2px;
        }

        .step-badge {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: .16em;
          text-transform: uppercase;
          color: var(--gray, #888);
          margin-bottom: 14px;
        }

        .process-step-box h3 {
          font-size: 16px;
          font-weight: 800;
          letter-spacing: .06em;
          text-transform: uppercase;
          color: var(--white, #fff);
          margin: 0 0 12px 0;
        }

        .process-step-box p {
          font-size: 13.5px;
          line-height: 1.6;
          color: var(--gray, #aaa);
          margin: 0;
        }

        /* APPLICATION FORM */
        .supplier-form-card {
          background: #141414;
          border: 1px solid var(--line-dark, rgba(255,255,255,0.12));
          padding: 44px 40px;
          border-radius: 3px;
        }

        .form-section-block {
          border-bottom: 1px solid rgba(255,255,255,0.08);
          padding-bottom: 34px;
          margin-bottom: 34px;
        }

        .form-section-block:last-of-type {
          border-bottom: none;
          padding-bottom: 0;
          margin-bottom: 0;
        }

        .section-title-wrap {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 22px;
        }

        .section-step-num {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: .1em;
          padding: 3px 8px;
          background: rgba(255,255,255,0.08);
          border-radius: 2px;
          color: var(--white, #fff);
        }

        .section-block-title {
          font-size: 14px;
          font-weight: 800;
          letter-spacing: .1em;
          text-transform: uppercase;
          color: var(--white, #fff);
          margin: 0;
        }

        .fields-grid-two {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .full-row {
          grid-column: span 2;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: .08em;
          text-transform: uppercase;
          color: var(--gray, #aaa);
        }

        .req {
          color: #ff5555;
          margin-left: 2px;
        }

        .form-input, .form-select, .form-textarea {
          width: 100%;
          background: #0d0d0d;
          border: 1px solid rgba(255,255,255,0.16);
          border-radius: 2px;
          padding: 13px 16px;
          color: var(--white, #fff);
          font-size: 13.5px;
          font-family: inherit;
          outline: none;
          transition: border-color .2s ease;
        }

        .form-input:focus, .form-select:focus, .form-textarea:focus {
          border-color: var(--white, #fff);
        }

        .has-error .form-input, .has-error .form-select, .has-error .form-textarea {
          border-color: #ff5555;
        }

        .err-msg {
          font-size: 11px;
          color: #ff5555;
          margin-top: 2px;
        }

        .file-drop-area {
          border: 1px dashed rgba(255,255,255,0.22);
          background: #0d0d0d;
          border-radius: 2px;
          padding: 20px;
          text-align: center;
          transition: all .2s ease;
        }

        .file-drop-area:hover {
          border-color: rgba(255,255,255,0.5);
        }

        .file-drop-label {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          color: var(--gray, #aaa);
          font-size: 12.5px;
        }

        .file-subtext {
          font-size: 10.5px;
          color: #777;
        }

        .form-error-banner {
          background: rgba(255,85,85,0.1);
          border: 1px solid #ff5555;
          padding: 14px 18px;
          border-radius: 2px;
          color: #ff9999;
          font-size: 13px;
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 24px;
        }

        .supplier-success-box {
          background: #141414;
          border: 1px solid rgba(0,255,136,0.3);
          padding: 60px 40px;
          border-radius: 3px;
          text-align: center;
        }

        .success-icon-wrap {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: rgba(0,255,136,0.08);
          border: 1px solid rgba(0,255,136,0.3);
          margin-bottom: 10px;
        }

        .supplier-bottom-cta {
          padding: 100px 0;
          border-top: 1px solid var(--line-dark, rgba(255,255,255,0.1));
          background: linear-gradient(180deg, #090909 0%, #000000 100%);
        }

        @media (max-width: 900px) {
          .supplier-cards-grid {
            grid-template-columns: 1fr;
          }
          .full-span-card {
            grid-column: span 1;
            flex-direction: column;
            align-items: flex-start;
          }
          .what-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          .process-three-grid {
            grid-template-columns: 1fr;
          }
          .fields-grid-two {
            grid-template-columns: 1fr;
          }
          .full-row {
            grid-column: span 1;
          }
          .supplier-form-card {
            padding: 30px 20px;
          }
        }
      `}</style>
    </div>
  );
}
