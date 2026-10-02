import React, { useState, useEffect } from 'react';
import {
  Save,
  RefreshCw,
  Check,
  AlertCircle,
  Plus,
  Trash2,
  DollarSign,
  Calculator,
  Sliders,
  Layers
} from 'lucide-react';
import { broadcastCmsUpdate } from '../../context/CmsContext';

export default function CostCalculatorAdminPage() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('products');
  const [message, setMessage] = useState(null);

  // Live test preview
  const [testProduct, setTestProduct] = useState('hoodie');
  const [testQty, setTestQty] = useState(100);
  const [testEstimate, setTestEstimate] = useState(null);

  useEffect(() => {
    fetchCalculatorSettings();
  }, []);

  const fetchCalculatorSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/cms/calculator');
      const data = await res.json();
      if (data.success) {
        setSettings(data.settings || {});
      }
    } catch (err) {
      console.error('[Calculator Fetch Error]', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const token = localStorage.getItem('gtt_admin_token');
      const res = await fetch('/api/cms/calculator', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save settings.');

      setMessage({ type: 'success', text: 'Pricing engine successfully updated and active on customer calculator!' });
      broadcastCmsUpdate();
      setTimeout(() => setMessage(null), 4000);
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateItem = (listName, index, field, value) => {
    const updatedList = [...(settings[listName] || [])];
    updatedList[index] = { ...updatedList[index], [field]: value };
    setSettings(prev => ({ ...prev, [listName]: updatedList }));
  };

  const handleAddItem = (listName, defaultObj) => {
    setSettings(prev => ({
      ...prev,
      [listName]: [...(prev[listName] || []), defaultObj]
    }));
  };

  const handleRemoveItem = (listName, index) => {
    setSettings(prev => ({
      ...prev,
      [listName]: (prev[listName] || []).filter((_, i) => i !== index)
    }));
  };

  // Run test estimate calculation
  useEffect(() => {
    if (!settings) return;
    const prod = (settings.products || []).find(p => p.id === testProduct) || settings.products?.[0];
    const base = Number(prod?.baseCost || 16.50);
    const qty = parseInt(testQty, 10) || 100;
    const tier = (settings.quantityBreaks || []).find(b => qty >= b.min && qty <= b.max) || { multiplier: 1.0, label: `${qty} pcs` };
    const unit = Math.round(base * Number(tier.multiplier || 1.0) * 100) / 100;
    setTestEstimate({ unit, total: Math.round(unit * qty * 100) / 100, tier: tier.label });
  }, [settings, testProduct, testQty]);

  if (loading) {
    return <div style={{ padding: 40, textAlign: 'center', color: 'var(--adm-text-dim)' }}>Loading pricing engine...</div>;
  }

  const tabs = [
    { id: 'products', label: 'Base Product Costs' },
    { id: 'fabrics', label: 'Fabrics & GSM' },
    { id: 'customization', label: 'Prints & Embroidery' },
    { id: 'finishing', label: 'Labels, Tags & Packaging' },
    { id: 'tiers', label: 'Quantity Breaks' }
  ];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700 }}>Cost Calculator &middot; Pricing Engine Settings</h1>
          <p style={{ color: 'var(--adm-text-muted)', fontSize: 13, marginTop: 4 }}>
            Control base costs, modifier adjustments, and volume tiers powering the customer manufacturing estimator.
          </p>
        </div>
        <button
          type="button"
          onClick={handleSaveSettings}
          disabled={saving}
          className="adm-btn adm-btn-primary"
        >
          {saving ? <RefreshCw size={14} className="spin" /> : <Save size={14} />}
          <span>Save Pricing Rules</span>
        </button>
      </div>

      {message && (
        <div style={{
          padding: '10px 14px',
          borderRadius: 4,
          marginBottom: 20,
          fontSize: 13,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: message.type === 'error' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
          color: message.type === 'error' ? '#fca5a5' : '#6ee7b7',
          border: `1px solid ${message.type === 'error' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`
        }}>
          {message.type === 'error' ? <AlertCircle size={15} /> : <Check size={15} />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Live Formula Preview Box */}
      <div className="adm-card" style={{ background: 'var(--adm-surface-alt)', borderColor: 'var(--adm-border-light)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Calculator size={20} style={{ color: 'var(--adm-primary)' }} />
            <div>
              <span style={{ fontWeight: 700, fontSize: 14 }}>Live Estimation Formula Preview</span>
              <div style={{ fontSize: 11, color: 'var(--adm-text-dim)' }}>Test how pricing renders for customers in real time</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <select
              value={testProduct}
              onChange={(e) => setTestProduct(e.target.value)}
              className="adm-select"
              style={{ width: 180, fontSize: 12 }}
            >
              {(settings.products || []).map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>

            <input
              type="number"
              value={testQty}
              onChange={(e) => setTestQty(e.target.value)}
              className="adm-input"
              style={{ width: 90, fontSize: 12 }}
              min={1}
            />
            <span style={{ fontSize: 12, color: 'var(--adm-text-dim)' }}>pcs</span>

            {testEstimate && (
              <div style={{
                background: 'var(--adm-bg)',
                padding: '6px 14px',
                borderRadius: 4,
                border: '1px solid var(--adm-border)',
                display: 'flex',
                gap: 12,
                fontSize: 12
              }}>
                <span>Unit: <strong style={{ color: '#34d399' }}>${testEstimate.unit}</strong></span>
                <span>Total: <strong style={{ color: '#3b82f6' }}>${testEstimate.total}</strong></span>
                <span style={{ color: 'var(--adm-text-dim)' }}>({testEstimate.tier})</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="adm-tabs">
        {tabs.map(t => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActiveTab(t.id)}
            className={`adm-tab ${activeTab === t.id ? 'active' : ''}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB 1: BASE PRODUCT COSTS */}
      {activeTab === 'products' && (
        <div className="adm-card">
          <div className="adm-card-header">
            <div>
              <h2 className="adm-card-title">Base Garment Product Costs</h2>
              <p className="adm-card-desc">Starting manufacturing price per garment before add-ons and volume adjustments.</p>
            </div>
            <button
              type="button"
              onClick={() => handleAddItem('products', { id: `prod_${Date.now()}`, name: 'New Garment', baseCost: 15.00, category: 'Streetwear' })}
              className="adm-btn adm-btn-secondary adm-btn-sm"
            >
              <Plus size={13} /> Add Product Type
            </button>
          </div>

          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Product Silhouette Name</th>
                  <th>Internal ID</th>
                  <th>Category</th>
                  <th style={{ width: 130 }}>Base Cost ($ USD)</th>
                  <th style={{ width: 50 }}></th>
                </tr>
              </thead>
              <tbody>
                {(settings.products || []).map((prod, idx) => (
                  <tr key={prod.id || idx}>
                    <td>
                      <input
                        type="text"
                        value={prod.name}
                        onChange={(e) => handleUpdateItem('products', idx, 'name', e.target.value)}
                        className="adm-input"
                        style={{ fontSize: 13, fontWeight: 600 }}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={prod.id}
                        onChange={(e) => handleUpdateItem('products', idx, 'id', e.target.value)}
                        className="adm-input"
                        style={{ fontSize: 11, fontFamily: 'var(--adm-mono)' }}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={prod.category || 'Streetwear'}
                        onChange={(e) => handleUpdateItem('products', idx, 'category', e.target.value)}
                        className="adm-input"
                        style={{ fontSize: 12 }}
                      />
                    </td>
                    <td>
                      <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: 8, top: 9, color: 'var(--adm-text-dim)', fontSize: 12 }}>$</span>
                        <input
                          type="number"
                          step="0.10"
                          value={prod.baseCost}
                          onChange={(e) => handleUpdateItem('products', idx, 'baseCost', parseFloat(e.target.value) || 0)}
                          className="adm-input"
                          style={{ paddingLeft: 20, fontSize: 13, fontWeight: 700, color: '#34d399' }}
                        />
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem('products', idx)}
                        className="adm-btn adm-btn-danger adm-btn-icon adm-btn-sm"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: FABRICS & GSM */}
      {activeTab === 'fabrics' && (
        <div>
          <div className="adm-card">
            <div className="adm-card-header">
              <div>
                <h2 className="adm-card-title">Fabric Composition Modifiers</h2>
                <p className="adm-card-desc">Cost differential added or deducted based on selected textile.</p>
              </div>
              <button
                type="button"
                onClick={() => handleAddItem('fabrics', { id: `fab_${Date.now()}`, name: 'Custom Fabric', costModifier: 0.00 })}
                className="adm-btn adm-btn-secondary adm-btn-sm"
              >
                <Plus size={13} /> Add Fabric Option
              </button>
            </div>

            <div className="adm-table-wrap">
              <table className="adm-table">
                <thead>
                  <tr>
                    <th>Fabric Description</th>
                    <th>Modifier ($ USD)</th>
                    <th style={{ width: 50 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {(settings.fabrics || []).map((fab, idx) => (
                    <tr key={fab.id || idx}>
                      <td>
                        <input
                          type="text"
                          value={fab.name}
                          onChange={(e) => handleUpdateItem('fabrics', idx, 'name', e.target.value)}
                          className="adm-input"
                        />
                      </td>
                      <td style={{ width: 140 }}>
                        <input
                          type="number"
                          step="0.05"
                          value={fab.costModifier}
                          onChange={(e) => handleUpdateItem('fabrics', idx, 'costModifier', parseFloat(e.target.value) || 0)}
                          className="adm-input"
                        />
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem('fabrics', idx)}
                          className="adm-btn adm-btn-danger adm-btn-icon adm-btn-sm"
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="adm-card">
            <div className="adm-card-header">
              <div>
                <h2 className="adm-card-title">GSM Fabric Weight Adjustments</h2>
                <p className="adm-card-desc">Adjustments per square meter weight (higher GSM = heavier knit density).</p>
              </div>
            </div>

            <div className="adm-table-wrap">
              <table className="adm-table">
                <thead>
                  <tr>
                    <th>GSM Weight Label</th>
                    <th>GSM Value</th>
                    <th>Modifier ($ USD)</th>
                  </tr>
                </thead>
                <tbody>
                  {(settings.gsmWeights || []).map((g, idx) => (
                    <tr key={g.id || idx}>
                      <td>
                        <input
                          type="text"
                          value={g.label}
                          onChange={(e) => handleUpdateItem('gsmWeights', idx, 'label', e.target.value)}
                          className="adm-input"
                        />
                      </td>
                      <td style={{ width: 120 }}>
                        <input
                          type="number"
                          value={g.gsm}
                          onChange={(e) => handleUpdateItem('gsmWeights', idx, 'gsm', parseInt(e.target.value, 10) || 0)}
                          className="adm-input"
                        />
                      </td>
                      <td style={{ width: 140 }}>
                        <input
                          type="number"
                          step="0.05"
                          value={g.costModifier}
                          onChange={(e) => handleUpdateItem('gsmWeights', idx, 'costModifier', parseFloat(e.target.value) || 0)}
                          className="adm-input"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PRINTS & EMBROIDERY */}
      {activeTab === 'customization' && (
        <div>
          <div className="adm-card">
            <div className="adm-card-header">
              <div>
                <h2 className="adm-card-title">Printing Technique Costs</h2>
                <p className="adm-card-desc">Screen print, DTG, DTF, and puff print costs.</p>
              </div>
            </div>

            <div className="adm-table-wrap">
              <table className="adm-table">
                <thead>
                  <tr>
                    <th>Printing Method</th>
                    <th>Modifier ($ USD)</th>
                  </tr>
                </thead>
                <tbody>
                  {(settings.printing || []).map((pr, idx) => (
                    <tr key={pr.id || idx}>
                      <td>
                        <input
                          type="text"
                          value={pr.name}
                          onChange={(e) => handleUpdateItem('printing', idx, 'name', e.target.value)}
                          className="adm-input"
                        />
                      </td>
                      <td style={{ width: 140 }}>
                        <input
                          type="number"
                          step="0.05"
                          value={pr.costModifier}
                          onChange={(e) => handleUpdateItem('printing', idx, 'costModifier', parseFloat(e.target.value) || 0)}
                          className="adm-input"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="adm-card">
            <div className="adm-card-header">
              <div>
                <h2 className="adm-card-title">Embroidery Technique Costs</h2>
                <p className="adm-card-desc">Flat micro-stitch, 3D puff, and chenille embroidery costs.</p>
              </div>
            </div>

            <div className="adm-table-wrap">
              <table className="adm-table">
                <thead>
                  <tr>
                    <th>Embroidery Method</th>
                    <th>Modifier ($ USD)</th>
                  </tr>
                </thead>
                <tbody>
                  {(settings.embroidery || []).map((emb, idx) => (
                    <tr key={emb.id || idx}>
                      <td>
                        <input
                          type="text"
                          value={emb.name}
                          onChange={(e) => handleUpdateItem('embroidery', idx, 'name', e.target.value)}
                          className="adm-input"
                        />
                      </td>
                      <td style={{ width: 140 }}>
                        <input
                          type="number"
                          step="0.05"
                          value={emb.costModifier}
                          onChange={(e) => handleUpdateItem('embroidery', idx, 'costModifier', parseFloat(e.target.value) || 0)}
                          className="adm-input"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: FINISHING */}
      {activeTab === 'finishing' && (
        <div>
          <div className="adm-card">
            <div className="adm-card-header">
              <h2 className="adm-card-title">Labels &amp; Hangtag Options</h2>
            </div>
            <div className="adm-table-wrap">
              <table className="adm-table">
                <thead>
                  <tr>
                    <th>Label / Tag Silhouette</th>
                    <th>Modifier ($ USD)</th>
                  </tr>
                </thead>
                <tbody>
                  {(settings.labels || []).map((lbl, idx) => (
                    <tr key={lbl.id || idx}>
                      <td>
                        <input
                          type="text"
                          value={lbl.name}
                          onChange={(e) => handleUpdateItem('labels', idx, 'name', e.target.value)}
                          className="adm-input"
                        />
                      </td>
                      <td style={{ width: 140 }}>
                        <input
                          type="number"
                          step="0.05"
                          value={lbl.costModifier}
                          onChange={(e) => handleUpdateItem('labels', idx, 'costModifier', parseFloat(e.target.value) || 0)}
                          className="adm-input"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="adm-card">
            <div className="adm-card-header">
              <h2 className="adm-card-title">Packaging Options</h2>
            </div>
            <div className="adm-table-wrap">
              <table className="adm-table">
                <thead>
                  <tr>
                    <th>Packaging Solution</th>
                    <th>Modifier ($ USD)</th>
                  </tr>
                </thead>
                <tbody>
                  {(settings.packaging || []).map((pkg, idx) => (
                    <tr key={pkg.id || idx}>
                      <td>
                        <input
                          type="text"
                          value={pkg.name}
                          onChange={(e) => handleUpdateItem('packaging', idx, 'name', e.target.value)}
                          className="adm-input"
                        />
                      </td>
                      <td style={{ width: 140 }}>
                        <input
                          type="number"
                          step="0.05"
                          value={pkg.costModifier}
                          onChange={(e) => handleUpdateItem('packaging', idx, 'costModifier', parseFloat(e.target.value) || 0)}
                          className="adm-input"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: QUANTITY BREAKS */}
      {activeTab === 'tiers' && (
        <div className="adm-card">
          <div className="adm-card-header">
            <div>
              <h2 className="adm-card-title">Configurable Quantity Break Pricing Rules</h2>
              <p className="adm-card-desc">Volume scales and multipliers applied dynamically based on customer order volume.</p>
            </div>
          </div>

          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Tier Label</th>
                  <th>Min Qty</th>
                  <th>Max Qty</th>
                  <th>Cost Multiplier (1.0 = Baseline)</th>
                </tr>
              </thead>
              <tbody>
                {(settings.quantityBreaks || []).map((b, idx) => (
                  <tr key={idx}>
                    <td>
                      <input
                        type="text"
                        value={b.label}
                        onChange={(e) => handleUpdateItem('quantityBreaks', idx, 'label', e.target.value)}
                        className="adm-input"
                      />
                    </td>
                    <td style={{ width: 100 }}>
                      <input
                        type="number"
                        value={b.min}
                        onChange={(e) => handleUpdateItem('quantityBreaks', idx, 'min', parseInt(e.target.value, 10) || 1)}
                        className="adm-input"
                      />
                    </td>
                    <td style={{ width: 100 }}>
                      <input
                        type="number"
                        value={b.max}
                        onChange={(e) => handleUpdateItem('quantityBreaks', idx, 'max', parseInt(e.target.value, 10) || 100000)}
                        className="adm-input"
                      />
                    </td>
                    <td style={{ width: 140 }}>
                      <input
                        type="number"
                        step="0.01"
                        value={b.multiplier}
                        onChange={(e) => handleUpdateItem('quantityBreaks', idx, 'multiplier', parseFloat(e.target.value) || 1.0)}
                        className="adm-input"
                        style={{ fontWeight: 700, color: b.multiplier < 1 ? '#34d399' : '#fbbf24' }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
