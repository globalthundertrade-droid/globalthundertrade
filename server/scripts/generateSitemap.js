#!/usr/bin/env node
/**
 * GLOBAL THUNDER TRADE — STANDALONE DYNAMIC SITEMAP GENERATOR
 * 
 * Compiles real-time sitemap.xml and robots.txt from the live CMS database,
 * static catalogues, and active route registry.
 * 
 * Usage:
 *   node server/scripts/generateSitemap.js
 */

import { getDb } from '../db/cmsStorage.js';
import { syncSitemapFiles } from '../routes/seoRoutes.js';

console.log('----------------------------------------------------');
console.log('⚡ GTT Dynamic Sitemap & Robots.txt Generator');
console.log('----------------------------------------------------');

try {
  const db = getDb();
  const result = syncSitemapFiles(db);

  if (result.success) {
    console.log(`✅ Success! Generated sitemap with ${result.totalUrls} live URLs.`);
    console.log('📁 Files updated:');
    console.log('   - public/sitemap.xml');
    console.log('   - public/robots.txt');
    process.exit(0);
  } else {
    console.error('❌ Failed to generate sitemap:', result.error);
    process.exit(1);
  }
} catch (err) {
  console.error('❌ Critical error generating sitemap:', err);
  process.exit(1);
}
