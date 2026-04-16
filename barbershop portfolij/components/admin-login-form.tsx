"use client";

import { useState, useTransition } from "react";
import { LockKeyhole, LoaderCircle } from "lucide-react";

type AdminLoginFormProps = {
  copy: {
    eyebrow: string;
    title: string;
    description: string;
    usernameLabel: string;
    passwordLabel: string;
    submitLabel: string;
    invalidLabel: string;
    hint: string;
  };
};

export function AdminLoginForm({ copy }: AdminLoginFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    startTransition(async () => {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        setError(copy.invalidLabel);
        return;
      }

      window.location.reload();
    });
  };

  return (
    <div className="glass-panel relative mx-auto max-w-xl overflow-hidden rounded-[2rem] p-8">
      <div className="barber-stripes absolute inset-x-0 top-0 h-24 opacity-20" />

      <div className="relative inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white">
        <LockKeyhole className="h-4 w-4" />
        {copy.eyebrow}
      </div>

      <h1 className="relative mt-6 font-serif-display text-4xl text-white">{copy.title}</h1>
      <p className="relative mt-3 text-sm leading-7 text-white/70">{copy.description}</p>

      <form className="relative mt-8 space-y-4" onSubmit={handleSubmit}>
        <label className="block space-y-2">
          <span className="text-sm font-medium text-white/80">{copy.usernameLabel}</span>
          <input
            className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-[#1273c6]"
            onChange={(event) => setUsername(event.target.value)}
            value={username}
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-white/80">{copy.passwordLabel}</span>
          <input
            className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-[#e32636]"
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            value={password}
          />
        </label>

        <button
          className="inline-flex min-w-48 items-center justify-center gap-3 rounded-full bg-[#1273c6] px-6 py-4 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#1b84dc] disabled:cursor-not-allowed disabled:opacity-70"
          disabled={isPending}
          type="submit"
        >
          {isPending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
          {copy.submitLabel}
        </button>
      </form>

      <p className="relative mt-4 text-xs uppercase tracking-[0.24em] text-white/40">{copy.hint}</p>

      {error ? <p className="relative mt-4 text-sm text-rose-300">{error}</p> : null}
    </div>
  );
}
