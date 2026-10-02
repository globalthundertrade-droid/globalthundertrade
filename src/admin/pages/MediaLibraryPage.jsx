import React, { useState, useEffect } from 'react';
import {
  Upload,
  Search,
  Trash2,
  Edit2,
  Copy,
  Check,
  AlertCircle,
  ExternalLink,
  Image as ImageIcon,
  Film,
  RefreshCw,
  X,
  FileText
} from 'lucide-react';

export default function MediaLibraryPage() {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [mediaTypeFilter, setMediaTypeFilter] = useState('all'); // 'all' | 'images' | 'videos'
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [message, setMessage] = useState(null);

  // Detail / Edit modal
  const [detailModal, setDetailModal] = useState(null);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/cms/media');
      const data = await res.json();
      if (data.success) {
        setMedia(data.media || []);
      }
    } catch (err) {
      console.error('[Media Fetch Error]', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadFile = async (file) => {
    if (!file) return;

    const allowed = [
      'image/jpeg', 'image/png', 'image/webp', 'image/svg+xml',
      'video/mp4', 'video/webm', 'video/quicktime'
    ];
    if (!allowed.includes(file.type)) {
      setMessage({ type: 'error', text: 'Allowed formats: JPG, JPEG, PNG, WEBP, SVG, MP4, WEBM, MOV.' });
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'File exceeds 100MB maximum size limit.' });
      return;
    }

    setUploading(true);
    setMessage(null);

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const token = localStorage.getItem('gtt_admin_token');
        const res = await fetch('/api/cms/media/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            dataUrl: e.target.result,
            filename: file.name,
            alt: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
            description: 'Direct upload to GTT Media Library',
            locationTag: 'general'
          })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Upload failed.');

        setMessage({ type: 'success', text: `Uploaded '${file.name}' successfully.` });
        fetchMedia();
      } catch (err) {
        setMessage({ type: 'error', text: err.message });
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleCopyUrl = (url, id) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDeleteMedia = async (id) => {
    if (!window.confirm('Delete this media asset permanently?')) return;
    try {
      const token = localStorage.getItem('gtt_admin_token');
      const res = await fetch(`/api/cms/media/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setMedia(prev => prev.filter(m => m.id !== id));
        if (detailModal?.id === id) setDetailModal(null);
      }
    } catch (err) {
      console.error('[Delete Media Error]', err);
    }
  };

  const handleSaveDetail = async (e) => {
    e.preventDefault();
    if (!detailModal) return;
    try {
      const token = localStorage.getItem('gtt_admin_token');
      const res = await fetch(`/api/cms/media/${detailModal.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          alt: detailModal.alt,
          description: detailModal.description,
          locationTag: detailModal.locationTag
        })
      });
      if (res.ok) {
        setMedia(prev => prev.map(m => m.id === detailModal.id ? detailModal : m));
        setDetailModal(null);
      }
    } catch (err) {
      console.error('[Save Detail Error]', err);
    }
  };

  const handleReplaceMedia = async (targetItem, file) => {
    if (!file || !targetItem) return;
    const allowed = [
      'image/jpeg', 'image/png', 'image/webp', 'image/svg+xml',
      'video/mp4', 'video/webm', 'video/quicktime'
    ];
    if (!allowed.includes(file.type)) {
      setMessage({ type: 'error', text: 'Allowed formats: JPG, PNG, WEBP, SVG, MP4, WEBM, MOV.' });
      return;
    }
    if (file.size > 100 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'File exceeds 100MB limit.' });
      return;
    }
    setUploading(true);
    setMessage(null);
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const token = localStorage.getItem('gtt_admin_token');
        const uploadRes = await fetch('/api/cms/media/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            dataUrl: e.target.result,
            filename: file.name,
            alt: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
            description: `Replacement asset for ${targetItem.filename}`,
            locationTag: targetItem.locationTag || 'general'
          })
        });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok || !uploadData.success) {
          throw new Error(uploadData.error || 'Upload failed.');
        }
        const newUrl = uploadData.media.url;

        // Propagate replacement through CMS across the whole website
        const replaceRes = await fetch('/api/cms/media/replace', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            targetOldUrl: targetItem.url,
            newUrl: newUrl
          })
        });
        if (!replaceRes.ok) {
          const repErr = await replaceRes.json();
          throw new Error(repErr.error || 'Failed to replace across site.');
        }

        setMessage({ type: 'success', text: `Replaced '${targetItem.filename}' with '${file.name}'. All site references updated.` });
        if (detailModal?.id === targetItem.id) {
          setDetailModal(prev => prev ? { ...prev, url: newUrl, filename: file.name } : null);
        }
        fetchMedia();

        try {
          window.dispatchEvent(new CustomEvent('gtt_cms_updated', { detail: { url: newUrl } }));
          if (typeof BroadcastChannel !== 'undefined') {
            const ch = new BroadcastChannel('gtt_cms_sync');
            ch.postMessage({ type: 'CMS_UPDATED', url: newUrl });
            setTimeout(() => ch.close(), 100);
          }
        } catch (e) {}
      } catch (err) {
        setMessage({ type: 'error', text: err.message });
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const filteredMedia = media.filter(m => {
    const isVid = m.isVideo || m.type === 'video' || m.url?.endsWith('.mp4') || m.url?.endsWith('.webm') || m.url?.endsWith('.mov');
    if (mediaTypeFilter === 'images' && isVid) return false;
    if (mediaTypeFilter === 'videos' && !isVid) return false;

    const matchesTag = !selectedTag || m.locationTag === selectedTag;
    if (!matchesTag) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return (m.filename && m.filename.toLowerCase().includes(q)) ||
           (m.alt && m.alt.toLowerCase().includes(q)) ||
           (m.description && m.description.toLowerCase().includes(q));
  });

  const videoCount = media.filter(m => m.isVideo || m.type === 'video' || m.url?.endsWith('.mp4') || m.url?.endsWith('.webm')).length;
  const imageCount = media.length - videoCount;

function formatBytes(bytes) {
  if (!bytes || isNaN(bytes)) return null;
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

  const handleScanAssets = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const token = localStorage.getItem('gtt_admin_token');
      const res = await fetch('/api/cms/media/scan', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setMessage({
          type: 'success',
          text: `Scanned public directory. Found ${data.total} assets on disk (${data.added} newly registered).`
        });
        fetchMedia();
      } else {
        throw new Error(data.error || 'Scan failed');
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700 }}>Centralized Media Library</h1>
          <p style={{ color: 'var(--adm-text-muted)', fontSize: 13, marginTop: 4 }}>
            Organize, upload, preview, replace, and map commercial photography and video assets across Global Thunder Trade.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            type="button"
            onClick={handleScanAssets}
            className="adm-btn adm-btn-secondary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
            title="Scan disk /public directory and sync newly placed images/videos into CMS registry"
          >
            <RefreshCw size={13} />
            <span>Scan Project Assets</span>
          </button>
        </div>
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

      {/* Media Type Filter Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <button
          type="button"
          onClick={() => setMediaTypeFilter('all')}
          className={`adm-tab ${mediaTypeFilter === 'all' ? 'active' : ''}`}
          style={{ padding: '6px 14px', fontSize: 12, fontWeight: 700 }}
        >
          ALL ASSETS ({media.length})
        </button>
        <button
          type="button"
          onClick={() => setMediaTypeFilter('images')}
          className={`adm-tab ${mediaTypeFilter === 'images' ? 'active' : ''}`}
          style={{ padding: '6px 14px', fontSize: 12, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 6 }}
        >
          <ImageIcon size={13} /> IMAGES ({imageCount})
        </button>
        <button
          type="button"
          onClick={() => setMediaTypeFilter('videos')}
          className={`adm-tab ${mediaTypeFilter === 'videos' ? 'active' : ''}`}
          style={{ padding: '6px 14px', fontSize: 12, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 6 }}
        >
          <Film size={13} /> VIDEOS ({videoCount})
        </button>
      </div>

      {/* Drag & Drop Upload Zone (Images & Videos) */}
      <div
        className={`adm-dropzone ${dragActive ? 'drag-active' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        style={{ marginBottom: 24, padding: '32px 20px' }}
      >
        <Upload size={32} style={{ color: 'var(--adm-primary)', margin: '0 auto 12px' }} />
        <h3 style={{ fontSize: 15, fontWeight: 700 }}>
          {uploading ? 'Processing & Optimizing Commercial Asset...' : 'Drag & Drop Images or Videos Here'}
        </h3>
        <p style={{ color: 'var(--adm-text-muted)', fontSize: 12, marginTop: 4 }}>
          Supports JPG, PNG, WEBP, SVG, MP4, WEBM, MOV (up to 100MB) &middot; Automatically optimized for high-res storefront delivery
        </p>
        <input
          type="file"
          accept="image/*,video/mp4,video/webm,video/quicktime"
          onChange={(e) => e.target.files && handleUploadFile(e.target.files[0])}
        />
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 240 }}>
          <input
            type="text"
            placeholder="Search media by filename, alt text, or tag..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="adm-input"
            style={{ paddingLeft: 36 }}
          />
          <Search size={15} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--adm-text-dim)' }} />
        </div>

        <select
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
          className="adm-select"
          style={{ width: 180 }}
        >
          <option value="">All Divisions</option>
          <option value="homepage">Homepage</option>
          <option value="services">Services</option>
          <option value="blanks">Blanks</option>
          <option value="products">Products</option>
          <option value="about">About</option>
          <option value="general">General</option>
        </select>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--adm-text-dim)' }}>Scanning media registry...</div>
      ) : filteredMedia.length > 0 ? (
        <div className="adm-media-grid">
          {filteredMedia.map((item) => {
            const isVid = item.isVideo || item.type === 'video' || item.url?.endsWith('.mp4') || item.url?.endsWith('.webm') || item.url?.endsWith('.mov');
            return (
              <div key={item.id} className="adm-media-item">
                <div style={{ position: 'relative', width: '100%', aspectRatio: '4/3', overflow: 'hidden', background: '#000' }}>
                  {isVid ? (
                    <video
                      src={item.url}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      muted
                      controls
                      playsInline
                    />
                  ) : (
                    <img
                      src={item.url}
                      alt={item.alt || item.filename}
                      className="adm-media-thumb"
                      onError={(e) => { e.currentTarget.style.opacity = '0.3'; }}
                    />
                  )}
                <span style={{
                  position: 'absolute',
                  top: 6,
                  right: 6,
                  background: 'rgba(0,0,0,0.7)',
                  backdropFilter: 'blur(4px)',
                  color: '#fff',
                  fontSize: 9,
                  fontWeight: 700,
                  padding: '2px 5px',
                  borderRadius: 2,
                  fontFamily: 'var(--adm-mono)'
                }}>
                  {item.extension ? item.extension.replace(/^\./, '').toUpperCase() : (isVid ? 'VIDEO' : 'IMG')}
                </span>
              </div>

              <div className="adm-media-info">
                <div className="adm-media-name" title={item.filename}>{item.filename}</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6, fontSize: 11, color: 'var(--adm-text-muted)', marginTop: 2 }}>
                  <span>{item.locationTag || 'general'}</span>
                  <span>{item.sizeFormatted || formatBytes(item.size) || ''}</span>
                </div>

                {item.associatedSlots && item.associatedSlots.length > 0 ? (
                  <div style={{ marginTop: 6, display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {item.associatedSlots.slice(0, 2).map((slot, idx) => (
                      <span key={idx} style={{
                        fontSize: 10,
                        background: 'rgba(217, 119, 6, 0.15)',
                        color: '#fbbf24',
                        border: '1px solid rgba(217, 119, 6, 0.3)',
                        padding: '2px 6px',
                        borderRadius: 3,
                        fontWeight: 600,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }} title={slot}>
                        {slot}
                      </span>
                    ))}
                    {item.associatedSlots.length > 2 && (
                      <span style={{ fontSize: 9, color: 'var(--adm-text-dim)' }}>
                        +{item.associatedSlots.length - 2} more site locations
                      </span>
                    )}
                  </div>
                ) : (
                  <div style={{ marginTop: 6, fontSize: 10, color: 'var(--adm-text-dim)' }}>
                    Unassigned library asset
                  </div>
                )}
              </div>

              <div style={{
                padding: '6px 12px 10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderTop: '1px solid var(--adm-border)'
              }}>
                <button
                  type="button"
                  onClick={() => handleCopyUrl(item.url, item.id)}
                  className="adm-btn adm-btn-secondary adm-btn-icon adm-btn-sm"
                  title="Copy URL path"
                >
                  {copiedId === item.id ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                </button>
                <div style={{ display: 'flex', gap: 4 }}>
                  <label
                    className="adm-btn adm-btn-secondary adm-btn-icon adm-btn-sm"
                    title="Replace this media asset across site"
                    style={{ cursor: 'pointer', margin: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <RefreshCw size={12} />
                    <input
                      type="file"
                      accept="image/*,video/mp4,video/webm,video/quicktime"
                      style={{ display: 'none' }}
                      onChange={(e) => e.target.files && handleReplaceMedia(item, e.target.files[0])}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => setDetailModal(item)}
                    className="adm-btn adm-btn-secondary adm-btn-icon adm-btn-sm"
                    title="Edit Metadata"
                  >
                    <Edit2 size={12} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteMedia(item.id)}
                    className="adm-btn adm-btn-danger adm-btn-icon adm-btn-sm"
                    title="Delete Media"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      ) : (
        <div style={{ textAlign: 'center', padding: 48, background: 'var(--adm-surface)', borderRadius: 8 }}>
          <ImageIcon size={32} style={{ color: 'var(--adm-text-dim)', margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: 16, fontWeight: 700 }}>No media items found</h3>
        </div>
      )}

      {/* Metadata Detail Modal */}
      {detailModal && (
        <div className="adm-modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) setDetailModal(null); }}>
          <div className="adm-modal" style={{ maxWidth: 650 }}>
            <div className="adm-modal-header">
              <h2 style={{ fontSize: 16, fontWeight: 700 }}>Media Asset Metadata</h2>
              <button
                type="button"
                onClick={() => setDetailModal(null)}
                className="adm-btn adm-btn-secondary adm-btn-icon adm-btn-sm"
              >
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleSaveDetail}>
              <div className="adm-modal-body">
                <div style={{
                  width: '100%',
                  aspectRatio: '16/9',
                  background: 'var(--adm-bg)',
                  borderRadius: 4,
                  overflow: 'hidden',
                  marginBottom: 16,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {detailModal.isVideo || detailModal.type === 'video' || detailModal.url?.endsWith('.mp4') || detailModal.url?.endsWith('.webm') || detailModal.url?.endsWith('.mov') ? (
                    <video
                      src={detailModal.url}
                      controls
                      playsInline
                      muted
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                  ) : (
                    <img
                      src={detailModal.url}
                      alt={detailModal.alt}
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                  )}
                </div>

                <div className="adm-form-group">
                  <label className="adm-label">Asset Public URL</label>
                  <input
                    type="text"
                    readOnly
                    value={detailModal.url}
                    className="adm-input"
                    style={{ fontFamily: 'var(--adm-mono)', fontSize: 12, background: 'var(--adm-surface-alt)' }}
                  />
                </div>

                {detailModal.associatedSlots && detailModal.associatedSlots.length > 0 && (
                  <div className="adm-form-group">
                    <label className="adm-label" style={{ color: '#fbbf24' }}>
                      Active Website Locations ({detailModal.associatedSlots.length})
                    </label>
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 4,
                      maxHeight: 120,
                      overflowY: 'auto',
                      padding: '8px 10px',
                      background: 'rgba(217, 119, 6, 0.08)',
                      border: '1px solid rgba(217, 119, 6, 0.25)',
                      borderRadius: 4
                    }}>
                      {detailModal.associatedSlots.map((slot, idx) => (
                        <div key={idx} style={{ fontSize: 12, color: '#fef3c7', fontWeight: 500 }}>
                          • {slot}
                        </div>
                      ))}
                    </div>
                    <p style={{ fontSize: 11, color: 'var(--adm-text-dim)', marginTop: 4 }}>
                      Replacing this asset file will automatically update all public site locations listed above.
                    </p>
                  </div>
                )}

                <div className="adm-form-group">
                  <label className="adm-label">Division / Location Tag</label>
                  <select
                    value={detailModal.locationTag || 'general'}
                    onChange={(e) => setDetailModal({ ...detailModal, locationTag: e.target.value })}
                    className="adm-select"
                  >
                    <option value="general">General</option>
                    <option value="homepage">Homepage</option>
                    <option value="services">Services</option>
                    <option value="blanks">Blanks</option>
                    <option value="products">Products</option>
                    <option value="about">About</option>
                  </select>
                </div>

                <div className="adm-form-group">
                  <label className="adm-label">SEO Alt Text (Accessibility &amp; Image Search)</label>
                  <input
                    type="text"
                    value={detailModal.alt || ''}
                    onChange={(e) => setDetailModal({ ...detailModal, alt: e.target.value })}
                    className="adm-input"
                  />
                </div>

                <div className="adm-form-group">
                  <label className="adm-label">Internal Description / Usage Location</label>
                  <textarea
                    rows={2}
                    value={detailModal.description || ''}
                    onChange={(e) => setDetailModal({ ...detailModal, description: e.target.value })}
                    className="adm-textarea"
                  />
                </div>
              </div>

              <div className="adm-modal-footer" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <label
                  className="adm-btn adm-btn-secondary"
                  style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, margin: 0 }}
                  title="Upload a new file to replace this asset across the site"
                >
                  <RefreshCw size={13} />
                  <span>Replace Asset File</span>
                  <input
                    type="file"
                    accept="image/*,video/mp4,video/webm,video/quicktime"
                    style={{ display: 'none' }}
                    onChange={(e) => e.target.files && handleReplaceMedia(detailModal, e.target.files[0])}
                  />
                </label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    type="button"
                    onClick={() => setDetailModal(null)}
                    className="adm-btn adm-btn-secondary"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="adm-btn adm-btn-primary"
                  >
                    Save Metadata
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
