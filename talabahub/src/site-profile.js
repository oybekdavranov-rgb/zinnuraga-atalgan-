'use strict';
/**
 * SAYT PROFILI — qaysi to'plamlar (jadvallar) shu loyihada faol.
 *
 * Profillar:
 *   - "hub"        — TalabaHub: talaba super-app (uy-joy + hamxona + ish + bozor + chegirmalar)
 *   - "university" — (eski) Kokand University asosiy sayti
 *   - "castle"     — (eski) faqat talabalar shaharchasi sayti
 *   - "all"        — barcha to'plamlar bitta serverda (development/superset)
 *
 * SITE_PROFILE muhit o'zgaruvchisi yoki shu fayldagi DEFAULT bilan belgilanadi.
 */

// TalabaHub xizmatlari (super-app) — bitta saytda jamlangan to'plamlar
const HUB_COLLECTIONS = ['residences', 'roommates', 'jobs', 'market', 'partners', 'applications'];

const PROFILES = {
  hub: {
    label: 'TalabaHub',
    collections: HUB_COLLECTIONS,
    homepage: 'index.html',
  },
  university: {
    label: 'Kokand University',
    collections: ['news', 'achievements', 'distinctions', 'interests', 'programmes', 'stories', 'gallery'],
    homepage: 'index.html',
  },
  castle: {
    label: 'Talabalar shaharchasi',
    collections: ['residences', 'castle_pages', 'applications'],
    homepage: 'shaharcha.html',
  },
  all: {
    label: 'TalabaHub (to‘liq)',
    collections: ['news', 'achievements', 'distinctions', 'interests', 'programmes', 'stories', 'gallery',
      'residences', 'castle_pages', 'roommates', 'jobs', 'market', 'partners', 'applications'],
    homepage: 'index.html',
  },
};

const DEFAULT_PROFILE = 'hub';
const name = process.env.SITE_PROFILE && PROFILES[process.env.SITE_PROFILE]
  ? process.env.SITE_PROFILE
  : DEFAULT_PROFILE;

const profile = { name, ...PROFILES[name] };
const enabled = new Set(profile.collections);

/** Shu profilda to'plam faolmi? */
function has(collection) {
  return enabled.has(collection);
}

module.exports = { profile, PROFILES, has };
