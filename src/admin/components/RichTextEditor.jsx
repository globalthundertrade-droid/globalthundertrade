import React, { useState, useRef } from 'react';
import {
  Heading1,
  Heading2,
  Heading3,
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Image as ImageIcon,
  Table as TableIcon,
  Eye,
  Code
} from 'lucide-react';

export default function RichTextEditor({ value = '', onChange, label = 'Article Body Content' }) {
  const [activeTab, setActiveTab] = useState('editor'); // 'editor' | 'preview'
  const textareaRef = useRef(null);

  const insertText = (before, after = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = textarea.value.substring(start, end);
    const replacement = before + (selected || 'sample text') + after;

    const newValue = textarea.value.substring(0, start) + replacement + textarea.value.substring(end);
    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + (selected.length || 11));
    }, 10);
  };

  const insertTable = () => {
    const tableTemplate = `\n| Specification | Details | Production Tolerance |\n| :--- | :--- | :--- |\n| Fabric Composition | 100% Combed Cotton | ± 2% |\n| GSM Fabric Weight | 460 GSM Heavyweight | ± 10 GSM |\n| Shrinkage Tolerance | Pre-shrunk silicone washed | < 3% |\n\n`;
    insertText(tableTemplate, '');
  };

  return (
    <div className="adm-form-group">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <label className="adm-label" style={{ marginBottom: 0 }}>{label}</label>
        <div style={{ display: 'flex', gap: 4 }}>
          <button
            type="button"
            onClick={() => setActiveTab('editor')}
            className={`adm-btn adm-btn-sm ${activeTab === 'editor' ? 'adm-btn-primary' : 'adm-btn-secondary'}`}
          >
            <Code size={12} /> Write
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`adm-btn adm-btn-sm ${activeTab === 'preview' ? 'adm-btn-primary' : 'adm-btn-secondary'}`}
          >
            <Eye size={12} /> Preview
          </button>
        </div>
      </div>

      <div style={{ border: '1px solid var(--adm-border)', borderRadius: 'var(--adm-radius)', overflow: 'hidden' }}>
        {/* Formatting Toolbar */}
        <div style={{
          background: 'var(--adm-surface-alt)',
          borderBottom: '1px solid var(--adm-border)',
          padding: '6px 10px',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          flexWrap: 'wrap'
        }}>
          <button
            type="button"
            onClick={() => insertText('\n# ', '\n')}
            title="Heading 1"
            className="adm-btn adm-btn-secondary adm-btn-icon adm-btn-sm"
          >
            <Heading1 size={14} />
          </button>
          <button
            type="button"
            onClick={() => insertText('\n## ', '\n')}
            title="Heading 2"
            className="adm-btn adm-btn-secondary adm-btn-icon adm-btn-sm"
          >
            <Heading2 size={14} />
          </button>
          <button
            type="button"
            onClick={() => insertText('\n### ', '\n')}
            title="Heading 3"
            className="adm-btn adm-btn-secondary adm-btn-icon adm-btn-sm"
          >
            <Heading3 size={14} />
          </button>

          <div style={{ width: 1, height: 16, background: 'var(--adm-border)', margin: '0 4px' }} />

          <button
            type="button"
            onClick={() => insertText('**', '**')}
            title="Bold"
            className="adm-btn adm-btn-secondary adm-btn-icon adm-btn-sm"
          >
            <Bold size={14} />
          </button>
          <button
            type="button"
            onClick={() => insertText('*', '*')}
            title="Italic"
            className="adm-btn adm-btn-secondary adm-btn-icon adm-btn-sm"
          >
            <Italic size={14} />
          </button>

          <div style={{ width: 1, height: 16, background: 'var(--adm-border)', margin: '0 4px' }} />

          <button
            type="button"
            onClick={() => insertText('\n- ', '\n')}
            title="Bulleted List"
            className="adm-btn adm-btn-secondary adm-btn-icon adm-btn-sm"
          >
            <List size={14} />
          </button>
          <button
            type="button"
            onClick={() => insertText('\n1. ', '\n')}
            title="Numbered List"
            className="adm-btn adm-btn-secondary adm-btn-icon adm-btn-sm"
          >
            <ListOrdered size={14} />
          </button>
          <button
            type="button"
            onClick={() => insertText('\n> ', '\n')}
            title="Blockquote"
            className="adm-btn adm-btn-secondary adm-btn-icon adm-btn-sm"
          >
            <Quote size={14} />
          </button>

          <div style={{ width: 1, height: 16, background: 'var(--adm-border)', margin: '0 4px' }} />

          <button
            type="button"
            onClick={() => insertText('[', '](https://globalthundertrade.com)')}
            title="Insert Link"
            className="adm-btn adm-btn-secondary adm-btn-icon adm-btn-sm"
          >
            <LinkIcon size={14} />
          </button>
          <button
            type="button"
            onClick={() => insertText('![Image Alt Text](', '/media/home/idea-to-market/05-manufacturing.jpg)')}
            title="Insert Image"
            className="adm-btn adm-btn-secondary adm-btn-icon adm-btn-sm"
          >
            <ImageIcon size={14} />
          </button>
          <button
            type="button"
            onClick={insertTable}
            title="Insert Specification Table"
            className="adm-btn adm-btn-secondary adm-btn-icon adm-btn-sm"
          >
            <TableIcon size={14} />
          </button>
        </div>

        {/* Editor Body */}
        {activeTab === 'editor' ? (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="adm-textarea"
            style={{
              minHeight: 280,
              border: 'none',
              borderRadius: 0,
              fontFamily: 'var(--adm-mono)',
              fontSize: 13,
              lineHeight: 1.6
            }}
            placeholder="Write article content using headings, paragraphs, bullet points, and specification tables..."
          />
        ) : (
          <div style={{
            minHeight: 280,
            padding: 24,
            background: 'var(--adm-bg)',
            overflowY: 'auto',
            fontSize: 14,
            lineHeight: 1.7
          }}>
            {value ? (
              <div style={{ whiteSpace: 'pre-wrap' }}>
                {value}
              </div>
            ) : (
              <p style={{ color: 'var(--adm-text-dim)', fontStyle: 'italic' }}>
                No content entered yet. Switch back to Write mode to draft the article.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
