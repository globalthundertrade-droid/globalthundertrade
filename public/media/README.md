# GTT Centralized Media System

This directory is the central asset repository for all visual media (images, videos, posters) used across the Global Thunder Trade (GTT) website.

All media paths are configured in:
`src/data/mediaConfig.js`

To add or update real media, simply place your high-resolution files into the corresponding directory below and ensure the filename matches (or update `mediaConfig.js`).

---

## Directory Structure & Recommended Naming

### 1. `/hero/`
Used for the Homepage Hero section.
- `hero-video.mp4`: Hero manufacturing/campaign video (16:9 or 4:3, muted ambient loop).
- `hero-poster.jpg`: Fallback poster displayed while video is buffering or if autoplay is restricted.

### 2. `/manufacturing/`
Visual assets for the 8-stage manufacturing roadmap (**IDEA → LAUNCH & SCALE**):
- `01-idea.jpg` / `01-idea.mp4`
- `02-product-development.jpg` / `02-product-development.mp4`
- `03-material-fabric.jpg` / `03-material-fabric.mp4`
- `04-sampling.jpg` / `04-sampling.mp4`
- `05-manufacturing.jpg` / `05-manufacturing.mp4`
- `06-customization-branding.jpg` / `06-customization-branding.mp4`
- `07-content-digital.jpg` / `07-content-digital.mp4`
- `08-launch-scale.jpg` / `08-launch-scale.mp4`

### 3. `/customization/`
Visual assets for the 6 customization techniques in **"YOUR PRODUCT. YOUR RULES."**:
- `01-embroidery.mp4` / `01-embroidery.jpg`
- `02-dtf-printing.mp4` / `02-dtf-printing.jpg`
- `03-dtg-printing.mp4` / `03-dtg-printing.jpg`
- `04-rhinestones.mp4` / `04-rhinestones.jpg`
- `05-labels-tags.mp4` / `05-labels-tags.jpg`
- `06-packaging.mp4` / `06-packaging.jpg`

### 4. `/blanks/`
Garment photography for the Blanks Catalog and Detail pages:
- Format: `{category}-{slug}-main.jpg`, `{category}-{slug}-alt.jpg`, `{category}-{slug}-video.mp4`
- Example: `hoodie-heavyweight-boxy-main.jpg`, `hoodie-heavyweight-boxy-alt.jpg`

### 5. `/products/`
Primary product lines and Industrial Supplies:
- **Streetwear**: `streetwear-hoodies.jpg`, `streetwear-tees.jpg`, etc.
- **Fashion Wear**: `fashion-wear-dresses.jpg`, etc.
- **Leather Products**: `leather-jackets.jpg`, etc.
- **Medical Wear**: `medical-scrubs.jpg`, etc.
- **Industrial Supplies**:
  - `leather-welding-gloves.jpg`
  - `working-gloves.jpg`
  - `furniture-gloves.jpg`
  - `rescue-jackets.jpg`
  - `safety-jackets.jpg`
  - `other-industrial.jpg`

### 6. `/services/`
Editorial photography and reels for the 4 Service Pillars:
- `01-manufacturing.jpg` / `01-manufacturing.mp4`
- `02-photography.jpg` / `02-photography.mp4`
- `03-marketing.jpg` / `03-marketing.mp4`
- `04-web-ecommerce.jpg` / `04-web-ecommerce.mp4`

### 7. `/portfolio/`
Real client website screenshots and store previews for digital work built by GTT.
- `{client-brand}-store.jpg` (e.g. `noir-atelier-store.jpg`)

### 8. `/about/` & `/reviews/`
- About factory infrastructure, certifications, team, and verified client testimonials.

---

## Best Practices
1. **Video Optimization**: Keep ambient background videos under 15MB. Encode with H.264 / AAC or WebM for high web compatibility.
2. **Aspect Ratios**: The media components preserve original aspect ratios without stretching or distortion.
3. **Graceful Fallbacks**: If any file is missing, the system automatically uses the curated editorial fallback configured in `src/data/mediaConfig.js`. No broken icons or black boxes will ever appear.
