import React, { useState, useEffect } from 'react';
import {
  Inbox,
  Search,
  Filter,
  Eye,
  CheckCircle,
  Archive,
  Trash2,
  X,
  Mail,
  Building,
  Globe,
  Phone,
  Calendar,
  Layers,
  Calculator
} from 'lucide-react';

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  useEffect(() => {
    fetchInquiries();
  }, [statusFilter, typeFilter]);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('gtt_admin_token');
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      if (typeFilter) params.append('type', typeFilter);

      const res = await fetch(`/api/cms/inquiries?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setInquiries(data.inquiries || []);
      }
    } catch (err) {
      console.error('[Inquiries Fetch Error]', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('gtt_admin_token');
      const res = await fetch(`/api/cms/inquiries/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setInquiries(prev => prev.map(i => i.id === id ? { ...i, status: newStatus } : i));
        if (selectedInquiry?.id === id) {
          setSelectedInquiry(prev => ({ ...prev, status: newStatus }));
        }
      }
    } catch (err) {
      console.error('[Status Update Error]', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this inquiry record?')) return;
    try {
      const token = localStorage.getItem('gtt_admin_token');
      const res = await fetch(`/api/cms/inquiries/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setInquiries(prev => prev.filter(i => i.id !== id));
        if (selectedInquiry?.id === id) setSelectedInquiry(null);
      }
    } catch (err) {
      console.error('[Delete Inquiry Error]', err);
    }
  };

  const handleViewDetails = (inquiry) => {
    setSelectedInquiry(inquiry);
    if (inquiry.status === 'unread') {
      handleUpdateStatus(inquiry.id, 'read');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700 }}>Inquiries, Leads &amp; Quote Requests</h1>
          <p style={{ color: 'var(--adm-text-muted)', fontSize: 13, marginTop: 4 }}>
            Submissions captured from Contact Page, Cost Calculator Estimates, Supplier Applications, and Product Prompts.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="adm-select"
          style={{ width: 160 }}
        >
          <option value="">All Statuses</option>
          <option value="unread">Unread</option>
          <option value="read">Read</option>
          <option value="archived">Archived</option>
        </select>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="adm-select"
          style={{ width: 220 }}
        >
          <option value="">All Submission Types</option>
          <option value="contact_form">Contact Form</option>
          <option value="cost_calculator">Cost Calculator Lead</option>
          <option value="quote_request">Quote Request</option>
          <option value="supplier_application">Supplier Application</option>
          <option value="product_idea">Product Idea Prompt</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--adm-text-dim)' }}>Loading inquiries...</div>
      ) : inquiries.length > 0 ? (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th style={{ width: 90 }}>Status</th>
                <th>Sender / Contact</th>
                <th>Company &amp; Country</th>
                <th>Type</th>
                <th>Summary / Product</th>
                <th>Date Received</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map((inq) => (
                <tr key={inq.id} style={{ background: inq.status === 'unread' ? 'rgba(245, 158, 11, 0.04)' : 'transparent' }}>
                  <td>
                    <span className={`adm-badge ${inq.status === 'unread' ? 'adm-badge-warning' : inq.status === 'read' ? 'adm-badge-success' : 'adm-badge-muted'}`}>
                      {inq.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 700 }}>{inq.name || inq.data?.contactInformation?.fullName || 'Anonymous'}</div>
                    <div style={{ fontSize: 11, color: 'var(--adm-text-dim)' }}>{inq.email || inq.data?.contactInformation?.email}</div>
                  </td>
                  <td>
                    <div>{inq.company || inq.data?.contactInformation?.companyName || 'N/A'}</div>
                    <div style={{ fontSize: 11, color: 'var(--adm-text-dim)' }}>{inq.country || inq.data?.contactInformation?.country}</div>
                  </td>
                  <td>
                    <span style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--adm-primary)', fontFamily: 'var(--adm-mono)' }}>
                      {inq.type.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td>
                    <div style={{ maxWidth: 220, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {inq.product || inq.message || inq.data?.businessInformation?.supplierType || 'Inquiry'}
                    </div>
                  </td>
                  <td style={{ fontSize: 11.5, color: 'var(--adm-text-dim)' }}>
                    {new Date(inq.createdAt).toLocaleString()}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      <button
                        type="button"
                        onClick={() => handleViewDetails(inq)}
                        className="adm-btn adm-btn-secondary adm-btn-icon adm-btn-sm"
                        title="View Full Submission"
                      >
                        <Eye size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(inq.id, inq.status === 'archived' ? 'read' : 'archived')}
                        className="adm-btn adm-btn-secondary adm-btn-icon adm-btn-sm"
                        title={inq.status === 'archived' ? 'Unarchive' : 'Archive'}
                      >
                        <Archive size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(inq.id)}
                        className="adm-btn adm-btn-danger adm-btn-icon adm-btn-sm"
                        title="Delete record"
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
          <Inbox size={32} style={{ color: 'var(--adm-text-dim)', margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: 16, fontWeight: 700 }}>No inquiries matched your criteria</h3>
        </div>
      )}

      {/* Detail Modal */}
      {selectedInquiry && (
        <div className="adm-modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) setSelectedInquiry(null); }}>
          <div className="adm-modal" style={{ maxWidth: 700 }}>
            <div className="adm-modal-header">
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 700 }}>Submission Details</h2>
                <span style={{ fontSize: 11, color: 'var(--adm-primary)', textTransform: 'uppercase', fontFamily: 'var(--adm-mono)' }}>
                  {selectedInquiry.type.replace(/_/g, ' ')} &middot; {selectedInquiry.id}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedInquiry(null)}
                className="adm-btn adm-btn-secondary adm-btn-icon adm-btn-sm"
              >
                <X size={15} />
              </button>
            </div>

            <div className="adm-modal-body">
              {/* Contact Information Box */}
              <div style={{
                background: 'var(--adm-surface-alt)',
                border: '1px solid var(--adm-border)',
                borderRadius: 6,
                padding: 16,
                marginBottom: 20
              }}>
                <span style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--adm-text-muted)', marginBottom: 10, textTransform: 'uppercase' }}>
                  Contact Information
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: 13 }}>
                  <div><strong>Name:</strong> {selectedInquiry.name || selectedInquiry.data?.contactInformation?.fullName}</div>
                  <div><strong>Email:</strong> <a href={`mailto:${selectedInquiry.email || selectedInquiry.data?.contactInformation?.email}`} style={{ color: 'var(--adm-primary)' }}>{selectedInquiry.email || selectedInquiry.data?.contactInformation?.email}</a></div>
                  <div><strong>Company:</strong> {selectedInquiry.company || selectedInquiry.data?.contactInformation?.companyName || 'N/A'}</div>
                  <div><strong>Country:</strong> {selectedInquiry.country || selectedInquiry.data?.contactInformation?.country || 'N/A'}</div>
                  {selectedInquiry.phone && <div><strong>Phone:</strong> {selectedInquiry.phone}</div>}
                  <div><strong>Date:</strong> {new Date(selectedInquiry.createdAt).toLocaleString()}</div>
                </div>
              </div>

              {/* Message */}
              {selectedInquiry.message && (
                <div className="adm-form-group">
                  <label className="adm-label">Message / Project Brief</label>
                  <div style={{
                    background: 'var(--adm-bg)',
                    border: '1px solid var(--adm-border)',
                    borderRadius: 4,
                    padding: 14,
                    fontSize: 13,
                    lineHeight: 1.6,
                    whiteSpace: 'pre-wrap'
                  }}>
                    {selectedInquiry.message}
                  </div>
                </div>
              )}

              {/* Cost Calculator Configuration Breakdown */}
              {selectedInquiry.configuration && (
                <div className="adm-form-group">
                  <label className="adm-label">Attached Cost Calculator Configuration</label>
                  <pre style={{
                    background: 'var(--adm-bg)',
                    border: '1px solid var(--adm-border)',
                    borderRadius: 4,
                    padding: 14,
                    fontFamily: 'var(--adm-mono)',
                    fontSize: 12,
                    color: '#34d399',
                    overflowX: 'auto'
                  }}>
                    {JSON.stringify(selectedInquiry.configuration, null, 2)}
                  </pre>
                </div>
              )}

              {/* Supplier Application Data */}
              {selectedInquiry.data?.businessInformation && (
                <div className="adm-form-group">
                  <label className="adm-label">Supplier Specifications</label>
                  <pre style={{
                    background: 'var(--adm-bg)',
                    border: '1px solid var(--adm-border)',
                    borderRadius: 4,
                    padding: 14,
                    fontFamily: 'var(--adm-mono)',
                    fontSize: 12,
                    color: 'var(--adm-text)',
                    overflowX: 'auto'
                  }}>
                    {JSON.stringify(selectedInquiry.data, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            <div className="adm-modal-footer">
              <a
                href={`mailto:${selectedInquiry.email || selectedInquiry.data?.contactInformation?.email}`}
                className="adm-btn adm-btn-primary"
              >
                <Mail size={13} /> Reply via Email
              </a>
              <button
                type="button"
                onClick={() => setSelectedInquiry(null)}
                className="adm-btn adm-btn-secondary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
