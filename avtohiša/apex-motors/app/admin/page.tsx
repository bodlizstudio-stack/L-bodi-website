"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, LogOut, ShieldCheck } from "lucide-react";
import { Car, mockLeads } from "@/lib/inventory";
import { loadCarsFromStorage, saveCarsToStorage } from "@/lib/portfolio-storage";

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/avif",
];

export default function AdminPage() {
  const [activePanel, setActivePanel] = useState<"cars" | "add" | "edit">("cars");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cars, setCars] = useState<Car[]>(() => loadCarsFromStorage());
  const [saveInfo, setSaveInfo] = useState("");
  const [newCarNameEn, setNewCarNameEn] = useState("");
  const [newCarNameSl, setNewCarNameSl] = useState("");
  const [newCarHp, setNewCarHp] = useState("");
  const [newCarYear, setNewCarYear] = useState("");
  const [newCarOpisEn, setNewCarOpisEn] = useState("");
  const [newCarOpisSl, setNewCarOpisSl] = useState("");
  const [newCarImage, setNewCarImage] = useState("");
  const [newCarGallery, setNewCarGallery] = useState("");

  const leads = useMemo(() => mockLeads, []);

  const commitCars = (updater: (current: Car[]) => Car[]) => {
    setCars((prev) => {
      const next = updater(prev);
      saveCarsToStorage(next);
      return next;
    });
  };

  const onLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (username === "user" && password === "user") {
      setIsLoggedIn(true);
      setError("");
      return;
    }
    setError("Invalid username or password.");
  };

  const fileToDataUrl = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result ?? ""));
      reader.onerror = () => reject(new Error("Failed to read file."));
      reader.readAsDataURL(file);
    });

  const getValidFiles = (list: FileList | null) => {
    const files = Array.from(list ?? []);
    const valid = files.filter((file) => ALLOWED_IMAGE_TYPES.includes(file.type));
    if (valid.length !== files.length) {
      setSaveInfo("Only JPG, JPEG, PNG, and AVIF files are allowed.");
      window.setTimeout(() => setSaveInfo(""), 2600);
    }
    return valid;
  };

  const updateCar = (
    id: string,
    field:
      | "konjskeMoci"
      | "letnik"
      | "pospesek"
      | "cardSpan"
      | "image"
      | "gallery"
      | "naziv.en"
      | "naziv.sl"
      | "opis.en"
      | "opis.sl"
      | "detailOpis.en"
      | "detailOpis.sl"
      | "lifestylePitch.en"
      | "lifestylePitch.sl",
    value: string,
  ) => {
    commitCars((prev) =>
      prev.map((car) => {
        if (car.id !== id) {
          return car;
        }

        if (field === "gallery") {
          return {
            ...car,
            gallery: value
              .split("\n")
              .map((line) => line.trim())
              .filter(Boolean),
          };
        }

        if (field.includes(".")) {
          const [root, locale] = field.split(".") as [string, "en" | "sl"];
          if (root === "naziv") {
            return { ...car, naziv: { ...car.naziv, [locale]: value } };
          }
          if (root === "opis") {
            return { ...car, opis: { ...car.opis, [locale]: value } };
          }
          if (root === "detailOpis") {
            return { ...car, detailOpis: { ...car.detailOpis, [locale]: value } };
          }
          return {
            ...car,
            lifestylePitch: { ...car.lifestylePitch, [locale]: value },
          };
        }

        return { ...car, [field]: value };
      }),
    );
  };

  const saveChanges = () => {
    saveCarsToStorage(cars);
    setSaveInfo("Changes saved. Refresh the main page.");
    window.setTimeout(() => setSaveInfo(""), 2600);
  };

  const handleExistingMainImageUpload = async (id: string, files: FileList | null) => {
    const validFiles = getValidFiles(files);
    if (!validFiles.length) return;
    const [first] = validFiles;
    const dataUrl = await fileToDataUrl(first);
    commitCars((prev) =>
      prev.map((car) => (car.id === id ? { ...car, image: dataUrl } : car)),
    );
  };

  const handleExistingGalleryUpload = async (id: string, files: FileList | null) => {
    const validFiles = getValidFiles(files);
    if (!validFiles.length) return;
    const urls = await Promise.all(validFiles.map(fileToDataUrl));
    commitCars((prev) =>
      prev.map((car) =>
        car.id === id ? { ...car, gallery: [...car.gallery, ...urls] } : car,
      ),
    );
  };

  const handleNewMainImageUpload = async (files: FileList | null) => {
    const validFiles = getValidFiles(files);
    if (!validFiles.length) return;
    const [first] = validFiles;
    setNewCarImage(await fileToDataUrl(first));
  };

  const handleNewGalleryUpload = async (files: FileList | null) => {
    const validFiles = getValidFiles(files);
    if (!validFiles.length) return;
    const urls = await Promise.all(validFiles.map(fileToDataUrl));
    setNewCarGallery((prev) => {
      const existing = prev
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
      return [...existing, ...urls].join("\n");
    });
  };

  const addCar = () => {
    if (
      !newCarNameEn.trim() ||
      !newCarNameSl.trim() ||
      !newCarHp.trim() ||
      !newCarYear.trim() ||
      !newCarOpisEn.trim() ||
      !newCarOpisSl.trim() ||
      !newCarImage.trim()
    ) {
      setSaveInfo("Fill in all required fields for a new car.");
      window.setTimeout(() => setSaveInfo(""), 2600);
      return;
    }

    const id = `car-${Date.now()}`;
    const gallery = newCarGallery
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    const createdCar: Car = {
      id,
      naziv: { en: newCarNameEn, sl: newCarNameSl },
      image: newCarImage,
      gallery: gallery.length ? gallery : [newCarImage],
      opis: { en: newCarOpisEn, sl: newCarOpisSl },
      detailOpis: { en: newCarOpisEn, sl: newCarOpisSl },
      konjskeMoci: newCarHp,
      letnik: newCarYear,
      pospesek: "N/A",
      lifestylePitch: {
        en: "Great fit for clients who want a modern, high-impact portfolio design.",
        sl: "Odlicna izbira za stranke, ki zelijo modern portfolio z mocnim vizualnim vtisom.",
      },
      cardSpan: "md:col-span-4 md:row-span-2",
    };

    commitCars((prev) => [...prev, createdCar]);
    setNewCarNameEn("");
    setNewCarNameSl("");
    setNewCarHp("");
    setNewCarYear("");
    setNewCarOpisEn("");
    setNewCarOpisSl("");
    setNewCarImage("");
    setNewCarGallery("");
    setSaveInfo("New car added and saved.");
    window.setTimeout(() => setSaveInfo(""), 2600);
  };

  const removeCar = (id: string) => {
    commitCars((prev) => prev.filter((car) => car.id !== id));
  };

  return (
    <main className="min-h-screen px-4 py-10 md:px-10">
      <div className="mx-auto w-full max-w-6xl">
        {!isLoggedIn ? (
          <motion.section
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto mt-20 max-w-lg rounded-3xl border border-white/20 bg-white/8 p-8 backdrop-blur-xl"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">
              Portfolio Studio
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-white">Admin Login</h1>
            <p className="mt-2 text-zinc-300">Demo credentials: user / user.</p>

            <form onSubmit={onLogin} className="mt-7 space-y-4">
              <div>
                <label className="mb-2 block text-sm text-zinc-300">
                  Username
                </label>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-xl border border-white/20 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-white/45"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm text-zinc-300">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-white/20 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-white/45"
                />
              </div>
              {error ? <p className="text-sm text-rose-300">{error}</p> : null}
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-black transition hover:bg-zinc-200"
              >
                <ShieldCheck size={18} />
                Sign In
              </button>
            </form>
          </motion.section>
        ) : (
          <motion.section
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-white/20 bg-white/8 p-6 backdrop-blur-xl md:p-8"
          >
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">
                  Admin Dashboard
                </p>
                <h2 className="mt-2 text-3xl font-semibold text-white">Lead Table</h2>
              </div>

              <div className="flex gap-2">
                <Link
                  href="/"
                  className="rounded-xl border border-white/20 px-4 py-2 text-sm text-white transition hover:bg-white/10"
                >
                  Back to showcase
                </Link>
                <button
                  type="button"
                  onClick={() => setIsLoggedIn(false)}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-4 py-2 text-sm text-white transition hover:bg-white/10"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-white/20">
              <table className="min-w-full text-left text-sm text-zinc-200">
                <thead className="bg-white/10 text-xs uppercase tracking-[0.15em] text-zinc-300">
                  <tr>
                    <th className="px-4 py-3">ID</th>
                    <th className="px-4 py-3">Client Name</th>
                    <th className="px-4 py-3">Car</th>
                    <th className="px-4 py-3">Contact</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => (
                    <tr key={lead.id} className="border-t border-white/10">
                      <td className="px-4 py-3">{lead.id}</td>
                      <td className="px-4 py-3">{lead.ime}</td>
                      <td className="px-4 py-3">{lead.vozilo}</td>
                      <td className="px-4 py-3">{lead.kontakt}</td>
                      <td className="px-4 py-3">
                        <span className="rounded-full bg-white/10 px-3 py-1 text-xs">
                          {lead.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-10 rounded-2xl border border-white/20 bg-black/30 p-5 md:p-6">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-2xl font-semibold text-white">
                  Portfolio Project Management
                </h3>
                <button
                  type="button"
                  onClick={saveChanges}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-4 py-2 text-sm transition hover:bg-white/10"
                >
                  <Check size={16} />
                  Save Changes
                </button>
              </div>
              {saveInfo ? <p className="mb-4 text-sm text-emerald-300">{saveInfo}</p> : null}
              <div className="mb-6 grid gap-2 sm:grid-cols-3">
                <button
                  type="button"
                  onClick={() => setActivePanel("cars")}
                  className={`rounded-xl border px-4 py-2 text-sm transition ${
                    activePanel === "cars"
                      ? "border-white/40 bg-white/15 text-white"
                      : "border-white/20 bg-black/20 text-zinc-300 hover:bg-white/10"
                  }`}
                >
                  1) Cars on page
                </button>
                <button
                  type="button"
                  onClick={() => setActivePanel("add")}
                  className={`rounded-xl border px-4 py-2 text-sm transition ${
                    activePanel === "add"
                      ? "border-emerald-300/40 bg-emerald-500/20 text-emerald-100"
                      : "border-white/20 bg-black/20 text-zinc-300 hover:bg-white/10"
                  }`}
                >
                  2) Add car
                </button>
                <button
                  type="button"
                  onClick={() => setActivePanel("edit")}
                  className={`rounded-xl border px-4 py-2 text-sm transition ${
                    activePanel === "edit"
                      ? "border-sky-300/40 bg-sky-500/20 text-sky-100"
                      : "border-white/20 bg-black/20 text-zinc-300 hover:bg-white/10"
                  }`}
                >
                  3) Edit cars
                </button>
              </div>

              {activePanel === "cars" ? (
                <div className="space-y-3">
                  {cars.map((car) => (
                    <div
                      key={car.id}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3"
                    >
                      <div>
                        <p className="text-sm font-semibold text-white">{car.naziv.sl}</p>
                        <p className="text-xs text-zinc-400">
                          {car.konjskeMoci} - {car.letnik} - images: {car.gallery.length}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeCar(car.id)}
                        className="rounded-lg border border-rose-300/30 px-3 py-1 text-xs uppercase tracking-[0.16em] text-rose-200 transition hover:bg-rose-500/20"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              ) : null}

              {activePanel === "add" ? (
                <div className="rounded-2xl border border-emerald-300/20 bg-emerald-950/20 p-4">
                  <p className="mb-3 text-sm uppercase tracking-[0.16em] text-emerald-200">
                    Add new car/project
                  </p>
                  <div className="grid gap-3 md:grid-cols-2">
                    <input
                      value={newCarNameEn}
                      onChange={(e) => setNewCarNameEn(e.target.value)}
                      placeholder="Name EN *"
                      className="rounded-xl border border-white/20 bg-black/40 px-3 py-2 text-sm"
                    />
                    <input
                      value={newCarNameSl}
                      onChange={(e) => setNewCarNameSl(e.target.value)}
                      placeholder="Name SLO *"
                      className="rounded-xl border border-white/20 bg-black/40 px-3 py-2 text-sm"
                    />
                    <input
                      value={newCarHp}
                      onChange={(e) => setNewCarHp(e.target.value)}
                      placeholder="Horsepower (npr. 420 KM) *"
                      className="rounded-xl border border-white/20 bg-black/40 px-3 py-2 text-sm"
                    />
                    <input
                      value={newCarYear}
                      onChange={(e) => setNewCarYear(e.target.value)}
                      placeholder="Year *"
                      className="rounded-xl border border-white/20 bg-black/40 px-3 py-2 text-sm"
                    />
                    <textarea
                      value={newCarOpisEn}
                      onChange={(e) => setNewCarOpisEn(e.target.value)}
                      placeholder="Description EN *"
                      rows={2}
                      className="rounded-xl border border-white/20 bg-black/40 px-3 py-2 text-sm"
                    />
                    <textarea
                      value={newCarOpisSl}
                      onChange={(e) => setNewCarOpisSl(e.target.value)}
                      placeholder="Description SLO *"
                      rows={2}
                      className="rounded-xl border border-white/20 bg-black/40 px-3 py-2 text-sm"
                    />
                    <input
                      value={newCarImage}
                      onChange={(e) => setNewCarImage(e.target.value)}
                      placeholder="Main image (e.g. /slike/my-car.jpg) *"
                      className="rounded-xl border border-white/20 bg-black/40 px-3 py-2 text-sm md:col-span-2"
                    />
                    <label className="rounded-xl border border-dashed border-emerald-300/30 bg-emerald-950/20 px-3 py-2 text-sm text-emerald-100 md:col-span-2">
                      Add attachment (main image): JPG, JPEG, PNG, AVIF
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png,.avif,image/jpeg,image/png,image/avif"
                        onChange={(e) => handleNewMainImageUpload(e.target.files)}
                        className="mt-2 block w-full text-xs"
                      />
                    </label>
                    <textarea
                      value={newCarGallery}
                      onChange={(e) => setNewCarGallery(e.target.value)}
                      placeholder="Image gallery (one path per line)"
                      rows={3}
                      className="rounded-xl border border-white/20 bg-black/40 px-3 py-2 text-sm md:col-span-2"
                    />
                    <label className="rounded-xl border border-dashed border-emerald-300/30 bg-emerald-950/20 px-3 py-2 text-sm text-emerald-100 md:col-span-2">
                      Add attachment (gallery): JPG, JPEG, PNG, AVIF
                      <input
                        type="file"
                        multiple
                        accept=".jpg,.jpeg,.png,.avif,image/jpeg,image/png,image/avif"
                        onChange={(e) => handleNewGalleryUpload(e.target.files)}
                        className="mt-2 block w-full text-xs"
                      />
                    </label>
                  </div>
                  <button
                    type="button"
                    onClick={addCar}
                    className="mt-4 rounded-xl border border-emerald-300/30 bg-emerald-500/15 px-4 py-2 text-sm transition hover:bg-emerald-500/30"
                  >
                    Add Car
                  </button>
                </div>
              ) : null}

              {activePanel === "edit" ? (
                <div className="space-y-6">
                  {cars.map((car) => (
                    <div
                      key={car.id}
                      className="rounded-2xl border border-white/10 bg-white/5 p-4"
                    >
                      <p className="mb-4 text-sm uppercase tracking-[0.18em] text-zinc-400">
                        {car.id}
                      </p>
                      <div className="grid gap-3 md:grid-cols-2">
                        <input
                          value={car.naziv.en}
                          onChange={(e) => updateCar(car.id, "naziv.en", e.target.value)}
                        placeholder="Title EN"
                          className="rounded-xl border border-white/20 bg-black/40 px-3 py-2 text-sm"
                        />
                        <input
                          value={car.naziv.sl}
                          onChange={(e) => updateCar(car.id, "naziv.sl", e.target.value)}
                        placeholder="Title SLO"
                          className="rounded-xl border border-white/20 bg-black/40 px-3 py-2 text-sm"
                        />
                        <input
                          value={car.image}
                          onChange={(e) => updateCar(car.id, "image", e.target.value)}
                        placeholder="Main image"
                          className="rounded-xl border border-white/20 bg-black/40 px-3 py-2 text-sm md:col-span-2"
                        />
                        <label className="rounded-xl border border-dashed border-white/30 bg-black/30 px-3 py-2 text-sm text-zinc-300 md:col-span-2">
                          Add attachment (main image): JPG, JPEG, PNG, AVIF
                          <input
                            type="file"
                            accept=".jpg,.jpeg,.png,.avif,image/jpeg,image/png,image/avif"
                            onChange={(e) =>
                              handleExistingMainImageUpload(car.id, e.target.files)
                            }
                            className="mt-2 block w-full text-xs"
                          />
                        </label>
                        <textarea
                          value={car.gallery.join("\n")}
                          onChange={(e) => updateCar(car.id, "gallery", e.target.value)}
                          placeholder="Image gallery, one path per line"
                          rows={3}
                          className="rounded-xl border border-white/20 bg-black/40 px-3 py-2 text-sm md:col-span-2"
                        />
                        <label className="rounded-xl border border-dashed border-white/30 bg-black/30 px-3 py-2 text-sm text-zinc-300 md:col-span-2">
                          Add attachment (gallery): JPG, JPEG, PNG, AVIF
                          <input
                            type="file"
                            multiple
                            accept=".jpg,.jpeg,.png,.avif,image/jpeg,image/png,image/avif"
                            onChange={(e) =>
                              handleExistingGalleryUpload(car.id, e.target.files)
                            }
                            className="mt-2 block w-full text-xs"
                          />
                        </label>
                        <textarea
                          value={car.opis.en}
                          onChange={(e) => updateCar(car.id, "opis.en", e.target.value)}
                          placeholder="Short description EN"
                          rows={2}
                          className="rounded-xl border border-white/20 bg-black/40 px-3 py-2 text-sm"
                        />
                        <textarea
                          value={car.opis.sl}
                          onChange={(e) => updateCar(car.id, "opis.sl", e.target.value)}
                          placeholder="Short description SLO"
                          rows={2}
                          className="rounded-xl border border-white/20 bg-black/40 px-3 py-2 text-sm"
                        />
                        <textarea
                          value={car.detailOpis.en}
                          onChange={(e) =>
                            updateCar(car.id, "detailOpis.en", e.target.value)
                          }
                          placeholder="Detailed description EN"
                          rows={2}
                          className="rounded-xl border border-white/20 bg-black/40 px-3 py-2 text-sm"
                        />
                        <textarea
                          value={car.detailOpis.sl}
                          onChange={(e) =>
                            updateCar(car.id, "detailOpis.sl", e.target.value)
                          }
                          placeholder="Detailed description SLO"
                          rows={2}
                          className="rounded-xl border border-white/20 bg-black/40 px-3 py-2 text-sm"
                        />
                        <input
                          value={car.konjskeMoci}
                          onChange={(e) => updateCar(car.id, "konjskeMoci", e.target.value)}
                          placeholder="Horsepower"
                          className="rounded-xl border border-white/20 bg-black/40 px-3 py-2 text-sm"
                        />
                        <input
                          value={car.pospesek}
                          onChange={(e) => updateCar(car.id, "pospesek", e.target.value)}
                          placeholder="0-100 km/h"
                          className="rounded-xl border border-white/20 bg-black/40 px-3 py-2 text-sm"
                        />
                        <textarea
                          value={car.lifestylePitch.en}
                          onChange={(e) =>
                            updateCar(car.id, "lifestylePitch.en", e.target.value)
                          }
                          placeholder="Sales pitch EN"
                          rows={2}
                          className="rounded-xl border border-white/20 bg-black/40 px-3 py-2 text-sm"
                        />
                        <textarea
                          value={car.lifestylePitch.sl}
                          onChange={(e) =>
                            updateCar(car.id, "lifestylePitch.sl", e.target.value)
                          }
                          placeholder="Sales pitch SLO"
                          rows={2}
                          className="rounded-xl border border-white/20 bg-black/40 px-3 py-2 text-sm"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </motion.section>
        )}
      </div>
    </main>
  );
}
