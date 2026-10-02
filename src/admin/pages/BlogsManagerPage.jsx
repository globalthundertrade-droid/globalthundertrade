import React, { useState, useEffect } from 'react';
import RichTextEditor from '../components/RichTextEditor';
import UniversalMediaControl from '../components/UniversalMediaControl';
import {
  Plus,
  Search,
  Edit,
  Copy,
  Trash2,
  Check,
  AlertCircle,
  X,
  BookOpen,
  Eye,
  EyeOff,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { broadcastCmsUpdate } from '../../context/CmsContext';

const BLOG_CATEGORIES = [
  'Clothing Manufacturing',
  'Product Development',
  'Fabrics & GSM',
  'Clothing Business',
  'Streetwear',
  'Customization',
  'Apparel Sourcing'
];

export default function BlogsManagerPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, [selectedCategory]);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('gtt_admin_token');
      const params = new URLSearchParams();
      if (selectedCategory) params.append('category', selectedCategory);

      const res = await fetch(`/api/cms/blogs?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setBlogs(data.blogs || []);
      }
    } catch (err) {
      console.error('[Blogs Fetch Error]', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingBlog({
      title: '',
      slug: '',
      metaTitle: '',
      metaDescription: '',
      primaryKeyword: '',
      secondaryKeywords: [],
      category: 'Clothing Manufacturing',
      author: 'GTT Technical Editorial Team',
      date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      readTime: '7 min read',
      image: '/media/home/idea-to-market/05-manufacturing.jpg',
      video: '',
      mediaMode: 'image_only',
      mobileMediaMode: 'image_only',
      imageAlt: '',
      excerpt: '',
      shortAnswer: '',
      contentHtml: '',
      status: 'published',
      faqs: [
        { question: 'What is the standard production turnaround time?', answer: 'Typical bulk cut-and-sew production requires 3–4 weeks following pre-production sample approval.' }
      ]
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (blog) => {
    setEditingBlog({
      ...blog,
      video: blog.video || blog.featuredVideo || '',
      mediaMode: blog.mediaMode || (blog.video ? 'video_fallback' : 'image_only'),
      mobileMediaMode: blog.mobileMediaMode || 'image_only',
      faqs: Array.isArray(blog.faqs) ? blog.faqs : [],
      secondaryKeywords: Array.isArray(blog.secondaryKeywords) ? blog.secondaryKeywords : []
    });
    setModalOpen(true);
  };

  const handleSaveBlog = async (e) => {
    e.preventDefault();
    if (!editingBlog.title.trim()) return;

    setSaving(true);
    setMessage(null);

    try {
      const token = localStorage.getItem('gtt_admin_token');
      const isEdit = Boolean(editingBlog.id);
      const url = isEdit ? `/api/cms/blogs/${editingBlog.id}` : '/api/cms/blogs';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editingBlog)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save blog post.');

      setMessage({ type: 'success', text: `Article '${editingBlog.title}' saved successfully!` });
      setModalOpen(false);
      broadcastCmsUpdate();
      fetchBlogs();
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleDuplicate = async (blogId) => {
    try {
      const token = localStorage.getItem('gtt_admin_token');
      const res = await fetch(`/api/cms/blogs/${blogId}/duplicate`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        broadcastCmsUpdate();
        fetchBlogs();
      }
    } catch (err) {
      console.error('[Duplicate Error]', err);
    }
  };

  const handleToggleStatus = async (blog) => {
    const nextStatus = blog.status === 'published' ? 'draft' : 'published';
    try {
      const token = localStorage.getItem('gtt_admin_token');
      const res = await fetch(`/api/cms/blogs/${blog.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: nextStatus })
      });
      if (res.ok) {
        setBlogs(prev => prev.map(b => b.id === blog.id ? { ...b, status: nextStatus } : b));
        broadcastCmsUpdate();
      }
    } catch (err) {
      console.error('[Status Toggle Error]', err);
    }
  };

  const handleDelete = async (blogId) => {
    if (!window.confirm('Delete this article permanently?')) return;
    try {
      const token = localStorage.getItem('gtt_admin_token');
      const res = await fetch(`/api/cms/blogs/${blogId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setBlogs(prev => prev.filter(b => b.id !== blogId));
        broadcastCmsUpdate();
      }
    } catch (err) {
      console.error('[Delete Error]', err);
    }
  };

  const handleAddFaq = () => {
    setEditingBlog(prev => ({
      ...prev,
      faqs: [...(prev.faqs || []), { question: '', answer: '' }]
    }));
  };

  const handleUpdateFaq = (index, field, value) => {
    const updated = [...(editingBlog.faqs || [])];
    updated[index][field] = value;
    setEditingBlog(prev => ({ ...prev, faqs: updated }));
  };

  const handleRemoveFaq = (index) => {
    setEditingBlog(prev => ({
      ...prev,
      faqs: (prev.faqs || []).filter((_, i) => i !== index)
    }));
  };

  const filteredBlogs = blogs.filter(b => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (b.title && b.title.toLowerCase().includes(q)) ||
           (b.excerpt && b.excerpt.toLowerCase().includes(q)) ||
           (b.category && b.category.toLowerCase().includes(q));
  });

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700 }}>The GTT Journal &middot; Blog CMS</h1>
          <p style={{ color: 'var(--adm-text-muted)', fontSize: 13, marginTop: 4 }}>
            Publish authoritative apparel manufacturing guides, AEO direct answers, and FAQ schema data.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAdd}
          className="adm-btn adm-btn-primary"
        >
          <Plus size={14} /> <span>Create New Article</span>
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
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 240 }}>
          <input
            type="text"
            placeholder="Search articles by title, topic, or keyword..."
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
          style={{ width: 220 }}
        >
          <option value="">All Topics</option>
          {BLOG_CATEGORIES.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Articles Table */}
      {loading ? (
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--adm-text-dim)' }}>Loading articles...</div>
      ) : filteredBlogs.length > 0 ? (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th style={{ width: 60 }}>Cover</th>
                <th>Article Title &amp; Focus</th>
                <th>Topic Category</th>
                <th>Read Time</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBlogs.map((b) => (
                <tr key={b.id}>
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
                        src={b.image || '/media/home/idea-to-market/05-manufacturing.jpg'}
                        alt={b.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, fontSize: 13.5 }}>{b.title}</div>
                    <div style={{ color: 'var(--adm-text-dim)', fontSize: 11, marginTop: 2 }}>
                      {b.primaryKeyword ? `Key: ${b.primaryKeyword} · ` : ''}{b.date}
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
                      {b.category}
                    </span>
                  </td>
                  <td style={{ color: 'var(--adm-text-muted)', fontSize: 12 }}>{b.readTime || '6 min'}</td>
                  <td>
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(b)}
                      className={`adm-badge ${b.status === 'published' ? 'adm-badge-success' : 'adm-badge-muted'}`}
                      style={{ cursor: 'pointer', border: 'none' }}
                      title="Click to toggle publish status"
                    >
                      {b.status === 'published' ? <Eye size={11} /> : <EyeOff size={11} />}
                      <span>{b.status}</span>
                    </button>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(b)}
                        className="adm-btn adm-btn-secondary adm-btn-icon adm-btn-sm"
                        title="Edit article"
                      >
                        <Edit size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDuplicate(b.id)}
                        className="adm-btn adm-btn-secondary adm-btn-icon adm-btn-sm"
                        title="Duplicate article"
                      >
                        <Copy size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(b.id)}
                        className="adm-btn adm-btn-danger adm-btn-icon adm-btn-sm"
                        title="Delete article"
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
          <BookOpen size={32} style={{ color: 'var(--adm-text-dim)', margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: 16, fontWeight: 700 }}>No articles found</h3>
        </div>
      )}

      {/* Edit / Create Modal */}
      {modalOpen && editingBlog && (
        <div className="adm-modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) setModalOpen(false); }}>
          <div className="adm-modal" style={{ maxWidth: 900 }}>
            <div className="adm-modal-header">
              <h2 style={{ fontSize: 16, fontWeight: 700 }}>
                {editingBlog.id ? `Edit Guide: ${editingBlog.title}` : 'Draft New Journal Guide'}
              </h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="adm-btn adm-btn-secondary adm-btn-icon adm-btn-sm"
              >
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleSaveBlog}>
              <div className="adm-modal-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 16 }}>
                  <div className="adm-form-group">
                    <label className="adm-label">Article Headline *</label>
                    <input
                      type="text"
                      required
                      value={editingBlog.title}
                      onChange={(e) => setEditingBlog({ ...editingBlog, title: e.target.value })}
                      className="adm-input"
                    />
                  </div>

                  <div className="adm-form-group">
                    <label className="adm-label">URL Slug</label>
                    <input
                      type="text"
                      value={editingBlog.slug || ''}
                      onChange={(e) => setEditingBlog({ ...editingBlog, slug: e.target.value })}
                      className="adm-input"
                      style={{ fontFamily: 'var(--adm-mono)', fontSize: 12 }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                  <div className="adm-form-group">
                    <label className="adm-label">Topic Category</label>
                    <select
                      value={editingBlog.category}
                      onChange={(e) => setEditingBlog({ ...editingBlog, category: e.target.value })}
                      className="adm-select"
                    >
                      {BLOG_CATEGORIES.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div className="adm-form-group">
                    <label className="adm-label">Primary Target Keyword</label>
                    <input
                      type="text"
                      value={editingBlog.primaryKeyword || ''}
                      onChange={(e) => setEditingBlog({ ...editingBlog, primaryKeyword: e.target.value })}
                      placeholder="e.g. clothing manufacturers"
                      className="adm-input"
                    />
                  </div>

                  <div className="adm-form-group">
                    <label className="adm-label">Publication Status</label>
                    <select
                      value={editingBlog.status}
                      onChange={(e) => setEditingBlog({ ...editingBlog, status: e.target.value })}
                      className="adm-select"
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft (Hidden)</option>
                    </select>
                  </div>
                </div>

                <div className="adm-form-group">
                  <label className="adm-label">Executive Excerpt (Meta Description Fallback)</label>
                  <textarea
                    rows={2}
                    value={editingBlog.excerpt || ''}
                    onChange={(e) => setEditingBlog({ ...editingBlog, excerpt: e.target.value })}
                    className="adm-textarea"
                  />
                </div>

                <div className="adm-form-group">
                  <label className="adm-label">
                    AEO Direct Answer (Highlighted Direct Definition for Answer Engines)
                  </label>
                  <textarea
                    rows={2}
                    value={editingBlog.shortAnswer || ''}
                    onChange={(e) => setEditingBlog({ ...editingBlog, shortAnswer: e.target.value })}
                    placeholder="Short answer: Concise 1-2 sentence direct response for Google AI Overviews / Answer Engines."
                    className="adm-textarea"
                  />
                </div>

                {/* Article Featured Visual Media (Image & Video) */}
                <div style={{ marginBottom: 16 }}>
                  <UniversalMediaControl
                    label="Article Featured Visual Media (Image & Video)"
                    description="Configure cover photography, featured header video, or technical demonstration."
                    media={{
                      image: editingBlog.image,
                      video: editingBlog.video,
                      mode: editingBlog.mediaMode || (editingBlog.video ? 'video_fallback' : 'image_only'),
                      mobileMode: editingBlog.mobileMediaMode || 'image_only',
                      poster: editingBlog.image,
                      alt: editingBlog.imageAlt || editingBlog.title
                    }}
                    onChange={(m) => {
                      setEditingBlog(prev => ({
                        ...prev,
                        image: m.image,
                        video: m.video,
                        mediaMode: m.mode,
                        mobileMediaMode: m.mobileMode,
                        imageAlt: m.alt
                      }));
                    }}
                    sectionKey="blogs"
                    slotKey={`blog-${editingBlog.id || 'new'}`}
                  />
                </div>

                {/* Rich Text Editor */}
                <RichTextEditor
                  label="Article Body Content (Markdown / Rich Headings & Tables)"
                  value={editingBlog.contentHtml || ''}
                  onChange={(val) => setEditingBlog({ ...editingBlog, contentHtml: val })}
                />

                {/* Structured FAQs Accordion Section */}
                <div style={{ marginTop: 24, borderTop: '1px solid var(--adm-border)', paddingTop: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <label className="adm-label" style={{ marginBottom: 0 }}>
                      Visible FAQ Section &amp; Schema Generator ({editingBlog.faqs?.length || 0})
                    </label>
                    <button
                      type="button"
                      onClick={handleAddFaq}
                      className="adm-btn adm-btn-secondary adm-btn-sm"
                    >
                      <Plus size={12} /> Add FAQ Item
                    </button>
                  </div>

                  {(editingBlog.faqs || []).map((faq, idx) => (
                    <div key={idx} style={{
                      background: 'var(--adm-surface-alt)',
                      border: '1px solid var(--adm-border)',
                      borderRadius: 4,
                      padding: 12,
                      marginBottom: 10
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--adm-primary)' }}>FAQ #{idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFaq(idx)}
                          className="adm-btn adm-btn-danger adm-btn-icon adm-btn-sm"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                      <input
                        type="text"
                        placeholder="Question (e.g. How does sampling work?)"
                        value={faq.question}
                        onChange={(e) => handleUpdateFaq(idx, 'question', e.target.value)}
                        className="adm-input"
                        style={{ marginBottom: 6, fontSize: 12 }}
                      />
                      <textarea
                        rows={2}
                        placeholder="Accepted Answer for customers and Schema..."
                        value={faq.answer}
                        onChange={(e) => handleUpdateFaq(idx, 'answer', e.target.value)}
                        className="adm-textarea"
                        style={{ minHeight: 60, fontSize: 12 }}
                      />
                    </div>
                  ))}
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
                  {saving ? 'Publishing Guide...' : 'Save Guide to Knowledge Base'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
