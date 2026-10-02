import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { PRODUCTS as STATIC_PRODUCTS } from '../data/productsData';
import { BLOG_POSTS as STATIC_BLOGS } from '../data/blogData';
import { GOOGLE_REVIEWS as STATIC_REVIEWS } from '../data/reviewsData';
import { CATEGORIES as STATIC_CATEGORIES } from '../data/categoriesData';
import { HOME_MEDIA as STATIC_HOME_MEDIA } from '../data/mediaConfig';

const CmsContext = createContext(null);

export function broadcastCmsUpdate() {
  try {
    window.dispatchEvent(new CustomEvent('gtt_cms_updated', { detail: { timestamp: Date.now() } }));
  } catch (e) {}
  try {
    if (typeof BroadcastChannel !== 'undefined') {
      const ch = new BroadcastChannel('gtt_cms_sync');
      ch.postMessage({ type: 'CMS_UPDATED', timestamp: Date.now() });
      setTimeout(() => ch.close(), 100);
    }
  } catch (e) {}
}

export function CmsProvider({ children }) {
  const [siteContent, setSiteContent] = useState({
    homepage: {
      hero: {
        eyebrow: 'GLOBAL THUNDER TRADE — APPAREL MANUFACTURING · PRODUCT DEVELOPMENT',
        title1: "WE DON'T JUST",
        title2: "MANUFACTURE CLOTHES.",
        title3: "WE HELP BUILD BRANDS.",
        lead: "From your first product idea to sampling, cut-and-sew manufacturing, custom trims, brand-ready finishing, and final packaging — Global Thunder Trade helps clothing brands turn concepts into production-ready collections.",
        video: '/media/home/hero/hero-video.mp4',
        mode: 'video_only',
        mobileMode: 'same_as_desktop',
        alt: 'Global Thunder Trade Apparel Manufacturing Facility',
        tagline: 'FROM IDEA → PRODUCT'
      },
      categories: {
        "street-fashion": {
          image: "/streetwear and fasion/image.jpg",
          video: "/streetwear and fasion/video.mp4",
          mode: "interaction_video",
          mobileMode: "interaction_video"
        },
        "leather-products": {
          image: "/leather products/image.jpg",
          video: "/leather products/video.mp4",
          mode: "interaction_video",
          mobileMode: "interaction_video"
        },
        "medical-wear": {
          image: "/medical/image.jpg",
          video: "/medical/video.mp4",
          mode: "interaction_video",
          mobileMode: "interaction_video"
        },
        "premium-blanks": {
          image: "/blanks/image.jpg",
          video: "/blanks/video.mp4",
          mode: "interaction_video",
          mobileMode: "interaction_video"
        },
        "industrial-supplies": {
          image: "/industrial supplies/image.jpg",
          video: "/industrial supplies/video.mp4",
          mode: "interaction_video",
          mobileMode: "interaction_video"
        }
      },
      customization: {
        "embroidery": { image: "/media/home/customization/01-embroidery.jpg", video: null, alt: "Industrial tactile embroidery" },
        "rhinestones": { image: "/media/home/customization/04-rhinestones.jpg", video: null, alt: "Precision glass crystal & hardware" },
        "screen-printing": { image: "/media/homepage/factory-preview-printing.jpg", video: null, alt: "High-density industrial screen printing" },
        "dtf-printing": { image: "/media/home/customization/02-dtf-printing.jpg", video: null, alt: "High-definition direct-to-film" },
        "dtg-printing": { image: "/media/home/customization/03-dtg-printing.jpg", video: null, alt: "Soft-hand direct-to-garment" },
        "custom-labels": { image: "/media/products/side-products/custom-labels.jpg", video: null, alt: "Woven damask & satin labels" },
        "custom-tags": { image: "/media/products/side-products/custom-tags.jpg", video: null, alt: "Bespoke debossed hangtags" },
        "washes-finishing": { image: "/media/manufacturing/06-customization-branding.jpg", video: null, alt: "Vintage washes & hand distressing" },
        "packaging": { image: "/media/home/customization/06-packaging.jpg", video: null, alt: "Retail-ready luxury packaging" }
      },
      detailsMatter: {
        "chains": { image: "/media/the-details-matter/chains.jpg", alt: "Chains - Industrial & Cuban Links" },
        "buckles": { image: "/media/the-details-matter/buckles.jpg", alt: "Buckles - Tactical & Magnetic Cast" },
        "zippers": { image: "/media/the-details-matter/zippers.jpg", alt: "Zippers - Precision YKK Systems" },
        "rhinestones": { image: "/media/the-details-matter/rhinestones.jpg", alt: "Rhinestones - Precision Glass Crystal" },
        "patches": { image: "/media/the-details-matter/patches.jpg", alt: "Patches - Chenille & 3D Embroidery" },
        "labels": { image: "/media/the-details-matter/labels.jpg", alt: "Labels - High-Density Woven Damask" }
      },
      finalCta: {
        heading: "READY TO BUILD YOUR NEXT DROP?",
        description: "Send us your tech pack, mockup, or reference garment. Our team will review your specifications, provide sampling guidance, and deliver transparent factory pricing.",
        image: "/media/homepage/homepage-cta.jpg"
      }
    },
    services: {
      hero: {
        heading: 'FROM CONCEPT TO RETAIL-READY COLLECTIONS.',
        subheading: 'Full-package product development, cut-and-sew manufacturing, custom trims, editorial lookbooks, and conversion-engineered e-commerce.'
      },
      manufacturingImage: '/media/services/01-manufacturing.jpg'
    },
    about: {
      hero: {
        heading: "ENGINEERING APPAREL FOR THE WORLD'S MOST AMBITIOUS BRANDS.",
        subheading: "Headquartered in Pakistan with global brand partners across the US, UK, Europe, Australia, and the Middle East."
      },
      storyImage: '/media/home/idea-to-market/05-manufacturing.jpg'
    },
    blanks: {
      blankHoodieImage: '/media/home/blanks/blank-hoodie.jpg',
      blankTeeImage: '/media/home/blanks/blank-tee.jpg'
    },
    contact: {
      eyebrow: 'START PRODUCTION · FACTORY DIRECT',
      heading: 'SEND YOUR MOCKUP & REQUEST QUOTE.'
    }
  });

  const [products, setProducts] = useState(STATIC_PRODUCTS);
  const [blogs, setBlogs] = useState(STATIC_BLOGS);
  const [reviews, setReviews] = useState(STATIC_REVIEWS);
  const [categories, setCategories] = useState(STATIC_CATEGORIES);
  const [calculatorSettings, setCalculatorSettings] = useState(null);
  const [seoSettings, setSeoSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCmsData = useCallback(async () => {
    try {
      const res = await fetch(`/api/cms/all?_t=${Date.now()}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          if (data.siteContent) {
            const rawContent = data.siteContent;
            const homeContent = rawContent.homepage || rawContent.home || {};
            const normalized = {
              ...rawContent,
              homepage: homeContent,
              home: homeContent
            };
            setSiteContent(normalized);
          }
          if (Array.isArray(data.products)) {
            setProducts(data.products);
          }
          if (Array.isArray(data.blogs)) {
            setBlogs(data.blogs);
          }
          if (Array.isArray(data.reviews)) {
            setReviews(data.reviews);
          }
          if (Array.isArray(data.categories) && data.categories.length > 0) {
            setCategories(data.categories);
          }
          if (data.calculatorSettings) {
            setCalculatorSettings(data.calculatorSettings);
          }
          if (data.seoSettings) {
            setSeoSettings(data.seoSettings);
          }
        }
      }
    } catch (err) {
      console.warn('[CMS Context] Live sync error, retaining active state:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial fetch
    fetchCmsData();

    // 1. Re-fetch whenever user switches tabs back to the public website
    const handleFocus = () => fetchCmsData();
    window.addEventListener('focus', handleFocus);

    // 2. In-app custom event listener (fired immediately upon admin save)
    const handleCmsUpdate = () => fetchCmsData();
    window.addEventListener('gtt_cms_updated', handleCmsUpdate);

    // 3. Cross-tab BroadcastChannel (instant updates across multiple open browser tabs)
    let channel = null;
    try {
      if (typeof BroadcastChannel !== 'undefined') {
        channel = new BroadcastChannel('gtt_cms_sync');
        channel.onmessage = (msg) => {
          if (msg.data?.type === 'CMS_UPDATED') {
            fetchCmsData();
          }
        };
      }
    } catch (e) {}

    // 4. Background polling every 3 seconds to guarantee freshness
    const pollInterval = setInterval(fetchCmsData, 3000);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('gtt_cms_updated', handleCmsUpdate);
      if (channel) channel.close();
      clearInterval(pollInterval);
    };
  }, [fetchCmsData]);

  return (
    <CmsContext.Provider
      value={{
        siteContent,
        content: siteContent, // Alias so both useCms().siteContent and useCms().content work
        products,
        blogs,
        reviews,
        categories,
        calculatorSettings,
        seoSettings,
        loading,
        refreshCmsData: fetchCmsData,
        broadcastCmsUpdate
      }}
    >
      {children}
    </CmsContext.Provider>
  );
}

export function useCms() {
  const context = useContext(CmsContext);
  if (!context) {
    throw new Error('useCms must be used within a CmsProvider');
  }
  return context;
}
