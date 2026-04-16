import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { ADMIN_COOKIE, ADMIN_PASSWORD, ADMIN_USERNAME } from "@/lib/admin";

export async function POST(request: Request) {
  const body = (await request.json()) as { username?: string; password?: string };

  if (body.username !== ADMIN_USERNAME || body.password !== ADMIN_PASSWORD) {
    return NextResponse.json({ message: "Invalid credentials." }, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, "authenticated", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8
  });

  return NextResponse.json({ ok: true });
}
