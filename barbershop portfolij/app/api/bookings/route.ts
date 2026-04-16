import { NextResponse } from "next/server";

import { createBooking, getBookings } from "@/lib/bookings";
import { BookingValidationError } from "@/lib/schedule";

export async function GET() {
  const bookings = await getBookings();
  return NextResponse.json(bookings);
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    customerName?: string;
    customerEmail?: string;
    service?: string;
    date?: string;
    time?: string;
    notes?: string;
  };

  if (!body.customerName || !body.customerEmail || !body.service || !body.date || !body.time) {
    return NextResponse.json(
      { message: "Missing required booking details." },
      { status: 400 }
    );
  }

  try {
    const booking = await createBooking({
      customerName: body.customerName,
      customerEmail: body.customerEmail,
      service: body.service,
      date: body.date,
      time: body.time,
      notes: body.notes
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    if (error instanceof BookingValidationError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    throw error;
  }
}
