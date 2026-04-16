export type Locale = "en" | "sl";

export type LocalizedText = Record<Locale, string>;

export type Car = {
  id: string;
  naziv: LocalizedText;
  image: string;
  gallery: string[];
  opis: LocalizedText;
  detailOpis: LocalizedText;
  konjskeMoci: string;
  letnik: string;
  pospesek: string;
  lifestylePitch: LocalizedText;
  cardSpan: string;
};

export const inventory: Car[] = [
  {
    id: "megane-rs",
    naziv: {
      en: "Renault Megane RS 2018 Trophy",
      sl: "Renault Megane RS 2018 Trophy",
    },
    image: "/slike/megane.jpg",
    gallery: ["/slike/megane.jpg", "/slike/renault_meghan.png"],
    opis: {
      en: "A brutal sport hatch with racing DNA. 1.8L turbo engine, 300 hp, and the legendary Cup chassis for precision cornering.",
      sl: "Brutalen sportni hatch z dirkaskim DNK. 1.8L turbo motor, 300 KM in legendarno podvozje Cup za popolno natancnost v ovinkih.",
    },
    detailOpis: {
      en: "Project style: aggressive sport identity, dynamic visuals, and conversion-focused CTA blocks for premium audiences.",
      sl: "Stil projekta: agresivna sportna identiteta, dinamicni vizuali in prodajno usmerjeni CTA bloki za premium publiko.",
    },
    konjskeMoci: "300 KM",
    letnik: "2018",
    pospesek: "5.7 s",
    lifestylePitch: {
      en: "Perfect for track-day enthusiasts and adrenaline-packed weekends.",
      sl: "Idealna izbira za navdusence nad track-day dogodki in vikend adrenalinom.",
    },
    cardSpan: "md:col-span-4 md:row-span-2",
  },
  {
    id: "audi-rsq8",
    naziv: {
      en: "Audi RS Q8 2022",
      sl: "Audi RS Q8 2022",
    },
    image: "/slike/rsq8.jpg",
    gallery: ["/slike/rsq8.jpg", "/slike/audi_rs_q8.png"],
    opis: {
      en: "The pinnacle of luxury power. A 600 hp V8 biturbo blending flagship comfort with supercar-level performance.",
      sl: "Vrhunec luksuzne moci. V8 biturbo z 600 KM, ki zdruzuje udobje prestizne limuzine in zmogljivost supersportnika.",
    },
    detailOpis: {
      en: "Project style: luxury editorial layout, cinematic transitions, and premium service storytelling for high-ticket leads.",
      sl: "Stil projekta: luksuzni editorial layout, cinematic prehodi in premium pripoved za high-ticket lead-e.",
    },
    konjskeMoci: "600 KM",
    letnik: "2022",
    pospesek: "3.8 s",
    lifestylePitch: {
      en: "The ultimate family beast with executive comfort and uncompromising power.",
      sl: "Ultimativna izbira za druzinsko udobje, poslovni prestiz in brutalno moc v enem.",
    },
    cardSpan: "md:col-span-5 md:row-span-2",
  },
  {
    id: "mustang-gt",
    naziv: {
      en: "Mustang GT V8 2020",
      sl: "Mustang GT V8 2020",
    },
    image: "/slike/mustang.jpg",
    gallery: ["/slike/mustang.jpg", "/slike/mustang_gt2020.png"],
    opis: {
      en: "Pure American muscle. A 5.0L V8 delivering unforgettable sound and raw force that pins you to the seat.",
      sl: "Cista ameriska misica. 5.0L V8 motor, ki proizvaja nepozaben zvok in surovo moc, ki vas bo prilepila na sedez.",
    },
    detailOpis: {
      en: "Project style: bold typography, impactful hero sections, and emotional copy that drives fast action.",
      sl: "Stil projekta: drzna tipografija, mocni hero odseki in custven copy, ki spodbuja hitro akcijo.",
    },
    konjskeMoci: "450 KM",
    letnik: "2020",
    pospesek: "4.5 s",
    lifestylePitch: {
      en: "Built for drivers who crave character, V8 sound, and drama on every road.",
      sl: "Pravi partner za voznika, ki ceni karakter, zvok V8 in spektakel na cesti.",
    },
    cardSpan: "md:col-span-3 md:row-span-2",
  },
];

export const mockLeads = [
  {
    id: "LD-001",
    ime: "Luka Zupan",
    vozilo: "Audi RS Q8 2022",
    status: "Nov povprasevalec",
    kontakt: "luka.zupan@email.si",
  },
  {
    id: "LD-002",
    ime: "Nika Kranjc",
    vozilo: "Mustang GT V8 2020",
    status: "Caka testno voznjo",
    kontakt: "nika.kranjc@email.si",
  },
  {
    id: "LD-003",
    ime: "Marko Vidmar",
    vozilo: "Renault Megane RS 2018 Trophy",
    status: "Zakljucevanje ponudbe",
    kontakt: "marko.vidmar@email.si",
  },
];
