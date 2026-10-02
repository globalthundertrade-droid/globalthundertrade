import { GTT_STATS } from './companyStatsData';

export const PRIMARY_BRAND_STAT = {
  number: "250+",
  label: "BRANDS SERVED",
  sublabel: "Helping emerging labels and high-volume clothing brands turn ideas into market-ready products."
};

export const MARKETS = [
  { code: "PK", name: "Pakistan", lat: 31.5204, lon: 74.3587, brands: "HQ", origin: true, flag: "🇵🇰", detail: "Manufacturing & Technical Sourcing Headquarters" },
  { code: "US", name: "United States", lat: 40.7128, lon: -74.0060, brands: "250+", flag: "🇺🇸", detail: "Streetwear & luxury fashion clients across NY, LA & Miami" },
  { code: "SA", name: "Saudi Arabia / KSA", lat: 24.7136, lon: 46.6753, brands: "90+", flag: "🇸🇦", detail: "Gulf region bespoke streetwear & contemporary fashion drops" },
  { code: "UK", name: "United Kingdom", lat: 51.5074, lon: -0.1278, brands: "120+", flag: "🇬🇧", detail: "London independent streetwear & boutique designer labels" },
  { code: "CA", name: "Canada", lat: 43.6532, lon: -79.3832, brands: "90+", flag: "🇨🇦", detail: "Activewear, winter outerwear & heavyweight blank supply" },
  { code: "CO", name: "Colombia", lat: 4.7110, lon: -74.0721, brands: "80+", flag: "🇨🇴", detail: "South American urban apparel distributions & denim production" },
  { code: "TR", name: "Turkey", lat: 41.0082, lon: 28.9784, brands: "85+", flag: "🇹🇷", detail: "Fabric partnership & Mediterranean fashion supply" },
  { code: "IT", name: "Italy", lat: 41.9028, lon: 12.4964, brands: "90+", flag: "🇮🇹", detail: "High-spec leather goods & Milan design studio partners" },
  { code: "PT", name: "Portugal", lat: 38.7223, lon: -9.1393, brands: "80+", flag: "🇵🇹", detail: "European textile coordination & outerwear development" },
  { code: "FR", name: "France", lat: 48.8566, lon: 2.3522, brands: "85+", flag: "🇫🇷", detail: "Parisian contemporary RTW lines & technical streetwear" },
  { code: "DE", name: "Germany", lat: 52.5200, lon: 13.4050, brands: "90+", flag: "🇩🇪", detail: "Technical apparel & minimalist streetwear brands" },
  { code: "AU", name: "Australia", lat: -33.8688, lon: 151.2093, brands: "90+", flag: "🇦🇺", detail: "Surf-street brands & luxury heavyweight fleece supply" }
];

export const COMPANY_STATS = GTT_STATS.map(s => ({
  id: s.id,
  label: s.label,
  value: `${s.value}${s.suffix}`,
  count: s.value,
  suffix: s.suffix
}));

