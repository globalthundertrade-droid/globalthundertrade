import React, { useState } from 'react';
import { Upload, Check, RefreshCw, AlertCircle, Image as ImageIcon } from 'lucide-react';

export default function DragDropMediaReplacer({
  currentImage,
  label = 'Section Image',
  onImageReplaced,
  sectionKey,
  slotKey
}) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleFile = (file) => {
    if (!file) return;
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
    if (!allowed.includes(file.type)) {
      setMessage({ type: 'error', text: 'Invalid file format. Please upload JPG, PNG, WEBP, or SVG.' });
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Image file exceeds 15MB size limit.' });
      return;
    }

    setSelectedFile(file);
    setMessage(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target.result);
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
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleSaveReplacement = async () => {
    if (!previewUrl || !selectedFile) return;

    setUploading(true);
    setMessage(null);

    try {
      const token = localStorage.getItem('gtt_admin_token');

      // 1. Upload to server
      const uploadRes = await fetch('/api/cms/media/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          dataUrl: previewUrl,
          filename: selectedFile.name,
          alt: `${label} - GTT`,
          locationTag: sectionKey || 'section'
        })
      });

      const uploadData = await uploadRes.json();
      if (!uploadRes.ok || !uploadData.success) {
        throw new Error(uploadData.error || 'Failed to upload new image.');
      }

      const uploadedUrl = uploadData.media.url;

      // 2. Replace reference in database
      const replaceRes = await fetch('/api/cms/media/replace', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          targetOldUrl: currentImage,
          newUrl: uploadedUrl,
          sectionKey,
          slotKey
        })
      });

      const replaceData = await replaceRes.json();
      if (!replaceRes.ok) {
        throw new Error(replaceData.error || 'Failed to update CMS references.');
      }

      setMessage({ type: 'success', text: 'Image successfully replaced and live on public site!' });
      setSelectedFile(null);
      setPreviewUrl(null);

      if (onImageReplaced) {
        onImageReplaced(uploadedUrl);
      }
      try {
        window.dispatchEvent(new CustomEvent('gtt_cms_updated', { detail: { url: uploadedUrl } }));
        if (typeof BroadcastChannel !== 'undefined') {
          const ch = new BroadcastChannel('gtt_cms_sync');
          ch.postMessage({ type: 'CMS_UPDATED', url: uploadedUrl });
          setTimeout(() => ch.close(), 100);
        }
      } catch (e) {}
    } catch (err) {
      console.error('[Media Replace Error]', err);
      setMessage({ type: 'error', text: err.message || 'Error saving image replacement.' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{
      background: 'var(--adm-surface-alt)',
      border: '1px solid var(--adm-border)',
      borderRadius: 'var(--adm-radius-lg)',
      padding: '18px',
      marginBottom: '18px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em' }}>
          {label}
        </span>
        {currentImage && (
          <span style={{ fontSize: 11, color: 'var(--adm-text-dim)', fontFamily: 'var(--adm-mono)' }}>
            {currentImage.slice(0, 45)}...
          </span>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Current Image Box */}
        <div>
          <span style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--adm-text-muted)', marginBottom: 6 }}>
            CURRENT IMAGE
          </span>
          <div style={{
            width: '100%',
            aspectRatio: '16/9',
            background: 'var(--adm-bg)',
            border: '1px solid var(--adm-border)',
            borderRadius: 'var(--adm-radius)',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}>
            {currentImage ? (
              <img
                src={currentImage}
                alt="Current Reference"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            ) : (
              <div style={{ color: 'var(--adm-text-dim)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <ImageIcon size={24} />
                <span style={{ fontSize: 11 }}>No current image</span>
              </div>
            )}
          </div>
        </div>

        {/* Replacement Dropzone */}
        <div>
          <span style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--adm-text-muted)', marginBottom: 6 }}>
            {previewUrl ? 'NEW IMAGE PREVIEW' : 'DRAG & DROP NEW IMAGE HERE'}
          </span>

          {previewUrl ? (
            <div>
              <div style={{
                width: '100%',
                aspectRatio: '16/9',
                background: 'var(--adm-bg)',
                border: '2px solid var(--adm-primary)',
                borderRadius: 'var(--adm-radius)',
                overflow: 'hidden',
                position: 'relative',
                marginBottom: 8
              }}>
                <img
                  src={previewUrl}
                  alt="New preview"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  type="button"
                  onClick={handleSaveReplacement}
                  disabled={uploading}
                  className="adm-btn adm-btn-primary adm-btn-sm"
                  style={{ flex: 1 }}
                >
                  {uploading ? (
                    <><RefreshCw size={13} className="spin" /> Updating...</>
                  ) : (
                    <><Check size={13} /> Save &amp; Replace Image</>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => { setSelectedFile(null); setPreviewUrl(null); }}
                  className="adm-btn adm-btn-secondary adm-btn-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div
              className={`adm-dropzone ${dragActive ? 'drag-active' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              style={{
                width: '100%',
                aspectRatio: '16/9',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 12
              }}
            >
              <Upload size={22} style={{ color: 'var(--adm-primary)', marginBottom: 8 }} />
              <span style={{ fontSize: 12, fontWeight: 600 }}>Drag New Image</span>
              <span style={{ fontSize: 10, color: 'var(--adm-text-dim)', marginTop: 2 }}>or click to browse files</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/svg+xml"
                onChange={(e) => e.target.files && handleFile(e.target.files[0])}
              />
            </div>
          )}
        </div>
      </div>

      {message && (
        <div style={{
          marginTop: 10,
          padding: '8px 12px',
          borderRadius: 'var(--adm-radius)',
          fontSize: 12,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: message.type === 'error' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
          color: message.type === 'error' ? '#fca5a5' : '#6ee7b7',
          border: `1px solid ${message.type === 'error' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`
        }}>
          {message.type === 'error' ? <AlertCircle size={14} /> : <Check size={14} />}
          <span>{message.text}</span>
        </div>
      )}
    </div>
  );
}
