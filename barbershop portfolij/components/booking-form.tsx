"use client";

import { useEffect, useState, useTransition } from "react";
import {
  CalendarDays,
  Clock3,
  LoaderCircle,
  Sparkles,
  TimerReset
} from "lucide-react";

type Language = "en" | "sl";

type BookingCopy = {
  badge: string;
  heading: string;
  description: string;
  nameLabel: string;
  emailLabel: string;
  serviceLabel: string;
  scheduleLabel: string;
  scheduleDescription: string;
  scheduleYearLabel: string;
  slotLabel: string;
  takenLabel: string;
  availableLabel: string;
  notesLabel: string;
  emailPlaceholder: string;
  notesPlaceholder: string;
  loadingScheduleLabel: string;
  noScheduleLabel: string;
  submitLabel: string;
  successMessage: string;
  errorMessage: string;
  slotRequiredMessage: string;
  services: Array<{ label: string; value: string }>;
};

type BookingFormProps = {
  language: Language;
  copy: BookingCopy;
};

type ScheduleSlot = {
  date: string;
  time: string;
  isBooked: boolean;
  bookingId: string | null;
  bookedBy: string | null;
  service: string | null;
};

type ScheduleDay = {
  date: string;
  isoLabel: string;
  weekday: string;
  day: string;
  month: string;
  year: string;
  slots: ScheduleSlot[];
};

const defaultForm = {
  customerName: "",
  customerEmail: "",
  service: "",
  date: "",
  time: "",
  notes: ""
};

function isSlotStillAvailable(
  selected: { date: string; time: string } | null,
  days: ScheduleDay[]
) {
  if (!selected) {
    return false;
  }

  return days.some(
    (day) =>
      day.date === selected.date &&
      day.slots.some((slot) => slot.time === selected.time && !slot.isBooked)
  );
}

export function BookingForm({ language, copy }: BookingFormProps) {
  const [formData, setFormData] = useState({
    ...defaultForm,
    service: copy.services[0]?.value ?? ""
  });
  const [scheduleDays, setScheduleDays] = useState<ScheduleDay[]>([]);
  const [scheduleYear, setScheduleYear] = useState("2026");
  const [activeDate, setActiveDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState<{ date: string; time: string } | null>(null);
  const [isScheduleLoading, setIsScheduleLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let isMounted = true;

    const loadSchedule = async () => {
      try {
        const response = await fetch("/api/schedule", {
          cache: "no-store"
        });

        if (!response.ok) {
          throw new Error("Failed to load schedule.");
        }

        const data = (await response.json()) as {
          year: number;
          days: ScheduleDay[];
        };

        if (!isMounted) {
          return;
        }

        setScheduleYear(String(data.year));
        setScheduleDays(data.days);
        setActiveDate((current) => {
          const hasCurrent = data.days.some((day) => day.date === current);
          return hasCurrent ? current : (data.days[0]?.date ?? "");
        });

        if (selectedSlot && !isSlotStillAvailable(selectedSlot, data.days)) {
          setSelectedSlot(null);
          setFormData((current) => ({
            ...current,
            date: "",
            time: ""
          }));
          setIsError(true);
          setStatusMessage(copy.slotRequiredMessage);
        }
      } catch {
        if (!isMounted) {
          return;
        }

        setIsError(true);
        setStatusMessage(copy.errorMessage);
      } finally {
        if (isMounted) {
          setIsScheduleLoading(false);
        }
      }
    };

    void loadSchedule();
    const interval = window.setInterval(() => {
      void loadSchedule();
    }, 30000);

    return () => {
      isMounted = false;
      window.clearInterval(interval);
    };
  }, [copy.errorMessage, copy.slotRequiredMessage, selectedSlot]);

  const activeDay = scheduleDays.find((day) => day.date === activeDate) ?? scheduleDays[0];
  const selectedSummary =
    selectedSlot && activeDay
      ? scheduleDays
          .flatMap((day) =>
            day.slots
              .filter((slot) => slot.date === selectedSlot.date && slot.time === selectedSlot.time)
              .map((slot) => ({
                dateLabel: day.isoLabel,
                time: slot.time
              }))
          )
          .at(0) ?? null
      : null;

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value
    }));
  };

  const handleSlotSelect = (slot: ScheduleSlot) => {
    if (slot.isBooked) {
      return;
    }

    setSelectedSlot({
      date: slot.date,
      time: slot.time
    });
    setFormData((current) => ({
      ...current,
      date: slot.date,
      time: slot.time
    }));
    setStatusMessage("");
    setIsError(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedSlot) {
      setIsError(true);
      setStatusMessage(copy.slotRequiredMessage);
      return;
    }

    setStatusMessage("");
    setIsError(false);

    startTransition(async () => {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { message?: string } | null;
        setIsError(true);
        setStatusMessage(payload?.message ?? copy.errorMessage);
        return;
      }

      const refreshedSchedule = await fetch("/api/schedule", {
        cache: "no-store"
      });

      if (refreshedSchedule.ok) {
        const schedulePayload = (await refreshedSchedule.json()) as {
          year: number;
          days: ScheduleDay[];
        };

        setScheduleYear(String(schedulePayload.year));
        setScheduleDays(schedulePayload.days);
        setActiveDate((current) => {
          const hasCurrent = schedulePayload.days.some((day) => day.date === current);
          return hasCurrent ? current : (schedulePayload.days[0]?.date ?? "");
        });
      }

      setSelectedSlot(null);
      setFormData({
        ...defaultForm,
        service: copy.services[0]?.value ?? ""
      });
      setStatusMessage(copy.successMessage);
    });
  };

  return (
    <div className="glass-panel relative overflow-hidden rounded-[2rem] p-8">
      <div className="barber-stripes pointer-events-none absolute inset-x-0 top-0 h-24 opacity-20" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(18,115,198,0.22),_transparent_34%),radial-gradient(circle_at_top_right,_rgba(227,38,54,0.18),_transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent_60%)]" />

      <div className="relative">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-white">
          <Sparkles className="h-4 w-4" />
          {copy.badge}
        </div>

        <h2 className="max-w-lg font-serif-display text-4xl text-white sm:text-5xl">
          {copy.heading}
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-white/70 sm:text-base">
          {copy.description}
        </p>

        <form className="mt-8 grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
          <label className="space-y-2">
            <span className="text-sm font-medium text-white/80">{copy.nameLabel}</span>
            <input
              required
              autoComplete="name"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-[#1273c6] focus:bg-white/8"
              name="customerName"
              onChange={handleChange}
              placeholder={language === "en" ? "Jordan Miles" : "Jordan Miles"}
              value={formData.customerName}
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-white/80">{copy.emailLabel}</span>
            <input
              required
              autoComplete="email"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-[#ffffff]/70 focus:bg-white/8"
              name="customerEmail"
              onChange={handleChange}
              placeholder={copy.emailPlaceholder}
              type="email"
              value={formData.customerEmail}
            />
          </label>

          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-medium text-white/80">{copy.serviceLabel}</span>
            <select
              required
              className="w-full rounded-2xl border border-white/10 bg-[#111111] px-4 py-3 text-white outline-none transition focus:border-[#ffffff]/70"
              name="service"
              onChange={handleChange}
              value={formData.service}
            >
              {copy.services.map((service) => (
                <option key={service.value} value={service.value}>
                  {service.label}
                </option>
              ))}
            </select>
          </label>

          <div className="md:col-span-2">
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-white/80">
              <CalendarDays className="h-4 w-4 text-[#1273c6]" />
              {copy.scheduleLabel}
            </div>
            <div className="rounded-[1.7rem] border border-white/10 bg-black/25 p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.22em] text-white/45">
                    {copy.scheduleYearLabel} {scheduleYear}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-white/68">{copy.scheduleDescription}</p>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.22em] text-white/60">
                  <TimerReset className="h-4 w-4" />
                  Mon to Fri, 08:00 - 18:00
                </div>
              </div>

              {isScheduleLoading ? (
                <div className="mt-6 rounded-[1.4rem] border border-white/10 bg-white/5 p-5 text-sm text-white/65">
                  {copy.loadingScheduleLabel}
                </div>
              ) : scheduleDays.length === 0 ? (
                <div className="mt-6 rounded-[1.4rem] border border-white/10 bg-white/5 p-5 text-sm text-white/65">
                  {copy.noScheduleLabel}
                </div>
              ) : (
                <>
                  <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                    {scheduleDays.map((day) => {
                      const isActive = day.date === activeDay?.date;
                      const freeSlots = day.slots.filter((slot) => !slot.isBooked).length;

                      return (
                        <button
                          key={day.date}
                          className={`rounded-[1.4rem] border px-4 py-4 text-left transition ${
                            isActive
                              ? "border-[#1273c6] bg-[#1273c6]/18 text-white"
                              : "border-white/10 bg-white/5 text-white/72 hover:border-white/20 hover:bg-white/10"
                          }`}
                          onClick={() => setActiveDate(day.date)}
                          type="button"
                        >
                          <p className="text-xs uppercase tracking-[0.24em] text-white/45">
                            {day.weekday}
                          </p>
                          <p className="mt-2 font-serif-display text-3xl text-white">
                            {day.day}.{day.month}
                          </p>
                          <p className="mt-2 text-xs uppercase tracking-[0.18em] text-white/50">
                            {freeSlots} free
                          </p>
                        </button>
                      );
                    })}
                  </div>

                  {selectedSummary ? (
                    <div className="mt-6 rounded-[1.4rem] border border-[#1273c6]/30 bg-[#1273c6]/12 p-4">
                      <p className="text-xs uppercase tracking-[0.22em] text-white/50">Selected slot</p>
                      <p className="mt-2 font-serif-display text-2xl text-white">
                        {selectedSummary.dateLabel}
                      </p>
                      <p className="mt-2 text-sm text-white/72">{selectedSummary.time}</p>
                    </div>
                  ) : null}

                  <div className="mt-6">
                    <div className="mb-3 flex items-center gap-2 text-sm font-medium text-white/80">
                      <Clock3 className="h-4 w-4 text-[#e32636]" />
                      {copy.slotLabel} {activeDay?.isoLabel}
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                      {activeDay?.slots.map((slot) => {
                        const isSelected =
                          selectedSlot?.date === slot.date && selectedSlot?.time === slot.time;

                        return (
                          <button
                            key={`${slot.date}-${slot.time}`}
                            className={`rounded-[1.3rem] border p-4 text-left transition ${
                              slot.isBooked
                                ? "cursor-not-allowed border-white/10 bg-white/5 text-white/35"
                                : isSelected
                                  ? "border-[#e32636] bg-[#e32636]/18 text-white"
                                  : "border-white/10 bg-black/25 text-white/78 hover:border-white/20 hover:bg-white/10"
                            }`}
                            disabled={slot.isBooked}
                            onClick={() => handleSlotSelect(slot)}
                            type="button"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <span className="font-serif-display text-2xl text-white">
                                  {slot.time}
                                </span>
                              </div>
                              <span
                                className={`rounded-full px-3 py-1 text-[0.65rem] uppercase tracking-[0.22em] ${
                                  slot.isBooked
                                    ? "bg-white/10 text-white/45"
                                    : "bg-[#1273c6]/20 text-white"
                                }`}
                              >
                                {slot.isBooked ? copy.takenLabel : copy.availableLabel}
                              </span>
                            </div>

                            <p className="mt-3 text-xs leading-6 text-white/55">
                              {slot.isBooked
                                ? `${slot.bookedBy ?? "Booked"}${slot.service ? ` - ${slot.service}` : ""}`
                                : "Tap to select this time."}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <input name="date" type="hidden" value={formData.date} />
          <input name="time" type="hidden" value={formData.time} />

          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-medium text-white/80">{copy.notesLabel}</span>
            <textarea
              className="min-h-32 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-[#e32636] focus:bg-white/8"
              name="notes"
              onChange={handleChange}
              placeholder={copy.notesPlaceholder}
              value={formData.notes}
            />
          </label>

          <div className="md:col-span-2">
            <button
              className="inline-flex min-w-56 items-center justify-center gap-3 rounded-full bg-[#1273c6] px-6 py-4 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#1b84dc] disabled:cursor-not-allowed disabled:opacity-70"
              disabled={isPending || isScheduleLoading}
              type="submit"
            >
              {isPending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
              {copy.submitLabel}
            </button>

            {statusMessage ? (
              <p
                className={`mt-4 text-sm ${isError ? "text-rose-300" : "text-emerald-300"}`}
              >
                {statusMessage}
              </p>
            ) : null}
          </div>
        </form>
      </div>
    </div>
  );
}
