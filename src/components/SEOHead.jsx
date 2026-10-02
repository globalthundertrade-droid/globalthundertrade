import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useCms } from '../context/CmsContext';

/**
 * SEOHead Component
 * Dynamically injects and manages document <head> metadata for single-page applications:
 * - <title> and <meta name="description">
 * - Canonical link
 * - Open Graph & Twitter/X card metadata
 * - JSON-LD Structured Data: Organization, WebSite, BlogPosting, BreadcrumbList, FAQPage
 */
export default function SEOHead({
  title,
  description,
  canonicalUrl,
  ogType = 'website',
  ogImage = '/media/home/hero/hero-poster.jpg',
  article = null,
  breadcrumbs = null,
  faqs = null,
  product = null
}) {
  const location = useLocation();
  let cmsSeo = null;
  try {
    const { seoSettings } = useCms();
    cmsSeo = seoSettings;
  } catch (e) {}

  const pagePathKeyMap = {
    '/': 'home',
    '/services': 'services',
    '/products': 'products',
    '/blanks': 'blanks',
    '/cost-calculator': 'costCalculator',
    '/about': 'about',
    '/contact': 'contact',
    '/blog': 'blog',
    '/reviews': 'reviews',
    '/be-a-supplier': 'beASupplier'
  };
  const pageKey = pagePathKeyMap[location.pathname];
  const cmsPage = cmsSeo?.pages?.[pageKey];
  const cmsGlobal = cmsSeo?.global;

  const siteUrl = cmsGlobal?.canonicalDomain || 'https://globalthundertrade.com';
  const effectiveTitle = cmsPage?.title || title || cmsGlobal?.siteTitle || 'Global Thunder Trade | Custom Apparel Manufacturing & Product Development';
  const fullTitle = effectiveTitle.includes('Global Thunder Trade') || effectiveTitle.includes('GTT') 
    ? effectiveTitle 
    : `${effectiveTitle} | Global Thunder Trade`;
  const fullDescription = cmsPage?.description || description || cmsGlobal?.siteDescription || 'Global Thunder Trade is an end-to-end clothing manufacturer and product development partner for streetwear, fashion, leather goods, medical apparel, and blanks.';
  const currentCanonical = cmsPage?.canonical || canonicalUrl || `${siteUrl}${location.pathname}`;
  const effectiveOgImage = cmsPage?.ogImage || ogImage || cmsGlobal?.defaultOgImage;
  const absoluteImage = effectiveOgImage?.startsWith('http') ? effectiveOgImage : `${siteUrl}${effectiveOgImage || '/media/home/hero/hero-poster.jpg'}`;

  useEffect(() => {
    // 1. Update Title
    document.title = fullTitle;

    // Helper to set or create meta tags
    const setMeta = (attr, key, content) => {
      if (!content) return;
      let el = document.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // 2. Standard Meta
    setMeta('name', 'description', fullDescription);

    // 3. Open Graph Meta
    setMeta('property', 'og:site_name', 'Global Thunder Trade');
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', fullDescription);
    setMeta('property', 'og:type', ogType);
    setMeta('property', 'og:url', currentCanonical);
    setMeta('property', 'og:image', absoluteImage);

    // 4. Twitter Meta
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:description', fullDescription);
    setMeta('name', 'twitter:image', absoluteImage);

    // 5. Canonical Link
    let canon = document.querySelector('link[rel="canonical"]');
    if (!canon) {
      canon = document.createElement('link');
      canon.setAttribute('rel', 'canonical');
      document.head.appendChild(canon);
    }
    canon.setAttribute('href', currentCanonical);

    // 6. JSON-LD Structured Data Graph
    const schemaGraph = [
      {
        '@type': 'Organization',
        '@id': `${siteUrl}/#organization`,
        name: 'Global Thunder Trade',
        url: siteUrl,
        description: 'Global apparel manufacturer and end-to-end product development studio.',
        sameAs: [
          'https://instagram.com/globalthundertrade',
          'https://linkedin.com/company/global-thunder-trade'
        ],
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'customer support & manufacturing intake',
          email: 'globalthundertrade@gmail.com'
        }
      },
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: siteUrl,
        name: 'Global Thunder Trade',
        publisher: { '@id': `${siteUrl}/#organization` }
      }
    ];

    // BreadcrumbList schema
    if (breadcrumbs && breadcrumbs.length > 0) {
      schemaGraph.push({
        '@type': 'BreadcrumbList',
        '@id': `${currentCanonical}#breadcrumbs`,
        itemListElement: breadcrumbs.map((b, idx) => {
          const target = b.item || b.url || '';
          return {
            '@type': 'ListItem',
            position: idx + 1,
            name: b.name,
            item: target.startsWith('http') ? target : `${siteUrl}${target}`
          };
        })
      });
    }

    // BlogPosting schema (for articles)
    if (ogType === 'article' && article) {
      schemaGraph.push({
        '@type': 'BlogPosting',
        '@id': `${currentCanonical}#article`,
        isPartOf: { '@id': `${siteUrl}/#website` },
        headline: title,
        description: fullDescription,
        mainEntityOfPage: currentCanonical,
        datePublished: article.publishedTime || '2026-09-01T08:00:00+00:00',
        dateModified: article.modifiedTime || article.publishedTime || '2026-09-16T08:00:00+00:00',
        author: {
          '@type': 'Organization',
          name: article.author || 'GTT Technical Editorial Team',
          url: siteUrl
        },
        publisher: { '@id': `${siteUrl}/#organization` },
        image: absoluteImage,
        articleSection: article.section || 'Clothing Manufacturing',
        keywords: article.tags ? article.tags.join(', ') : undefined
      });
    }

    // Product & ProductGroup schema (Google compliant apparel variant support)
    if (product) {
      const hasVariants = product.variants && product.variants.length > 0;
      if (hasVariants) {
        schemaGraph.push({
          '@type': 'ProductGroup',
          '@id': `${currentCanonical}#productgroup`,
          name: product.name,
          description: product.description || fullDescription,
          url: currentCanonical,
          productGroupID: product.slug || product.id,
          variesBy: ['https://schema.org/color'],
          brand: { '@id': `${siteUrl}/#organization` },
          hasVariant: product.variants.map((v) => ({
            '@type': 'Product',
            name: `${product.name} - ${v.colorName}`,
            sku: v.sku || `${product.slug}-${v.colorName.toLowerCase()}`,
            color: v.colorName,
            image: v.image?.startsWith('http') ? v.image : `${siteUrl}${v.image || product.image}`,
            offers: {
              '@type': 'AggregateOffer',
              priceCurrency: 'USD',
              availability: 'https://schema.org/InStock',
              priceValidUntil: '2027-12-31',
              price: '16.50'
            }
          }))
        });
      } else {
        schemaGraph.push({
          '@type': 'Product',
          '@id': `${currentCanonical}#product`,
          name: product.name,
          description: product.description || fullDescription,
          image: absoluteImage,
          sku: product.slug || product.id,
          brand: { '@id': `${siteUrl}/#organization` },
          offers: {
            '@type': 'AggregateOffer',
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
            priceValidUntil: '2027-12-31',
            price: '16.50'
          }
        });
      }
    }

    // FAQPage schema (Strictly generated only when visible FAQs exist on the page)
    if (faqs && Array.isArray(faqs) && faqs.length > 0) {
      schemaGraph.push({
        '@type': 'FAQPage',
        '@id': `${currentCanonical}#faqs`,
        mainEntity: faqs.map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: f.answer
          }
        }))
      });
    }

    // Inject Script Tag
    let scriptEl = document.getElementById('seo-structured-data');
    if (!scriptEl) {
      scriptEl = document.createElement('script');
      scriptEl.id = 'seo-structured-data';
      scriptEl.type = 'application/ld+json';
      document.head.appendChild(scriptEl);
    }
    scriptEl.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': schemaGraph
    });

    return () => {
      const existing = document.getElementById('seo-structured-data');
      if (existing) {
        existing.remove();
      }
    };
  }, [fullTitle, fullDescription, currentCanonical, absoluteImage, ogType, JSON.stringify(breadcrumbs), JSON.stringify(article), JSON.stringify(faqs), JSON.stringify(product)]);

  return null;
}
