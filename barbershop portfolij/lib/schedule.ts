import type { Booking } from "@/lib/bookings";

export const SCHEDULE_YEAR = 2026;
export const SCHEDULE_TIMEZONE = "Europe/Ljubljana";
export const WORKDAY_START_HOUR = 8;
export const WORKDAY_END_HOUR = 18;
export const SLOT_INTERVAL_MINUTES = 30;

export type ScheduleSlot = {
  date: string;
  time: string;
  isBooked: boolean;
  bookingId: string | null;
  bookedBy: string | null;
  service: string | null;
};

export type ScheduleDay = {
  date: string;
  isoLabel: string;
  weekday: string;
  day: string;
  month: string;
  year: string;
  slots: ScheduleSlot[];
};

export class BookingValidationError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = "BookingValidationError";
    this.status = status;
  }
}

function pad(value: number) {
  return value.toString().padStart(2, "0");
}

function formatDateParts(date: Date) {
  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate()
  };
}

function toIsoDate(date: Date) {
  const parts = formatDateParts(date);
  return `${parts.year}-${pad(parts.month)}-${pad(parts.day)}`;
}

function formatDisplayParts(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "UTC",
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).formatToParts(date);
}

export function getTodayInLjubljana() {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: SCHEDULE_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });

  return formatter.format(new Date());
}

export function isBookableDate(date: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return false;
  }

  const parsed = new Date(`${date}T00:00:00Z`);

  if (Number.isNaN(parsed.getTime()) || parsed.getUTCFullYear() !== SCHEDULE_YEAR) {
    return false;
  }

  const weekday = parsed.getUTCDay();
  return weekday >= 1 && weekday <= 5;
}

export function getScheduleTimes() {
  const times: string[] = [];
  const startMinutes = WORKDAY_START_HOUR * 60;
  const endMinutes = WORKDAY_END_HOUR * 60;

  for (let current = startMinutes; current < endMinutes; current += SLOT_INTERVAL_MINUTES) {
    const hours = Math.floor(current / 60);
    const minutes = current % 60;
    times.push(`${pad(hours)}:${pad(minutes)}`);
  }

  return times;
}

export function validateBookingInput(date: string, time: string, bookings: Booking[]) {
  if (!isBookableDate(date)) {
    throw new BookingValidationError("Please select a valid weekday in the 2026 schedule.");
  }

  if (date < getTodayInLjubljana()) {
    throw new BookingValidationError("Please select a future appointment date.");
  }

  if (!getScheduleTimes().includes(time)) {
    throw new BookingValidationError("Please select one of the available schedule times.");
  }

  const existingBooking = bookings.find((booking) => booking.date === date && booking.time === time);

  if (existingBooking) {
    throw new BookingValidationError("This slot has already been booked.", 409);
  }
}

export function getUpcomingScheduleDays(bookings: Booking[], daysToShow = 10): ScheduleDay[] {
  const days: ScheduleDay[] = [];
  const scheduleTimes = getScheduleTimes();
  const today = getTodayInLjubljana();
  const firstDate = today > `${SCHEDULE_YEAR}-01-01` ? today : `${SCHEDULE_YEAR}-01-01`;
  let cursor = new Date(`${firstDate}T00:00:00Z`);

  while (cursor.getUTCFullYear() === SCHEDULE_YEAR && days.length < daysToShow) {
    const isoDate = toIsoDate(cursor);

    if (isBookableDate(isoDate)) {
      const bookingMap = new Map(
        bookings
          .filter((booking) => booking.date === isoDate)
          .map((booking) => [booking.time, booking] as const)
      );

      const parts = formatDisplayParts(cursor);
      const lookup = Object.fromEntries(parts.map((part) => [part.type, part.value]));

      days.push({
        date: isoDate,
        isoLabel: `${lookup.weekday} ${lookup.day}.${lookup.month}.${lookup.year}`,
        weekday: lookup.weekday ?? "",
        day: lookup.day ?? "",
        month: lookup.month ?? "",
        year: lookup.year ?? "",
        slots: scheduleTimes.map((time) => {
          const booking = bookingMap.get(time);

          return {
            date: isoDate,
            time,
            isBooked: Boolean(booking),
            bookingId: booking?.id ?? null,
            bookedBy: booking?.customerName ?? null,
            service: booking?.service ?? null
          };
        })
      });
    }

    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return days;
}
