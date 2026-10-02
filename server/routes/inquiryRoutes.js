import nodemailer from 'nodemailer';
import { getDb, saveDb } from '../db/cmsStorage.js';
import { requireAuth } from '../auth.js';

// Simple in-memory IP rate limiter: max 15 submissions per 10 minutes
const ipRateLimits = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000;
  const entry = ipRateLimits.get(ip) || { count: 0, resetAt: now + windowMs };

  if (now > entry.resetAt) {
    entry.count = 1;
    entry.resetAt = now + windowMs;
    ipRateLimits.set(ip, entry);
    return false;
  }

  entry.count++;
  ipRateLimits.set(ip, entry);
  return entry.count > 15;
}

export function handleInquiryRoutes(req, res, url, body) {
  const db = getDb();

  // 1. POST /api/inquiries — Public lead submission
  if (req.method === 'POST' && (url === '/api/inquiries' || url === '/api/contact' || url === '/api/send-product-idea')) {
    const clientIp = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
    if (isRateLimited(clientIp)) {
      res.writeHead(429, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Too many requests. Please wait a few minutes before submitting again.' }));
      return true;
    }

    const data = body || {};
    const {
      name,
      fullName,
      email,
      company,
      companyName,
      country,
      phone,
      message,
      type = 'contact_form',
      configuration,
      estimatedCost,
      estimatedTotal,
      quantity,
      selectedProduct
    } = data;

    const contactName = (fullName || name || '').trim();
    const contactEmail = (email || '').trim();

    if (!contactName) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Your name is required.' }));
      return true;
    }

    if (!contactEmail || !contactEmail.includes('@')) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'A valid email address is required.' }));
      return true;
    }

    const submissionId = `inq_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const timestamp = new Date().toISOString();

    const inquiryRecord = {
      id: submissionId,
      type: type || 'contact_form',
      status: 'unread',
      createdAt: timestamp,
      name: contactName,
      email: contactEmail,
      company: (company || companyName || 'Not specified').trim(),
      country: (country || 'Not specified').trim(),
      phone: (phone || '').trim(),
      message: (message || '').trim(),
      product: selectedProduct || configuration?.product?.name || data.product || 'N/A',
      quantity: quantity || configuration?.quantity || 'N/A',
      estimatedCost: estimatedCost || null,
      estimatedTotal: estimatedTotal || null,
      configuration: configuration || null,
      rawPayload: data
    };

    db.inquiries = [inquiryRecord, ...(db.inquiries || [])];
    saveDb(db);

    // Attempt SMTP dispatch if configured
    const hasSmtp = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
    const destinationEmail = process.env.GTT_CONTACT_EMAIL || 'globalthundertrade@gmail.com';

    if (hasSmtp) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT || '587', 10),
          secure: process.env.SMTP_SECURE === 'true',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
          }
        });

        const subjectTag = type === 'cost_calculator' ? 'CALCULATOR ESTIMATE & QUOTE REQUEST' :
                           type === 'supplier_application' ? 'SUPPLIER APPLICATION' :
                           type === 'product_idea' ? 'NEW PRODUCT IDEA PROMPT' : 'NEW WEBSITE INQUIRY';

        const mailText = `
GLOBAL THUNDER TRADE — ${subjectTag}
Reference ID: ${submissionId}
Date: ${timestamp}

============================================================
CONTACT INFORMATION
============================================================
Name:    ${contactName}
Email:   ${contactEmail}
Company: ${inquiryRecord.company}
Country: ${inquiryRecord.country}
Phone:   ${inquiryRecord.phone || 'N/A'}

============================================================
SPECIFICATIONS & MESSAGE
============================================================
Product:  ${inquiryRecord.product}
Quantity: ${inquiryRecord.quantity}
${inquiryRecord.estimatedTotal ? `Estimated Total: $${inquiryRecord.estimatedTotal} ($${inquiryRecord.estimatedCost}/unit)` : ''}

Message:
${inquiryRecord.message || 'No additional message provided.'}

${configuration ? `
============================================================
CONFIGURATION DETAILS
============================================================
${JSON.stringify(configuration, null, 2)}
` : ''}

Reply directly to this email to contact ${contactName} (${contactEmail}).
`;

        transporter.sendMail({
          from: `"GTT System" <${process.env.SMTP_USER}>`,
          to: destinationEmail,
          replyTo: contactEmail,
          subject: `[GTT] ${subjectTag} — ${contactName} (${inquiryRecord.company})`,
          text: mailText
        }).catch(err => console.error('[GTT Email] SMTP dispatch error:', err));
      } catch (smtpErr) {
        console.error('[GTT Email] SMTP setup error:', smtpErr);
      }
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      inquiryId: submissionId,
      message: "Thank you. Your inquiry has been received by Global Thunder Trade and our production team will review it."
    }));
    return true;
  }

  // 2. GET /api/cms/inquiries — Admin list inquiries
  if (req.method === 'GET' && url.startsWith('/api/cms/inquiries')) {
    requireAuth(req, res, () => {
      const urlObj = new URL(req.url, 'http://localhost');
      const status = urlObj.searchParams.get('status');
      const type = urlObj.searchParams.get('type');

      let list = db.inquiries || [];

      if (status) {
        list = list.filter(i => i.status === status);
      }
      if (type) {
        list = list.filter(i => i.type === type);
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        total: list.length,
        unreadCount: (db.inquiries || []).filter(i => i.status === 'unread').length,
        inquiries: list
      }));
    });
    return true;
  }

  // 3. PATCH /api/cms/inquiries/:id or /api/cms/inquiries/:id/status — Mark read, unread, archive
  const statusMatch = url.match(/^\/api\/cms\/inquiries\/([a-zA-Z0-9_-]+)(?:\/status)?$/);
  if (req.method === 'PATCH' && statusMatch) {
    requireAuth(req, res, async () => {
      const inquiryId = statusMatch[1];
      const inquiry = (db.inquiries || []).find(i => i.id === inquiryId);

      if (!inquiry) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Inquiry not found.' }));
        return;
      }

      const validStatuses = ['unread', 'read', 'archived'];
      const newStatus = body?.status;
      if (!validStatuses.includes(newStatus)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid status. Must be unread, read, or archived.' }));
        return;
      }

      inquiry.status = newStatus;
      inquiry.updatedAt = new Date().toISOString();

      await saveDb(db);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, status: newStatus }));
    });
    return true;
  }

  // 4. DELETE /api/cms/inquiries/:id — Delete inquiry
  const deleteMatch = url.match(/^\/api\/cms\/inquiries\/([a-zA-Z0-9_-]+)$/);
  if (req.method === 'DELETE' && deleteMatch) {
    requireAuth(req, res, async () => {
      const inquiryId = deleteMatch[1];
      db.inquiries = (db.inquiries || []).filter(i => i.id !== inquiryId);

      await saveDb(db);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, message: 'Inquiry deleted.' }));
    });
    return true;
  }

  return false;
}
