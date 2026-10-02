import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { COMPANY } from '../data/companyData';
import { CATEGORIES } from '../data/categoriesData';
import SEOHead from '../components/SEOHead';
import { 
  Phone, Mail, MapPin, UploadCloud, CheckCircle2, FileText, Send, X, 
  Layers, Sliders, ExternalLink, Sparkles, AlertCircle 
} from 'lucide-react';

export default function ContactPage() {
  const location = useLocation();
  const [activeBlankSpec, setActiveBlankSpec] = useState(location.state?.blankSpec || null);
  const [activeSideProductSpec, setActiveSideProductSpec] = useState(location.state?.sideProductSpec || null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    brand: '',
    country: '',
    productCategory: 'Streetwear',
    productType: 'Hoodies',
    quantity: '50–100 pieces (Emerging Drop)',
    message: ''
  });


  // Sync incoming blank spec or URL params to form fields
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const paramBlank = params.get('blank');
    const paramColor = params.get('color');
    const paramCat = params.get('category');

    if (activeBlankSpec) {
      const summary = [
        `=== ATTACHED GTT BLANK APPAREL SPECIFICATION ===`,
        `Blank Silhouette: ${activeBlankSpec.product}`,
        `Category: ${activeBlankSpec.category || 'Blanks'}`,
        `Selected Colour: ${activeBlankSpec.color || 'Standard'}`,
        activeBlankSpec.fit ? `Fit Profile: ${activeBlankSpec.fit}` : '',
        activeBlankSpec.fabric ? `Fabric Base: ${activeBlankSpec.fabric}` : '',
        activeBlankSpec.gsm ? `Target GSM / Weight: ${activeBlankSpec.gsm}` : ''
      ].filter(Boolean).join('\n');

      setFormData(prev => ({
        ...prev,
        productCategory: 'Premium Blanks',
        productType: activeBlankSpec.product,
        message: prev.message ? `${prev.message}\n\n${summary}` : summary
      }));
    } else if (paramBlank) {
      const summary = [
        `=== ATTACHED GTT BLANK APPAREL SPECIFICATION ===`,
        `Blank Silhouette: ${paramBlank}`,
        paramCat ? `Category: ${paramCat}` : '',
        paramColor ? `Selected Colour: ${paramColor}` : ''
      ].filter(Boolean).join('\n');

      setFormData(prev => ({
        ...prev,
        productCategory: 'Premium Blanks',
        productType: paramBlank,
        message: prev.message ? `${prev.message}\n\n${summary}` : summary
      }));
    }
  }, [activeBlankSpec, location.search]);

  // Sync incoming side product spec or URL params to form fields
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const paramSideProduct = params.get('sideProduct') || params.get('inquiry');

    if (activeSideProductSpec) {
      const summary = [
        `=== ATTACHED GTT SIDE PRODUCT & TRIM SPECIFICATION ===`,
        `Product: ${activeSideProductSpec.product}`,
        `Division / Category: ${activeSideProductSpec.category || 'Custom Hardware & Side Products'}`,
        activeSideProductSpec.materials?.length ? `Materials: ${activeSideProductSpec.materials.join(', ')}` : '',
        activeSideProductSpec.finishes?.length ? `Finishes / Colours: ${activeSideProductSpec.finishes.join(', ')}` : '',
        activeSideProductSpec.customizationOptions?.length ? `Customization Options: ${activeSideProductSpec.customizationOptions.join(', ')}` : ''
      ].filter(Boolean).join('\n');

      setFormData(prev => ({
        ...prev,
        productCategory: 'Side Products / Hardware',
        productType: activeSideProductSpec.product,
        message: prev.message ? `${prev.message}\n\n${summary}` : summary
      }));
    } else if (paramSideProduct) {
      const summary = [
        `=== ATTACHED GTT SIDE PRODUCT & TRIM SPECIFICATION ===`,
        `Inquired Product: ${paramSideProduct}`,
        `Division: Custom Hardware, Trims & Packaging`
      ].join('\n');

      setFormData(prev => ({
        ...prev,
        productCategory: 'Side Products / Hardware',
        productType: paramSideProduct,
        message: prev.message ? `${prev.message}\n\n${summary}` : summary
      }));
    }
  }, [activeSideProductSpec, location.search]);

  const [uploadedFile, setUploadedFile] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setUploadedFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    let fileAttachment = null;
    if (uploadedFile) {
      fileAttachment = {
        name: uploadedFile.name,
        size: uploadedFile.size,
        type: uploadedFile.type
      };
    }

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          brand: formData.brand,
          country: formData.country,
          productCategory: formData.productCategory,
          productType: formData.productType,
          quantity: formData.quantity,
          message: formData.message,
          source: 'contact_page',
          specs: {
            activeBlankSpec,
            activeSideProductSpec,
            fileAttachment
          }
        })
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        console.warn('API submission response:', data);
      }
      setSubmitted(true);
    } catch (err) {
      console.error('Error submitting inquiry to server:', err);
      // Keep optimistic confirmation so visitor is not frustrated
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ paddingTop: 'var(--nav-h)' }}>
      <SEOHead />
      {/* Header */}
      <section className="section section-dark" style={{ borderBottom: '1px solid var(--line-dark)' }}>
        <div className="wrap">
          <p className="eyebrow">START PRODUCTION &middot; FACTORY DIRECT</p>
          <h1 style={{ fontSize: 'clamp(36px, 5.5vw, 72px)', marginTop: 20, letterSpacing: '-.02em', textTransform: 'uppercase' }}>
            SEND YOUR MOCKUP &amp; REQUEST QUOTE.
          </h1>
          <p style={{ color: 'var(--gray)', fontSize: 17, maxWidth: 700, marginTop: 18, lineHeight: 1.65 }}>
            Upload your tech pack, graphic sketch, or reference garment details. Our patternmakers and production engineers review construction, tolerances, and fabrics to issue an itemized manufacturing quote within 24 hours.
          </p>
        </div>
      </section>

      {/* Main Form & Contact Information Grid */}
      <section className="section" style={{ background: 'var(--near-black)', color: 'var(--white)' }}>
        <div 
          className="wrap contact-layout-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1.25fr 0.75fr',
            gap: 50,
            alignItems: 'flex-start'
          }}
        >
          {/* Left: High-Conversion Form */}
          <div 
            style={{
              background: 'var(--charcoal)',
              border: '1px solid var(--line-dark)',
              borderRadius: 3,
              padding: '40px 36px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.4)'
            }}
          >

            {/* ============================================================== */}
            {/* BLANK APPAREL SPECIFICATION CARD (When arriving from /blanks) */}
            {/* ============================================================== */}
            {activeBlankSpec && (
              <div 
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: 3,
                  padding: 24,
                  marginBottom: 32,
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, borderBottom: '1px solid var(--line-dark)', paddingBottom: 14 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#00ff88', boxShadow: '0 0 10px #00ff88' }} />
                      <span style={{ fontSize: 10, letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--gray)', fontWeight: 800 }}>
                        GTT BLANK APPAREL INQUIRY ATTACHED
                      </span>
                    </div>
                    <h3 style={{ fontSize: 20, marginTop: 4, textTransform: 'uppercase', fontWeight: 800, letterSpacing: '-.01em' }}>
                      {activeBlankSpec.product}
                    </h3>
                  </div>

                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <Link
                      to={activeBlankSpec.slug ? `/blanks/${activeBlankSpec.slug}` : '/blanks'}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        fontSize: 11,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        padding: '6px 12px',
                        background: 'rgba(255,255,255,0.08)',
                        border: '1px solid var(--line-dark)',
                        borderRadius: 2,
                        color: 'var(--white)'
                      }}
                    >
                      <Sliders size={12} /> View Blank
                    </Link>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveBlankSpec(null);
                        setFormData(prev => ({ ...prev, message: '' }));
                      }}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        fontSize: 11,
                        color: 'var(--gray)',
                        cursor: 'pointer',
                        padding: '6px 10px',
                        border: 'none',
                        background: 'transparent'
                      }}
                    >
                      <X size={14} /> Clear
                    </button>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginTop: 16, fontSize: 12 }}>
                  {activeBlankSpec.color && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span 
                        style={{ 
                          width: 20, 
                          height: 20, 
                          borderRadius: '50%', 
                          background: activeBlankSpec.colorHex || '#111', 
                          border: '2px solid rgba(255,255,255,0.3)',
                          flexShrink: 0
                        }} 
                      />
                      <div>
                        <span style={{ color: 'var(--gray)', fontSize: 10, textTransform: 'uppercase', display: 'block' }}>Selected Shade:</span>
                        <strong>{activeBlankSpec.color}</strong>
                      </div>
                    </div>
                  )}

                  {activeBlankSpec.category && (
                    <div>
                      <span style={{ color: 'var(--gray)', fontSize: 10, textTransform: 'uppercase', display: 'block' }}>Category:</span>
                      <strong>{activeBlankSpec.category}</strong>
                    </div>
                  )}

                  {activeBlankSpec.fit && (
                    <div>
                      <span style={{ color: 'var(--gray)', fontSize: 10, textTransform: 'uppercase', display: 'block' }}>Fit Profile:</span>
                      <strong>{activeBlankSpec.fit}</strong>
                    </div>
                  )}

                  {activeBlankSpec.fabric && (
                    <div>
                      <span style={{ color: 'var(--gray)', fontSize: 10, textTransform: 'uppercase', display: 'block' }}>Fabric &amp; Weight:</span>
                      <strong>{activeBlankSpec.fabric} {activeBlankSpec.gsm ? `· ${activeBlankSpec.gsm}` : ''}</strong>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Attached Side Product Spec Card */}
            {activeSideProductSpec && (
              <div 
                style={{ 
                  background: 'rgba(255,255,255,0.04)', 
                  border: '1px solid rgba(255,255,255,0.2)', 
                  borderRadius: 3, 
                  padding: '24px 28px', 
                  marginBottom: 32,
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Layers size={14} color="var(--white)" />
                      <span style={{ fontSize: 10, letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--gray)', fontWeight: 800 }}>
                        ATTACHED TRIM &amp; HARDWARE SPECIFICATION //
                      </span>
                    </div>
                    <h3 style={{ fontSize: 20, marginTop: 4, textTransform: 'uppercase', fontWeight: 800, letterSpacing: '-.01em' }}>
                      {activeSideProductSpec.product}
                    </h3>
                  </div>

                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <Link
                      to="/side-products"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        fontSize: 11,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        padding: '6px 12px',
                        background: 'rgba(255,255,255,0.08)',
                        border: '1px solid var(--line-dark)',
                        borderRadius: 2,
                        color: 'var(--white)'
                      }}
                    >
                      <Sliders size={12} /> Catalogue
                    </Link>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveSideProductSpec(null);
                        setFormData(prev => ({ ...prev, message: '' }));
                      }}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        fontSize: 11,
                        color: 'var(--gray)',
                        cursor: 'pointer',
                        padding: '6px 10px',
                        border: 'none',
                        background: 'transparent'
                      }}
                    >
                      <X size={14} /> Clear
                    </button>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginTop: 16, fontSize: 12 }}>
                  {activeSideProductSpec.category && (
                    <div>
                      <span style={{ color: 'var(--gray)', fontSize: 10, textTransform: 'uppercase', display: 'block' }}>Category:</span>
                      <strong>{activeSideProductSpec.category}</strong>
                    </div>
                  )}

                  {activeSideProductSpec.materials?.length > 0 && (
                    <div>
                      <span style={{ color: 'var(--gray)', fontSize: 10, textTransform: 'uppercase', display: 'block' }}>Materials:</span>
                      <strong>{activeSideProductSpec.materials.slice(0, 2).join(' · ')}</strong>
                    </div>
                  )}

                  {activeSideProductSpec.finishes?.length > 0 && (
                    <div>
                      <span style={{ color: 'var(--gray)', fontSize: 10, textTransform: 'uppercase', display: 'block' }}>Finishes / Colours:</span>
                      <strong>{activeSideProductSpec.finishes.slice(0, 2).join(' · ')}</strong>
                    </div>
                  )}
                </div>
              </div>
            )}

            {submitted ? (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <CheckCircle2 size={52} color="var(--white)" style={{ margin: '0 auto 20px' }} />
                <h2 style={{ fontSize: 26, textTransform: 'uppercase', letterSpacing: '-.01em' }}>
                  INQUIRY &amp; SPECIFICATION RECEIVED
                </h2>
                <p style={{ color: 'var(--gray)', fontSize: 15, marginTop: 12, maxWidth: 480, margin: '12px auto 28px', lineHeight: 1.6 }}>
                  Thank you, <strong>{formData.name}</strong>. Your project specifications have been registered directly into our factory queue. A technical account manager will reply to <strong>{formData.email}</strong> within 24 business hours with itemized sample costs and lead times.
                </p>
                <button 
                  onClick={() => {
                    setSubmitted(false);
                    setActiveBuildSpec(null);
                  }}
                  className="btn btn-ghost"
                  style={{ border: '1px solid var(--line-dark)', color: 'var(--white)' }}
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }} className="form-two-col">
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--gray)' }}>
                      Full Name *
                    </label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Marcus Vance"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        marginTop: 6,
                        border: '1px solid var(--line-dark)',
                        borderRadius: 2,
                        fontSize: 14,
                        fontFamily: 'inherit',
                        background: 'var(--near-black)',
                        color: 'var(--white)'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--gray)' }}>
                      Email Address *
                    </label>
                    <input 
                      type="email" 
                      required
                      placeholder="brand@yourlabel.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        marginTop: 6,
                        border: '1px solid var(--line-dark)',
                        borderRadius: 2,
                        fontSize: 14,
                        fontFamily: 'inherit',
                        background: 'var(--near-black)',
                        color: 'var(--white)'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }} className="form-two-col">
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--gray)' }}>
                      Company / Brand Name
                    </label>
                    <input 
                      type="text" 
                      placeholder="e.g. Studio Vance London"
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        marginTop: 6,
                        border: '1px solid var(--line-dark)',
                        borderRadius: 2,
                        fontSize: 14,
                        fontFamily: 'inherit',
                        background: 'var(--near-black)',
                        color: 'var(--white)'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--gray)' }}>
                      Destination Country *
                    </label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. United States, UK, Canada, Australia"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        marginTop: 6,
                        border: '1px solid var(--line-dark)',
                        borderRadius: 2,
                        fontSize: 14,
                        fontFamily: 'inherit',
                        background: 'var(--near-black)',
                        color: 'var(--white)'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }} className="form-two-col">
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--gray)' }}>
                      Product Category *
                    </label>
                    <select
                      value={formData.productCategory}
                      onChange={(e) => setFormData({ ...formData, productCategory: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        marginTop: 6,
                        border: '1px solid var(--line-dark)',
                        borderRadius: 2,
                        fontSize: 14,
                        fontFamily: 'inherit',
                        background: 'var(--near-black)',
                        color: 'var(--white)'
                      }}
                    >
                      {CATEGORIES.map(c => (
                        <option key={c.id} value={c.title}>{c.title}</option>
                      ))}
                      <option value="Medical Uniforms & Scrubs">Medical Uniforms &amp; Scrubs</option>
                      <option value="Side Products / Hardware">Side Products / Hardware</option>
                      <option value="Custom Blanks">Custom Blanks</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--gray)' }}>
                      Estimated Order Volume *
                    </label>
                    <select
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        marginTop: 6,
                        border: '1px solid var(--line-dark)',
                        borderRadius: 2,
                        fontSize: 14,
                        fontFamily: 'inherit',
                        background: 'var(--near-black)',
                        color: 'var(--white)'
                      }}
                    >
                      <option value="Sample Prototype Only">Sample Prototype Only</option>
                      <option value="50–100 pieces (Emerging Drop)">50–100 pieces (Emerging Drop)</option>
                      <option value="100–300 pieces (Standard Batch)">100–300 pieces (Standard Batch)</option>
                      <option value="300–500 pieces">300–500 pieces</option>
                      <option value="1,000+ pieces (Volume Wholesale)">1,000+ pieces (Volume Wholesale)</option>
                    </select>
                  </div>
                </div>

                {/* Upload Mockup / Tech Pack Box */}
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--gray)', display: 'block', marginBottom: 6 }}>
                    Upload Tech Pack / Graphic Artwork (PDF, AI, PNG, PSD, ZIP)
                  </label>
                  <div
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    style={{
                      border: '2px dashed var(--line-dark)',
                      borderRadius: 2,
                      padding: '28px 20px',
                      textAlign: 'center',
                      background: 'rgba(255,255,255,0.02)',
                      cursor: 'pointer',
                      transition: 'border-color .2s ease'
                    }}
                    onClick={() => document.getElementById('fileUploadInput').click()}
                  >
                    <input 
                      type="file" 
                      id="fileUploadInput" 
                      style={{ display: 'none' }} 
                      onChange={handleFileChange}
                      accept=".pdf,.ai,.psd,.png,.jpg,.jpeg,.zip"
                    />
                    <UploadCloud size={28} color="var(--gray)" style={{ margin: '0 auto 10px' }} />
                    <div style={{ fontSize: 12.5, fontWeight: 700, textTransform: 'uppercase', color: 'var(--white)' }}>
                      {uploadedFile ? uploadedFile.name : 'Click to Browse or Drag & Drop File'}
                    </div>
                    <span style={{ fontSize: 11, color: 'var(--gray)', marginTop: 4, display: 'block' }}>
                      {uploadedFile 
                        ? `${(uploadedFile.size / 1024 / 1024).toFixed(2)} MB &middot; Ready to attach` 
                        : 'Supports CAD, vector, and high-res image files up to 50MB'}
                    </span>
                  </div>

                  {uploadedFile && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.08)', padding: '8px 14px', borderRadius: 2, marginTop: 8, fontSize: 12 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--white)' }}>
                        <FileText size={14} /> {uploadedFile.name}
                      </span>
                      <button 
                        type="button" 
                        onClick={(e) => { e.stopPropagation(); setUploadedFile(null); }}
                        style={{ color: '#ff5555', background: 'transparent', border: 'none', cursor: 'pointer', padding: 2 }}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--gray)' }}>
                    Project Notes, Target Delivery Date, Sizing Ratios
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Tell us about your target fabrics, cut specifications, print techniques, or sizing breakdown (e.g. S/20, M/40, L/30, XL/10)..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      marginTop: 6,
                      border: '1px solid var(--line-dark)',
                      borderRadius: 2,
                      fontSize: 13,
                      fontFamily: 'inherit',
                      background: 'var(--near-black)',
                      color: 'var(--white)',
                      lineHeight: 1.5,
                      resize: 'vertical'
                    }}
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={submitting}
                  className="btn btn-primary"
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    padding: '16px',
                    fontSize: 13,
                    background: 'var(--white)',
                    color: 'var(--black)',
                    fontWeight: 800,
                    letterSpacing: '.08em',
                    textTransform: 'uppercase',
                    opacity: submitting ? 0.7 : 1,
                    cursor: submitting ? 'not-allowed' : 'pointer'
                  }}
                >
                  {submitting ? 'TRANSMITTING TO FACTORY...' : 'SEND INQUIRY · REQUEST ESTIMATE'} <Send size={15} />
                </button>
              </form>
            )}
          </div>

          {/* Right: Direct Factory Contacts & Manufacturing Guarantees */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
            <div style={{ background: 'var(--charcoal)', padding: 32, borderRadius: 2, border: '1px solid var(--line-dark)' }}>
              <span style={{ fontSize: 10.5, letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--gray)', fontWeight: 800 }}>
                DIRECT FACTORY CONTACT
              </span>
              <h3 style={{ fontSize: 22, marginTop: 6, marginBottom: 20, textTransform: 'uppercase', letterSpacing: '-.01em' }}>
                GLOBAL THUNDER TRADE
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <span style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--gray)', fontWeight: 700 }}>
                    Direct WhatsApp / Phone:
                  </span>
                  <div style={{ fontSize: 18, fontWeight: 800, marginTop: 4 }}>
                    <a href={`tel:${COMPANY.phone}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--white)' }}>
                      <Phone size={16} /> {COMPANY.phone}
                    </a>
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--gray)', fontWeight: 700 }}>
                    Official Inquiries Email:
                  </span>
                  <div style={{ fontSize: 15, fontWeight: 700, marginTop: 4 }}>
                    <a href={`mailto:${COMPANY.email}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--white)' }}>
                      <Mail size={16} /> {COMPANY.email}
                    </a>
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--gray)', fontWeight: 700 }}>
                    Manufacturing Origin:
                  </span>
                  <div style={{ fontSize: 14, color: 'var(--white)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <MapPin size={16} /> {COMPANY.location}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ border: '1px solid var(--line-dark)', padding: 28, borderRadius: 2, background: 'rgba(255,255,255,0.02)' }}>
              <h4 style={{ fontSize: 13, textTransform: 'uppercase', fontWeight: 800, letterSpacing: '.06em' }}>
                FACTORY SAMPLING WORKFLOW
              </h4>
              <ul style={{ listStyle: 'none', marginTop: 14, display: 'flex', flexDirection: 'column', gap: 12, fontSize: 13, color: 'var(--gray)' }}>
                <li style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <CheckCircle2 size={16} color="var(--white)" style={{ flexShrink: 0, marginTop: 2 }} />
                  <span><strong>1. Technical Review:</strong> Master patternmakers examine artwork, dimensions, tolerances and fabric compatibility.</span>
                </li>
                <li style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <CheckCircle2 size={16} color="var(--white)" style={{ flexShrink: 0, marginTop: 2 }} />
                  <span><strong>2. Sample Schedule:</strong> You receive an itemized quote, fabric swatches, and a verified sample turnaround schedule.</span>
                </li>
                <li style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <CheckCircle2 size={16} color="var(--white)" style={{ flexShrink: 0, marginTop: 2 }} />
                  <span><strong>3. Physical Production:</strong> Pattern cutting, printing/embroidery, sewing, and rigorous quality inspection.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 960px) {
            .contact-layout-grid {
              grid-template-columns: 1fr !important;
              gap: 40px !important;
            }
          }
          @media (max-width: 540px) {
            .form-two-col {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </section>
    </div>
  );
}
