import Image from "next/image";
import { cookies } from "next/headers";
import {
  CalendarDays,
  Clock3,
  LogOut,
  Mail,
  Shield,
  Sparkles,
  UserRound
} from "lucide-react";

import { AdminLoginForm } from "@/components/admin-login-form";
import { ADMIN_COOKIE } from "@/lib/admin";
import { getBookings } from "@/lib/bookings";
import { getUpcomingScheduleDays, SCHEDULE_YEAR } from "@/lib/schedule";
import logo from "@/slike/logo.png";

async function logout() {
  "use server";

  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE);
}

const adminCopy = {
  eyebrow: "Admin Access",
  title: "Sign in to the dashboard",
  description:
    "Sign in with username and password user / user to review every booking in one place.",
  usernameLabel: "Username",
  passwordLabel: "Password",
  submitLabel: "Enter Admin",
  invalidLabel: "The credentials you entered are not correct.",
  hint: "Username: user / Password: user"
};

function formatBookingDate(date: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(new Date(`${date}T12:00:00`));
}

function formatCreatedAt(date: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(date));
}

export default async function AdminPage() {
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.get(ADMIN_COOKIE)?.value === "authenticated";

  if (!isAuthenticated) {
    return (
      <main className="relative min-h-screen overflow-hidden px-6 py-10 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(18,115,198,0.24),_transparent_22%),radial-gradient(circle_at_top_right,_rgba(227,38,54,0.22),_transparent_22%),linear-gradient(180deg,#040507_0%,#09111c_42%,#05070b_100%)]" />
        <div className="absolute inset-x-0 top-0 h-56 barber-stripes opacity-20 blur-3xl" />

        <div className="relative mx-auto flex min-h-[80vh] max-w-6xl items-center justify-center">
          <AdminLoginForm copy={adminCopy} />
        </div>
      </main>
    );
  }

  const bookings = await getBookings();
  const scheduleDays = getUpcomingScheduleDays(bookings, 10);
  const totalScheduleSlots = scheduleDays.reduce((total, day) => total + day.slots.length, 0);
  const bookedScheduleSlots = scheduleDays.reduce(
    (total, day) => total + day.slots.filter((slot) => slot.isBooked).length,
    0
  );

  return (
    <main className="relative min-h-screen overflow-hidden px-5 py-8 text-white sm:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(18,115,198,0.24),_transparent_22%),radial-gradient(circle_at_top_right,_rgba(227,38,54,0.22),_transparent_22%),linear-gradient(180deg,#040507_0%,#09111c_42%,#05070b_100%)]" />
      <div className="absolute inset-x-0 top-0 h-56 barber-stripes opacity-20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <section className="glass-panel rounded-[2rem] p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="logo-ring relative h-[4.5rem] w-[4.5rem] overflow-hidden rounded-full border border-white/20 bg-white/90 p-1">
                <Image alt="Portfolio Barbershop logo" className="h-full w-full rounded-full object-cover" src={logo} />
              </div>

              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white">
                  <Shield className="h-4 w-4" />
                  Admin dashboard
                </div>
                <h1 className="mt-5 font-serif-display text-4xl text-white sm:text-5xl">
                  Schedule and Client Overview
                </h1>
                <p className="mt-4 max-w-3xl text-sm leading-7 text-white/68 sm:text-base">
                  This admin page now has two areas: a live schedule board for the fixed 2026 weekday slots
                  and a full booking list with client details.
                </p>
              </div>
            </div>

            <form action={logout}>
              <button
                className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-black/30 px-5 py-3 text-sm font-medium text-white transition hover:border-[#e32636]/45 hover:bg-[#e32636]/10"
                type="submit"
              >
                <LogOut className="h-4 w-4" />
                Log Out
              </button>
            </form>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-4">
            <div className="rounded-[1.5rem] border border-white/10 bg-black/25 p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-white/45">Total Bookings</p>
              <p className="mt-3 font-serif-display text-4xl text-white">{bookings.length}</p>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-black/25 p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-white/45">Schedule Year</p>
              <p className="mt-3 font-serif-display text-4xl text-white">{SCHEDULE_YEAR}</p>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-black/25 p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-white/45">Upcoming Booked Slots</p>
              <p className="mt-3 font-serif-display text-4xl text-white">{bookedScheduleSlots}</p>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-black/25 p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-white/45">Upcoming Free Slots</p>
              <p className="mt-3 font-serif-display text-4xl text-white">
                {totalScheduleSlots - bookedScheduleSlots}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8 glass-panel rounded-[2rem] p-6 sm:p-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="section-label">
                <CalendarDays className="h-4 w-4" />
                Schedule Board
              </p>
              <h2 className="mt-5 font-serif-display text-4xl text-white">
                Weekday slots for {SCHEDULE_YEAR}
              </h2>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-white/68 sm:text-base">
                Monday to Friday, from 08:00 to 18:00, every 30 minutes. A booked slot stays visible here,
                but it is already locked for everyone else.
              </p>
            </div>

            <div className="rounded-full border border-white/12 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.22em] text-white/55">
              10 upcoming workdays
            </div>
          </div>

          <div className="mt-8 grid gap-5 xl:grid-cols-2">
            {scheduleDays.map((day) => (
              <article
                key={day.date}
                className="rounded-[1.7rem] border border-white/10 bg-black/25 p-5"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-white/45">{day.weekday}</p>
                    <h3 className="mt-2 font-serif-display text-3xl text-white">
                      {day.day}.{day.month}.{day.year}
                    </h3>
                  </div>
                  <div className="text-right">
                    <p className="text-xs uppercase tracking-[0.22em] text-white/40">Slots</p>
                    <p className="mt-2 text-sm text-white/70">
                      {day.slots.filter((slot) => !slot.isBooked).length} free /{" "}
                      {day.slots.filter((slot) => slot.isBooked).length} booked
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {day.slots.map((slot) => (
                    <div
                      key={`${day.date}-${slot.time}`}
                      className={`rounded-[1.2rem] border p-4 ${
                        slot.isBooked
                          ? "border-[#e32636]/35 bg-[#e32636]/10"
                          : "border-white/10 bg-white/5"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-serif-display text-2xl text-white">{slot.time}</span>
                        <span
                          className={`rounded-full px-3 py-1 text-[0.65rem] uppercase tracking-[0.22em] ${
                            slot.isBooked
                              ? "bg-[#e32636]/20 text-white"
                              : "bg-[#1273c6]/18 text-white"
                          }`}
                        >
                          {slot.isBooked ? "Booked" : "Free"}
                        </span>
                      </div>

                      <p className="mt-3 text-xs leading-6 text-white/60">
                        {slot.isBooked
                          ? `${slot.bookedBy ?? "Reserved"}${slot.service ? ` • ${slot.service}` : ""}`
                          : "Available for booking"}
                      </p>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-5">
            <p className="section-label">
              <Sparkles className="h-4 w-4" />
              Booking List
            </p>
          </div>

          {bookings.length === 0 ? (
            <div className="glass-panel rounded-[2rem] p-8">
              <div className="flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-white" />
                <p className="font-serif-display text-3xl text-white">No bookings yet.</p>
              </div>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/64">
                As soon as someone submits the booking form, the reservation will appear here.
              </p>
            </div>
          ) : (
            <div className="grid gap-5">
              {bookings.map((booking) => (
                <article
                  key={booking.id}
                  className="glass-panel relative overflow-hidden rounded-[2rem] p-6"
                >
                  <div className="absolute inset-y-0 left-0 w-2 bg-[linear-gradient(180deg,#1273c6_0%,#f8fafc_48%,#e32636_100%)]" />

                  <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                    <div>
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/12 bg-white/10 text-white">
                          <UserRound className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-[0.24em] text-white/42">Client</p>
                          <h2 className="font-serif-display text-3xl text-white">
                            {booking.customerName}
                          </h2>
                        </div>
                      </div>

                      <div className="mt-6 grid gap-4 sm:grid-cols-2">
                        <div className="rounded-[1.4rem] border border-white/10 bg-black/25 p-4">
                          <p className="text-xs uppercase tracking-[0.22em] text-white/45">Email</p>
                          <div className="mt-3 flex items-center gap-2 text-sm text-white/78">
                            <Mail className="h-4 w-4 text-[#1273c6]" />
                            {booking.customerEmail || "Not provided"}
                          </div>
                        </div>

                        <div className="rounded-[1.4rem] border border-white/10 bg-black/25 p-4">
                          <p className="text-xs uppercase tracking-[0.22em] text-white/45">Service</p>
                          <p className="mt-3 text-sm text-white/78">{booking.service}</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-4">
                      <div className="rounded-[1.4rem] border border-white/10 bg-black/25 p-4">
                        <p className="text-xs uppercase tracking-[0.22em] text-white/45">Appointment</p>
                        <div className="mt-3 flex flex-wrap gap-4 text-sm text-white/78">
                          <span className="inline-flex items-center gap-2">
                            <CalendarDays className="h-4 w-4 text-[#1273c6]" />
                            {formatBookingDate(booking.date)}
                          </span>
                          <span className="inline-flex items-center gap-2">
                            <Clock3 className="h-4 w-4 text-[#e32636]" />
                            {booking.time}
                          </span>
                        </div>
                      </div>

                      <div className="rounded-[1.4rem] border border-white/10 bg-black/25 p-4">
                        <p className="text-xs uppercase tracking-[0.22em] text-white/45">Submitted</p>
                        <p className="mt-3 text-sm text-white/78">{formatCreatedAt(booking.createdAt)}</p>
                      </div>

                      <div className="rounded-[1.4rem] border border-white/10 bg-black/25 p-4">
                        <p className="text-xs uppercase tracking-[0.22em] text-white/45">Notes</p>
                        <p className="mt-3 text-sm leading-7 text-white/70">
                          {booking.notes || "No extra notes."}
                        </p>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
