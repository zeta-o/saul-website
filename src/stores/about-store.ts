import { create } from "zustand";

type AboutState = {
  /** Año elegido por el visitante; null = el marcado como inicial en el admin. */
  year: string | null;
  modalOpen: boolean;
  setYear: (year: string) => void;
  setModalOpen: (open: boolean) => void;
};

export const useAboutStore = create<AboutState>()((set) => ({
  year: null,
  modalOpen: false,
  setYear: (year) => set({ year }),
  setModalOpen: (modalOpen) => set({ modalOpen }),
}));
