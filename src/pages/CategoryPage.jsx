import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CATEGORIES } from '../data/categoriesData';
import { PRODUCTS } from '../data/productsData';
import ProductCard from '../components/ProductCard';
import { ArrowRight, Check, Sparkles } from 'lucide-react';
import { useCms } from '../context/CmsContext';
import SEOHead from '../components/SEOHead';

export default function CategoryPage() {
  const { category: categorySlug } = useParams();
  const { products: cmsProducts, categories: cmsCategories, content } = useCms();
  const [selectedType, setSelectedType] = useState('all');

  const baseCategories = cmsCategories && cmsCategories.length > 0 ? cmsCategories : CATEGORIES;
  const rawCat = baseCategories.find(c => c.slug === categorySlug || (c.aliases && c.aliases.includes(categorySlug))) || baseCategories[0];
  const cmsOverrideImage = content?.homepage?.categories?.[rawCat.slug]?.image || content?.home?.categories?.[rawCat.slug]?.image;
  const category = {
    ...rawCat,
    image: cmsOverrideImage || rawCat.image
  };

  const allProducts = cmsProducts && cmsProducts.length > 0 ? cmsProducts : PRODUCTS;
  const categoryProducts = allProducts.filter(p => 
    p.category === category.slug || 
    p.category === category.id || 
    (category.slug === 'street-fashion' && (p.category === 'streetwear' || p.category === 'fashion-wear'))
  );
  const filteredProducts = selectedType === 'all'
    ? categoryProducts
    : categoryProducts.filter(p => p.type.toLowerCase().includes(selectedType.toLowerCase()));

  return (
    <div style={{ paddingTop: 'var(--nav-h)' }}>
      <SEOHead 
        title={`${category.title} Apparel & Manufacturing | Global Thunder Trade`}
        description={category.description}
        ogImage={category.image}
      />
      {/* Category Hero */}
      <section className="section section-dark" style={{ position: 'relative', overflow: 'hidden' }}>
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.2,
            backgroundImage: `url(${category.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'grayscale(1)'
          }}
        />
        <div className="wrap" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <Link to="/products" style={{ color: 'var(--gray)', fontSize: 12, letterSpacing: '.1em', textTransform: 'uppercase' }}>
              Products &rarr;
            </Link>
            <span style={{ color: 'var(--white)', fontSize: 12, letterSpacing: '.1em', textTransform: 'uppercase' }}>
              {category.title}
            </span>
          </div>

          <h1 style={{ fontSize: 'clamp(38px, 6vw, 76px)', maxWidth: 900 }}>
            {category.title}
          </h1>

          <p style={{ fontSize: 18, color: 'var(--white)', marginTop: 14, fontWeight: 600, letterSpacing: '-.01em', maxWidth: 720 }}>
            {category.subtitle}
          </p>

          <p style={{ color: 'var(--gray)', fontSize: 16, maxWidth: 660, marginTop: 16, lineHeight: 1.65 }}>
            {category.description}
          </p>

          <div style={{ display: 'flex', gap: 16, marginTop: 36, flexWrap: 'wrap' }}>
            <Link to="/contact" className="btn btn-primary">
              Send Your Mockup <ArrowRight size={14} />
            </Link>
            <Link to="/blanks" className="btn btn-ghost">
              Browse Wholesale Blanks
            </Link>
          </div>
        </div>
      </section>

      {/* Product Types Filter Strip */}
      <section style={{ background: 'var(--off-white)', borderBottom: '1px solid var(--line-light)', padding: '24px 0' }}>
        <div className="wrap">
          <div style={{ fontSize: 11, letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--gray-dark)', fontWeight: 800, marginBottom: 14 }}>
            PRODUCT TYPES UNDER {category.title}
          </div>

          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 6, scrollbarWidth: 'none' }}>
            <button
              onClick={() => setSelectedType('all')}
              style={{
                flex: '0 0 auto',
                padding: '8px 18px',
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: '.04em',
                textTransform: 'uppercase',
                border: '1px solid var(--line-light)',
                background: selectedType === 'all' ? 'var(--black)' : 'var(--white)',
                color: selectedType === 'all' ? 'var(--white)' : 'var(--black)',
                transition: 'all .25s ease'
              }}
            >
              All {category.title} ({categoryProducts.length})
            </button>

            {category.productTypes.map((pt) => (
              <button
                key={pt}
                onClick={() => setSelectedType(pt)}
                style={{
                  flex: '0 0 auto',
                  padding: '8px 18px',
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: '.04em',
                  textTransform: 'uppercase',
                  border: '1px solid var(--line-light)',
                  background: selectedType === pt ? 'var(--black)' : 'var(--white)',
                  color: selectedType === pt ? 'var(--white)' : 'var(--black)',
                  transition: 'all .25s ease'
                }}
              >
                {pt}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="section">
        <div className="wrap">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
            <div>
              <span style={{ fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--gray-dark)', fontWeight: 700 }}>
                {category.title.toUpperCase()} SPECIFICATIONS
              </span>
              <h2 style={{ fontSize: 28, marginTop: 4 }}>
                {selectedType === 'all' ? 'AVAILABLE STYLES & SILHOUETTES' : `${selectedType.toUpperCase()}`}
              </h2>
            </div>
            <span style={{ fontSize: 13, color: 'var(--gray-dark)' }}>
              Showing {filteredProducts.length} specifications
            </span>
          </div>

          {filteredProducts.length > 0 ? (
            <div 
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 26
              }}
              className="cat-products-grid"
            >
              {filteredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div style={{ padding: '60px 40px', background: 'var(--off-white)', textAlign: 'center', borderRadius: 2 }}>
              <h3 style={{ fontSize: 20 }}>SPECIFICATION COMING SOON</h3>
              <p style={{ color: 'var(--gray-dark)', marginTop: 8, maxWidth: 500, margin: '8px auto 20px' }}>
                We manufacture custom {selectedType} on demand. Send your tech pack or mockup to start sampling right away.
              </p>
              <Link to="/contact" className="btn btn-primary">
                Send Mockup for {selectedType} <ArrowRight size={14} />
              </Link>
            </div>
          )}

          {/* Customization & Manufacturing Capabilities Bar */}
          <div 
            style={{
              marginTop: 80,
              padding: 44,
              border: '1px solid var(--line-light)',
              background: 'var(--off-white)',
              borderRadius: 2
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <Sparkles size={16} />
              <span style={{ fontSize: 11, letterSpacing: '.18em', textTransform: 'uppercase', fontWeight: 800 }}>
                CUSTOMIZATION CAPABILITIES FOR {category.title}
              </span>
            </div>
            <h3 style={{ fontSize: 24, marginBottom: 20 }}>
              TAILORED CUT-AND-SEW MANUFACTURING
            </h3>
            <div 
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 24
              }}
              className="cat-perks-grid"
            >
              <div>
                <h4 style={{ fontSize: 14, textTransform: 'uppercase', fontWeight: 800 }}>Bespoke Pattern Grading</h4>
                <p style={{ fontSize: 13.5, color: 'var(--gray-dark)', marginTop: 6, lineHeight: 1.5 }}>
                  Develop graded size curves from XS to 3XL calibrated to your target audience.
                </p>
              </div>
              <div>
                <h4 style={{ fontSize: 14, textTransform: 'uppercase', fontWeight: 800 }}>Custom Fabric Milling</h4>
                <p style={{ fontSize: 13.5, color: 'var(--gray-dark)', marginTop: 6, lineHeight: 1.5 }}>
                  Custom dyed to your target Pantone TCX color with pre-shrunk anti-pilling finishes.
                </p>
              </div>
              <div>
                <h4 style={{ fontSize: 14, textTransform: 'uppercase', fontWeight: 800 }}>Full Trim Integration</h4>
                <p style={{ fontSize: 13.5, color: 'var(--gray-dark)', marginTop: 6, lineHeight: 1.5 }}>
                  Woven neck labels, metal zippers, custom aglets, and branded frosted polybags.
                </p>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 960px) {
            .cat-products-grid {
              grid-template-columns: repeat(2, 1fr) !important;
            }
            .cat-perks-grid {
              grid-template-columns: 1fr !important;
            }
          }
          @media (max-width: 580px) {
            .cat-products-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </section>
    </div>
  );
}
