import React, { useState } from 'react';
import { Plus, Trash2, Image as ImageIcon } from 'lucide-react';

export default function VariantEditor({ variants = [], onChange, defaultImage }) {
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#111111');
  const [newImage, setNewImage] = useState('');

  const handleAddVariant = () => {
    if (!newColorName.trim()) return;

    const variant = {
      id: `var_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      colorName: newColorName.trim(),
      colorHex: newColorHex || '#111111',
      image: newImage.trim() || defaultImage || '/media/products/streetwear-hoodies.jpg',
      sku: `GTT-${newColorName.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8)}`
    };

    onChange([...variants, variant]);
    setNewColorName('');
    setNewColorHex('#111111');
    setNewImage('');
  };

  const handleRemoveVariant = (id) => {
    onChange(variants.filter(v => v.id !== id));
  };

  const handleUpdateVariant = (id, field, value) => {
    onChange(variants.map(v => v.id === id ? { ...v, [field]: value } : v));
  };

  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <label className="adm-label" style={{ marginBottom: 0 }}>
          Color Variants &amp; Google ProductGroup Items ({variants.length})
        </label>
        <span style={{ fontSize: 11, color: 'var(--adm-text-dim)' }}>
          Single product with multiple apparel colorways
        </span>
      </div>

      {/* Existing Variants Table */}
      {variants.length > 0 ? (
        <div className="adm-table-wrap" style={{ marginBottom: 16 }}>
          <table className="adm-table">
            <thead>
              <tr>
                <th>Swatch</th>
                <th>Color Name</th>
                <th>Hex Code</th>
                <th>Variant Image URL</th>
                <th>SKU</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {variants.map((v) => (
                <tr key={v.id}>
                  <td style={{ width: 44 }}>
                    <div style={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      background: v.colorHex || '#111111',
                      border: '1px solid var(--adm-border-light)'
                    }} />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={v.colorName}
                      onChange={(e) => handleUpdateVariant(v.id, 'colorName', e.target.value)}
                      className="adm-input"
                      style={{ padding: '6px 8px', fontSize: 12 }}
                    />
                  </td>
                  <td style={{ width: 110 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <input
                        type="color"
                        value={v.colorHex || '#111111'}
                        onChange={(e) => handleUpdateVariant(v.id, 'colorHex', e.target.value)}
                        style={{ width: 26, height: 26, border: 'none', background: 'none', cursor: 'pointer' }}
                      />
                      <input
                        type="text"
                        value={v.colorHex || '#111111'}
                        onChange={(e) => handleUpdateVariant(v.id, 'colorHex', e.target.value)}
                        className="adm-input"
                        style={{ padding: '6px 8px', fontSize: 11, fontFamily: 'var(--adm-mono)' }}
                      />
                    </div>
                  </td>
                  <td>
                    <input
                      type="text"
                      value={v.image || ''}
                      onChange={(e) => handleUpdateVariant(v.id, 'image', e.target.value)}
                      placeholder="/media/products/..."
                      className="adm-input"
                      style={{ padding: '6px 8px', fontSize: 12 }}
                    />
                  </td>
                  <td style={{ width: 110 }}>
                    <input
                      type="text"
                      value={v.sku || ''}
                      onChange={(e) => handleUpdateVariant(v.id, 'sku', e.target.value)}
                      className="adm-input"
                      style={{ padding: '6px 8px', fontSize: 11, fontFamily: 'var(--adm-mono)' }}
                    />
                  </td>
                  <td style={{ width: 40, textAlign: 'right' }}>
                    <button
                      type="button"
                      onClick={() => handleRemoveVariant(v.id)}
                      className="adm-btn adm-btn-danger adm-btn-icon adm-btn-sm"
                      title="Remove variant"
                    >
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{
          padding: 16,
          background: 'var(--adm-surface-alt)',
          border: '1px dashed var(--adm-border)',
          borderRadius: 'var(--adm-radius)',
          color: 'var(--adm-text-dim)',
          fontSize: 12,
          textAlign: 'center',
          marginBottom: 16
        }}>
          No specific variants defined yet. Add colorways below.
        </div>
      )}

      {/* Add Variant Inputs */}
      <div style={{
        background: 'var(--adm-surface-alt)',
        border: '1px solid var(--adm-border)',
        borderRadius: 'var(--adm-radius)',
        padding: 12,
        display: 'grid',
        gridTemplateColumns: '1.2fr 110px 1.5fr auto',
        gap: 10,
        alignItems: 'center'
      }}>
        <input
          type="text"
          placeholder="New Color (e.g. Washed Charcoal)"
          value={newColorName}
          onChange={(e) => setNewColorName(e.target.value)}
          className="adm-input"
          style={{ padding: '8px 10px', fontSize: 12 }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <input
            type="color"
            value={newColorHex}
            onChange={(e) => setNewColorHex(e.target.value)}
            style={{ width: 28, height: 28, border: 'none', background: 'none', cursor: 'pointer' }}
          />
          <input
            type="text"
            value={newColorHex}
            onChange={(e) => setNewColorHex(e.target.value)}
            className="adm-input"
            style={{ padding: '6px 8px', fontSize: 11, fontFamily: 'var(--adm-mono)' }}
          />
        </div>
        <input
          type="text"
          placeholder="Color Image URL (Optional)"
          value={newImage}
          onChange={(e) => setNewImage(e.target.value)}
          className="adm-input"
          style={{ padding: '8px 10px', fontSize: 12 }}
        />
        <button
          type="button"
          onClick={handleAddVariant}
          disabled={!newColorName.trim()}
          className="adm-btn adm-btn-primary adm-btn-sm"
        >
          <Plus size={13} /> Add Colorway
        </button>
      </div>
    </div>
  );
}
