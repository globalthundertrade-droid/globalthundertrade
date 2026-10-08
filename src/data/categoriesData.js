import { CATEGORIES_MEDIA } from './mediaConfig.js';

export const CATEGORIES = [
  {
    id: "street-fashion",
    slug: "street-fashion",
    title: "Street & Fashion",
    subtitle: "Heavyweight silhouettes, drop shoulders & contemporary tailored luxury",
    description: "Engineered for high-end streetwear and contemporary fashion labels. From oversized luxury 450-500 GSM fleece hoodies to vintage-washed boxy tees, cargo pants, tailored jackets, and bespoke cut-and-sew precision.",
    image: CATEGORIES_MEDIA["street-fashion"]?.image || "/streetwear and fasion/image.jpg",
    video: CATEGORIES_MEDIA["street-fashion"]?.video || "/streetwear and fasion/video.mp4",
    fallbackImage: "/streetwear and fasion/image.jpg",
    aliases: ["streetwear", "fashion-wear"],
    productTypes: [
      "Hoodies",
      "T-Shirts",
      "Sweatshirts",
      "Joggers",
      "Cargo Pants",
      "Jeans",
      "Varsity Jackets",
      "Tracksuits",
      "Shorts",
      "Custom Shirts",
      "Tailored Jackets",
      "Co-Ord Sets",
      "Fashion Dresses / Tops",
      "Other Custom Apparel"
    ]
  },
  {
    id: "leather-products",
    slug: "leather-products",
    title: "Leather Products",
    subtitle: "Full-grain hides, precision artisan stitching & bespoke hardware",
    description: "Mastercrafted real and vegan leather outerwear, moto jackets, vests, trousers, weekender bags, and luxury accessories built to endure with custom brass and matte black hardware.",
    image: CATEGORIES_MEDIA["leather-products"]?.image || "/leather products/image.jpg",
    video: CATEGORIES_MEDIA["leather-products"]?.video || "/leather products/video.mp4",
    fallbackImage: "/leather products/image.jpg",
    productTypes: [
      "Leather Jackets",
      "Leather Vests",
      "Leather Pants",
      "Leather Bags",
      "Leather Accessories",
      "Custom Leather Products"
    ]
  },
  {
    id: "medical-wear",
    slug: "medical-wear",
    title: "Medical Wear",
    subtitle: "Antimicrobial fabrics, clinical durability & ergonomic comfort",
    description: "Technical medical scrubs, tailored lab coats, warm-up hospital jackets, and institutional uniforms engineered with antimicrobial, liquid-repellent, four-way stretch fabrics.",
    image: CATEGORIES_MEDIA["medical-wear"]?.image || "/medical/image.jpg",
    video: CATEGORIES_MEDIA["medical-wear"]?.video || "/medical/video.mp4",
    fallbackImage: "/medical/image.jpg",
    productTypes: [
      "Medical Scrubs",
      "Lab Coats",
      "Medical Jackets",
      "Medical Uniforms",
      "Hospital Wear",
      "Custom Medical Apparel"
    ]
  },
  {
    id: "premium-blanks",
    slug: "premium-blanks",
    title: "Premium Blanks",
    subtitle: "Production-ready blanks built for brand relabeling & rapid drops",
    description: "High-grade blank apparel crafted from combed cotton, heavyweight loopback French terry, and brushed fleece. Seamlessly ready for screen printing, direct-to-film, and custom brand relabeling.",
    image: CATEGORIES_MEDIA["premium-blanks"]?.image || "/blanks/image.jpg",
    video: CATEGORIES_MEDIA["premium-blanks"]?.video || "/blanks/video.mp4",
    fallbackImage: "/blanks/image.jpg",
    productTypes: [
      "Blank Hoodies",
      "Blank T-Shirts",
      "Blank Sweatshirts",
      "Blank Joggers",
      "Blank Pants",
      "Blank Shorts",
      "Blank Jackets",
      "Other Blank Apparel"
    ]
  },
  {
    id: "industrial-supplies",
    slug: "industrial-supplies",
    title: "Industrial Supplies",
    subtitle: "Heavy-duty safety gear, certified protective wear & precision work gloves",
    description: "Industrial-grade protective apparel, reinforced welding gear, heat-resistant workwear, and precision safety gloves engineered for rigorous industrial, workshop, and rescue utility.",
    image: CATEGORIES_MEDIA["industrial-supplies"]?.image || "/industrial supplies/image.jpg",
    video: CATEGORIES_MEDIA["industrial-supplies"]?.video || "/industrial supplies/video.mp4",
    fallbackImage: "/industrial supplies/image.jpg",
    productTypes: [
      "Leather Welding Gloves",
      "Working Gloves",
      "Furniture Gloves",
      "Rescue Jackets",
      "Safety Jackets",
      "Other Industrial / Safety Products"
    ]
  }
];
