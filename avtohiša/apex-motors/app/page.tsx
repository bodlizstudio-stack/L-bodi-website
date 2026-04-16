"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { Gauge, Sparkles, X } from "lucide-react";
import { Car, inventory, Locale } from "@/lib/inventory";
import { loadCarsFromStorage } from "@/lib/portfolio-storage";

const uiText: Record<
  Locale,
  {
    nav: { home: string; inventory: string; contact: string };
    languageLabel: string;
    heroTag: string;
    heroDescription: string;
    stockTag: string;
    stockTitle: string;
    browseImages: string;
    close: string;
    details: string;
    contactAction: string;
    contactTitle: string;
    contactDescription: string;
    contactForm: {
      fullName: string;
      email: string;
      subject: string;
      details: string;
      send: string;
    };
    footer: string;
    specs: string;
    horsepower: string;
    year: string;
    acceleration: string;
    advisorIntro: string;
    advisorOutro: string;
  }
> = {
  en: {
    nav: { home: "Home", inventory: "Inventory", contact: "Contact" },
    languageLabel: "SLO",
    heroTag: "Premium showroom experience",
    heroDescription:
      "An exclusive vehicle collection where luxury, performance, and design unite in one cinematic journey.",
    stockTag: "Curated inventory",
    stockTitle: "Bento garage of power",
    browseImages: "Browse images",
    close: "Close",
    details: "Details",
    contactAction: "Contact us",
    contactTitle: "Send inquiry",
    contactDescription:
      "Tell us about your project and we will design a unique high-converting website.",
    contactForm: {
      fullName: "Full Name",
      email: "Email",
      subject: "SUBJECT",
      details: "Details",
      send: "Send inquiry",
    },
    footer: "All rights reserved.",
    specs: "Technical specifications",
    horsepower: "Horsepower",
    year: "Year",
    acceleration: "0-100 km/h",
    advisorIntro: "Based on your driving lifestyle, this model is",
    advisorOutro:
      "With outstanding performance, premium comfort, and unmistakable character, it is ready for every scenario.",
  },
  sl: {
    nav: { home: "Domov", inventory: "Zaloga", contact: "Kontakt" },
    languageLabel: "EN",
    heroTag: "Premium showroom izkusnja",
    heroDescription:
      "Ekskluzivna kolekcija vozil, kjer se luksuz, performans in dizajn srecajo v eni cinematic izkusnji.",
    stockTag: "Izbrana zaloga",
    stockTitle: "Bento garaza moci",
    browseImages: "Brskaj slike",
    close: "Zapri",
    details: "Podrobnosti",
    contactAction: "Kontaktiraj nas",
    contactTitle: "Poslji povprasevanje",
    contactDescription:
      "Sporoci nam svoje cilje in pripravimo unikatno, prodajno usmerjeno spletno stran.",
    contactForm: {
      fullName: "Full Name",
      email: "E-posta",
      subject: "SUBJECT",
      details: "Details",
      send: "Poslji povprasevanje",
    },
    footer: "Vse pravice pridrzane.",
    specs: "Tehnicne specifikacije",
    horsepower: "Konjskih moci",
    year: "Letnik",
    acceleration: "0-100 km/h",
    advisorIntro: "Glede na tvoj stil voznje je ta model",
    advisorOutro:
      "Z visoko zmogljivostjo, premium obcutkom in brezkompromisnim karakterjem je pripravljen na vsak scenarij.",
  },
};

function AnimatedHeadline({ text }: { text: string }) {
  return (
    <h1 className="text-4xl font-semibold uppercase leading-tight tracking-[0.14em] text-white sm:text-6xl lg:text-7xl">
      {text.split("").map((char, index) => (
        <motion.span
          key={`${char}-${index}`}
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.045, duration: 0.35 }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </h1>
  );
}

function CarCard({
  car,
  locale,
  text,
  onOpenDetails,
}: {
  car: Car;
  locale: Locale;
  text: (typeof uiText)[Locale];
  onOpenDetails: (car: Car) => void;
}) {
  const cardRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <motion.article
      ref={cardRef}
      onClick={() => onOpenDetails(car)}
      className={`group relative overflow-hidden rounded-3xl border border-white/20 bg-white/5 backdrop-blur-md ${car.cardSpan}`}
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      <motion.div style={{ y: imageY }} className="absolute inset-0 scale-110">
        <Image
          src={car.image}
          alt={car.naziv[locale]}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover brightness-[0.78] transition duration-500 group-hover:scale-105"
        />
      </motion.div>

      <div className="relative flex h-full min-h-[340px] flex-col justify-end bg-gradient-to-t from-black/85 via-black/45 to-transparent p-6">
        <h3 className="text-2xl font-semibold text-white">{car.naziv[locale]}</h3>
        <p className="mt-2 max-w-xl text-sm text-zinc-200">{car.opis[locale]}</p>

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onOpenDetails(car);
          }}
          className="mt-5 inline-flex w-fit items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20"
        >
          <Sparkles size={16} />
          {text.details}
        </button>
      </div>

      <div className="pointer-events-none absolute inset-0 translate-y-full bg-black/80 p-6 text-white transition duration-500 group-hover:translate-y-0">
        <div className="mb-3 flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-zinc-300">
          <Gauge size={14} />
          {text.specs}
        </div>
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div className="min-w-0 rounded-xl border border-white/20 bg-white/10 p-3">
            <p className="break-words text-xs leading-tight text-zinc-300">
              {text.horsepower}
            </p>
            <p className="mt-1 text-base font-semibold leading-tight">{car.konjskeMoci}</p>
          </div>
          <div className="min-w-0 rounded-xl border border-white/20 bg-white/10 p-3">
            <p className="break-words text-xs leading-tight text-zinc-300">{text.year}</p>
            <p className="mt-1 text-base font-semibold leading-tight">{car.letnik}</p>
          </div>
          <div className="min-w-0 rounded-xl border border-white/20 bg-white/10 p-3">
            <p className="break-words text-xs leading-tight text-zinc-300">
              {text.acceleration}
            </p>
            <p className="mt-1 text-base font-semibold leading-tight">{car.pospesek}</p>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

const getCarMedia = (car: Car) => {
  const all = [car.image, ...car.gallery].filter(Boolean);
  return Array.from(new Set(all));
};

export default function Home() {
  const [cars, setCars] = useState<Car[]>(inventory);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [locale, setLocale] = useState<Locale>("en");
  const t = uiText[locale];

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setCars(loadCarsFromStorage());
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const navigation = useMemo(
    () => [
      { label: t.nav.home, href: "#hero" },
      { label: t.nav.inventory, href: "#zaloga" },
      { label: t.nav.contact, href: "#kontakt" },
    ],
    [t.nav.contact, t.nav.home, t.nav.inventory],
  );

  return (
    <main className="text-white">
      <header className="fixed top-4 z-50 w-full px-4 md:px-10">
        <nav className="mx-auto flex w-full max-w-7xl items-center justify-between rounded-2xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-xl">
          <div>
            <p className="text-lg font-semibold tracking-[0.18em]">PORTFOLIO STUDIO</p>
          </div>
          <ul className="hidden gap-6 text-sm text-zinc-200 md:flex">
            {navigation.map((item) => (
              <li key={item.label}>
                <a href={item.href} className="transition hover:text-white">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <Link
            href="/admin"
            className="rounded-full border border-white/25 px-4 py-2 text-xs uppercase tracking-[0.2em] transition hover:bg-white/20"
          >
            Admin
          </Link>
          <button
            type="button"
            onClick={() => setLocale((prev) => (prev === "en" ? "sl" : "en"))}
            className="rounded-full border border-white/25 px-4 py-2 text-xs uppercase tracking-[0.2em] transition hover:bg-white/20"
          >
            {t.languageLabel}
          </button>
        </nav>
      </header>

      <section id="hero" className="relative flex min-h-screen items-end overflow-hidden px-5 pb-20 md:px-10">
        <Image
          src="/slike/rsq8.jpg"
          alt="Apex Motors Hero vozilo"
          fill
          priority
          sizes="100vw"
          className="object-cover brightness-[0.45]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
        <div className="relative z-10 mx-auto w-full max-w-7xl">
          <p className="mb-4 text-xs uppercase tracking-[0.4em] text-zinc-300">
            {t.heroTag}
          </p>
          <AnimatedHeadline text="Portfolio Showcase" />
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.65 }}
            className="mt-6 max-w-xl text-base text-zinc-200 md:text-lg"
          >
            {t.heroDescription}
          </motion.p>
        </div>
      </section>

      <section id="zaloga" className="mx-auto max-w-7xl px-5 py-20 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
        >
          <p className="text-xs uppercase tracking-[0.35em] text-zinc-400">
            {t.stockTag}
          </p>
          <h2 className="mt-3 text-3xl font-semibold md:text-5xl">{t.stockTitle}</h2>
        </motion.div>

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-12 md:auto-rows-[180px]">
          {cars.map((car) => (
            <CarCard
              key={car.id}
              car={car}
              locale={locale}
              text={t}
              onOpenDetails={(nextCar) => {
                setSelectedCar(nextCar);
                setActiveImage(0);
              }}
            />
          ))}
        </div>
      </section>

      <section id="kontakt" className="mx-auto max-w-7xl px-5 pb-20 md:px-10">
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          className="rounded-3xl border border-red-500/30 bg-gradient-to-br from-zinc-950 via-zinc-900 to-red-950/30 p-8 shadow-[0_0_80px_rgba(239,68,68,0.12)] backdrop-blur-xl"
        >
          <h3 className="text-2xl font-semibold">{t.contactTitle}</h3>
          <p className="mt-2 max-w-2xl text-zinc-300">{t.contactDescription}</p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <input
              placeholder={t.contactForm.fullName}
              className="rounded-xl border border-white/20 bg-black/45 px-4 py-3 outline-none transition focus:border-red-400/70 focus:shadow-[0_0_24px_rgba(248,113,113,0.25)]"
            />
            <input
              type="email"
              placeholder={t.contactForm.email}
              className="rounded-xl border border-white/20 bg-black/45 px-4 py-3 outline-none transition focus:border-red-400/70 focus:shadow-[0_0_24px_rgba(248,113,113,0.25)]"
            />
            <input
              placeholder={t.contactForm.subject}
              className="rounded-xl border border-white/20 bg-black/45 px-4 py-3 outline-none transition focus:border-red-400/70 focus:shadow-[0_0_24px_rgba(248,113,113,0.25)] md:col-span-2"
            />
            <textarea
              placeholder={t.contactForm.details}
              rows={5}
              className="rounded-xl border border-white/20 bg-black/45 px-4 py-3 outline-none transition focus:border-red-400/70 focus:shadow-[0_0_24px_rgba(248,113,113,0.25)] md:col-span-2"
            />
          </div>
          <button
            type="submit"
            className="mt-5 rounded-full border border-red-300/40 bg-red-500/15 px-5 py-2 text-sm transition hover:bg-red-500/30"
          >
            {t.contactForm.send}
          </button>
        </motion.form>
      </section>
      <AnimatePresence>
        {selectedCar ? (
          <motion.div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/75 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCar(null)}
          >
            <motion.div
              initial={{ scale: 0.92, y: 25, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.92, y: 20, opacity: 0 }}
              transition={{ duration: 0.28 }}
              onClick={(event) => event.stopPropagation()}
              className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-3xl border border-white/20 bg-zinc-950 p-5 md:p-7"
            >
              <div className="mb-4 flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">
                  {t.details}
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedCar(null)}
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 px-3 py-1.5 text-xs uppercase tracking-[0.18em] transition hover:bg-white/10"
                >
                  <X size={14} />
                  {t.close}
                </button>
              </div>

              <h3 className="text-3xl font-semibold">{selectedCar.naziv[locale]}</h3>
              <p className="mt-2 text-zinc-300">{selectedCar.detailOpis[locale]}</p>

              <div className="mt-6 grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-white/15">
                    <Image
                      src={getCarMedia(selectedCar)[activeImage] ?? selectedCar.image}
                      alt={selectedCar.naziv[locale]}
                      fill
                      sizes="(max-width: 1024px) 100vw, 66vw"
                      className="object-cover"
                    />
                  </div>
                  <p className="mt-3 text-sm text-zinc-400">{t.browseImages}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {getCarMedia(selectedCar).map((photo, idx) => (
                      <button
                        key={`${photo}-${idx}`}
                        type="button"
                        onClick={() => setActiveImage(idx)}
                        className={`relative h-14 w-24 overflow-hidden rounded-lg border transition ${
                          idx === activeImage
                            ? "border-red-300"
                            : "border-white/20 hover:border-white/50"
                        }`}
                      >
                        <Image
                          src={photo}
                          alt={`${selectedCar.naziv[locale]} ${idx + 1}`}
                          fill
                          sizes="96px"
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 rounded-2xl border border-white/15 bg-black/35 p-5">
                  <p className="text-zinc-200">{selectedCar.lifestylePitch[locale]}</p>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="min-w-0 rounded-xl border border-white/15 bg-white/8 p-2">
                      <p className="break-words text-xs leading-tight text-zinc-400">
                        {t.horsepower}
                      </p>
                      <p className="mt-1 text-base font-semibold leading-tight">
                        {selectedCar.konjskeMoci}
                      </p>
                    </div>
                    <div className="min-w-0 rounded-xl border border-white/15 bg-white/8 p-2">
                      <p className="break-words text-xs leading-tight text-zinc-400">
                        {t.year}
                      </p>
                      <p className="mt-1 text-base font-semibold leading-tight">
                        {selectedCar.letnik}
                      </p>
                    </div>
                    <div className="min-w-0 rounded-xl border border-white/15 bg-white/8 p-2">
                      <p className="break-words text-xs leading-tight text-zinc-400">
                        {t.acceleration}
                      </p>
                      <p className="mt-1 text-base font-semibold leading-tight">
                        {selectedCar.pospesek}
                      </p>
                    </div>
                  </div>
                  <a
                    href="#kontakt"
                    onClick={() => setSelectedCar(null)}
                    className="inline-flex rounded-full border border-red-300/40 bg-red-500/15 px-4 py-2 text-sm transition hover:bg-red-500/30"
                  >
                    {t.contactAction}
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
      <footer className="border-t border-white/10 py-8 text-center text-sm text-zinc-400">
        PORTFOLIO STUDIO - {new Date().getFullYear()} - {t.footer}
      </footer>
    </main>
  );
}
