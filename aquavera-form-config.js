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
              image_url:   "assets/fugenloses-badezimmer.webp",
              description: "Glatte Oberflächen, puristischer Loft-Look",
              image_position: "center 65%"
            },
            {
              value:       "dunkel_luxus",
              label:       "Edle Dunkelheit",
              image_url:   "assets/modern-dark-bathroom.webp",
              description: "Dunkle Fliesen, Schiefer-Optik — Luxus-Spa-Gefühl",
              image_position: "center"
            },
            {
              value:       "hell_natuerlich",
              label:       "Helle Oase",
              image_url:   "assets/modern-bright-bathroom.webp",
              description: "Helle Fliesen, Naturstein, viel Licht",
              image_position: "center 60%"
            },
            {
              value:       "holz_natur",
              label:       "Holz & Natur",
              image_url:   "assets/wood-bathroom.webp",
              description: "Warme Holztöne kombiniert mit Keramik",
              image_position: "center 45%"
            }
          ]
        }
      ]
    },

    // ── Step 2: Art des Projekts (Einzelauswahl) ──
    {
      title:        "Was haben Sie vor?",
      subtitle:     "Wählen Sie das Ziel Ihrer Sanierung.",
      badge_text:   "Ihr Projekt",
      auto_advance: true,
      fields: [
        {
          type:  "select",
          name:  "projektart",
          label: "Art des Projekts",
          options: [
            { value: "teilsanierung",       label: "Teilsanierung" },
            { value: "komplettsanierung",   label: "Komplette Sanierung" },
            { value: "barrierefrei",        label: "Barrierefreier Umbau" }
          ]
        }
      ]
    },

    // ── Step 3: Elemente / Umfang (Bildauswahl, Mehrfachauswahl) ──
    {
      title:    "Welche Elemente sollen wir einplanen?",
      subtitle: "Mehrfachauswahl möglich.",
      badge_text: "Ausstattung",
      fields: [
        {
          type:  "image_select",
          name:  "elemente",
          multi: true,
          label: "Gewünschte Elemente",
          options: [
            { value: "bodenebene_dusche",     label: "Bodentiefe Dusche",       image_url: "assets/bodentiefe-dusche.webp",       image_position: "center" },
            { value: "freistehende_badewanne", label: "Freistehende Badewanne",  image_url: "assets/freistehende-badewanne.webp", image_position: "center 60%" },
            { value: "fussbodenheizung",       label: "Fußbodenheizung",         image_url: "assets/fussbodenheizung.webp",       image_position: "center" },
            { value: "sauna",                  label: "Sauna / Dampfbad",        image_url: "assets/sauna.webp",                  image_position: "center" },
            { value: "doppelwaschtisch",       label: "Doppelwaschtisch",        image_url: "assets/doppelwaschtisch.webp",       image_position: "center 40%" },
            { value: "lichtkonzept",           label: "Neues Lichtkonzept",      image_url: "assets/lichtkonzept.webp",           image_position: "center" }
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
