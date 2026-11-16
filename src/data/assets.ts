// Centralized assets mapping for SOLEX official website

// Local generated high-definition realistic photography
import heroSolarModernRooftop from '../assets/images/hero_solar_modern_rooftop_1793967416162.jpg';
import bannerProductsCatalog from '../assets/images/banner_products_catalog_1793969857618.jpg';
import solarPhotovoltaicPanels from '../assets/images/solar_photovoltaic_panels_1793967416715.jpg';
import solarLithiumBatteries from '../assets/images/solar_lithium_batteries_1793967417689.jpg';
import solarHybridInverter from '../assets/images/solar_hybrid_inverter_1793967417844.jpg';
import solarMpptController from '../assets/images/solar_mppt_controller_1793967502866.jpg';
import solarKitComplete from '../assets/images/solar_kit_complete_1793967504678.jpg';
import solarAgriculturalPumping from '../assets/images/solar_agricultural_pumping_1793967417852.jpg';
import solarCablesConnectors from '../assets/images/solar_cables_connectors_1793967504476.jpg';
import bannerSolarSolutions from '../assets/images/banner_solar_solutions_1793969874767.jpg';
import bannerSolexTeamAbout from '../assets/images/banner_solex_team_about_1793969892045.jpg';
import bannerSolarBrandsTech from '../assets/images/banner_solar_brands_tech_1793969911104.jpg';
import bannerSolexContact from '../assets/images/banner_solex_contact_1793969927336.jpg';

// Real commercial product catalog photography
import realSolarPanel from '../assets/images/real_solar_panel_1794073469182.jpg';
import realLithiumBattery from '../assets/images/real_lithium_battery_1794073471133.jpg';
import realHybridInverter from '../assets/images/real_hybrid_inverter_1794073471330.jpg';
import realMpptController from '../assets/images/real_mppt_controller_1794073472649.jpg';
import realSolarPump from '../assets/images/real_solar_pump_1794073473894.jpg';
import realSolarCables from '../assets/images/real_solar_cables_1794073473741.jpg';

export const ASSETS = {
  // Brand logo
  logo: '/assets/aistudio/LOGO_80dbff4a.png',

  // Dedicated unique page header banners (Never repeated)
  banners: {
    home: heroSolarModernRooftop,
    products: bannerProductsCatalog,
    solutions: bannerSolarSolutions,
    about: bannerSolexTeamAbout,
    brands: bannerSolarBrandsTech,
    contact: bannerSolexContact,
  },

  // Category specific banners and featured photography (100% realistic studio hardware)
  categories: {
    panneaux: realSolarPanel,
    batteries: realLithiumBattery,
    onduleurs: realHybridInverter,
    regulateurs: realMpptController,
    kits: realHybridInverter,
    pompes: realSolarPump,
    accessoires: realSolarCables,
  },

  // Direct realistic hardware exports
  products: {
    solarPanel: realSolarPanel,
    lithiumBattery: realLithiumBattery,
    hybridInverter: realHybridInverter,
    mpptController: realMpptController,
    solarPump: realSolarPump,
    solarCables: realSolarCables,
  },

  // Team & facilities
  team: bannerSolexTeamAbout,
};
