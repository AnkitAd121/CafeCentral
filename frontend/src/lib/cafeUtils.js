// Shared cafe helpers: open-now detection, weekly featured rotation, random pick.

export function parseTimeToMinutes(str) {
  const m = str.trim().match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!m) return null;
  let h = parseInt(m[1], 10) % 12;
  if (m[3].toUpperCase() === "PM") h += 12;
  return h * 60 + parseInt(m[2], 10);
}

// Determines whether a cafe is currently open based on its "8:00 AM – 10:00 PM" hours.
export function isOpenNow(cafe, now = new Date()) {
  const parts = cafe.hours.split(/\s*[–-]\s*/);
  if (parts.length < 2) return true;
  const start = parseTimeToMinutes(parts[0]);
  let end = parseTimeToMinutes(parts[1]);
  if (start == null || end == null) return true;
  if (end === 0) end = 24 * 60; // 12:00 AM closing => midnight
  const mins = now.getHours() * 60 + now.getMinutes();
  if (end <= start) return mins >= start || mins < end; // crosses midnight
  return mins >= start && mins < end;
}

export function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

// Deterministic weekly rotation — stable within a week, advances every 7 days.
export function getWeeklyFeatured(list) {
  const week = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
  return list[week % list.length];
}

export const featuredBlurbs = {
  "dyu-art-cafe":
    "A rotating gallery, a mango-tree courtyard, and pour-overs worth lingering over — slow living, bottled.",
  "the-daily-grind":
    "Twelve seats, one obsessive barista, and the best 27-second espresso in the city. Unfiltered coffee craft.",
  "pages-and-pour":
    "Two thousand books, a riverside view, and Friday poetry nights — Guwahati's coziest reason to stay a while.",
  "highland-brew":
    "Northeastern flavour in every cup: Assam CTC espresso, bamboo-shoot bites, and handwoven Majuli warmth.",
  "rooftop-ritual":
    "An open sky, the Brahmaputra at dusk, and a sunset cocktail timed to perfection. Golden hour has a home.",
  "the-quiet-cup":
    "The city's only enforced-quiet cafe and its highest rated. Bring your hardest work and sink into the calm.",
};
