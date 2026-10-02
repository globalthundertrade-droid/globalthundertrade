import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, ArrowRight, Menu, X } from 'lucide-react';
import GttWordmark from './GttWordmark';

const PRODUCT_CATEGORIES = [
  {
    index: "01",
    path: "/products/street-fashion",
    title: "STREET & FASHION",
    desc: "Oversized hoodies, boxy tees & luxury streetwear",
  },
  {
    index: "02",
    path: "/products/leather-products",
    title: "LEATHER PRODUCTS",
    desc: "Moto jackets, vests, weekender bags & hardware",
  },
  {
    index: "03",
    path: "/products/medical-wear",
    title: "MEDICAL WEAR",
    desc: "Technical antimicrobial scrubs & lab coats",
  },
  {
    index: "04",
    path: "/products/premium-blanks",
    title: "PREMIUM BLANKS",
    desc: "Heavyweight blanks built for custom relabeling",
  },
  {
    index: "05",
    path: "/products/industrial-supplies",
    title: "INDUSTRIAL SUPPLIES",
    desc: "Split-grain welding gloves & safety gear",
  },
  {
    index: "06",
    path: "/side-products",
    title: "SIDE PRODUCTS",
    desc: "Bespoke trims, packaging & specialty products",
  },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const closeTimerRef = useRef(null);
  const location = useLocation();

  // Completely isolate admin routes from public navbar
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cleanup close timer on unmount
  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  // Close mobile drawer and dropdown on route change
  useEffect(() => {
    setMobileOpen(false);
    setProductsOpen(false);
    setMobileProductsOpen(false);
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, [location.pathname]);

  // Robust hover management with debounce to eliminate hover gap / accidental close
  const handleDropdownEnter = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setProductsOpen(true);
  };

  const handleDropdownLeave = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
    }
    // 220ms grace period allows smooth diagonal mouse movement without feeling sluggish
    closeTimerRef.current = setTimeout(() => {
      setProductsOpen(false);
    }, 220);
  };

  const handleTriggerClick = (e) => {
    e.preventDefault();
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setProductsOpen((prev) => !prev);
  };

  const handleItemClick = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setProductsOpen(false);
  };

  // Handle escape key and outside clicks
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
        setProductsOpen(false);
      }
    };
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
        setProductsOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <header className={`site-header ${scrolled ? 'solid' : ''}`} id="siteHeader">
        <div className="nav-inner">
          <Link to="/" className="logo-wrap" aria-label="Global Thunder Trade Home">
            <GttWordmark variant="navbar" />
          </Link>

          <nav className="nav-links" aria-label="Main Navigation">
            <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
            <Link to="/services" className={location.pathname === '/services' ? 'active' : ''}>Services</Link>
            
            <div 
              ref={dropdownRef}
              className={`nav-item-drop ${productsOpen ? 'open' : ''}`}
              onMouseEnter={handleDropdownEnter}
              onMouseLeave={handleDropdownLeave}
            >
              <button 
                className="nav-drop-trigger" 
                aria-haspopup="true" 
                aria-expanded={productsOpen}
                onClick={handleTriggerClick}
                aria-label="Products category menu"
              >
                <span>Products</span>
                <ChevronDown size={13} className="nav-trigger-arrow" />
              </button>

              <div 
                className="nav-dropdown" 
                role="menu" 
                aria-label="Products Categories"
                onMouseEnter={handleDropdownEnter}
                onMouseLeave={handleDropdownLeave}
              >
                <div className="nav-dropdown-header">
                  <span className="ndh-eyebrow">DIVISIONS // 06 CATEGORIES</span>
                  <span className="ndh-sub">SPECIFICATIONS</span>
                </div>

                <div className="nav-dropdown-list">
                  {PRODUCT_CATEGORIES.map((cat) => {
                    const isItemActive = location.pathname === cat.path;
                    return (
                      <Link 
                        key={cat.index} 
                        to={cat.path} 
                        className={`nav-dropdown-item ${isItemActive ? 'active' : ''}`}
                        role="menuitem"
                        onClick={handleItemClick}
                      >
                        <div className="ndi-left">
                          <span className="ndi-index">{cat.index}</span>
                          <span className="ndi-title">{cat.title}</span>
                        </div>
                        <div className="ndi-arrow-wrap">
                          <ArrowRight size={13} className="ndi-arrow" />
                        </div>
                      </Link>
                    );
                  })}
                </div>

                <div className="nav-dropdown-footer">
                  <Link 
                    to="/products" 
                    className="nav-dropdown-all-link"
                    role="menuitem"
                    onClick={handleItemClick}
                  >
                    <span>VIEW ALL PRODUCT CATEGORIES</span>
                    <ArrowRight size={11} className="ndf-arrow" />
                  </Link>
                </div>
              </div>
            </div>

            <Link to="/blanks" className={location.pathname === '/blanks' ? 'active' : ''}>Blanks</Link>
            <Link to="/reviews" className={location.pathname === '/reviews' ? 'active' : ''}>Reviews</Link>
            <Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>About</Link>
            <Link to="/blog" className={location.pathname.startsWith('/blog') ? 'active' : ''}>Blog</Link>
            <Link to="/contact" className={location.pathname === '/contact' ? 'active' : ''}>Contact Us</Link>
            <Link to="/be-a-supplier" className={location.pathname === '/be-a-supplier' ? 'active' : ''}>Be a Supplier</Link>
          </nav>

          <div className="nav-right">
            <Link to="/contact" className="nav-cta-btn">
              Get In Touch <ArrowRight size={13} />
            </Link>
          </div>

          <button 
            className={`burger ${mobileOpen ? 'open' : ''}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle Navigation Menu"
            aria-expanded={mobileOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>

      {/* Fullscreen Mobile Drawer */}
      <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`} id="mobileMenu">
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, paddingBottom: 16, borderBottom: '1px solid var(--line-dark)' }}>
            <Link to="/" onClick={() => setMobileOpen(false)} aria-label="Global Thunder Trade Home">
              <GttWordmark variant="mobile" />
            </Link>
            <button 
              onClick={() => setMobileOpen(false)} 
              aria-label="Close menu"
              style={{ color: 'var(--white)', padding: 6, background: 'transparent', border: 'none', cursor: 'pointer' }}
            >
              <X size={24} />
            </button>
          </div>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li>
              <button 
                className={`mm-drop-trigger ${mobileProductsOpen ? 'open' : ''}`}
                onClick={() => setMobileProductsOpen(!mobileProductsOpen)}
                aria-expanded={mobileProductsOpen}
              >
                <span>Products</span>
                <ChevronDown size={20} className="mm-chevron" />
              </button>
              <div className={`mm-submenu ${mobileProductsOpen ? 'open' : ''}`}>
                <div className="mm-submenu-inner">
                  {PRODUCT_CATEGORIES.map((cat) => {
                    const isItemActive = location.pathname === cat.path;
                    return (
                      <Link 
                        key={cat.index} 
                        to={cat.path}
                        className={`mm-sub-item ${isItemActive ? 'active' : ''}`}
                        onClick={() => {
                          setMobileOpen(false);
                          setMobileProductsOpen(false);
                        }}
                      >
                        <div className="mm-sub-left">
                          <span className="mm-sub-idx">{cat.index}</span>
                          <span className="mm-sub-title">{cat.title}</span>
                        </div>
                        <ArrowRight size={14} className="mm-sub-arrow" />
                      </Link>
                    );
                  })}
                  <Link 
                    to="/products" 
                    className="mm-sub-all"
                    onClick={() => {
                      setMobileOpen(false);
                      setMobileProductsOpen(false);
                    }}
                  >
                    <span>View All Categories</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </li>
            <li><Link to="/blanks">Blanks</Link></li>
            <li><Link to="/reviews">Reviews</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/blog">Blog</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
            <li><Link to="/be-a-supplier">Be a Supplier</Link></li>
          </ul>
        </div>

        <div style={{ paddingTop: 30 }}>
          <Link to="/contact" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
            Send Your Mockup <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </>
  );
}
