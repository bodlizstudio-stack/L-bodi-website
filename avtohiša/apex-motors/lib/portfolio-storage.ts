import { Car, inventory } from "@/lib/inventory";

export const PORTFOLIO_STORAGE_KEY = "portfolioCarsV1";

export const loadCarsFromStorage = (): Car[] => {
  if (typeof window === "undefined") {
    return inventory;
  }

  const raw = window.localStorage.getItem(PORTFOLIO_STORAGE_KEY);
  if (!raw) {
    return inventory;
  }

  try {
    const parsed = JSON.parse(raw) as Car[];
    if (!Array.isArray(parsed)) {
      return inventory;
    }
    return parsed;
  } catch {
    return inventory;
  }
};

export const saveCarsToStorage = (cars: Car[]) => {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(PORTFOLIO_STORAGE_KEY, JSON.stringify(cars));
};
