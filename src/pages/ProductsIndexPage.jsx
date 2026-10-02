import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIES } from '../data/categoriesData';
import { PRODUCTS } from '../data/productsData';
import ProductCard from '../components/ProductCard';
import { ArrowRight } from 'lucide-react';
import { useCms } from '../context/CmsContext';
import SEOHead from '../components/SEOHead';

export default function ProductsIndexPage() {
  const { products: cmsProducts, categories: cmsCategories, content } = useCms();
  const allProducts = cmsProducts && cmsProducts.length > 0 ? cmsProducts : PRODUCTS;
  const [selectedCategory, setSelectedCategory] = useState('all');

  const activeCategories = (cmsCategories && cmsCategories.length > 0 ? cmsCategories : CATEGORIES).map(cat => {
    const cmsCat = content?.homepage?.categories?.[cat.slug] || content?.home?.categories?.[cat.slug];
    return {
      ...cat,
      image: cmsCat?.image || cat.image
    };
  });

  const filteredProducts = selectedCategory === 'all'
    ? allProducts
    : allProducts.filter(p => p.category === selectedCategory);

  return (
    <div style={{ paddingTop: 'var(--nav-h)' }}>
      <SEOHead />
      {/* Editorial Header */}
      <section className="section" style={{ paddingBottom: 40 }}>
        <div className="wrap">
          <p className="eyebrow">MANUFACTURING CATALOGUE</p>
          <h1 style={{ fontSize: 'clamp(36px, 5.5vw, 68px)', marginTop: 18 }}>
            ALL PRODUCT DIVISIONS.
          </h1>
          <p style={{ color: 'var(--gray-dark)', fontSize: 17, maxWidth: 640, marginTop: 18, lineHeight: 1.6 }}>
            Explore our five core production divisions: Streetwear, Contemporary Fashion Wear, Handcrafted Leather Goods, Technical Medical Apparel, and Wholesale Blanks.
          </p>

          {/* Category Filter Chips */}
          <div 
            style={{
              display: 'flex',
              gap: 8,
              marginTop: 40,
              flexWrap: 'wrap',
              borderBottom: '1px solid var(--line-light)',
              paddingBottom: 20
            }}
          >
            <button
              onClick={() => setSelectedCategory('all')}
              style={{
                padding: '10px 20px',
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: '.06em',
                textTransform: 'uppercase',
                border: '1px solid var(--line-light)',
                background: selectedCategory === 'all' ? 'var(--black)' : 'transparent',
                color: selectedCategory === 'all' ? 'var(--white)' : 'var(--black)',
                transition: 'all .25s ease'
              }}
            >
              All Categories ({allProducts.length})
            </button>

            {activeCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                style={{
                  padding: '10px 20px',
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: '.06em',
                  textTransform: 'uppercase',
                  border: '1px solid var(--line-light)',
                  background: selectedCategory === cat.slug ? 'var(--black)' : 'transparent',
                  color: selectedCategory === cat.slug ? 'var(--white)' : 'var(--black)',
                  transition: 'all .25s ease'
                }}
              >
                {cat.title}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Category Overview Cards when 'all' is selected */}
      {selectedCategory === 'all' && (
        <section style={{ padding: '20px 0 60px' }}>
          <div className="wrap">
            <h2 style={{ fontSize: 20, letterSpacing: '.14em', textTransform: 'uppercase', marginBottom: 24, color: 'var(--gray-dark)' }}>
              FIVE CORE SECTORS
            </h2>
            <div 
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gap: 16
              }}
              className="cat-index-grid"
            >
              {CATEGORIES.map((cat, idx) => (
                <Link
                  key={cat.id}
                  to={`/products/${cat.slug}`}
                  style={{
                    position: 'relative',
                    aspectRatio: '3/4',
                    borderRadius: 2,
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    padding: 20,
                    color: 'var(--white)',
                    background: 'var(--charcoal)'
                  }}
                  className="cat-ind-card"
                >
                  <img 
                    src={cat.image} 
                    alt={cat.title} 
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.6s ease'
                    }}
                    className="cat-ind-img"
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0) 30%, rgba(0,0,0,0.85) 100%)' }} />
                  <div style={{ position: 'relative', zIndex: 2 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.14em', color: 'var(--gray)' }}>
                      0{idx + 1}
                    </span>
                    <h3 style={{ fontSize: 18, marginTop: 4 }}>{cat.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <style>{`
            @media (max-width: 1024px) {
              .cat-index-grid {
                grid-template-columns: repeat(3, 1fr) !important;
              }
            }
            @media (max-width: 640px) {
              .cat-index-grid {
                grid-template-columns: repeat(2, 1fr) !important;
              }
            }
            .cat-ind-card:hover .cat-ind-img {
              transform: scale(1.08);
            }
          `}</style>
        </section>
      )}

      {/* Product Items Grid */}
      <section className="section section-off">
        <div className="wrap">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 36 }}>
            <h2 style={{ fontSize: 24, letterSpacing: '-.01em' }}>
              {selectedCategory === 'all' ? 'FEATURED PRODUCT SPECIFICATIONS' : `${selectedCategory.toUpperCase()} STYLES`}
            </h2>
            <span style={{ fontSize: 13, color: 'var(--gray-dark)' }}>
              Showing {filteredProducts.length} items
            </span>
          </div>

          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 26
            }}
            className="products-list-grid"
          >
            {filteredProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          <div style={{ marginTop: 60, padding: 40, background: 'var(--black)', color: 'var(--white)', borderRadius: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
            <div>
              <h3 style={{ fontSize: 24 }}>NEED A BESPOKE SILHOUETTE NOT LISTED HERE?</h3>
              <p style={{ color: 'var(--gray)', fontSize: 14, marginTop: 6 }}>
                We develop custom cut-and-sew patterns for any garment type from sketches or physical reference samples.
              </p>
            </div>
            <Link to="/contact" className="btn btn-primary" style={{ background: 'var(--white)', color: 'var(--black)' }}>
              Send Tech Pack / Mockup <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        <style>{`
          @media (max-width: 960px) {
            .products-list-grid {
              grid-template-columns: repeat(2, 1fr) !important;
            }
          }
          @media (max-width: 580px) {
            .products-list-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </section>
    </div>
  );
}
