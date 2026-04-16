"use client";

import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import {
  ArrowRight,
  CalendarCheck2,
  Clock3,
  Scissors,
  ShieldCheck,
  Sparkles
} from "lucide-react";

import { BookingForm } from "@/components/booking-form";
import logo from "@/slike/logo.png";

const smoothEase = [0.22, 1, 0.36, 1] as const;

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: smoothEase
    }
  }
};

const stagger: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const bookingCopy = {
  badge: "Fast Booking",
  heading: "Choose a slot and book in a minute.",
  description:
    "Pick a free weekday slot for 2026, choose your service, and send the booking straight to the admin dashboard.",
  nameLabel: "Full Name",
  emailLabel: "Email",
  serviceLabel: "Service",
  scheduleLabel: "Schedule",
  scheduleDescription:
    "Only real available slots are shown here. Once a time is booked, it stays visible but cannot be selected again.",
  scheduleYearLabel: "For year",
  slotLabel: "Slots for",
  takenLabel: "Taken",
  availableLabel: "Free",
  notesLabel: "Notes",
  emailPlaceholder: "name.surname@gmail.com",
  notesPlaceholder: "Optional: fade, beard trim, line-up, or anything the barber should know.",
  loadingScheduleLabel: "Loading available appointments...",
  noScheduleLabel: "There are no remaining slots in the current 2026 schedule.",
  submitLabel: "Book Appointment",
  successMessage: "Your appointment has been saved.",
  errorMessage: "Something went wrong while saving your appointment. Please try again.",
  slotRequiredMessage: "Please select one free time slot before booking.",
  services: [
    { label: "Classic Haircut", value: "Classic Haircut" },
    { label: "Fade Haircut", value: "Fade Haircut" },
    { label: "Beard Trim", value: "Beard Trim" },
    { label: "Haircut + Beard", value: "Haircut + Beard" },
    { label: "Shape Up / Line-Up", value: "Shape Up / Line-Up" },
    { label: "Premium Package", value: "Premium Package" }
  ]
};

const services = [
  { title: "Classic Haircut", detail: "Clean everyday cut", icon: Scissors },
  { title: "Fade Haircut", detail: "Sharp transitions", icon: Sparkles },
  { title: "Beard Trim", detail: "Shape and detail", icon: ShieldCheck },
  { title: "Haircut + Beard", detail: "Full refresh", icon: CalendarCheck2 }
];

const quickFacts = [
  { title: "08:00 - 18:00", text: "Weekday bookings only" },
  { title: "30 min", text: "One slot every half hour" },
  { title: "Live lock", text: "Taken slots cannot be clicked again" }
];

export default function HomePage() {
  return (
    <main className="relative overflow-hidden text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(18,115,198,0.25),_transparent_22%),radial-gradient(circle_at_top_right,_rgba(227,38,54,0.24),_transparent_22%),linear-gradient(180deg,#040507_0%,#09111c_42%,#05070b_100%)]" />
      <div className="absolute inset-x-0 top-0 h-72 barber-stripes opacity-20 blur-3xl" />
      <div className="absolute right-[-12rem] top-40 h-80 w-80 rounded-full bg-[#1273c6]/20 blur-3xl" />
      <div className="absolute left-[-10rem] top-[34rem] h-72 w-72 rounded-full bg-[#e32636]/18 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 pb-20 pt-6 sm:px-8 lg:px-10">
        <motion.header
          className="glass-panel flex flex-col gap-5 rounded-[2rem] px-5 py-4 md:flex-row md:items-center md:justify-between"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: smoothEase }}
        >
          <div className="flex items-center gap-4">
            <div className="logo-ring relative h-16 w-16 overflow-hidden rounded-full border border-white/20 bg-white/90 p-1">
              <Image
                alt="Portfolio Barbershop logo"
                className="h-full w-full rounded-full object-cover"
                src={logo}
              />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.34em] text-white/55">Portfolio</p>
              <p className="font-serif-display text-2xl text-white">Portfolio Barbershop</p>
            </div>
          </div>

          <nav className="flex flex-wrap items-center gap-3 text-sm font-medium text-white/75">
            <a className="rounded-full px-4 py-2 transition hover:bg-white/10 hover:text-white" href="#booking">
              Book
            </a>
            <a className="rounded-full px-4 py-2 transition hover:bg-white/10 hover:text-white" href="#services">
              Services
            </a>
            <a className="rounded-full px-4 py-2 transition hover:bg-white/10 hover:text-white" href="/admin">
              Admin
            </a>
            <a
              className="inline-flex items-center gap-2 rounded-full bg-[#e32636] px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#ff3346]"
              href="#booking"
            >
              Start Booking
              <ArrowRight className="h-4 w-4" />
            </a>
          </nav>
        </motion.header>

        <section className="grid items-center gap-10 py-14 lg:grid-cols-[0.95fr_1.05fr]">
          <motion.div initial="hidden" animate="show" className="max-w-3xl" variants={stagger}>
            <motion.div className="section-label" variants={fadeInUp}>
              <Sparkles className="h-4 w-4" />
              Barber Booking
            </motion.div>

            <motion.h1
              className="mt-6 font-serif-display text-5xl leading-[0.94] text-white sm:text-6xl lg:text-7xl"
              variants={fadeInUp}
            >
              Looks sharp, confident, and ready to take bookings.
            </motion.h1>

            <motion.p
              className="mt-6 max-w-2xl text-base leading-8 text-white/70 sm:text-lg"
              variants={fadeInUp}
            >
              Clean booking flow, live schedule, and simple service selection. The goal is quick booking with no extra noise.
            </motion.p>

            <motion.div className="mt-8 flex flex-wrap gap-4" variants={fadeInUp}>
              <a
                className="inline-flex items-center gap-2 rounded-full bg-[#1273c6] px-6 py-4 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#1b84dc]"
                href="#booking"
              >
                Book Appointment
              </a>
              <a
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-6 py-4 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/10"
                href="/admin"
              >
                Admin Login
              </a>
            </motion.div>

            <motion.div className="mt-10 grid gap-4 sm:grid-cols-3" variants={fadeInUp}>
              {quickFacts.map((item) => (
                <div key={item.title} className="glass-panel rounded-[1.5rem] p-5">
                  <p className="font-serif-display text-2xl text-white">{item.title}</p>
                  <p className="mt-3 text-sm leading-6 text-white/60">{item.text}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            className="glass-panel relative overflow-hidden rounded-[2.4rem] p-5"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1, ease: smoothEase }}
          >
            <div className="absolute inset-0 barber-stripes opacity-20" />
            <div className="relative rounded-[2rem] border border-white/12 bg-[#06101d]/82 p-6">
              <p className="text-sm uppercase tracking-[0.3em] text-white/48">Front desk vibe</p>
              <p className="mt-4 max-w-md font-serif-display text-4xl text-white">
                A visual system that keeps the booking experience clear and premium.
              </p>

              <div className="mt-8">
                <div className="premium-panel rounded-[1.5rem] p-5">
                  <Clock3 className="h-5 w-5 text-white" />
                  <p className="mt-5 text-xs uppercase tracking-[0.22em] text-white/45">Booking Flow</p>
                  <p className="mt-2 font-serif-display text-2xl text-white">Fast and Clear</p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                {bookingCopy.services.map((service) => (
                  <span
                    key={service.value}
                    className="rounded-full border border-white/12 bg-black/35 px-4 py-2 text-sm text-white/78"
                  >
                    {service.label}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        <section className="py-4" id="booking">
          <motion.div
            className="mx-auto max-w-5xl"
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1, ease: smoothEase }}
          >
            <BookingForm copy={bookingCopy} language="en" />
          </motion.div>
        </section>

        <motion.section
          className="grid gap-8 py-10 lg:grid-cols-[1fr_1fr]"
          id="services"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
        >
          <motion.div className="glass-panel rounded-[2rem] p-8" variants={fadeInUp}>
            <p className="section-label">
              <Scissors className="h-4 w-4" />
              Services
            </p>
            <h2 className="mt-5 font-serif-display text-4xl text-white">A short and clear menu.</h2>
            <p className="mt-4 max-w-xl text-base leading-8 text-white/68">
              Everything here is tied directly to the booking flow so people can choose fast.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {services.map((service) => {
                const Icon = service.icon;

                return (
                  <div
                    key={service.title}
                    className="rounded-[1.5rem] border border-white/10 bg-black/25 p-5"
                  >
                    <Icon className="h-5 w-5 text-white" />
                    <h3 className="mt-4 font-serif-display text-2xl text-white">{service.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-white/62">{service.detail}</p>
                  </div>
                );
              })}
            </div>
          </motion.div>

          <motion.div className="glass-panel rounded-[2rem] p-8" variants={fadeInUp}>
            <p className="section-label">
              <Clock3 className="h-4 w-4" />
              Essentials
            </p>
            <div className="mt-6 grid gap-4">
              <div className="rounded-[1.5rem] border border-white/10 bg-black/25 p-5">
                <p className="text-xs uppercase tracking-[0.22em] text-white/45">Schedule</p>
                <p className="mt-3 font-serif-display text-3xl text-white">
                  Monday to Friday, 08:00 to 18:00.
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-black/25 p-5">
                <p className="text-xs uppercase tracking-[0.22em] text-white/45">Availability</p>
                <p className="mt-3 text-sm leading-7 text-white/68">
                  Free slots are clickable. Taken slots stay visible, but cannot be selected again.
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-black/25 p-5">
                <p className="text-xs uppercase tracking-[0.22em] text-white/45">Admin</p>
                <p className="mt-2 font-serif-display text-2xl text-white">user / user</p>
              </div>
            </div>
          </motion.div>
        </motion.section>
      </div>
    </main>
  );
}
