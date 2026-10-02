import React, { useState, useEffect } from 'react';
import VariantEditor from '../components/VariantEditor';
import UniversalMediaControl from '../components/UniversalMediaControl';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Copy,
  Trash2,
  Check,
  AlertCircle,
  X,
  ExternalLink,
  ShoppingBag,
  Sparkles,
  Eye,
  EyeOff
} from 'lucide-react';
import { broadcastCmsUpdate } from '../../context/CmsContext';

const CATEGORIES = [
  { id: 'street-fashion', label: 'Street & Fashion' },
  { id: 'leather-products', label: 'Leather Products' },
  { id: 'medical-wear', label: 'Medical Wear' },
  { id: 'premium-blanks', label: 'Premium Blanks' },
  { id: 'industrial-supplies', label: 'Industrial Supplies' },
  { id: 'side-products', label: 'Side Products' }
];

export default function ProductsManagerPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Modal State (Add / Edit)
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, selectedStatus]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('gtt_admin_token');
      const params = new URLSearchParams();
      if (selectedCategory) params.append('category', selectedCategory);
      if (selectedStatus) params.append('status', selectedStatus);

      const res = await fetch(`/api/cms/products?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setProducts(data.products || []);
      }
    } catch (err) {
      console.error('[Products Fetch Error]', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingProduct({
      name: '',
      slug: '',
      category: 'street-fashion',
      type: 'Hoodies',
      tagline: '',
      description: '',
      longDescription: '',
      image: '/media/products/streetwear-hoodies.jpg',
      video: '',
      mediaMode: 'hover_video',
      mobileMediaMode: 'image_only',
      gallery: ['/media/products/streetwear-hoodies.jpg'],
      gsmOptions: ['420 GSM', '460 GSM'],
      fabrics: ['100% Combed Cotton Fleece'],
      fitOptions: ['Oversized Boxy', 'Relaxed Drop Shoulder'],
      colorOptions: ['Pitch Black', 'Bone White'],
      features: ['Double-layer hood', '2x2 Heavy ribbing'],
      gsm: '450 GSM',
      fabric: '100% Combed Cotton Fleece',
      fit: 'Oversized Boxy',
      sampleMOQ: '3 pcs',
      bulkMOQ: '45 pcs',
      sampleMoq: '3 pcs',
      bulkMoq: '45 pcs',
      status: 'published',
      variants: [
        {
          id: 'var_init_1',
          colorName: 'Pitch Black',
          colorHex: '#111111',
          image: '/media/products/streetwear-hoodies.jpg',
          sku: 'GTT-BLK-01'
        }
      ]
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (product) => {
    setEditingProduct({
      ...product,
      gsm: product.gsm || (Array.isArray(product.gsmOptions) ? product.gsmOptions.join(', ') : ''),
      fabric: product.fabric || (Array.isArray(product.fabrics) ? product.fabrics.join(', ') : ''),
      fit: product.fit || (Array.isArray(product.fitOptions) ? product.fitOptions.join(', ') : ''),
      sampleMOQ: product.sampleMOQ || product.sampleMoq || '3 pcs',
      bulkMOQ: product.bulkMOQ || product.bulkMoq || '45 pcs',
      video: product.video || '',
      mediaMode: product.mediaMode || (product.video ? 'hover_video' : 'image_only'),
      mobileMediaMode: product.mobileMediaMode || 'image_only',
      gallery: Array.isArray(product.gallery) ? product.gallery : [product.image],
      variants: Array.isArray(product.variants) ? product.variants : []
    });
    setModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!editingProduct.name.trim()) return;

    setSaving(true);
    setMessage(null);

    try {
      const token = localStorage.getItem('gtt_admin_token');
      const isEdit = Boolean(editingProduct.id);
      const url = isEdit ? `/api/cms/products/${editingProduct.id}` : '/api/cms/products';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editingProduct)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save product.');

      setMessage({ type: 'success', text: `Product '${editingProduct.name}' saved successfully!` });
      setModalOpen(false);
      broadcastCmsUpdate();
      fetchProducts();
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleDuplicate = async (productId) => {
    try {
      const token = localStorage.getItem('gtt_admin_token');
      const res = await fetch(`/api/cms/products/${productId}/duplicate`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        broadcastCmsUpdate();
        fetchProducts();
      }
    } catch (err) {
      console.error('[Duplicate Error]', err);
    }
  };

  const handleToggleStatus = async (product) => {
    const nextStatus = product.status === 'published' ? 'draft' : 'published';
    try {
      const token = localStorage.getItem('gtt_admin_token');
      const res = await fetch(`/api/cms/products/${product.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: nextStatus })
      });
      if (res.ok) {
        setProducts(prev => prev.map(p => p.id === product.id ? { ...p, status: nextStatus } : p));
        broadcastCmsUpdate();
      }
    } catch (err) {
      console.error('[Status Toggle Error]', err);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const token = localStorage.getItem('gtt_admin_token');
      const res = await fetch(`/api/cms/products/${productId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setProducts(prev => prev.filter(p => p.id !== productId));
        broadcastCmsUpdate();
      }
    } catch (err) {
      console.error('[Delete Error]', err);
    }
  };

  const filteredProducts = products.filter(p => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (p.name && p.name.toLowerCase().includes(q)) ||
           (p.type && p.type.toLowerCase().includes(q)) ||
           (p.description && p.description.toLowerCase().includes(q));
  });

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700 }}>Catalog &amp; Product Management</h1>
          <p style={{ color: 'var(--adm-text-muted)', fontSize: 13, marginTop: 4 }}>
            Manage commercial cut-and-sew apparel, variants, images, specifications, and Google ProductGroup data.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAdd}
          className="adm-btn adm-btn-primary"
        >
          <Plus size={14} /> <span>Add New Product</span>
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

      {/* Filter Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        marginBottom: 20,
        flexWrap: 'wrap'
      }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 240 }}>
          <input
            type="text"
            placeholder="Search products by name, type, or fabric..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="adm-input"
            style={{ paddingLeft: 36 }}
          />
          <Search size={15} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--adm-text-dim)' }} />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="adm-select"
          style={{ width: 200 }}
        >
          <option value="">All Categories (6 Divisions)</option>
          {CATEGORIES.map(c => (
            <option key={c.id} value={c.id}>{c.label}</option>
          ))}
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="adm-select"
          style={{ width: 150 }}
        >
          <option value="">All Statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {/* Products Table */}
      {loading ? (
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--adm-text-dim)' }}>Loading catalog...</div>
      ) : filteredProducts.length > 0 ? (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th style={{ width: 60 }}>Visual</th>
                <th>Product Name &amp; Silhouette</th>
                <th>Category</th>
                <th>Variants / Colors</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div style={{
                      width: 44,
                      height: 44,
                      borderRadius: 4,
                      overflow: 'hidden',
                      background: 'var(--adm-surface-alt)',
                      border: '1px solid var(--adm-border)'
                    }}>
                      <img
                        src={p.image || '/media/products/streetwear-hoodies.jpg'}
                        alt={p.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, fontSize: 13.5 }}>{p.name}</div>
                    <div style={{ color: 'var(--adm-text-dim)', fontSize: 11, marginTop: 2 }}>
                      {p.tagline || p.type || 'Custom Cut & Sew'}
                    </div>
                  </td>
                  <td>
                    <span style={{
                      fontSize: 11,
                      textTransform: 'uppercase',
                      letterSpacing: '.06em',
                      fontFamily: 'var(--adm-mono)',
                      color: 'var(--adm-text-muted)'
                    }}>
                      {p.category}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      {(p.variants && p.variants.length > 0 ? p.variants : (p.colorOptions || []).map((c, i) => ({ id: i, colorHex: '#222' }))).slice(0, 5).map((v, i) => (
                        <div
                          key={v.id || i}
                          style={{
                            width: 14,
                            height: 14,
                            borderRadius: '50%',
                            background: v.colorHex || '#444',
                            border: '1px solid var(--adm-border-light)'
                          }}
                          title={v.colorName || 'Colorway'}
                        />
                      ))}
                      {(p.variants?.length || p.colorOptions?.length || 0) > 5 && (
                        <span style={{ fontSize: 10, color: 'var(--adm-text-dim)' }}>
                          +{(p.variants?.length || p.colorOptions?.length) - 5}
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(p)}
                      className={`adm-badge ${p.status === 'published' ? 'adm-badge-success' : 'adm-badge-muted'}`}
                      style={{ cursor: 'pointer', border: 'none' }}
                      title="Click to toggle publish status"
                    >
                      {p.status === 'published' ? <Eye size={11} /> : <EyeOff size={11} />}
                      <span>{p.status}</span>
                    </button>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(p)}
                        className="adm-btn adm-btn-secondary adm-btn-icon adm-btn-sm"
                        title="Edit product"
                      >
                        <Edit size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDuplicate(p.id)}
                        className="adm-btn adm-btn-secondary adm-btn-icon adm-btn-sm"
                        title="Duplicate product"
                      >
                        <Copy size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(p.id)}
                        className="adm-btn adm-btn-danger adm-btn-icon adm-btn-sm"
                        title="Delete product"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: 48, background: 'var(--adm-surface)', borderRadius: 8 }}>
          <ShoppingBag size={32} style={{ color: 'var(--adm-text-dim)', margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: 16, fontWeight: 700 }}>No products matched your criteria</h3>
          <p style={{ color: 'var(--adm-text-muted)', fontSize: 12, marginTop: 4 }}>
            Try adjusting your search terms or filter selections.
          </p>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {modalOpen && editingProduct && (
        <div className="adm-modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) setModalOpen(false); }}>
          <div className="adm-modal">
            <div className="adm-modal-header">
              <h2 style={{ fontSize: 16, fontWeight: 700 }}>
                {editingProduct.id ? `Edit Product: ${editingProduct.name}` : 'Create New Apparel Product'}
              </h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="adm-btn adm-btn-secondary adm-btn-icon adm-btn-sm"
              >
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct}>
              <div className="adm-modal-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 16 }}>
                  <div className="adm-form-group">
                    <label className="adm-label">Product Name *</label>
                    <input
                      type="text"
                      required
                      value={editingProduct.name}
                      onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                      placeholder="e.g. Heavyweight Boxy Hoodie"
                      className="adm-input"
                    />
                  </div>

                  <div className="adm-form-group">
                    <label className="adm-label">URL Slug</label>
                    <input
                      type="text"
                      value={editingProduct.slug || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, slug: e.target.value })}
                      placeholder="e.g. heavyweight-boxy-hoodie"
                      className="adm-input"
                      style={{ fontFamily: 'var(--adm-mono)', fontSize: 12 }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                  <div className="adm-form-group">
                    <label className="adm-label">Category Division</label>
                    <select
                      value={editingProduct.category}
                      onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                      className="adm-select"
                    >
                      {CATEGORIES.map(c => (
                        <option key={c.id} value={c.id}>{c.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="adm-form-group">
                    <label className="adm-label">Garment Type</label>
                    <input
                      type="text"
                      value={editingProduct.type || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, type: e.target.value })}
                      placeholder="e.g. Hoodies, Tees, Pants"
                      className="adm-input"
                    />
                  </div>

                  <div className="adm-form-group">
                    <label className="adm-label">Publication Status</label>
                    <select
                      value={editingProduct.status}
                      onChange={(e) => setEditingProduct({ ...editingProduct, status: e.target.value })}
                      className="adm-select"
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft (Hidden)</option>
                    </select>
                  </div>
                </div>

                <div className="adm-form-group">
                  <label className="adm-label">Short Tagline / Feature Summary</label>
                  <input
                    type="text"
                    value={editingProduct.tagline || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, tagline: e.target.value })}
                    placeholder="e.g. 450–500 GSM luxury brushed fleece with double-layered crossover hood"
                    className="adm-input"
                  />
                </div>

                <div className="adm-form-group">
                  <label className="adm-label">Product Description</label>
                  <textarea
                    rows={3}
                    value={editingProduct.description || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                    className="adm-textarea"
                  />
                </div>

                {/* Technical Specifications (GSM, Fabric, Fit, MOQs) */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: 16,
                  padding: 16,
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--adm-border)',
                  borderRadius: 6,
                  marginBottom: 16
                }}>
                  <div className="adm-form-group" style={{ margin: 0 }}>
                    <label className="adm-label">GSM / Fabric Weight</label>
                    <input
                      type="text"
                      value={editingProduct.gsm || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, gsm: e.target.value })}
                      placeholder="e.g. 450 GSM or 280 GSM"
                      className="adm-input"
                    />
                  </div>

                  <div className="adm-form-group" style={{ margin: 0 }}>
                    <label className="adm-label">Fabric Composition</label>
                    <input
                      type="text"
                      value={editingProduct.fabric || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, fabric: e.target.value })}
                      placeholder="e.g. 100% Combed Cotton Fleece"
                      className="adm-input"
                    />
                  </div>

                  <div className="adm-form-group" style={{ margin: 0 }}>
                    <label className="adm-label">Fit Profile</label>
                    <input
                      type="text"
                      value={editingProduct.fit || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, fit: e.target.value })}
                      placeholder="e.g. Oversized Boxy"
                      className="adm-input"
                    />
                  </div>

                  <div className="adm-form-group" style={{ margin: 0 }}>
                    <label className="adm-label">Sample MOQ</label>
                    <input
                      type="text"
                      value={editingProduct.sampleMOQ || editingProduct.sampleMoq || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, sampleMOQ: e.target.value, sampleMoq: e.target.value })}
                      placeholder="e.g. 3 pcs"
                      className="adm-input"
                    />
                  </div>

                  <div className="adm-form-group" style={{ margin: 0 }}>
                    <label className="adm-label">Bulk Production MOQ</label>
                    <input
                      type="text"
                      value={editingProduct.bulkMOQ || editingProduct.bulkMoq || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, bulkMOQ: e.target.value, bulkMoq: e.target.value })}
                      placeholder="e.g. 45 pcs"
                      className="adm-input"
                    />
                  </div>
                </div>

                {/* Universal Product Media Control (Image & Hover Video) */}
                <div style={{ marginBottom: 16 }}>
                  <UniversalMediaControl
                    label="Product Visual Media (Image & Hover Video)"
                    description="Configure cover photography, video loop (shown on card hover / interaction), and mobile behaviour."
                    media={{
                      image: editingProduct.image,
                      video: editingProduct.video,
                      mode: editingProduct.mediaMode || (editingProduct.video ? 'hover_video' : 'image_only'),
                      mobileMode: editingProduct.mobileMediaMode || 'image_only',
                      poster: editingProduct.image,
                      alt: editingProduct.name
                    }}
                    onChange={(m) => {
                      setEditingProduct(prev => ({
                        ...prev,
                        image: m.image,
                        video: m.video,
                        mediaMode: m.mode,
                        mobileMediaMode: m.mobileMode
                      }));
                    }}
                    sectionKey="products"
                    slotKey={`product-${editingProduct.id || 'new'}`}
                  />
                </div>

                  {/* Color Variants Editor */}
                  <VariantEditor
                    variants={editingProduct.variants || []}
                    onChange={(updatedVariants) => setEditingProduct({ ...editingProduct, variants: updatedVariants })}
                    defaultImage={editingProduct.image}
                  />
                </div>

                <div className="adm-modal-footer">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="adm-btn adm-btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="adm-btn adm-btn-primary"
                >
                  {saving ? 'Saving Product...' : 'Save Product to Database'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
