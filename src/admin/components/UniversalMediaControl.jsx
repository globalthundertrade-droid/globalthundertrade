import React, { useState, useEffect, useRef } from 'react';
import {
  Upload,
  Film,
  Image as ImageIcon,
  Check,
  RefreshCw,
  AlertCircle,
  Play,
  Pause,
  Trash2,
  FolderOpen,
  X,
  ExternalLink,
  Eye,
  Sliders,
  Smartphone,
  Monitor,
  Sparkles
} from 'lucide-react';
import UniversalMedia from '../../components/UniversalMedia';

export default function UniversalMediaControl({
  label = 'Visual Media Slot',
  description = 'Configure image, video, desktop interaction, and mobile behaviour.',
  media = {},
  onChange,
  sectionKey = 'general',
  slotKey = 'media',
  allowPoster = true,
  allowAlt = true,
  showPresets = true
}) {
  // Normalize incoming media value
  const initialMedia = typeof media === 'string'
    ? {
        image: media.endsWith('.mp4') || media.endsWith('.webm') ? '' : media,
        video: media.endsWith('.mp4') || media.endsWith('.webm') ? media : '',
        mode: media.endsWith('.mp4') || media.endsWith('.webm') ? 'video_only' : 'image_only',
        mobileMode: 'image_only',
        poster: '',
        alt: ''
      }
    : {
        image: media?.image || '',
        video: media?.video || '',
        mode: media?.mode || (media?.video ? 'hover_video' : 'image_only'),
        mobileMode: media?.mobileMode || 'image_only',
        poster: media?.poster || '',
        alt: media?.alt || ''
      };

  const [currentMedia, setCurrentMedia] = useState(initialMedia);
  const [activeTab, setActiveTab] = useState('image'); // 'image' | 'video' | 'settings' | 'preview'
  const [uploading, setUploading] = useState(false);
  const [uploadType, setUploadType] = useState(null); // 'image' | 'video' | 'poster'
  const [uploadMessage, setUploadMessage] = useState(null);
  const [dragActiveImage, setDragActiveImage] = useState(false);
  const [dragActiveVideo, setDragActiveVideo] = useState(false);

  // Media Library Picker Modal
  const [libraryModalOpen, setLibraryModalOpen] = useState(false);
  const [libraryMedia, setLibraryMedia] = useState([]);
  const [libraryFilter, setLibraryFilter] = useState('all');
  const [libraryLoading, setLibraryLoading] = useState(false);
  const [libraryTargetField, setLibraryTargetField] = useState('image'); // 'image' | 'video' | 'poster'

  // Sync internal state if prop changes externally
  useEffect(() => {
    if (typeof media === 'string') {
      const isVid = media.endsWith('.mp4') || media.endsWith('.webm');
      setCurrentMedia(prev => ({
        ...prev,
        image: isVid ? prev.image : media,
        video: isVid ? media : prev.video
      }));
    } else if (media && typeof media === 'object') {
      setCurrentMedia(prev => ({
        ...prev,
        image: media.image !== undefined ? media.image : prev.image,
        video: media.video !== undefined ? media.video : prev.video,
        mode: media.mode !== undefined ? media.mode : prev.mode,
        mobileMode: media.mobileMode !== undefined ? media.mobileMode : prev.mobileMode,
        poster: media.poster !== undefined ? media.poster : prev.poster,
        alt: media.alt !== undefined ? media.alt : prev.alt
      }));
    }
  }, [media]);

  const updateFields = (changes) => {
    setCurrentMedia(prev => {
      const updated = { ...prev, ...changes };
      if (onChange) {
        onChange(updated);
      }
      return updated;
    });
  };

  const updateField = (field, value) => {
    updateFields({ [field]: value });
  };

  // Preset Configurations
  const applyPreset = (presetKey) => {
    let presetChanges = {};
    if (presetKey === 'hero') {
      presetChanges = {
        mode: 'video_only',
        mobileMode: 'same_as_desktop'
      };
    } else if (presetKey === 'card_hover') {
      presetChanges = {
        mode: 'interaction_video',
        mobileMode: 'tap_to_play'
      };
    } else if (presetKey === 'video_only') {
      presetChanges = {
        mode: 'video_only',
        mobileMode: 'autoplay_video'
      };
    } else if (presetKey === 'image_only') {
      presetChanges = {
        mode: 'image_only',
        mobileMode: 'image_only'
      };
    }
    updateFields(presetChanges);
  };

  // Upload handler for image, video, and poster
  const handleUploadFile = async (file, targetField = 'image') => {
    if (!file) return;

    const isVideoField = targetField === 'video';
    const allowedImage = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
    const allowedVideo = ['video/mp4', 'video/webm', 'video/quicktime'];

    if (isVideoField && !allowedVideo.includes(file.type)) {
      setUploadMessage({ type: 'error', text: 'Invalid video format. Supported: MP4, WEBM, MOV.' });
      return;
    }
    if (!isVideoField && !allowedImage.includes(file.type)) {
      setUploadMessage({ type: 'error', text: 'Invalid image format. Supported: JPG, PNG, WEBP, SVG.' });
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      setUploadMessage({ type: 'error', text: 'File exceeds maximum 100MB limit.' });
      return;
    }

    setUploading(true);
    setUploadType(targetField);
    setUploadMessage(null);

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const token = localStorage.getItem('gtt_admin_token');
        const res = await fetch('/api/cms/media/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          },
          body: JSON.stringify({
            dataUrl: e.target.result,
            filename: file.name,
            alt: currentMedia.alt || `${label} Asset`,
            locationTag: sectionKey
          })
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || 'Upload failed.');
        }

        const uploadedUrl = data.media.url;
        const changes = { [targetField]: uploadedUrl };
        if (targetField === 'video' && currentMedia.mode === 'image_only') {
          changes.mode = 'hover_video';
        }
        updateFields(changes);

        setUploadMessage({ type: 'success', text: `Uploaded ${file.name} successfully!` });
        setTimeout(() => setUploadMessage(null), 3500);
      } catch (err) {
        setUploadMessage({ type: 'error', text: err.message });
      } finally {
        setUploading(false);
        setUploadType(null);
      }
    };
    reader.readAsDataURL(file);
  };

  // Open Media Library Modal
  const openMediaLibrary = (targetField = 'image') => {
    setLibraryTargetField(targetField);
    setLibraryFilter(targetField === 'video' ? 'videos' : 'images');
    setLibraryModalOpen(true);
    fetchLibraryMedia();
  };

  const fetchLibraryMedia = async () => {
    setLibraryLoading(true);
    try {
      const token = localStorage.getItem('gtt_admin_token');
      const res = await fetch('/api/cms/media', {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      const data = await res.json();
      if (data.success) {
        setLibraryMedia(data.media || []);
      }
    } catch (e) {
      console.error('[Library Fetch Error]', e);
    } finally {
      setLibraryLoading(false);
    }
  };

  const handleSelectFromLibrary = (item) => {
    const changes = { [libraryTargetField]: item.url };
    if (libraryTargetField === 'image' && item.alt && !currentMedia.alt) {
      changes.alt = item.alt;
    }
    if (libraryTargetField === 'video' && currentMedia.mode === 'image_only') {
      changes.mode = 'hover_video';
    }
    updateFields(changes);
    setLibraryModalOpen(false);
  };

  const MODES = [
    { id: 'image_only', label: 'IMAGE ONLY', desc: 'Display static image exclusively; ignore video.' },
    { id: 'video_only', label: 'VIDEO ONLY', desc: 'Display video directly without image fallback or delay.' },
    { id: 'interaction_video', label: 'IMAGE → VIDEO ON ARROW', desc: 'Display image by default. On arrow / hover interaction, smoothly play category video.' },
    { id: 'hover_video', label: 'IMAGE → VIDEO ON HOVER', desc: 'Display image by default. On desktop hover, smoothly crossfade to playing video.' },
    { id: 'video_fallback', label: 'VIDEO WITH IMAGE FALLBACK', desc: 'Autoplays video if available; falls back to image if video fails.' }
  ];

  const MOBILE_BEHAVIOURS = [
    { id: 'image_only', label: 'IMAGE ONLY (Default)', desc: 'Keeps mobile fast and conserves cellular bandwidth.' },
    { id: 'tap_to_play', label: 'TAP TO PLAY VIDEO', desc: 'Tapping the card/media toggles video playback on touchscreens.' },
    { id: 'autoplay_video', label: 'AUTOPLAY VIDEO', desc: 'Autoplays muted video when card scrolls into viewport.' },
    { id: 'same_as_desktop', label: 'SAME AS DESKTOP', desc: 'Attempts standard desktop hover/focus behavior.' }
  ];

  return (
    <div style={{
      background: '#15181c',
      border: '1px solid #262c36',
      borderRadius: 6,
      padding: 20,
      marginBottom: 20
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 14 }}>
        <div>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: '#f0f3f6', textTransform: 'uppercase', letterSpacing: '.04em' }}>
            {label}
          </h3>
          <p style={{ fontSize: 12, color: '#8b949e', marginTop: 2 }}>
            {description}
          </p>
        </div>

        {/* Quick Presets */}
        {showPresets && (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => applyPreset('hero')}
              className="adm-btn adm-btn-secondary"
              style={{ fontSize: 11, padding: '4px 8px' }}
              title="Autoplay Video with Image Fallback"
            >
              <Sparkles size={11} /> Hero Preset
            </button>
            <button
              type="button"
              onClick={() => applyPreset('card_hover')}
              className="adm-btn adm-btn-secondary"
              style={{ fontSize: 11, padding: '4px 8px' }}
              title="Image default, Video on hover"
            >
              <Sparkles size={11} /> Card Hover Preset
            </button>
            <button
              type="button"
              onClick={() => applyPreset('image_only')}
              className="adm-btn adm-btn-secondary"
              style={{ fontSize: 11, padding: '4px 8px' }}
            >
              Image Only
            </button>
          </div>
        )}
      </div>

      {uploadMessage && (
        <div style={{
          padding: '8px 12px',
          borderRadius: 4,
          marginBottom: 14,
          fontSize: 12,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          background: uploadMessage.type === 'error' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
          color: uploadMessage.type === 'error' ? '#fca5a5' : '#6ee7b7',
          border: `1px solid ${uploadMessage.type === 'error' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`
        }}>
          {uploadMessage.type === 'error' ? <AlertCircle size={14} /> : <Check size={14} />}
          <span>{uploadMessage.text}</span>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid #262c36', marginBottom: 16 }}>
        <button
          type="button"
          onClick={() => setActiveTab('image')}
          style={{
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'image' ? '2px solid #ffffff' : '2px solid transparent',
            color: activeTab === 'image' ? '#ffffff' : '#8b949e',
            fontWeight: 600,
            fontSize: 12,
            padding: '8px 14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}
        >
          <ImageIcon size={13} />
          <span>IMAGE {currentMedia.image ? '✓' : ''}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('video')}
          style={{
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'video' ? '2px solid #ffffff' : '2px solid transparent',
            color: activeTab === 'video' ? '#ffffff' : '#8b949e',
            fontWeight: 600,
            fontSize: 12,
            padding: '8px 14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}
        >
          <Film size={13} />
          <span>VIDEO {currentMedia.video ? '✓' : ''}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('settings')}
          style={{
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'settings' ? '2px solid #ffffff' : '2px solid transparent',
            color: activeTab === 'settings' ? '#ffffff' : '#8b949e',
            fontWeight: 600,
            fontSize: 12,
            padding: '8px 14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}
        >
          <Sliders size={13} />
          <span>MEDIA MODE & BEHAVIOUR</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('preview')}
          style={{
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'preview' ? '2px solid #ffffff' : '2px solid transparent',
            color: activeTab === 'preview' ? '#ffffff' : '#8b949e',
            fontWeight: 600,
            fontSize: 12,
            padding: '8px 14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            marginLeft: 'auto'
          }}
        >
          <Eye size={13} />
          <span>LIVE PREVIEW</span>
        </button>
      </div>

      {/* 1. IMAGE TAB */}
      {activeTab === 'image' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: 16, alignItems: 'start' }}>
            {/* Thumbnail Preview */}
            <div style={{
              width: 140,
              height: 140,
              background: '#0a0b0d',
              border: '1px solid #262c36',
              borderRadius: 4,
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}>
              {currentMedia.image ? (
                <img
                  src={currentMedia.image}
                  alt={currentMedia.alt || 'Preview'}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div style={{ textAlign: 'center', color: '#5d6775', padding: 10 }}>
                  <ImageIcon size={28} style={{ margin: '0 auto 6px' }} />
                  <span style={{ fontSize: 11, display: 'block' }}>No Image Set</span>
                </div>
              )}
            </div>

            {/* Controls */}
            <div>
              {/* Drag & Drop Zone */}
              <div
                onDragOver={(e) => { e.preventDefault(); setDragActiveImage(true); }}
                onDragLeave={() => setDragActiveImage(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragActiveImage(false);
                  if (e.dataTransfer.files?.[0]) handleUploadFile(e.dataTransfer.files[0], 'image');
                }}
                style={{
                  border: `2px dashed ${dragActiveImage ? '#ffffff' : '#303642'}`,
                  background: dragActiveImage ? 'rgba(255,255,255,0.05)' : '#101216',
                  borderRadius: 6,
                  padding: '16px 20px',
                  textAlign: 'center',
                  marginBottom: 12,
                  transition: 'all .2s ease'
                }}
              >
                <Upload size={18} style={{ color: '#8b949e', marginBottom: 6 }} />
                <div style={{ fontSize: 12, color: '#f0f3f6', fontWeight: 600 }}>
                  [ DRAG IMAGE HERE ]
                </div>
                <div style={{ fontSize: 11, color: '#8b949e', marginTop: 2 }}>
                  Supports JPG, PNG, WEBP, SVG &middot; Up to 100MB
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 10 }}>
                  <label className="adm-btn adm-btn-secondary" style={{ fontSize: 11, padding: '5px 10px', cursor: 'pointer' }}>
                    <Upload size={12} /> Upload New Image
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        if (e.target.files?.[0]) handleUploadFile(e.target.files[0], 'image');
                      }}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => openMediaLibrary('image')}
                    className="adm-btn adm-btn-secondary"
                    style={{ fontSize: 11, padding: '5px 10px' }}
                  >
                    <FolderOpen size={12} /> Media Library
                  </button>
                  {currentMedia.image && (
                    <button
                      type="button"
                      onClick={() => updateField('image', '')}
                      className="adm-btn adm-btn-secondary"
                      style={{ fontSize: 11, padding: '5px 10px', color: '#f87171' }}
                    >
                      <Trash2 size={12} /> Remove
                    </button>
                  )}
                </div>
              </div>

              {/* Direct URL Input */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 10 }}>
                <div>
                  <label className="adm-label" style={{ fontSize: 11 }}>Image URL / File Path</label>
                  <input
                    type="text"
                    value={currentMedia.image || ''}
                    placeholder="/media/..."
                    onChange={(e) => updateField('image', e.target.value)}
                    className="adm-input"
                    style={{ fontSize: 12, padding: '7px 10px' }}
                  />
                </div>
                {allowAlt && (
                  <div>
                    <label className="adm-label" style={{ fontSize: 11 }}>Image Alt Text (SEO & Accessibility)</label>
                    <input
                      type="text"
                      value={currentMedia.alt || ''}
                      placeholder="e.g. Master tailor crafting luxury heavyweight garments"
                      onChange={(e) => updateField('alt', e.target.value)}
                      className="adm-input"
                      style={{ fontSize: 12, padding: '7px 10px' }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. VIDEO TAB */}
      {activeTab === 'video' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: 16, alignItems: 'start' }}>
            {/* Video Player Preview */}
            <div style={{
              width: 180,
              height: 140,
              background: '#0a0b0d',
              border: '1px solid #262c36',
              borderRadius: 4,
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}>
              {currentMedia.video ? (
                <video
                  src={currentMedia.video}
                  poster={currentMedia.poster || currentMedia.image}
                  muted
                  loop
                  controls
                  playsInline
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div style={{ textAlign: 'center', color: '#5d6775', padding: 10 }}>
                  <Film size={28} style={{ margin: '0 auto 6px' }} />
                  <span style={{ fontSize: 11, display: 'block' }}>No Video Configured</span>
                </div>
              )}
            </div>

            {/* Video Controls */}
            <div>
              {/* Drag & Drop Zone */}
              <div
                onDragOver={(e) => { e.preventDefault(); setDragActiveVideo(true); }}
                onDragLeave={() => setDragActiveVideo(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragActiveVideo(false);
                  if (e.dataTransfer.files?.[0]) handleUploadFile(e.dataTransfer.files[0], 'video');
                }}
                style={{
                  border: `2px dashed ${dragActiveVideo ? '#ffffff' : '#303642'}`,
                  background: dragActiveVideo ? 'rgba(255,255,255,0.05)' : '#101216',
                  borderRadius: 6,
                  padding: '16px 20px',
                  textAlign: 'center',
                  marginBottom: 12,
                  transition: 'all .2s ease'
                }}
              >
                <Film size={18} style={{ color: '#8b949e', marginBottom: 6 }} />
                <div style={{ fontSize: 12, color: '#f0f3f6', fontWeight: 600 }}>
                  [ DRAG VIDEO HERE ]
                </div>
                <div style={{ fontSize: 11, color: '#8b949e', marginTop: 2 }}>
                  Supports MP4, WEBM, MOV &middot; Up to 100MB
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 10 }}>
                  <label className="adm-btn adm-btn-secondary" style={{ fontSize: 11, padding: '5px 10px', cursor: 'pointer' }}>
                    <Upload size={12} /> Upload Video
                    <input
                      type="file"
                      accept="video/mp4,video/webm,video/quicktime"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        if (e.target.files?.[0]) handleUploadFile(e.target.files[0], 'video');
                      }}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => openMediaLibrary('video')}
                    className="adm-btn adm-btn-secondary"
                    style={{ fontSize: 11, padding: '5px 10px' }}
                  >
                    <FolderOpen size={12} /> Media Library
                  </button>
                  {currentMedia.video && (
                    <button
                      type="button"
                      onClick={() => updateField('video', '')}
                      className="adm-btn adm-btn-secondary"
                      style={{ fontSize: 11, padding: '5px 10px', color: '#f87171' }}
                    >
                      <Trash2 size={12} /> Remove
                    </button>
                  )}
                </div>
              </div>

              {/* Video URL & Optional Poster */}
              <div style={{ display: 'grid', gridTemplateColumns: allowPoster ? '1fr 1fr' : '1fr', gap: 10 }}>
                <div>
                  <label className="adm-label" style={{ fontSize: 11 }}>Video URL / File Path</label>
                  <input
                    type="text"
                    value={currentMedia.video || ''}
                    placeholder="/media/... (or .mp4 URL)"
                    onChange={(e) => updateField('video', e.target.value)}
                    className="adm-input"
                    style={{ fontSize: 12, padding: '7px 10px' }}
                  />
                </div>
                {allowPoster && (
                  <div>
                    <label className="adm-label" style={{ fontSize: 11 }}>Optional Video Poster Image</label>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <input
                        type="text"
                        value={currentMedia.poster || ''}
                        placeholder="Fallback to image if empty"
                        onChange={(e) => updateField('poster', e.target.value)}
                        className="adm-input"
                        style={{ fontSize: 12, padding: '7px 10px' }}
                      />
                      <button
                        type="button"
                        onClick={() => openMediaLibrary('poster')}
                        className="adm-btn adm-btn-secondary"
                        style={{ padding: '7px 10px', flexShrink: 0 }}
                        title="Pick poster image"
                      >
                        <FolderOpen size={13} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. SETTINGS: MEDIA MODE & BEHAVIOUR */}
      {activeTab === 'settings' && (
        <div>
          {/* Desktop Media Display Mode */}
          <div style={{ marginBottom: 20 }}>
            <label className="adm-label" style={{ fontSize: 12, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Monitor size={14} /> MEDIA DISPLAY MODE
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 8 }}>
              {MODES.map((m) => {
                const isSelected = (currentMedia.mode || 'image_only').toLowerCase() === m.id;
                return (
                  <div
                    key={m.id}
                    onClick={() => updateField('mode', m.id)}
                    style={{
                      background: isSelected ? 'rgba(255,255,255,0.08)' : '#0d0f12',
                      border: `1px solid ${isSelected ? '#ffffff' : '#262c36'}`,
                      borderRadius: 4,
                      padding: '10px 12px',
                      cursor: 'pointer',
                      transition: 'all .15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: isSelected ? '#ffffff' : '#c9d1d9' }}>
                        {m.label}
                      </span>
                      <div style={{
                        width: 14,
                        height: 14,
                        borderRadius: '50%',
                        border: `1px solid ${isSelected ? '#ffffff' : '#5d6775'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {isSelected && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ffffff' }} />}
                      </div>
                    </div>
                    <p style={{ fontSize: 11, color: '#8b949e', marginTop: 4, lineHeight: 1.4 }}>
                      {m.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mobile Media Behaviour */}
          <div>
            <label className="adm-label" style={{ fontSize: 12, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Smartphone size={14} /> MOBILE MEDIA BEHAVIOUR
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 8 }}>
              {MOBILE_BEHAVIOURS.map((mb) => {
                const isSelected = (currentMedia.mobileMode || 'image_only').toLowerCase() === mb.id;
                return (
                  <div
                    key={mb.id}
                    onClick={() => updateField('mobileMode', mb.id)}
                    style={{
                      background: isSelected ? 'rgba(255,255,255,0.08)' : '#0d0f12',
                      border: `1px solid ${isSelected ? '#ffffff' : '#262c36'}`,
                      borderRadius: 4,
                      padding: '10px 12px',
                      cursor: 'pointer',
                      transition: 'all .15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 11.5, fontWeight: 700, color: isSelected ? '#ffffff' : '#c9d1d9' }}>
                        {mb.label}
                      </span>
                      <div style={{
                        width: 14,
                        height: 14,
                        borderRadius: '50%',
                        border: `1px solid ${isSelected ? '#ffffff' : '#5d6775'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {isSelected && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ffffff' }} />}
                      </div>
                    </div>
                    <p style={{ fontSize: 11, color: '#8b949e', marginTop: 4, lineHeight: 1.4 }}>
                      {mb.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 4. LIVE PREVIEW TAB */}
      {activeTab === 'preview' && (
        <div style={{ textAlign: 'center', padding: '10px 0' }}>
          <p style={{ fontSize: 12, color: '#8b949e', marginBottom: 12 }}>
            Hover or interact with the preview below to inspect configured behaviour:
          </p>
          <div style={{
            maxWidth: 340,
            aspectRatio: '16/10',
            margin: '0 auto',
            borderRadius: 4,
            overflow: 'hidden',
            border: '1px solid #303642',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
          }}>
            <UniversalMedia
              media={currentMedia}
              alt={currentMedia.alt || label}
              overlayScrim={true}
            />
          </div>
          <div style={{ marginTop: 10, fontSize: 11, color: '#8b949e' }}>
            Current Mode: <strong style={{ color: '#ffffff' }}>{currentMedia.mode || 'image_only'}</strong> &middot; Mobile: <strong style={{ color: '#ffffff' }}>{currentMedia.mobileMode || 'image_only'}</strong>
          </div>
        </div>
      )}

      {/* Media Library Picker Modal */}
      {libraryModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.85)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20
        }}>
          <div style={{
            maxWidth: 720,
            width: '100%',
            maxHeight: '85vh',
            background: '#15181c',
            border: '1px solid #303642',
            borderRadius: 8,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid #262c36',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#f0f3f6' }}>
                  Select {libraryTargetField.toUpperCase()} from Media Library
                </h3>
                <span style={{ fontSize: 11, color: '#8b949e' }}>Click any asset to assign to this section</span>
              </div>
              <button
                type="button"
                onClick={() => setLibraryModalOpen(false)}
                className="adm-btn adm-btn-secondary"
                style={{ padding: '6px 10px' }}
              >
                <X size={14} />
              </button>
            </div>

            {/* Filter Tabs */}
            <div style={{ display: 'flex', gap: 6, padding: '12px 20px', borderBottom: '1px solid #262c36' }}>
              <button
                type="button"
                onClick={() => setLibraryFilter('all')}
                className={`adm-tab ${libraryFilter === 'all' ? 'active' : ''}`}
                style={{ fontSize: 11, padding: '4px 10px' }}
              >
                All Assets
              </button>
              <button
                type="button"
                onClick={() => setLibraryFilter('images')}
                className={`adm-tab ${libraryFilter === 'images' ? 'active' : ''}`}
                style={{ fontSize: 11, padding: '4px 10px' }}
              >
                Images Only
              </button>
              <button
                type="button"
                onClick={() => setLibraryFilter('videos')}
                className={`adm-tab ${libraryFilter === 'videos' ? 'active' : ''}`}
                style={{ fontSize: 11, padding: '4px 10px' }}
              >
                Videos Only
              </button>
            </div>

            {/* Grid */}
            <div style={{ padding: 20, overflowY: 'auto', flex: 1 }}>
              {libraryLoading ? (
                <div style={{ textAlign: 'center', padding: 40, color: '#8b949e' }}>Loading library assets...</div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 12 }}>
                  {libraryMedia
                    .filter(m => {
                      const isVid = m.isVideo || m.type === 'video' || m.url?.endsWith('.mp4') || m.url?.endsWith('.webm');
                      if (libraryFilter === 'videos') return isVid;
                      if (libraryFilter === 'images') return !isVid;
                      return true;
                    })
                    .map((item) => {
                      const isVid = item.isVideo || item.type === 'video' || item.url?.endsWith('.mp4') || item.url?.endsWith('.webm');
                      return (
                        <div
                          key={item.id || item.url}
                          onClick={() => handleSelectFromLibrary(item)}
                          style={{
                            background: '#0d0f12',
                            border: '1px solid #262c36',
                            borderRadius: 4,
                            overflow: 'hidden',
                            cursor: 'pointer',
                            transition: 'all .15s ease'
                          }}
                          className="adm-lib-picker-item"
                        >
                          <div style={{ aspectRatio: '1/1', position: 'relative', background: '#000' }}>
                            {isVid ? (
                              <video
                                src={item.url}
                                muted
                                playsInline
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                            ) : (
                              <img
                                src={item.url}
                                alt={item.alt || item.filename}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                            )}
                            <span style={{
                              position: 'absolute',
                              top: 4,
                              left: 4,
                              background: 'rgba(0,0,0,0.7)',
                              color: '#fff',
                              fontSize: 9,
                              padding: '2px 5px',
                              borderRadius: 2,
                              fontWeight: 700
                            }}>
                              {isVid ? 'VIDEO' : 'IMAGE'}
                            </span>
                          </div>
                          <div style={{ padding: '6px 8px', fontSize: 10, color: '#c9d1d9', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {item.filename || item.url}
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
