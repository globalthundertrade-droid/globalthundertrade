import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import CustomCursor from './components/CustomCursor';
import { CmsProvider } from './context/CmsContext';

import HomePage from './pages/HomePage';
import ProductsIndexPage from './pages/ProductsIndexPage';
import CategoryPage from './pages/CategoryPage';
import ProductDetailPage from './pages/ProductDetailPage';
import SideProductsPage from './pages/SideProductsPage';
import SideProductDetailPage from './pages/SideProductDetailPage';
import BlanksPage from './pages/BlanksPage';
import BlankDetailPage from './pages/BlankDetailPage';
import BeASupplierPage from './pages/BeASupplierPage';
import ServicesPage from './pages/ServicesPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import BlogIndexPage from './pages/BlogIndexPage';
import BlogPostPage from './pages/BlogPostPage';
import ReviewsPage from './pages/ReviewsPage';
import CostCalculatorPage from './pages/CostCalculatorPage';

// Admin imports
import ProtectedRoute from './admin/components/ProtectedRoute';
import AdminLayout from './admin/AdminLayout';
import AdminLoginPage from './admin/pages/AdminLoginPage';
import DashboardPage from './admin/pages/DashboardPage';
import ContentManagerPage from './admin/pages/ContentManagerPage';
import ProductsManagerPage from './admin/pages/ProductsManagerPage';
import BlogsManagerPage from './admin/pages/BlogsManagerPage';
import MediaLibraryPage from './admin/pages/MediaLibraryPage';
import CostCalculatorAdminPage from './admin/pages/CostCalculatorAdminPage';
import SeoControlPage from './admin/pages/SeoControlPage';
import InquiriesPage from './admin/pages/InquiriesPage';
import ReviewsManagerPage from './admin/pages/ReviewsManagerPage';
import SettingsPage from './admin/pages/SettingsPage';

export default function App() {
  return (
    <CmsProvider>
      <div className="app-container">
        <ScrollToTop />
        <CustomCursor />
        <Navbar />

        <main>
          <Routes>
            {/* Public Storefront Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/products" element={<ProductsIndexPage />} />
            <Route path="/products/:category" element={<CategoryPage />} />
            <Route path="/products/:category/:productId" element={<ProductDetailPage />} />
            <Route path="/side-products" element={<SideProductsPage />} />
            <Route path="/side-products/:slug" element={<SideProductDetailPage />} />
            <Route path="/blanks" element={<BlanksPage />} />
            <Route path="/blanks/:slug" element={<BlankDetailPage />} />
            <Route path="/be-a-supplier" element={<BeASupplierPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/cost-calculator" element={<CostCalculatorPage />} />
            <Route path="/blog" element={<BlogIndexPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            <Route path="/reviews" element={<ReviewsPage />} />

            {/* Admin Authentication */}
            <Route path="/admin/login" element={<AdminLoginPage />} />

            {/* Protected Admin CMS Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardPage />} />
              <Route path="content" element={<ContentManagerPage />} />
              <Route path="products" element={<ProductsManagerPage />} />
              <Route path="blogs" element={<BlogsManagerPage />} />
              <Route path="media" element={<MediaLibraryPage />} />
              <Route path="calculator" element={<CostCalculatorAdminPage />} />
              <Route path="seo" element={<SeoControlPage />} />
              <Route path="inquiries" element={<InquiriesPage />} />
              <Route path="reviews" element={<ReviewsManagerPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<HomePage />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </CmsProvider>
  );
}
