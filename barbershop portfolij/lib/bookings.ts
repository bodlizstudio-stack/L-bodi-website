import { promises as fs } from "fs";
import path from "path";

import { validateBookingInput } from "@/lib/schedule";

export type Booking = {
  id: string;
  customerName: string;
  customerEmail: string;
  service: string;
  date: string;
  time: string;
  notes?: string;
  createdAt: string;
};

export type NewBookingInput = {
  customerName: string;
  customerEmail: string;
  service: string;
  date: string;
  time: string;
  notes?: string;
};

const bookingsFile = path.join(process.cwd(), "data", "bookings.json");

async function ensureBookingsFile() {
  await fs.mkdir(path.dirname(bookingsFile), { recursive: true });

  try {
    await fs.access(bookingsFile);
  } catch {
    await fs.writeFile(bookingsFile, "[]", "utf8");
  }
}

export async function getBookings() {
  await ensureBookingsFile();
  const fileContent = await fs.readFile(bookingsFile, "utf8");
  const bookings = JSON.parse(fileContent) as Booking[];

  return bookings.sort((left, right) =>
    `${left.date} ${left.time}`.localeCompare(`${right.date} ${right.time}`)
  );
}

export async function createBooking(input: NewBookingInput) {
  const bookings = await getBookings();

  validateBookingInput(input.date, input.time, bookings);

  const newBooking: Booking = {
    id: crypto.randomUUID(),
    customerName: input.customerName.trim(),
    customerEmail: input.customerEmail.trim(),
    service: input.service,
    date: input.date,
    time: input.time,
    notes: input.notes?.trim() || "",
    createdAt: new Date().toISOString()
  };

  bookings.push(newBooking);

  await fs.writeFile(bookingsFile, JSON.stringify(bookings, null, 2), "utf8");

  return newBooking;
}
