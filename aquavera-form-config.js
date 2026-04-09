window.FORM_CONFIG = {
  form_key:          "aquavera-kontakt",
  api_url:           "https://client-dashboard-sand.vercel.app",
  form_name:         "aquavera-kontakt",
  thank_you_page_url: "danke.html",
  success_message:   "Vielen Dank — wir melden uns innerhalb von 24 Stunden.",
  steps: [
    // ── Step 1: Stil (Landing-Step — wird auch auf anfrage.html wiederholt) ──
    {
      title:        "Welcher Stil spricht Sie am meisten an?",
      subtitle:     "Wählen Sie das Gefühl, das Ihr neues Bad haben soll.",
      badge_text:   "Inspiration",
      auto_advance: true,
      fields: [
        {
          type:  "image_select",
          name:  "badstil",
          label: "Ihr Wunschstil",
          options: [
            {
              value:       "fugenlos",
              label:       "Fugenlos & Modern",
              image_url:   "assets/shower-modern.webp",
              description: "Glatte Oberflächen, puristischer Loft-Look"
            },
            {
              value:       "dunkel_luxus",
              label:       "Edle Dunkelheit",
              image_url:   "assets/PLACEHOLDER_dark-luxury.jpg",
              description: "Dunkle Fliesen, Schiefer-Optik — Luxus-Spa-Gefühl"
            },
            {
              value:       "hell_natuerlich",
              label:       "Helle Oase",
              image_url:   "assets/bathroom-modern.webp",
              description: "Helle Fliesen, Naturstein, viel Licht"
            },
            {
              value:       "holz_natur",
              label:       "Holz & Natur",
              image_url:   "assets/hero.webp",
              description: "Warme Holztöne kombiniert mit Keramik"
            }
          ]
        }
      ]
    },

    // ── Step 2: Art des Projekts (Bildauswahl) ──
    {
      title:        "Was haben Sie vor?",
      subtitle:     "Wählen Sie das Ziel Ihrer Sanierung.",
      badge_text:   "Ihr Projekt",
      auto_advance: true,
      fields: [
        {
          type:  "image_select",
          name:  "projektart",
          label: "Art des Projekts",
          options: [
            {
              value:       "komplettsanierung",
              label:       "Komplett-Sanierung",
              image_url:   "assets/PLACEHOLDER_komplett.jpg",
              description: "Alles neu — vom Boden bis zur Decke"
            },
            {
              value:       "barrierefrei",
              label:       "Barrierefreier Umbau",
              image_url:   "assets/PLACEHOLDER_barrierefrei.jpg",
              description: "Sicheres Bad für die Zukunft — KfW-förderfähig"
            },
            {
              value:       "teilsanierung",
              label:       "Teilsanierung",
              image_url:   "assets/PLACEHOLDER_teilsanierung.jpg",
              description: "Nur Dusche, WC oder Waschtisch erneuern"
            },
            {
              value:       "wellness",
              label:       "Wellness-Tempel",
              image_url:   "assets/project-4-after.webp",
              description: "Sauna, Spa, Dampfbad — individueller Luxus"
            }
          ]
        }
      ]
    },

    // ── Step 3: Elemente / Umfang (Mehrfachauswahl) ──
    {
      title:    "Welche Elemente sollen wir einplanen?",
      subtitle: "Mehrfachauswahl möglich.",
      badge_text: "Ausstattung",
      fields: [
        {
          type:  "multi_select",
          name:  "elemente",
          label: "Gewünschte Elemente",
          options: [
            { value: "bodenebene_dusche",     label: "Bodentiefe Dusche" },
            { value: "freistehende_badewanne", label: "Freistehende Badewanne" },
            { value: "fussbodenheizung",       label: "Fußbodenheizung" },
            { value: "sauna",                  label: "Sauna / Dampfbad" },
            { value: "doppelwaschtisch",        label: "Doppelwaschtisch" },
            { value: "lichtkonzept",            label: "Neues Lichtkonzept" }
          ],
          min_selections: 1
        }
      ]
    },

    // ── Step 4: Badgröße (Einzelauswahl) ──
    {
      title:        "Wie groß ist das aktuelle Badezimmer?",
      badge_text:   "Rahmenbedingungen",
      auto_advance: true,
      fields: [
        {
          type:  "select",
          name:  "badgroesse",
          label: "Badezimmergröße",
          options: [
            { value: "klein",    label: "Kleines Gäste-WC (unter 5 m²)" },
            { value: "standard", label: "Standardbad (5–10 m²)" },
            { value: "gross",    label: "Großes Master-Bad (10–20 m²)" },
            { value: "wellness", label: "Wellnesstempel (20 m² und mehr)" }
          ]
        }
      ]
    },

    // ── Step 5: Budget (Einzelauswahl) ──
    {
      title:        "Welchen Budgetrahmen haben Sie im Blick?",
      badge_text:   "Budget",
      auto_advance: true,
      fields: [
        {
          type:  "select",
          name:  "budget",
          label: "Budgetrahmen",
          options: [
            { value: "bis_20k",    label: "10.000 – 20.000 €" },
            { value: "bis_35k",    label: "20.000 – 35.000 €" },
            { value: "bis_60k",    label: "35.000 – 60.000 €" },
            { value: "premium",    label: "Über 60.000 €" },
            { value: "unsicher",   label: "Ich bin noch unsicher" }
          ]
        }
      ]
    },

    // ── Step 6: Loader ──
    {
      type:        "loader",
      messages:    [
        "Wir analysieren Ihre Stilwünsche…",
        "Wir prüfen die Kapazitäten unserer Experten in Stuttgart…",
        "Wir bereiten Ihre individuelle Beratung vor…"
      ],
      duration_ms: 2800
    },

    // ── Step 7: Kontaktdaten ──
    {
      title:    "Wo dürfen wir uns für Planung und Kostenschätzung melden?",
      subtitle: "Fast geschafft — nur noch Ihre Kontaktdaten.",
      badge_text: "Ihr Kontakt",
      fields: [
        {
          type:        "text",
          name:        "name",
          label:       "Ihr Name",
          placeholder: "Vor- und Nachname",
          validation:  { required: true, required_message: "Bitte geben Sie Ihren Namen ein." }
        },
        {
          type:        "email",
          name:        "email",
          label:       "E-Mail-Adresse",
          placeholder: "ihre@email.de",
          validation:  { required: true, required_message: "Bitte geben Sie Ihre E-Mail-Adresse ein." }
        },
        {
          type:        "phone",
          name:        "phone",
          label:       "Telefonnummer",
          placeholder: "+49 711 …",
          hint:        "Optional — für einen schnelleren Rückruf",
          validation:  { required: false }
        }
      ]
    }
  ]
};
