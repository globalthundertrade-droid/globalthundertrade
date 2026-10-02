# GTT 3D Garment Models Directory

This directory hosts production GLB / GLTF 3D garment models for the Global Thunder Trade interactive 3D configurator.

## File Naming Convention
The configurator automatically checks this directory for binary `.glb` models matching the product ID:

- `hoodie.glb` — Heavyweight Boxy Hoodie
- `tshirt.glb` — Boxy Vintage T-Shirt
- `sweatshirt.glb` — Luxury Crewneck Sweatshirt
- `jacket.glb` — Artisan Leather / Varsity Jacket
- `jeans.glb` — Selvedge Denim Jeans
- `baggy-sweat-pants.glb` — Heavy Fleece Baggy Sweatpants
- `joggers.glb` — Heavy Fleece Joggers / Trackpants
- `shorts.glb` — Heavy French Terry Shorts
- `cropped-sleeveless.glb` — Cropped Boxy Sleeveless
- `medical-scrubs.glb` — Performance Medical Scrubs

## 3D Model Technical Specifications
1. **Format:** Binary `.glb` (preferred for performance and single-file bundling) or `.gltf` with embedded buffers.
2. **PBR Materials:** Use standard PBR materials (Principled BSDF) with base color, roughness, metalness, and normal maps.
3. **Dynamic Recolor:** The main garment mesh should have a distinct material slot (or be named `GarmentMesh` / `Body`) so the configurator can dynamically update its hex color in real time.
4. **Dimensions & Scale:** 1 unit = 1 meter. Model height around 1.2m - 1.8m centered at `(0, 0, 0)`.
5. **Draco Compression:** Optional; standard uncompressed or Draco-compressed GLBs are supported.
6. **Fallback Behavior:** If a `.glb` is not present in this folder, the configurator seamlessly falls back to the high-precision procedural WebGL studio model.
