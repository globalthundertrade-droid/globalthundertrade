import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import UniversalMedia from './UniversalMedia';

export default function BlogCard({ post }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <article 
      style={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        overflow: 'hidden'
      }}
      className="blog-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link 
        to={`/blog/${post.slug}`}
        style={{
          aspectRatio: '16/10',
          overflow: 'hidden',
          borderRadius: 2,
          marginBottom: 20,
          background: 'var(--off-white)',
          display: 'block'
        }}
      >
        <UniversalMedia 
          media={{
            image: post.image,
            video: post.video,
            mode: post.mediaMode || (post.video ? 'hover_video' : 'image_only'),
            mobileMode: post.mobileMediaMode || 'image_only',
            poster: post.poster || post.image,
            alt: post.imageAlt || post.title
          }}
          isHovered={isHovered}
          objectFit="cover"
          style={{ width: '100%', height: '100%' }}
          className="b-img"
        />
      </Link>

      <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--gray-dark)' }}>
        {post.category} &middot; {post.readTime}
      </span>

      <h3 style={{ fontSize: 20, textTransform: 'none', fontWeight: 800, letterSpacing: '-.01em', margin: '12px 0 10px', lineHeight: 1.3 }}>
        <Link to={`/blog/${post.slug}`} style={{ color: 'inherit' }}>
          {post.title}
        </Link>
      </h3>

      <p style={{ fontSize: 14.5, lineHeight: 1.6, color: 'var(--gray-dark)', marginBottom: 20, flexGrow: 1 }}>
        {post.excerpt}
      </p>

      <Link 
        to={`/blog/${post.slug}`} 
        style={{
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: '.06em',
          textTransform: 'uppercase',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          marginTop: 'auto'
        }}
        className="b-read-btn"
      >
        Read Article <ArrowRight size={14} className="b-read-arrow" style={{ transition: 'transform .3s ease' }} />
      </Link>

      <style>{`
        .blog-card:hover .b-img {
          transform: scale(1.06);
        }
        .blog-card:hover .b-read-arrow {
          transform: translateX(4px);
        }
      `}</style>
    </article>
  );
}
