/**
 * PRODUCT PROMPT PARSER SERVICE — GLOBAL THUNDER TRADE
 * 
 * Architecture Layer:
 * USER PROMPT -> AI / PRODUCT PARSER -> STRUCTURED CONFIGURATION -> BUILDER STATE -> LIVE PREVIEW -> RFQ
 * 
 * This service parses natural language product descriptions into structured
 * apparel manufacturing specifications.
 * 
 * Currently uses high-precision local semantic rule parsing for instant, reliable client-side execution.
 * Easily pluggable to Gemini API / OpenAI serverless endpoint via `parseProductDescriptionAsync`.
 */

import { BUILDER_PRODUCTS } from '../data/builderData';

export function parseProductPrompt(promptText = '') {
  const text = promptText.toLowerCase().trim();

  // 1. Detect Product Silhouette
  let matchedProduct = BUILDER_PRODUCTS.find(p => p.id === 'hoodie'); // Default

  if (text.includes('t-shirt') || text.includes('tshirt') || text.includes('tee') || text.includes('graphic tee')) {
    matchedProduct = BUILDER_PRODUCTS.find(p => p.id === 'tshirt');
  } else if (text.includes('sweatshirt') || text.includes('crewneck') || text.includes('pullover')) {
    matchedProduct = BUILDER_PRODUCTS.find(p => p.id === 'sweatshirt');
  } else if (text.includes('jacket') || text.includes('leather') || text.includes('varsity') || text.includes('bomber') || text.includes('biker')) {
    matchedProduct = BUILDER_PRODUCTS.find(p => p.id === 'jacket');
  } else if (text.includes('jean') || text.includes('denim') || text.includes('pants') || text.includes('trousers') || text.includes('selvedge')) {
    matchedProduct = BUILDER_PRODUCTS.find(p => p.id === 'jeans');
  } else if (text.includes('jogger') || text.includes('sweatpant') || text.includes('track pant') || text.includes('fleece pants')) {
    matchedProduct = BUILDER_PRODUCTS.find(p => p.id === 'joggers');
  } else if (text.includes('scrub') || text.includes('medical') || text.includes('hospital') || text.includes('nurse') || text.includes('doctor')) {
    matchedProduct = BUILDER_PRODUCTS.find(p => p.id === 'medical-scrubs');
  } else if (text.includes('hoodie') || text.includes('hooded')) {
    matchedProduct = BUILDER_PRODUCTS.find(p => p.id === 'hoodie');
  }

  // 2. Detect Color
  let matchedColor = matchedProduct.availableColors[0];
  if (text.includes('black') || text.includes('onyx') || text.includes('dark')) {
    matchedColor = matchedProduct.availableColors.find(c => c.name.toLowerCase().includes('black')) || matchedProduct.availableColors[0];
  } else if (text.includes('white') || text.includes('bone') || text.includes('cream') || text.includes('off-white') || text.includes('light')) {
    matchedColor = matchedProduct.availableColors.find(c => c.name.toLowerCase().includes('white') || c.name.toLowerCase().includes('bone')) || matchedProduct.availableColors[0];
  } else if (text.includes('grey') || text.includes('gray') || text.includes('charcoal') || text.includes('slate')) {
    matchedColor = matchedProduct.availableColors.find(c => c.name.toLowerCase().includes('grey') || c.name.toLowerCase().includes('charcoal') || c.name.toLowerCase().includes('slate')) || matchedProduct.availableColors[0];
  } else if (text.includes('blue') || text.includes('navy') || text.includes('indigo') || text.includes('ceil')) {
    matchedColor = matchedProduct.availableColors.find(c => c.name.toLowerCase().includes('navy') || c.name.toLowerCase().includes('blue') || c.name.toLowerCase().includes('indigo')) || matchedProduct.availableColors[0];
  } else if (text.includes('green') || text.includes('olive') || text.includes('sage') || text.includes('forest')) {
    matchedColor = matchedProduct.availableColors.find(c => c.name.toLowerCase().includes('olive') || c.name.toLowerCase().includes('green') || c.name.toLowerCase().includes('sage')) || matchedProduct.availableColors[0];
  } else if (text.includes('brown') || text.includes('espresso') || text.includes('sand') || text.includes('tan') || text.includes('beige')) {
    matchedColor = matchedProduct.availableColors.find(c => c.name.toLowerCase().includes('espresso') || c.name.toLowerCase().includes('sand') || c.name.toLowerCase().includes('tan') || c.name.toLowerCase().includes('brown')) || matchedProduct.availableColors[0];
  } else if (text.includes('burgundy') || text.includes('oxblood') || text.includes('cherry') || text.includes('wine')) {
    matchedColor = matchedProduct.availableColors.find(c => c.name.toLowerCase().includes('oxblood') || c.name.toLowerCase().includes('burgundy') || c.name.toLowerCase().includes('wine')) || matchedProduct.availableColors[0];
  }

  // 3. Detect Fit
  let matchedFit = matchedProduct.availableFits[0];
  if (text.includes('oversized') || text.includes('baggy') || text.includes('wide')) {
    matchedFit = matchedProduct.availableFits.find(f => f.toLowerCase().includes('oversized') || f.toLowerCase().includes('wide') || f.toLowerCase().includes('baggy')) || matchedFit;
  } else if (text.includes('boxy')) {
    matchedFit = matchedProduct.availableFits.find(f => f.toLowerCase().includes('boxy')) || matchedFit;
  } else if (text.includes('slim') || text.includes('fitted') || text.includes('biker') || text.includes('moto')) {
    matchedFit = matchedProduct.availableFits.find(f => f.toLowerCase().includes('slim') || f.toLowerCase().includes('moto')) || matchedFit;
  } else if (text.includes('relaxed') || text.includes('drop shoulder')) {
    matchedFit = matchedProduct.availableFits.find(f => f.toLowerCase().includes('relaxed') || f.toLowerCase().includes('drop shoulder')) || matchedFit;
  } else if (text.includes('classic') || text.includes('regular') || text.includes('straight')) {
    matchedFit = matchedProduct.availableFits.find(f => f.toLowerCase().includes('classic') || f.toLowerCase().includes('regular') || f.toLowerCase().includes('straight')) || matchedFit;
  }

  // 4. Detect Fabric / Weight (GSM)
  let matchedFabric = matchedProduct.availableFabrics[0];
  let matchedGsm = matchedProduct.availableGsm ? matchedProduct.availableGsm[0] : null;

  if (text.includes('500') || text.includes('ultra-heavy') || text.includes('500 gsm')) {
    matchedGsm = matchedProduct.availableGsm?.find(g => g.includes('500')) || matchedGsm;
    matchedFabric = matchedProduct.availableFabrics.find(f => f.includes('500')) || matchedFabric;
  } else if (text.includes('460') || text.includes('460 gsm') || text.includes('heavyweight')) {
    matchedGsm = matchedProduct.availableGsm?.find(g => g.includes('460')) || matchedGsm;
    matchedFabric = matchedProduct.availableFabrics.find(f => f.includes('460')) || matchedFabric;
  } else if (text.includes('french terry')) {
    matchedFabric = matchedProduct.availableFabrics.find(f => f.toLowerCase().includes('french terry')) || matchedFabric;
  } else if (text.includes('cowhide') || text.includes('full-grain') || text.includes('leather')) {
    matchedFabric = matchedProduct.availableFabrics.find(f => f.toLowerCase().includes('cowhide') || f.toLowerCase().includes('leather')) || matchedFabric;
  } else if (text.includes('selvedge') || text.includes('denim')) {
    matchedFabric = matchedProduct.availableFabrics.find(f => f.toLowerCase().includes('selvedge')) || matchedFabric;
  } else if (text.includes('organic')) {
    matchedFabric = matchedProduct.availableFabrics.find(f => f.toLowerCase().includes('organic')) || matchedFabric;
  }

  // 5. Detect Print Technique
  let matchedPrint = matchedProduct.availablePrint ? matchedProduct.availablePrint[0] : 'None';
  if (matchedProduct.availablePrint) {
    if (text.includes('puff print') || text.includes('3d print') || text.includes('raised print')) {
      matchedPrint = matchedProduct.availablePrint.find(p => p.toLowerCase().includes('puff')) || matchedPrint;
    } else if (text.includes('screen print') || text.includes('screenprint') || text.includes('silkscreen')) {
      matchedPrint = matchedProduct.availablePrint.find(p => p.toLowerCase().includes('screen print')) || matchedPrint;
    } else if (text.includes('dtf') || text.includes('direct to film')) {
      matchedPrint = matchedProduct.availablePrint.find(p => p.toLowerCase().includes('dtf')) || matchedPrint;
    } else if (text.includes('dtg') || text.includes('direct to garment') || text.includes('full color print')) {
      matchedPrint = matchedProduct.availablePrint.find(p => p.toLowerCase().includes('dtg')) || matchedPrint;
    } else if (text.includes('no print') || text.includes('blank') || text.includes('plain')) {
      matchedPrint = 'None';
    }
  }

  // 6. Detect Embroidery
  let matchedEmbroidery = matchedProduct.availableEmbroidery ? matchedProduct.availableEmbroidery[0] : 'None';
  if (matchedProduct.availableEmbroidery) {
    if (text.includes('puff embroidery') || text.includes('3d embroidery') || text.includes('puff embroidered')) {
      matchedEmbroidery = matchedProduct.availableEmbroidery.find(e => e.toLowerCase().includes('puff')) || matchedEmbroidery;
    } else if (text.includes('satin stitch') || text.includes('flat stitch') || text.includes('flat embroidery')) {
      matchedEmbroidery = matchedProduct.availableEmbroidery.find(e => e.toLowerCase().includes('flat')) || matchedEmbroidery;
    } else if (text.includes('embroidery') || text.includes('embroidered') || text.includes('stitched')) {
      matchedEmbroidery = matchedProduct.availableEmbroidery.find(e => !e.toLowerCase().includes('none')) || matchedEmbroidery;
    } else if (text.includes('no embroidery')) {
      matchedEmbroidery = 'None';
    }
  }

  // 7. Detect Embellishments / Rhinestones / Hardware
  let matchedEmbellishments = matchedProduct.availableEmbellishments ? matchedProduct.availableEmbellishments[0] : 'None';
  if (matchedProduct.availableEmbellishments) {
    if (text.includes('rhinestone') || text.includes('crystals') || text.includes('diamonds') || text.includes('shimmer')) {
      matchedEmbellishments = matchedProduct.availableEmbellishments.find(em => em.toLowerCase().includes('rhinestone')) || matchedEmbellishments;
    } else if (text.includes('distressed') || text.includes('grinding') || text.includes('ripped')) {
      matchedEmbellishments = matchedProduct.availableEmbellishments.find(em => em.toLowerCase().includes('distressed')) || matchedEmbellishments;
    } else if (text.includes('rivet') || text.includes('studs')) {
      matchedEmbellishments = matchedProduct.availableEmbellishments.find(em => em.toLowerCase().includes('rivet')) || matchedEmbellishments;
    }
  }

  // 8. Detect Washes / Finishing
  let matchedWash = matchedProduct.availableWashes ? matchedProduct.availableWashes[0] : 'Standard Factory Finish';
  if (matchedProduct.availableWashes) {
    if (text.includes('washed') || text.includes('vintage wash') || text.includes('acid wash') || text.includes('mineral')) {
      matchedWash = matchedProduct.availableWashes.find(w => w.toLowerCase().includes('acid') || w.toLowerCase().includes('mineral') || w.toLowerCase().includes('vintage')) || matchedWash;
    } else if (text.includes('enzyme') || text.includes('silicone') || text.includes('softened')) {
      matchedWash = matchedProduct.availableWashes.find(w => w.toLowerCase().includes('silicone') || w.toLowerCase().includes('enzyme')) || matchedWash;
    } else if (text.includes('raw') || text.includes('rigid') || text.includes('unwashed')) {
      matchedWash = matchedProduct.availableWashes.find(w => w.toLowerCase().includes('raw')) || matchedWash;
    }
  }

  // 9. Detect Labels & Packaging
  let matchedLabel = matchedProduct.availableLabels ? matchedProduct.availableLabels[0] : 'Custom Woven Label';
  if (matchedProduct.availableLabels) {
    if (text.includes('woven label') || text.includes('neck label') || text.includes('damask')) {
      matchedLabel = matchedProduct.availableLabels.find(l => l.toLowerCase().includes('woven')) || matchedLabel;
    } else if (text.includes('tagless') || text.includes('heat transfer')) {
      matchedLabel = matchedProduct.availableLabels.find(l => l.toLowerCase().includes('transfer')) || matchedLabel;
    }
  }

  let matchedPackaging = matchedProduct.availablePackaging ? matchedProduct.availablePackaging[0] : 'Frosted Custom Polybag';
  if (matchedProduct.availablePackaging) {
    if (text.includes('box') || text.includes('gift box') || text.includes('kraft box')) {
      matchedPackaging = matchedProduct.availablePackaging.find(pkg => pkg.toLowerCase().includes('box')) || matchedPackaging;
    } else if (text.includes('polybag') || text.includes('ziplock') || text.includes('frosted')) {
      matchedPackaging = matchedProduct.availablePackaging.find(pkg => pkg.toLowerCase().includes('polybag') || pkg.toLowerCase().includes('ziplock')) || matchedPackaging;
    }
  }

  // Structured Extracted Attributes List for Display
  const extractedAttributes = [
    { label: "Product Silhouette", value: matchedProduct.name },
    { label: "Color Palette", value: `${matchedColor.name} (${matchedColor.hex})` },
    { label: "Fit Silhouette", value: matchedFit },
    { label: "Fabric & Weight", value: `${matchedFabric} ${matchedGsm ? `· ${matchedGsm}` : ''}`.trim() },
    ...(matchedPrint && matchedPrint !== 'None' ? [{ label: "Graphic Print", value: matchedPrint }] : []),
    ...(matchedEmbroidery && matchedEmbroidery !== 'None' ? [{ label: "Embroidery Technique", value: matchedEmbroidery }] : []),
    ...(matchedEmbellishments && matchedEmbellishments !== 'None' ? [{ label: "Embellishments", value: matchedEmbellishments }] : []),
    { label: "Garment Wash", value: matchedWash },
    { label: "Brand Labeling", value: matchedLabel },
    { label: "Retail Packaging", value: matchedPackaging }
  ];

  return {
    success: true,
    rawPrompt: promptText,
    detectedProductId: matchedProduct.id,
    detectedProduct: matchedProduct,
    configuration: {
      productId: matchedProduct.id,
      productName: matchedProduct.name,
      color: matchedColor.hex,
      colorName: matchedColor.name,
      fit: matchedFit,
      fabric: matchedFabric,
      gsm: matchedGsm || matchedProduct.availableGsm?.[0] || 'Standard',
      print: matchedPrint,
      embroidery: matchedEmbroidery,
      embellishments: matchedEmbellishments,
      hardware: matchedProduct.availableHardware?.[0] || matchedProduct.availableZippers?.[0] || 'None',
      buttons: matchedProduct.availableButtons?.[0] || 'None',
      patches: matchedProduct.availablePatches?.[0] || 'None',
      labels: matchedLabel,
      tags: matchedProduct.availableTags?.[0] || 'Matte Black Hangtag',
      washes: matchedWash,
      packaging: matchedPackaging,
      userPromptDescription: promptText
    },
    extractedAttributes
  };
}

/**
 * Pluggable async wrapper. Currently invokes deterministic parser; ready to
 * connect to Gemini / OpenAI endpoint without touching UI components.
 */
export async function parseProductDescriptionAsync(promptText) {
  // Simulate natural AI latency (300ms) to give a polished, responsive feeling
  await new Promise(resolve => setTimeout(resolve, 320));
  return parseProductPrompt(promptText);
}
