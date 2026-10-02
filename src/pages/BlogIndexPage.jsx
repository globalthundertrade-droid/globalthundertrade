import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BLOG_POSTS, BLOG_CATEGORIES } from '../data/blogData';
import BlogCard from '../components/BlogCard';
import SafeImage from '../components/SafeImage';
import UniversalMedia from '../components/UniversalMedia';
import SEOHead from '../components/SEOHead';
import { ArrowRight, Search, Sparkles } from 'lucide-react';
import { useCms } from '../context/CmsContext';

export default function BlogIndexPage() {
  const { blogs: cmsBlogs } = useCms();
  const allPosts = (cmsBlogs && cmsBlogs.length > 0 ? cmsBlogs : BLOG_POSTS).filter(p => p.status !== 'draft');

  const [selectedCat, setSelectedCat] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = allPosts.filter((post) => {
    const matchesCat = selectedCat === 'All' || post.category.toLowerCase() === selectedCat.toLowerCase();
    const query = searchQuery.trim().toLowerCase();
    if (!query) return matchesCat;

    const matchesSearch = 
      post.title.toLowerCase().includes(query) ||
      post.excerpt.toLowerCase().includes(query) ||
      (post.primaryKeyword && post.primaryKeyword.toLowerCase().includes(query)) ||
      (post.secondaryKeywords && post.secondaryKeywords.some(k => k.toLowerCase().includes(query)));

    return matchesCat && matchesSearch;
  });

  const featured = (!searchQuery && selectedCat === 'All') ? allPosts[0] : null;
  const gridPosts = featured ? filteredPosts.filter(p => p.id !== featured.id) : filteredPosts;

  return (
    <div style={{ paddingTop: 'var(--nav-h)' }}>
      <SEOHead 
        title="The GTT Journal | Apparel Manufacturing & Brand Insights | Global Thunder Trade"
        description="Comprehensive guides on clothing manufacturing, fabric GSM selection, pattern drafting, tech pack preparation, MOQs, and building a fashion brand from Global Thunder Trade."
        canonicalUrl="https://globalthundertrade.com/blog"
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'The GTT Journal', url: '/blog' }
        ]}
      />

      {/* Header */}
      <section className="section section-dark" style={{ padding: '70px 0 60px' }}>
        <div className="wrap">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 20, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', marginBottom: 20 }}>
            <Sparkles size={13} color="var(--white)" />
            <span style={{ fontSize: 11, letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--white)', fontWeight: 700 }}>
              FACTORY JOURNAL &middot; KNOWLEDGE BASE
            </span>
          </div>
          <h1 style={{ fontSize: 'clamp(36px, 5.5vw, 72px)', lineHeight: 1.05, letterSpacing: '-0.02em', margin: '10px 0 18px' }}>
            THE GTT JOURNAL.
          </h1>
          <p style={{ color: 'var(--gray)', fontSize: 17, maxWidth: 680, lineHeight: 1.65 }}>
            Insights on clothing manufacturing, product development, fabrics, branding, and building better fashion products directly from the factory floor.
          </p>
        </div>
      </section>

      {/* Featured Article Hero */}
      {featured && (
        <section style={{ background: 'var(--off-white)', padding: '50px 0', borderBottom: '1px solid var(--line-light)' }}>
          <div className="wrap">
            <span style={{ fontSize: 11, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--gray-dark)', fontWeight: 800 }}>
              FEATURED DISPATCH
            </span>
            <div 
              style={{
                display: 'grid',
                gridTemplateColumns: '1.15fr 0.85fr',
                gap: 50,
                alignItems: 'center',
                marginTop: 20
              }}
              className="featured-blog-grid"
            >
              <div>
                <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--gray-dark)' }}>
                  {featured.category} &middot; {featured.readTime}
                </span>
                <h2 style={{ fontSize: 'clamp(26px, 3.2vw, 42px)', margin: '14px 0 16px', lineHeight: 1.2, fontWeight: 800 }}>
                  <Link to={`/blog/${featured.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                    {featured.title}
                  </Link>
                </h2>
                <p style={{ fontSize: 16, lineHeight: 1.65, color: 'var(--gray-dark)', marginBottom: 26, maxWidth: 580 }}>
                  {featured.excerpt}
                </p>
                <Link to={`/blog/${featured.slug}`} className="btn btn-primary">
                  Read Full Article <ArrowRight size={14} />
                </Link>
              </div>

              <Link to={`/blog/${featured.slug}`} style={{ aspectRatio: '16/10', overflow: 'hidden', borderRadius: 2, display: 'block' }}>
                <UniversalMedia 
                  media={{
                    image: featured.image,
                    video: featured.video,
                    mode: featured.mediaMode || (featured.video ? 'hover_video' : 'image_only'),
                    mobileMode: featured.mobileMediaMode || 'image_only',
                    poster: featured.poster || featured.image,
                    alt: featured.imageAlt || featured.title
                  }}
                  objectFit="cover"
                  style={{ width: '100%', height: '100%' }} 
                />
              </Link>
            </div>
          </div>

          <style>{`
            @media (max-width: 900px) {
              .featured-blog-grid {
                grid-template-columns: 1fr !important;
                gap: 30px !important;
              }
            }
          `}</style>
        </section>
      )}

      {/* Articles Grid & Controls */}
      <section className="section" style={{ padding: '60px 0 100px' }}>
        <div className="wrap">
          {/* Controls Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20, marginBottom: 44, paddingBottom: 24, borderBottom: '1px solid var(--line-light)' }}>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {BLOG_CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedCat(c)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 20,
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: '.04em',
                    textTransform: 'uppercase',
                    border: '1px solid var(--line-light)',
                    background: selectedCat === c ? 'var(--black)' : 'transparent',
                    color: selectedCat === c ? 'var(--white)' : 'var(--black)',
                    cursor: 'pointer',
                    transition: 'all .2s ease'
                  }}
                >
                  {c === 'All' ? 'All Articles' : c}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--off-white)', padding: '8px 16px', borderRadius: 20, border: '1px solid var(--line-light)' }}>
              <Search size={14} color="var(--gray-dark)" />
              <input 
                type="text" 
                placeholder="Search guides, fabrics, terms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  fontSize: 13,
                  fontFamily: 'inherit',
                  width: 200
                }}
              />
            </div>
          </div>

          {/* Results Summary if filtered */}
          {(selectedCat !== 'All' || searchQuery) && (
            <div style={{ marginBottom: 30, fontSize: 13, color: 'var(--gray-dark)' }}>
              Showing {filteredPosts.length} {filteredPosts.length === 1 ? 'article' : 'articles'}
              {selectedCat !== 'All' ? ` in "${selectedCat}"` : ''}
              {searchQuery ? ` matching "${searchQuery}"` : ''}
            </div>
          )}

          {/* Grid */}
          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 40
            }}
            className="blog-full-grid"
          >
            {gridPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div style={{ padding: '80px 20px', textAlign: 'center', color: 'var(--gray-dark)' }}>
              <p style={{ fontSize: 18, marginBottom: 16 }}>No articles found matching your criteria.</p>
              <button 
                onClick={() => { setSelectedCat('All'); setSearchQuery(''); }}
                className="btn btn-secondary"
              >
                Reset Search Filters
              </button>
            </div>
          )}

          {/* Bottom Conversion Callout */}
          <div 
            style={{
              marginTop: 90,
              padding: '48px 40px',
              background: 'var(--black)',
              color: 'var(--white)',
              borderRadius: 3,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 30
            }}
          >
            <div style={{ maxWidth: 640 }}>
              <span style={{ fontSize: 11, letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--gray)', fontWeight: 700 }}>
                FULL-PACKAGE MANUFACTURING &middot; WORLDWIDE DELIVERY
              </span>
              <h3 style={{ fontSize: 'clamp(22px, 3vw, 32px)', marginTop: 8, lineHeight: 1.2 }}>
                Ready to turn your designs into finished garments?
              </h3>
              <p style={{ color: 'var(--gray)', fontSize: 15, marginTop: 10, lineHeight: 1.6 }}>
                From custom fabric knitting and lab-dip dyeing to CAD pattern grading, cut-and-sew, and custom branding, Global Thunder Trade delivers precision across every step.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <Link to="/contact" className="btn btn-primary" style={{ background: 'var(--white)', color: 'var(--black)' }}>
                Start Production <ArrowRight size={14} />
              </Link>
              <Link to="/blanks" className="btn btn-outline-white">
                Wholesale Blanks
              </Link>
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 980px) {
            .blog-full-grid {
              grid-template-columns: repeat(2, 1fr) !important;
            }
          }
          @media (max-width: 640px) {
            .blog-full-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </section>
    </div>
  );
}
