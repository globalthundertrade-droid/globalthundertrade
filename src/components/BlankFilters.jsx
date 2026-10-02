import React, { useState } from 'react';
import { SlidersHorizontal, X, Check, RotateCcw } from 'lucide-react';

export default function BlankFilters({
  filters,
  onFilterChange,
  onClearFilters,
  availableOptions,
  filteredCount,
  totalCount
}) {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Check if any filter is active
  const hasActiveFilters = Boolean(
    (filters.category && filters.category !== 'ALL') ||
    filters.color ||
    filters.fit ||
    filters.fabric ||
    filters.gsm
  );

  return (
    <div className="blanks-filter-bar-container">
      {/* Desktop Filter Ribbon */}
      <div className="blanks-filter-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--gray-dark)' }}>
            Showing {filteredCount} of {totalCount} Blanks
          </span>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onClearFilters}
              className="blanks-clear-btn"
            >
              Clear All Filters
            </button>
          )}
        </div>

        {/* Desktop Dropdowns */}
        <div className="blanks-filter-dropdowns">
          {/* Color Filter */}
          {availableOptions.colors?.length > 0 && (
            <select
              aria-label="Filter by Colour"
              value={filters.color || ''}
              onChange={(e) => onFilterChange('color', e.target.value)}
              className="blanks-filter-select"
            >
              <option value="">COLOUR: ALL</option>
              {availableOptions.colors.map((c) => (
                <option key={c} value={c}>{c.toUpperCase()}</option>
              ))}
            </select>
          )}

          {/* Fit Filter */}
          {availableOptions.fits?.length > 0 && (
            <select
              aria-label="Filter by Fit"
              value={filters.fit || ''}
              onChange={(e) => onFilterChange('fit', e.target.value)}
              className="blanks-filter-select"
            >
              <option value="">FIT: ALL</option>
              {availableOptions.fits.map((f) => (
                <option key={f} value={f}>{f.toUpperCase()}</option>
              ))}
            </select>
          )}

          {/* Fabric Filter */}
          {availableOptions.fabrics?.length > 0 && (
            <select
              aria-label="Filter by Fabric"
              value={filters.fabric || ''}
              onChange={(e) => onFilterChange('fabric', e.target.value)}
              className="blanks-filter-select"
            >
              <option value="">FABRIC: ALL</option>
              {availableOptions.fabrics.map((fab) => (
                <option key={fab} value={fab}>{fab.toUpperCase()}</option>
              ))}
            </select>
          )}

          {/* GSM Filter */}
          {availableOptions.gsms?.length > 0 && (
            <select
              aria-label="Filter by GSM"
              value={filters.gsm || ''}
              onChange={(e) => onFilterChange('gsm', e.target.value)}
              className="blanks-filter-select"
            >
              <option value="">GSM: ALL</option>
              {availableOptions.gsms.map((g) => (
                <option key={g} value={g}>{g.toUpperCase()}</option>
              ))}
            </select>
          )}
        </div>

        {/* Mobile Filter Button */}
        <button
          type="button"
          onClick={() => setMobileDrawerOpen(true)}
          className="blanks-mobile-filter-trigger"
          aria-label="Open filter settings"
        >
          <SlidersHorizontal size={14} />
          <span>Filters {hasActiveFilters ? '• Active' : ''}</span>
        </button>
      </div>

      {/* Mobile Drawer Modal */}
      {mobileDrawerOpen && (
        <div className="blanks-filter-drawer-overlay" onClick={() => setMobileDrawerOpen(false)}>
          <div
            className="blanks-filter-drawer"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Filter options"
          >
            <div className="blanks-drawer-header">
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-.02em' }}>
                  Filter Blanks
                </h3>
                <span style={{ fontSize: 11, color: 'var(--gray-dark)', fontWeight: 600 }}>
                  {filteredCount} silhouettes available
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                style={{ padding: 8, cursor: 'pointer' }}
                aria-label="Close filters"
              >
                <X size={20} />
              </button>
            </div>

            <div className="blanks-drawer-body">
              {/* Colour */}
              {availableOptions.colors?.length > 0 && (
                <div>
                  <label style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--gray-dark)', display: 'block', marginBottom: 8 }}>
                    Available Colours
                  </label>
                  <select
                    value={filters.color || ''}
                    onChange={(e) => onFilterChange('color', e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--line-light)', borderRadius: 2, fontSize: 13, fontWeight: 600 }}
                  >
                    <option value="">All Colours</option>
                    {availableOptions.colors.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Fit */}
              {availableOptions.fits?.length > 0 && (
                <div>
                  <label style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--gray-dark)', display: 'block', marginBottom: 8 }}>
                    Fit Profile
                  </label>
                  <select
                    value={filters.fit || ''}
                    onChange={(e) => onFilterChange('fit', e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--line-light)', borderRadius: 2, fontSize: 13, fontWeight: 600 }}
                  >
                    <option value="">All Fits</option>
                    {availableOptions.fits.map(f => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Fabric */}
              {availableOptions.fabrics?.length > 0 && (
                <div>
                  <label style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--gray-dark)', display: 'block', marginBottom: 8 }}>
                    Fabric Composition
                  </label>
                  <select
                    value={filters.fabric || ''}
                    onChange={(e) => onFilterChange('fabric', e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--line-light)', borderRadius: 2, fontSize: 13, fontWeight: 600 }}
                  >
                    <option value="">All Fabrics</option>
                    {availableOptions.fabrics.map(fab => (
                      <option key={fab} value={fab}>{fab}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* GSM */}
              {availableOptions.gsms?.length > 0 && (
                <div>
                  <label style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--gray-dark)', display: 'block', marginBottom: 8 }}>
                    GSM / Fabric Weight
                  </label>
                  <select
                    value={filters.gsm || ''}
                    onChange={(e) => onFilterChange('gsm', e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--line-light)', borderRadius: 2, fontSize: 13, fontWeight: 600 }}
                  >
                    <option value="">All GSM Weights</option>
                    {availableOptions.gsms.map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="blanks-drawer-footer">
              <button
                type="button"
                onClick={() => {
                  onClearFilters();
                }}
                className="btn btn-ghost"
                style={{ flex: 1, justifyContent: 'center' }}
              >
                Clear Filters
              </button>
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                className="btn btn-primary"
                style={{ flex: 1, justifyContent: 'center' }}
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
