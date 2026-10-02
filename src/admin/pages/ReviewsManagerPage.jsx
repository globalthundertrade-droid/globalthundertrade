import React, { useState, useEffect } from 'react';
import {
  Star,
  Plus,
  Edit,
  Trash2,
  Check,
  AlertCircle,
  X,
  Eye,
  EyeOff
} from 'lucide-react';
import { broadcastCmsUpdate } from '../../context/CmsContext';

export default function ReviewsManagerPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('gtt_admin_token');
      const res = await fetch('/api/cms/reviews', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setReviews(data.reviews || []);
      }
    } catch (err) {
      console.error('[Reviews Fetch Error]', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingReview({
      author: '',
      location: 'United States',
      rating: 5,
      date: 'Verified Client Review',
      product: 'Custom Heavyweight Hoodies',
      text: '',
      isGoogleReview: true,
      status: 'published'
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (rev) => {
    setEditingReview(rev);
    setModalOpen(true);
  };

  const handleSaveReview = async (e) => {
    e.preventDefault();
    if (!editingReview.author || !editingReview.text) return;

    setSaving(true);
    setMessage(null);

    try {
      const token = localStorage.getItem('gtt_admin_token');
      const isEdit = Boolean(editingReview.id);
      const url = isEdit ? `/api/cms/reviews/${editingReview.id}` : '/api/cms/reviews';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editingReview)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save review.');

      setMessage({ type: 'success', text: 'Review saved successfully!' });
      setModalOpen(false);
      broadcastCmsUpdate();
      fetchReviews();
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (rev) => {
    const nextStatus = rev.status === 'published' ? 'hidden' : 'published';
    try {
      const token = localStorage.getItem('gtt_admin_token');
      const res = await fetch(`/api/cms/reviews/${rev.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: nextStatus })
      });
      if (res.ok) {
        setReviews(prev => prev.map(r => r.id === rev.id ? { ...r, status: nextStatus } : r));
        broadcastCmsUpdate();
      }
    } catch (err) {
      console.error('[Review Status Error]', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      const token = localStorage.getItem('gtt_admin_token');
      const res = await fetch(`/api/cms/reviews/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setReviews(prev => prev.filter(r => r.id !== id));
        broadcastCmsUpdate();
      }
    } catch (err) {
      console.error('[Delete Review Error]', err);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700 }}>Client Testimonials &amp; Verified Reviews</h1>
          <p style={{ color: 'var(--adm-text-muted)', fontSize: 13, marginTop: 4 }}>
            Manage authentic customer feedback, 5-star ratings, and published testimonials.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAdd}
          className="adm-btn adm-btn-primary"
        >
          <Plus size={14} /> <span>Add Client Review</span>
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

      {/* Reviews Table */}
      {loading ? (
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--adm-text-dim)' }}>Loading reviews...</div>
      ) : reviews.length > 0 ? (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Rating</th>
                <th>Client / Brand</th>
                <th>Location</th>
                <th>Product Produced</th>
                <th>Testimonial Text</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((r) => (
                <tr key={r.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', color: '#fbbf24', gap: 2 }}>
                      <Star size={13} fill="#fbbf24" />
                      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--adm-text)' }}>{r.rating}.0</span>
                    </div>
                  </td>
                  <td style={{ fontWeight: 700 }}>{r.author}</td>
                  <td style={{ color: 'var(--adm-text-muted)', fontSize: 12 }}>{r.location}</td>
                  <td style={{ fontSize: 12 }}>{r.product}</td>
                  <td style={{ maxWidth: 300, fontSize: 12, color: 'var(--adm-text-muted)' }}>
                    <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      "{r.text}"
                    </div>
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(r)}
                      className={`adm-badge ${r.status === 'published' ? 'adm-badge-success' : 'adm-badge-muted'}`}
                      style={{ cursor: 'pointer', border: 'none' }}
                      title="Click to toggle publish"
                    >
                      {r.status === 'published' ? <Eye size={11} /> : <EyeOff size={11} />}
                      <span>{r.status}</span>
                    </button>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(r)}
                        className="adm-btn adm-btn-secondary adm-btn-icon adm-btn-sm"
                        title="Edit review"
                      >
                        <Edit size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(r.id)}
                        className="adm-btn adm-btn-danger adm-btn-icon adm-btn-sm"
                        title="Delete review"
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
          <Star size={32} style={{ color: 'var(--adm-text-dim)', margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: 16, fontWeight: 700 }}>No reviews found</h3>
        </div>
      )}

      {/* Edit / Add Modal */}
      {modalOpen && editingReview && (
        <div className="adm-modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) setModalOpen(false); }}>
          <div className="adm-modal" style={{ maxWidth: 600 }}>
            <div className="adm-modal-header">
              <h2 style={{ fontSize: 16, fontWeight: 700 }}>
                {editingReview.id ? 'Edit Client Review' : 'Add Client Review'}
              </h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="adm-btn adm-btn-secondary adm-btn-icon adm-btn-sm"
              >
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleSaveReview}>
              <div className="adm-modal-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="adm-form-group">
                    <label className="adm-label">Client Name / Brand Title *</label>
                    <input
                      type="text"
                      required
                      value={editingReview.author}
                      onChange={(e) => setEditingReview({ ...editingReview, author: e.target.value })}
                      placeholder="e.g. Brand Founder, Streetwear Label"
                      className="adm-input"
                    />
                  </div>

                  <div className="adm-form-group">
                    <label className="adm-label">Location / Country</label>
                    <input
                      type="text"
                      value={editingReview.location}
                      onChange={(e) => setEditingReview({ ...editingReview, location: e.target.value })}
                      placeholder="e.g. United States, United Kingdom"
                      className="adm-input"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="adm-form-group">
                    <label className="adm-label">Product Manufactured</label>
                    <input
                      type="text"
                      value={editingReview.product}
                      onChange={(e) => setEditingReview({ ...editingReview, product: e.target.value })}
                      placeholder="e.g. Custom Heavyweight Hoodies & Graphic Tees"
                      className="adm-input"
                    />
                  </div>

                  <div className="adm-form-group">
                    <label className="adm-label">Rating (1 to 5 Stars)</label>
                    <input
                      type="number"
                      min={1}
                      max={5}
                      value={editingReview.rating}
                      onChange={(e) => setEditingReview({ ...editingReview, rating: parseInt(e.target.value, 10) || 5 })}
                      className="adm-input"
                    />
                  </div>
                </div>

                <div className="adm-form-group">
                  <label className="adm-label">Testimonial Text *</label>
                  <textarea
                    rows={4}
                    required
                    value={editingReview.text}
                    onChange={(e) => setEditingReview({ ...editingReview, text: e.target.value })}
                    className="adm-textarea"
                  />
                </div>

                <div className="adm-form-group">
                  <label className="adm-label">Publication Status</label>
                  <select
                    value={editingReview.status}
                    onChange={(e) => setEditingReview({ ...editingReview, status: e.target.value })}
                    className="adm-select"
                  >
                    <option value="published">Published</option>
                    <option value="hidden">Hidden</option>
                  </select>
                </div>
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
                  {saving ? 'Saving...' : 'Save Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
