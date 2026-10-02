import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BLOG_POSTS } from '../data/blogData';
import BlogCard from '../components/BlogCard';
import SafeImage from '../components/SafeImage';
import UniversalMedia from '../components/UniversalMedia';
import SEOHead from '../components/SEOHead';
import { 
  ArrowLeft, 
  ArrowRight, 
  Calendar, 
  Clock, 
  User, 
  ListOrdered, 
  CheckCircle2, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp,
  ShieldCheck,
  Share2
} from 'lucide-react';
import { useCms } from '../context/CmsContext';

export default function BlogPostPage() {
  const { slug } = useParams();
  const { blogs: cmsBlogs } = useCms();
  const allPosts = cmsBlogs && cmsBlogs.length > 0 ? cmsBlogs : BLOG_POSTS;
  const post = allPosts.find(p => p.slug === slug || p.id === slug);
  const [openFaq, setOpenFaq] = useState(null);
  const [copied, setCopied] = useState(false);

  // If post not found, render 404 state
  if (!post) {
    return (
      <div style={{ paddingTop: 'var(--nav-h)' }}>
        <SEOHead 
          title="Article Not Found | The GTT Journal"
          description="The requested apparel manufacturing guide could not be located in our archive."
        />
        <section className="section" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
          <div className="wrap" style={{ textAlign: 'center', maxWidth: 600 }}>
            <h1 style={{ fontSize: 36, marginBottom: 16 }}>ARTICLE NOT FOUND</h1>
            <p style={{ color: 'var(--gray-dark)', fontSize: 16, marginBottom: 30 }}>
              The educational guide you are looking for has moved or is currently being updated by our editorial team.
            </p>
            <Link to="/blog" className="btn btn-primary">
              <ArrowLeft size={14} /> Back to The GTT Journal
            </Link>
          </div>
        </section>
      </div>
    );
  }

  // Related posts
  const relatedPosts = (post.relatedSlugs || [])
    .map(rSlug => allPosts.find(p => p.slug === rSlug))
    .filter(Boolean)
    .slice(0, 3);

  // Fallback to other posts if relatedSlugs has fewer than 3
  const finalRelated = relatedPosts.length >= 3 
    ? relatedPosts 
    : [
        ...relatedPosts,
        ...allPosts.filter(p => p.id !== post.id && !relatedPosts.some(rp => rp.id === p.id))
      ].slice(0, 3);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div style={{ paddingTop: 'var(--nav-h)' }}>
      {/* Dynamic SEO & Schema Injection */}
      <SEOHead 
        title={post.metaTitle || post.title}
        description={post.metaDescription || post.excerpt}
        canonicalUrl={`https://globalthundertrade.com/blog/${post.slug}`}
        ogType="article"
        ogImage={post.image}
        article={{
          publishedTime: '2026-09-01T08:00:00+00:00',
          modifiedTime: '2026-09-16T08:00:00+00:00',
          author: post.author,
          tags: post.secondaryKeywords,
          section: post.category
        }}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'The GTT Journal', url: '/blog' },
          { name: post.title, url: `/blog/${post.slug}` }
        ]}
        faqs={post.faqs}
      />

      {/* Breadcrumb Bar */}
      <nav 
        aria-label="Breadcrumb"
        style={{ 
          background: 'var(--off-white)', 
          borderBottom: '1px solid var(--line-light)', 
          padding: '14px 0' 
        }}
      >
        <div className="wrap" style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, textTransform: 'uppercase', color: 'var(--gray-dark)', flexWrap: 'wrap' }}>
          <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
          <span style={{ opacity: 0.5 }}>/</span>
          <Link to="/blog" style={{ color: 'inherit', textDecoration: 'none' }}>The GTT Journal</Link>
          <span style={{ opacity: 0.5 }}>/</span>
          <span style={{ color: 'var(--black)', fontWeight: 700, maxWidth: 360, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {post.title}
          </span>
        </div>
      </nav>

      {/* Main Article Container */}
      <article className="section" style={{ padding: '50px 0 90px' }}>
        <div className="wrap" style={{ maxWidth: 880 }}>
          
          {/* Top Actions */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 14 }}>
            <Link 
              to="/blog" 
              style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: 8, 
                fontSize: 12, 
                fontWeight: 700, 
                letterSpacing: '.08em', 
                textTransform: 'uppercase', 
                color: 'var(--gray-dark)',
                textDecoration: 'none'
              }}
            >
              <ArrowLeft size={14} /> Back to All Articles
            </Link>

            <button
              onClick={handleCopyLink}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '.06em',
                textTransform: 'uppercase',
                background: 'var(--off-white)',
                border: '1px solid var(--line-light)',
                padding: '6px 14px',
                borderRadius: 20,
                cursor: 'pointer',
                color: 'var(--black)'
              }}
            >
              <Share2 size={12} /> {copied ? 'Link Copied!' : 'Share Article'}
            </button>
          </div>

          {/* Category & Read Time */}
          <div style={{ marginBottom: 12 }}>
            <span style={{ 
              display: 'inline-block', 
              fontSize: 11, 
              letterSpacing: '.18em', 
              textTransform: 'uppercase', 
              color: 'var(--black)', 
              fontWeight: 800,
              background: 'var(--off-white)',
              border: '1px solid var(--line-light)',
              padding: '4px 12px',
              borderRadius: 3
            }}>
              {post.category} &middot; {post.readTime}
            </span>
          </div>

          {/* H1 Main Title */}
          <h1 style={{ 
            fontSize: 'clamp(32px, 4.4vw, 54px)', 
            letterSpacing: '-.02em', 
            lineHeight: 1.15, 
            marginBottom: 20,
            fontWeight: 800 
          }}>
            {post.title}
          </h1>

          {/* Author & Date Meta */}
          <div style={{ 
            display: 'flex', 
            gap: 20, 
            alignItems: 'center', 
            fontSize: 13, 
            color: 'var(--gray-dark)', 
            borderBottom: '1px solid var(--line-light)', 
            paddingBottom: 22, 
            marginBottom: 34, 
            flexWrap: 'wrap' 
          }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <User size={14} /> {post.author}
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <Calendar size={14} /> {post.date}
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <Clock size={14} /> {post.readTime}
            </span>
          </div>

          {/* AEO / Direct Answer Callout Box */}
          {post.shortAnswer && (
            <div 
              style={{
                background: 'linear-gradient(135deg, rgba(0,0,0,0.03) 0%, rgba(0,0,0,0.06) 100%)',
                borderLeft: '4px solid var(--black)',
                borderTop: '1px solid var(--line-light)',
                borderRight: '1px solid var(--line-light)',
                borderBottom: '1px solid var(--line-light)',
                padding: '24px 28px',
                borderRadius: '0 4px 4px 0',
                marginBottom: 36
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <CheckCircle2 size={16} color="var(--black)" />
                <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--black)' }}>
                  DIRECT ANSWER &middot; KEY TAKEAWAY
                </span>
              </div>
              <p style={{ fontSize: 16, lineHeight: 1.65, color: 'var(--near-black)', margin: 0, fontWeight: 500 }}>
                {post.shortAnswer}
              </p>
            </div>
          )}

          {/* Featured Article Visual Media */}
          <div style={{ 
            aspectRatio: '16/9', 
            overflow: 'hidden', 
            borderRadius: 2, 
            marginBottom: 44, 
            background: 'var(--off-white)',
            border: '1px solid var(--line-light)'
          }}>
            <UniversalMedia 
              media={{
                image: post.image,
                video: post.video,
                mode: post.mediaMode || (post.video ? 'video_fallback' : 'image_only'),
                mobileMode: post.mobileMediaMode || 'image_only',
                poster: post.poster || post.image,
                alt: post.imageAlt || post.title
              }}
              controls={Boolean(post.video)}
              autoPlay={Boolean(post.video)}
              loop={true}
              muted={true}
              objectFit="cover"
              style={{ width: '100%', height: '100%' }} 
            />
          </div>

          {/* Table of Contents */}
          {post.tableOfContents && post.tableOfContents.length > 0 && (
            <div 
              style={{
                background: 'var(--off-white)',
                border: '1px solid var(--line-light)',
                borderRadius: 4,
                padding: '26px 30px',
                marginBottom: 50
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <ListOrdered size={16} color="var(--black)" />
                <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--black)' }}>
                  TABLE OF CONTENTS &middot; JUMP TO SECTION
                </span>
              </div>
              <ol style={{ margin: 0, paddingLeft: 20, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '8px 24px' }}>
                {post.tableOfContents.map((item, idx) => (
                  <li key={item.id || idx} style={{ fontSize: 14, lineHeight: 1.5 }}>
                    <a 
                      href={`#${item.id}`} 
                      style={{ color: 'var(--near-black)', textDecoration: 'none', fontWeight: 600 }}
                      onMouseEnter={(e) => e.target.style.color = 'var(--gray-dark)'}
                      onMouseLeave={(e) => e.target.style.color = 'var(--near-black)'}
                    >
                      {item.title}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Listicle / Rich Text Content Sections */}
          <div className="article-body">
            {post.content && (
              <div 
                className="article-rich-text"
                style={{ 
                  fontSize: 16, 
                  lineHeight: 1.8, 
                  color: 'var(--near-black)', 
                  marginBottom: 48,
                  paddingBottom: 32,
                  borderBottom: post.sections?.length ? '1px solid var(--line-light)' : 'none'
                }}
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            )}
            {post.sections && post.sections.map((section, idx) => (
              <section 
                key={section.id || idx} 
                id={section.id} 
                style={{ 
                  scrollMarginTop: 'calc(var(--nav-h) + 20px)',
                  marginBottom: 56,
                  paddingBottom: 40,
                  borderBottom: '1px solid var(--line-light)'
                }}
              >
                {/* Number & H2 */}
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 12 }}>
                  <span style={{ 
                    fontFamily: 'monospace', 
                    fontSize: 20, 
                    fontWeight: 800, 
                    color: 'var(--gray-dark)',
                    background: 'var(--off-white)',
                    padding: '2px 8px',
                    borderRadius: 2,
                    border: '1px solid var(--line-light)'
                  }}>
                    {section.number || `0${idx + 1}`}
                  </span>
                  <h2 style={{ 
                    fontSize: 'clamp(22px, 2.8vw, 32px)', 
                    lineHeight: 1.25, 
                    fontWeight: 800, 
                    margin: 0,
                    letterSpacing: '-0.01em'
                  }}>
                    {section.heading}
                  </h2>
                </div>

                {/* Summary badge if present */}
                {section.summary && (
                  <div style={{ 
                    fontSize: 14, 
                    fontWeight: 600, 
                    color: 'var(--gray-dark)', 
                    marginBottom: 18, 
                    fontStyle: 'italic' 
                  }}>
                    Key Point: {section.summary}
                  </div>
                )}

                {/* In-depth content paragraphs */}
                <div style={{ fontSize: 17, lineHeight: 1.8, color: 'var(--near-black)', marginBottom: 22 }}>
                  {section.content.split('\n\n').map((paragraph, pIdx) => (
                    <p key={pIdx} style={{ marginBottom: 16 }}>
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* GTT Context Callout / The GTT Standard */}
                {section.gttContext && (
                  <div 
                    style={{
                      background: 'rgba(0,0,0,0.02)',
                      border: '1px solid var(--line-light)',
                      borderRadius: 3,
                      padding: '18px 22px',
                      display: 'flex',
                      gap: 14,
                      alignItems: 'flex-start',
                      marginBottom: 18
                    }}
                  >
                    <ShieldCheck size={18} color="var(--black)" style={{ flexShrink: 0, marginTop: 2 }} />
                    <div>
                      <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.12em', textTransform: 'uppercase', display: 'block', marginBottom: 4, color: 'var(--black)' }}>
                        THE GTT STANDARD
                      </span>
                      <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.6, color: 'var(--gray-dark)' }}>
                        {section.gttContext}
                      </p>
                    </div>
                  </div>
                )}

                {/* Contextual Internal Link */}
                {section.internalLink && (
                  <div>
                    <Link 
                      to={section.internalLink.url}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        fontSize: 13,
                        fontWeight: 700,
                        letterSpacing: '.04em',
                        color: 'var(--black)',
                        textDecoration: 'none',
                        borderBottom: '1px solid var(--black)',
                        paddingBottom: 2
                      }}
                    >
                      {section.internalLink.text} <ArrowRight size={13} />
                    </Link>
                  </div>
                )}
              </section>
            ))}
          </div>

          {/* Article Conclusion */}
          {post.conclusion && (
            <section style={{ margin: '40px 0 60px', padding: '32px 34px', background: 'var(--off-white)', borderRadius: 4, border: '1px solid var(--line-light)' }}>
              <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 14, letterSpacing: '-0.01em' }}>
                Conclusion & Final Thoughts
              </h2>
              <p style={{ fontSize: 16.5, lineHeight: 1.75, color: 'var(--near-black)', margin: 0 }}>
                {post.conclusion}
              </p>
            </section>
          )}

          {/* Frequently Asked Questions (Matches FAQPage JSON-LD) */}
          {post.faqs && post.faqs.length > 0 && (
            <section style={{ margin: '60px 0', borderTop: '2px solid var(--black)', paddingTop: 40 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <HelpCircle size={20} color="var(--black)" />
                <h2 style={{ fontSize: 28, fontWeight: 800, margin: 0, letterSpacing: '-0.01em' }}>
                  Frequently Asked Questions
                </h2>
              </div>
              <p style={{ color: 'var(--gray-dark)', fontSize: 15, marginBottom: 28 }}>
                Common questions from founders and apparel product managers regarding this topic.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {post.faqs.map((faq, fIdx) => {
                  const isOpen = openFaq === fIdx;
                  return (
                    <div 
                      key={fIdx}
                      style={{
                        border: '1px solid var(--line-light)',
                        borderRadius: 3,
                        background: isOpen ? 'var(--off-white)' : 'transparent',
                        transition: 'background .2s ease'
                      }}
                    >
                      <button
                        onClick={() => toggleFaq(fIdx)}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '18px 22px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: 16,
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: 16,
                          fontWeight: 700,
                          color: 'var(--black)',
                          fontFamily: 'inherit'
                        }}
                      >
                        <span>{faq.question}</span>
                        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>

                      {isOpen && (
                        <div style={{ padding: '0 22px 20px', fontSize: 15, lineHeight: 1.7, color: 'var(--gray-dark)' }}>
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Conversion CTA Box */}
          <div 
            style={{
              marginTop: 60,
              padding: '44px 38px',
              background: 'var(--black)',
              color: 'var(--white)',
              borderRadius: 4,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 24
            }}
          >
            <div style={{ maxWidth: 520 }}>
              <span style={{ fontSize: 11, letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--gray)', fontWeight: 700 }}>
                GLOBAL THUNDER TRADE &middot; APPAREL MANUFACTURING
              </span>
              <h3 style={{ fontSize: 'clamp(20px, 2.5vw, 28px)', marginTop: 8, lineHeight: 1.25 }}>
                {post.cta?.heading || "Ready to Discuss Your Upcoming Production?"}
              </h3>
              <p style={{ color: 'var(--gray)', fontSize: 14.5, marginTop: 8, lineHeight: 1.6 }}>
                {post.cta?.body || "Send your tech pack, mockup, or design sketches for feasibility review and prototype quotes."}
              </p>
            </div>
            <Link 
              to={post.cta?.buttonUrl && post.cta.buttonUrl !== '/build-your-product' ? post.cta.buttonUrl : "/contact"} 
              className="btn btn-primary" 
              style={{ background: 'var(--white)', color: 'var(--black)' }}
            >
              {post.cta?.buttonText && post.cta.buttonText !== 'Build Your Product Spec' ? post.cta.buttonText : "Request Manufacturing Quote"} <ArrowRight size={14} />
            </Link>
          </div>

          {/* Related Articles Section */}
          {finalRelated && finalRelated.length > 0 && (
            <section style={{ marginTop: 90, paddingTop: 40, borderTop: '1px solid var(--line-light)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 28 }}>
                <div>
                  <span style={{ fontSize: 11, letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--gray-dark)', fontWeight: 800 }}>
                    FURTHER READING
                  </span>
                  <h3 style={{ fontSize: 24, fontWeight: 800, marginTop: 4 }}>
                    Related Manufacturing Guides
                  </h3>
                </div>
                <Link to="/blog" style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--black)' }}>
                  View All &rarr;
                </Link>
              </div>

              <div 
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: 30
                }}
                className="related-blog-grid"
              >
                {finalRelated.map((relatedPost) => (
                  <BlogCard key={relatedPost.id} post={relatedPost} />
                ))}
              </div>
            </section>
          )}

        </div>

        <style>{`
          @media (max-width: 860px) {
            .related-blog-grid {
              grid-template-columns: repeat(2, 1fr) !important;
            }
          }
          @media (max-width: 580px) {
            .related-blog-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </article>
    </div>
  );
}
