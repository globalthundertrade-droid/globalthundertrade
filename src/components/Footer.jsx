import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { COMPANY } from '../data/companyData';
import { Phone, Mail, MapPin, ArrowUpRight } from 'lucide-react';
import GttWordmark from './GttWordmark';

export default function Footer() {
  const location = useLocation();
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="foot-top">
          <div className="foot-brand">
            <Link to="/" aria-label="Global Thunder Trade Home" style={{ textDecoration: 'none', color: 'inherit' }}>
              <GttWordmark variant="footer" />
            </Link>
            <p style={{ marginTop: 16 }}>Your Manufacturing Partner.<br />Your Brand's Advantage.</p>
            <div className="foot-contact-info">
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <Phone size={14} /> <a href={`tel:${COMPANY.phone}`}>{COMPANY.phone}</a>
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <Mail size={14} /> <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <MapPin size={14} /> {COMPANY.location}
              </span>
            </div>
          </div>

          <div className="foot-cols">
            <div className="foot-col">
              <h4>Company</h4>
              <ul>
                <li><Link to="/about">About GTT</Link></li>
                <li><Link to="/products">Our Work</Link></li>
                <li><Link to="/reviews">Client Reviews</Link></li>
                <li><Link to="/blog">The GTT Journal (Blog)</Link></li>
                <li><Link to="/contact">Contact &amp; Quotes</Link></li>
              </ul>
            </div>

            <div className="foot-col">
              <h4>Products</h4>
              <ul>
                <li><Link to="/products/street-fashion">Street &amp; Fashion</Link></li>
                <li><Link to="/products/leather-products">Leather Products</Link></li>
                <li><Link to="/products/medical-wear">Medical Wear</Link></li>
                <li><Link to="/products/premium-blanks">Premium Blanks</Link></li>
                <li><Link to="/products/industrial-supplies">Industrial Supplies</Link></li>
                <li><Link to="/side-products">Side Products &amp; Trims</Link></li>
              </ul>
            </div>

            <div className="foot-col">
              <h4>Manufacturing</h4>
              <ul>
                <li><Link to="/services">Services &amp; Capabilities</Link></li>
                <li><Link to="/cost-calculator">Cost Calculator</Link></li>
                <li><Link to="/side-products">Side Products &amp; Trims</Link></li>
                <li><Link to="/blanks">Wholesale Blanks</Link></li>
                <li><Link to="/be-a-supplier">Be a Supplier</Link></li>
                <li><Link to="/contact">Send Your Mockup</Link></li>
              </ul>
            </div>

            <div className="foot-col">
              <h4>Social</h4>
              <ul>
                {COMPANY.socials.map((soc) => (
                  <li key={soc.name}>
                    <a 
                      href={soc.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
                    >
                      {soc.name} <ArrowUpRight size={13} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="foot-bottom">
          <span>&copy; {new Date().getFullYear()} GLOBAL THUNDER TRADE. ALL RIGHTS RESERVED.</span>
          <span>FROM IDEA TO MARKET &middot; ENGINEERED BY MANUFACTURERS</span>
        </div>
      </div>
    </footer>
  );
}
