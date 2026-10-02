import React, { useState } from 'react';
import { 
  Sparkles, Send, Upload, FileText, CheckCircle2, AlertCircle, 
  ArrowRight, RefreshCw, X, Sliders, ShieldCheck, ChevronRight
} from 'lucide-react';
import { parseProductPrompt } from '../utils/productPromptParser';

export default function ProductCreationWorkflows({
  currentConfiguration = null,
  onApplyPromptToConfigurator = null,
  initialPrompt = '',
  defaultTab = 'ai' // 'ai' | 'gtt'
}) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  // ==========================================
  // OPTION A: AI GENERATE STATE
  // ==========================================
  const [aiPrompt, setAiPrompt] = useState(initialPrompt || '');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [aiError, setAiError] = useState(null);

  const handleAiGenerate = async (promptToUse = aiPrompt) => {
    if (!promptToUse || !promptToUse.trim()) return;
    setAiLoading(true);
    setAiError(null);
    setAiResult(null);

    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptToUse.trim() })
      });

      const data = await response.json();
      if (data.configured && data.success && data.imageUrl) {
        setAiResult({
          imageUrl: data.imageUrl,
          prompt: data.prompt
        });
      } else {
        // Backend returned honest unconfigured or error status
        setAiError({
          configured: data.configured || false,
          message: data.message || "AI generation backend is not yet connected with an API key."
        });
      }
    } catch (err) {
      console.error('AI Generation Request Error:', err);
      setAiError({
        configured: false,
        message: "Could not reach the AI generation service. Please verify your connection or contact GTT."
      });
    } finally {
      setAiLoading(false);
    }
  };

  const handleApplyAiPromptToStudio = () => {
    const text = aiPrompt.trim();
    if (!text) return;
    if (onApplyPromptToConfigurator) {
      const parsed = parseProductPrompt(text);
      if (parsed) {
        onApplyPromptToConfigurator(parsed);
      }
    }
  };

  // ==========================================
  // OPTION B: SEND PROMPT TO GTT STATE
  // ==========================================
  const [gttPrompt, setGttPrompt] = useState(initialPrompt || '');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [country, setCountry] = useState('');
  const [phone, setPhone] = useState('');
  const [referenceFile, setReferenceFile] = useState(null);

  const [isSubmittingGtt, setIsSubmittingGtt] = useState(false);
  const [gttSuccess, setGttSuccess] = useState(null);
  const [gttError, setGttError] = useState(null);

  // File Upload Handler
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 20 * 1024 * 1024) {
      alert('File size exceeds 20MB limit.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setReferenceFile({
        name: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        type: file.type,
        dataUrl: reader.result
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSendToGtt = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !gttPrompt.trim()) {
      setGttError('Please complete your name, email, and product idea prompt.');
      return;
    }

    setIsSubmittingGtt(true);
    setGttError(null);

    try {
      const response = await fetch('/api/send-product-idea', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          company: company.trim(),
          country: country.trim(),
          phone: phone.trim(),
          prompt: gttPrompt.trim(),
          configuration: currentConfiguration,
          referenceFile: referenceFile ? { name: referenceFile.name, dataUrl: referenceFile.dataUrl } : null
        })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setGttSuccess({
          customerEmail: email.trim(),
          submissionId: data.submissionId,
          destinationEmail: data.destinationEmail || 'globalthundertrade@gmail.com'
        });
      } else {
        setGttError(data.message || "We couldn't send your request right now. Please try again or contact GTT directly at globalthundertrade@gmail.com.");
      }
    } catch (err) {
      console.error('Send to GTT Network Error:', err);
      setGttError("We couldn't send your request right now. Please try again or contact GTT directly at globalthundertrade@gmail.com.");
    } finally {
      setIsSubmittingGtt(false);
    }
  };

  return (
    <div style={{ background: 'var(--near-black, #0f0f0f)', border: '1px solid var(--line-dark, rgba(255,255,255,0.1))', borderRadius: 3, padding: '32px 28px' }}>
      
      {/* Workflow Navigation Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--line-dark, rgba(255,255,255,0.1))', marginBottom: 28 }}>
        <button
          onClick={() => setActiveTab('ai')}
          style={{
            flex: 1,
            padding: '16px 20px',
            background: activeTab === 'ai' ? 'rgba(255,255,255,0.05)' : 'transparent',
            border: 'none',
            borderBottom: activeTab === 'ai' ? '2px solid var(--white, #ffffff)' : '2px solid transparent',
            color: activeTab === 'ai' ? 'var(--white, #ffffff)' : 'var(--gray, #888888)',
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: '.1em',
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            cursor: 'pointer',
            transition: 'all .25s ease'
          }}
        >
          <Sparkles size={14} /> OPTION A &middot; GENERATE WITH AI
        </button>

        <button
          onClick={() => setActiveTab('gtt')}
          style={{
            flex: 1,
            padding: '16px 20px',
            background: activeTab === 'gtt' ? 'rgba(255,255,255,0.05)' : 'transparent',
            border: 'none',
            borderBottom: activeTab === 'gtt' ? '2px solid var(--white, #ffffff)' : '2px solid transparent',
            color: activeTab === 'gtt' ? 'var(--white, #ffffff)' : 'var(--gray, #888888)',
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: '.1em',
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            cursor: 'pointer',
            transition: 'all .25s ease'
          }}
        >
          <Send size={14} /> OPTION B &middot; SEND PROMPT TO GTT
        </button>
      </div>

      {/* =========================================================
          TAB A: GENERATE YOUR PRODUCT WITH AI
          ========================================================= */}
      {activeTab === 'ai' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 10, letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--gray, #888)', fontWeight: 800 }}>
                OPTION A &middot; VISUAL PROTOTYPING
              </span>
            </div>
            <h3 style={{ fontSize: 'clamp(20px, 2.4vw, 26px)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.01em', color: 'var(--white, #fff)' }}>
              GENERATE YOUR PRODUCT WITH AI
            </h3>
            <p style={{ color: 'var(--gray, #aaa)', fontSize: 14, marginTop: 8, lineHeight: 1.6, maxWidth: 680 }}>
              Describe your product and let AI turn your idea into a visual concept.
            </p>
          </div>

          {/* Prompt Input Box */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label style={{ fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--gray, #888)', fontWeight: 800 }}>
              DESCRIBE YOUR PRODUCT
            </label>
            <textarea
              rows={4}
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="Example: Create an oversized 400 GSM black hoodie with a large vintage graphic on the back, white embroidery on the chest and custom woven labels."
              style={{
                width: '100%',
                background: 'rgba(0,0,0,0.65)',
                border: '1px solid var(--line-dark, rgba(255,255,255,0.15))',
                borderRadius: 2,
                padding: '16px 18px',
                color: 'var(--white, #fff)',
                fontSize: 14,
                fontFamily: 'inherit',
                lineHeight: 1.6,
                outline: 'none',
                resize: 'vertical',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Quick Idea Presets */}
          <div>
            <span style={{ fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--gray, #777)', fontWeight: 700 }}>
              OR SELECT AN EDITORIAL PRESET:
            </span>
            <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
              {[
                "Oversized 460 GSM black fleece hoodie with vintage distress wash, puff embroidery on chest and custom woven label",
                "280 GSM boxy vintage drop-shoulder t-shirt in bone white with distressed discharge front screenprint",
                "14 oz heavy raw selvedge denim jeans in dark indigo with donut button fly and brass rivets",
                "Artisan leather moto jacket in midnight black with chunky silver YKK zippers and debossed interior patch"
              ].map((preset, pIdx) => (
                <button
                  key={pIdx}
                  type="button"
                  onClick={() => setAiPrompt(preset)}
                  style={{
                    fontSize: 11,
                    padding: '6px 12px',
                    borderRadius: 2,
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid var(--line-dark, rgba(255,255,255,0.12))',
                    color: 'var(--gray, #aaa)',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all .2s ease'
                  }}
                >
                  "{preset.slice(0, 48)}..."
                </button>
              ))}
            </div>
          </div>

          {/* Action Row */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 4 }}>
            <button
              onClick={() => handleAiGenerate()}
              disabled={aiLoading || !aiPrompt.trim()}
              className="btn btn-primary"
              style={{
                background: 'var(--white, #fff)',
                color: 'var(--black, #000)',
                padding: '14px 26px',
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: '.08em',
                cursor: aiLoading || !aiPrompt.trim() ? 'not-allowed' : 'pointer',
                opacity: aiLoading || !aiPrompt.trim() ? 0.6 : 1
              }}
            >
              {aiLoading ? (
                <>
                  <RefreshCw size={13} className="spin-animate" /> GENERATING CONCEPT...
                </>
              ) : (
                <>
                  <Sparkles size={13} /> GENERATE WITH AI
                </>
              )}
            </button>

            {onApplyPromptToConfigurator && (
              <button
                type="button"
                onClick={handleApplyAiPromptToStudio}
                disabled={!aiPrompt.trim()}
                className="btn btn-ghost"
                style={{
                  padding: '14px 22px',
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: '.06em',
                  cursor: !aiPrompt.trim() ? 'not-allowed' : 'pointer'
                }}
              >
                <Sliders size={13} /> Map Prompt to 3D Studio Configurator
              </button>
            )}
          </div>

          {/* Backend Connection Status / Error Message */}
          {aiError && (
            <div 
              style={{ 
                background: 'rgba(255,255,255,0.03)', 
                border: '1px solid rgba(255,255,255,0.15)', 
                borderRadius: 2, 
                padding: 18, 
                marginTop: 8 
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }} />
                <span style={{ fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--white, #fff)', fontWeight: 800 }}>
                  AI GENERATION BACKEND STATUS: ARCHITECTED &amp; CONNECTED
                </span>
              </div>
              <p style={{ color: 'var(--gray, #bbb)', fontSize: 13, lineHeight: 1.55 }}>
                {aiError.message}
              </p>
              <div style={{ marginTop: 12, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 11, color: 'var(--gray, #888)', background: 'rgba(0,0,0,0.5)', padding: '4px 8px', borderRadius: 2 }}>
                  Backend Endpoint: <code>POST /api/ai/generate</code>
                </span>
                <span style={{ fontSize: 11, color: 'var(--gray, #888)', background: 'rgba(0,0,0,0.5)', padding: '4px 8px', borderRadius: 2 }}>
                  Configuration: <code>GEMINI_API_KEY</code> in <code>.env</code>
                </span>
              </div>
            </div>
          )}

          {/* Real AI Result Card (if API key provided & concept generated) */}
          {aiResult && (
            <div style={{ marginTop: 16, background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 2, padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <span style={{ fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase', color: '#10b981', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <CheckCircle2 size={13} /> AI CONCEPT / VISUAL REFERENCE
                </span>
                <span style={{ fontSize: 11, color: 'var(--gray, #888)' }}>
                  Visual Design Reference Only
                </span>
              </div>

              <div style={{ maxWidth: 440, margin: '0 auto', aspectRatio: '1/1', overflow: 'hidden', borderRadius: 2, background: '#000' }}>
                <img src={aiResult.imageUrl} alt="AI Concept" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>

              <p style={{ fontSize: 12, color: 'var(--gray, #888)', marginTop: 14, textAlign: 'center', fontStyle: 'italic' }}>
                "{aiResult.prompt}"
              </p>

              <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 16 }}>
                <button
                  type="button"
                  onClick={handleApplyAiPromptToStudio}
                  className="btn btn-primary"
                  style={{ background: 'var(--white, #fff)', color: 'var(--black, #000)', fontSize: 11 }}
                >
                  Configure Actual Production Details <ArrowRight size={13} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================
          TAB B: SEND YOUR IDEA TO GTT
          ========================================================= */}
      {activeTab === 'gtt' && (
        <div>
          {gttSuccess ? (
            /* Success State */
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <CheckCircle2 size={28} color="var(--white, #fff)" />
              </div>

              <span style={{ fontSize: 11, letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--gray, #888)', fontWeight: 800 }}>
                SUBMISSION CONFIRMED &middot; ID: {gttSuccess.submissionId}
              </span>

              <h3 style={{ fontSize: 'clamp(24px, 3.2vw, 36px)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.02em', color: 'var(--white, #fff)', marginTop: 12 }}>
                YOUR IDEA IS WITH THE GTT TEAM.
              </h3>

              <p style={{ color: 'var(--gray, #bbb)', fontSize: 15, maxWidth: 540, margin: '14px auto 28px', lineHeight: 1.65 }}>
                We've received your product idea. Our team will review it and get back to you directly by email at <strong style={{ color: 'var(--white, #fff)' }}>{gttSuccess.customerEmail}</strong>.
              </p>

              <div style={{ display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => {
                    setGttSuccess(null);
                    setGttPrompt('');
                    setReferenceFile(null);
                  }}
                  className="btn btn-ghost"
                  style={{ fontSize: 12, padding: '12px 24px' }}
                >
                  Send Another Product Idea <RefreshCw size={13} />
                </button>
              </div>
            </div>
          ) : (
            /* Send to GTT Form */
            <form onSubmit={handleSendToGtt} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 10, letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--gray, #888)', fontWeight: 800 }}>
                    OPTION B &middot; BESPOKE DEVELOPMENT
                  </span>
                </div>
                <h3 style={{ fontSize: 'clamp(20px, 2.4vw, 26px)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.01em', color: 'var(--white, #fff)' }}>
                  SEND YOUR IDEA TO GTT
                </h3>
                <p style={{ color: 'var(--gray, #aaa)', fontSize: 14, marginTop: 8, lineHeight: 1.6, maxWidth: 680 }}>
                  Have a product idea but want our team to develop it with you? Send us your prompt and our team will review it and get back to you.
                </p>
              </div>

              {/* Large Text Area: YOUR PRODUCT IDEA */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label style={{ fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--gray, #888)', fontWeight: 800 }}>
                  YOUR PRODUCT IDEA <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={gttPrompt}
                  onChange={(e) => setGttPrompt(e.target.value)}
                  placeholder="Describe what you want to create..."
                  style={{
                    width: '100%',
                    background: 'rgba(0,0,0,0.65)',
                    border: '1px solid var(--line-dark, rgba(255,255,255,0.15))',
                    borderRadius: 2,
                    padding: '16px 18px',
                    color: 'var(--white, #fff)',
                    fontSize: 14,
                    fontFamily: 'inherit',
                    lineHeight: 1.6,
                    outline: 'none',
                    resize: 'vertical',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Configurator Specifications Included Badge */}
              {currentConfiguration && (
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px 16px', borderRadius: 2 }}>
                  <span style={{ fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--gray, #888)', fontWeight: 800 }}>
                    ATTACHED 3D CONFIGURATOR SPECIFICATIONS &check;
                  </span>
                  <div style={{ fontSize: 12, color: 'var(--white, #fff)', marginTop: 4 }}>
                    {currentConfiguration.product} &middot; {currentConfiguration.color} &middot; {currentConfiguration.fit} &middot; {currentConfiguration.fabric}
                  </div>
                </div>
              )}

              {/* Customer Contact Details Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }} className="gtt-contact-grid">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--gray, #888)', fontWeight: 700 }}>
                    NAME <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="First & Last Name"
                    style={inputStyle}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--gray, #888)', fontWeight: 700 }}>
                    EMAIL <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="yourname@brand.com"
                    style={inputStyle}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--gray, #888)', fontWeight: 700 }}>
                    COMPANY / BRAND
                  </label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Brand Name (or Launching Brand)"
                    style={inputStyle}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--gray, #888)', fontWeight: 700 }}>
                    COUNTRY
                  </label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="e.g. United Kingdom, USA, Australia"
                    style={inputStyle}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, gridColumn: 'span 2' }}>
                  <label style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--gray, #888)', fontWeight: 700 }}>
                    PHONE <span style={{ color: 'var(--gray, #666)', fontSize: 10 }}>(OPTIONAL)</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* Upload Reference / Moodboard / Sketch */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--gray, #888)', fontWeight: 700 }}>
                  UPLOAD REFERENCE / MOODBOARD / SKETCH <span style={{ color: 'var(--gray, #666)', fontSize: 10 }}>(OPTIONAL)</span>
                </label>
                
                {referenceFile ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--line-dark, rgba(255,255,255,0.15))', padding: '12px 16px', borderRadius: 2 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <FileText size={16} color="var(--white, #fff)" />
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--white, #fff)' }}>{referenceFile.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--gray, #888)' }}>{referenceFile.size}</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setReferenceFile(null)}
                      style={{ background: 'transparent', border: 'none', color: 'var(--gray, #888)', cursor: 'pointer', padding: 4 }}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <label 
                    style={{
                      border: '1px dashed var(--line-dark, rgba(255,255,255,0.25))',
                      borderRadius: 2,
                      padding: '24px 20px',
                      textAlign: 'center',
                      background: 'rgba(0,0,0,0.3)',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 8,
                      transition: 'border-color .2s ease'
                    }}
                  >
                    <Upload size={20} color="var(--gray, #888)" />
                    <span style={{ fontSize: 13, color: 'var(--white, #fff)', fontWeight: 600 }}>
                      Attach artwork, sketch, or tech pack
                    </span>
                    <span style={{ fontSize: 11, color: 'var(--gray, #777)' }}>
                      PNG, JPG, PDF up to 20MB
                    </span>
                    <input 
                      type="file" 
                      onChange={handleFileUpload}
                      accept="image/*,.pdf" 
                      style={{ display: 'none' }} 
                    />
                  </label>
                )}
              </div>

              {/* Error Alert */}
              {gttError && (
                <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', padding: '12px 16px', borderRadius: 2, fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <AlertCircle size={16} />
                  <span>{gttError}</span>
                </div>
              )}

              {/* Submit CTA */}
              <div style={{ marginTop: 8 }}>
                <button
                  type="submit"
                  disabled={isSubmittingGtt}
                  className="btn btn-primary"
                  style={{
                    background: 'var(--white, #fff)',
                    color: 'var(--black, #000)',
                    padding: '16px 36px',
                    fontSize: 12.5,
                    fontWeight: 800,
                    letterSpacing: '.08em',
                    cursor: isSubmittingGtt ? 'not-allowed' : 'pointer',
                    opacity: isSubmittingGtt ? 0.7 : 1
                  }}
                >
                  {isSubmittingGtt ? (
                    <>
                      <RefreshCw size={14} className="spin-animate" /> SENDING TO GTT...
                    </>
                  ) : (
                    <>
                      <Send size={14} /> SEND TO GTT
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 680px) {
          .gtt-contact-grid {
            grid-template-columns: 1fr !important;
          }
          .gtt-contact-grid > div {
            grid-column: span 1 !important;
          }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spin-animate {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}

const inputStyle = {
  background: 'rgba(0,0,0,0.65)',
  border: '1px solid var(--line-dark, rgba(255,255,255,0.15))',
  borderRadius: 2,
  padding: '12px 14px',
  color: 'var(--white, #fff)',
  fontSize: 13,
  fontFamily: 'inherit',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box'
};
