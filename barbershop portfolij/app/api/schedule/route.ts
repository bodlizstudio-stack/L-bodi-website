import { NextResponse } from "next/server";

import { getBookings } from "@/lib/bookings";
import { getUpcomingScheduleDays, SCHEDULE_YEAR } from "@/lib/schedule";

export async function GET() {
  const bookings = await getBookings();
  const days = getUpcomingScheduleDays(bookings, 10);

  return NextResponse.json({
    year: SCHEDULE_YEAR,
    days
  });
}
