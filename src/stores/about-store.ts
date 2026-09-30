import { create } from "zustand";

import { DEFAULT_YEAR, type HistoryEntry } from "@/content/sobre-mi";

type AboutState = {
  year: HistoryEntry["id"];
  modalOpen: boolean;
  setYear: (year: HistoryEntry["id"]) => void;
  setModalOpen: (open: boolean) => void;
};

export const useAboutStore = create<AboutState>()((set) => ({
  year: DEFAULT_YEAR,
  modalOpen: false,
  setYear: (year) => set({ year }),
  setModalOpen: (modalOpen) => set({ modalOpen }),
}));
