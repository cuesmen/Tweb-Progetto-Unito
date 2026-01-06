import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";
countries.registerLocale(enLocale);

// ChatGpt exported country code mapping:
const MANUAL_OVERRIDES = {
  uk: "GB",
  "u.k.": "GB",
  "united kingdom": "GB",
  england: "GB",
  usa: "US",
  "u.s.a.": "US",
  "united states": "US",
  "united states of america": "US",
  uae: "AE",
  "united arab emirates": "AE",

  ussr: "RU",
  "soviet union": "RU",
  yugoslavia: "RS",
  czechoslovakia: "CZ",
  "east germany": "DE",
  "german democratic republic": "DE",
  "serbia and montenegro": "RS",

  kosovo: "XK",
  "state of palestine": "PS",

  "bolivarian republic of venezuela": "VE",
  "lao people's democratic republic": "LA",
  "republic of moldova": "MD",
  "russian federation": "RU",
  "united republic of tanzania": "TZ",
  "vatican city": "VA",
  "ivory coast": "CI",
  "cape verde": "CV",
  "eswatini": "SZ",
  "north macedonia": "MK",
  "south korea": "KR",
  "north korea": "KP",
  "hong kong": "HK",
  macao: "MO",
  "timor-leste": "TL",
  "czechia": "CZ",
  "british indian ocean territory": "IO",
  "french southern territories": "TF",
  "heard island and mcdonald islands": "HM",
  "western sahara": "EH",
  antarctica: "AQ",
  "bouvet island": "BV",
  "svalbard and jan mayen": "SJ",
  "cocos (keeling) islands": "CC",
  "christmas island": "CX",
  "norfolk island": "NF",
  pitcairn: "PN",
  niue: "NU",
  tokelau: "TK",
  "wallis and futuna": "WF",
  "new caledonia": "NC",
  "french polynesia": "PF",
  réunion: "RE",
  "reunion": "RE",
  martinique: "MQ",
  guadeloupe: "GP",
  mayotte: "YT",
  "saint pierre and miquelon": "PM",
  "saint helena, ascension and tristan da cunha": "SH",
  montserrat: "MS",
  bermuda: "BM",
  "cayman islands": "KY",
  "british virgin islands": "VG",
  "us virgin islands": "VI",
  "american samoa": "AS",
  "northern mariana islands": "MP",
  guam: "GU",
  "puerto rico": "PR",
  greenland: "GL",
  gibraltar: "GI",
  aruba: "AW",
  "cook islands": "CK",
  "falkland islands": "FK",
  "faroe islands": "FO",

  "netherlands antilles": "AN", 
  "democratic republic of congo": "CD", 
  congo: "CG", 

  "brunei darussalam": "BN",
  "syrian arab republic": "SY",
  "dominican republic": "DO",
  "sao tome and principe": "ST",
  "côte d’ivoire": "CI",
  "cote d'ivoire": "CI",
  "holy see": "VA",
};

function clean(s) {
  return String(s || "").trim().toLowerCase();
}

export function toISO2(countryInput) {
  if (!countryInput) return null;
  const raw = String(countryInput).trim();

  if (/^[A-Za-z]{2}$/.test(raw)) return raw.toUpperCase();

  if (/^[A-Za-z]{3}$/.test(raw)) {
    const iso2 = countries.alpha3ToAlpha2(raw.toUpperCase());
    if (iso2) return iso2;
  }

  const manual = MANUAL_OVERRIDES[clean(raw)];
  if (manual) return manual;

  const byName = countries.getAlpha2Code(raw, "en");
  if (byName) return byName;

  const byNameTitle = countries.getAlpha2Code(
    raw
      .toLowerCase()
      .replace(/\s+/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase()),
    "en"
  );
  if (byNameTitle) return byNameTitle;

  return null;
}

export function listISO2(countryNames = [], max = 2) {
  const out = [];
  for (const c of countryNames) {
    const iso2 = toISO2(c);
    if (iso2 && !out.includes(iso2)) out.push(iso2);
    if (out.length >= max) break;
  }
  return out;
}
