import { create } from "zustand";

export type GalleryTab = "todas" | "ruta" | "montana";

type GalleryState = {
  tab: GalleryTab;
  setTab: (tab: GalleryTab) => void;
};

export const useGalleryStore = create<GalleryState>()((set) => ({
  tab: "todas",
  setTab: (tab) => set({ tab }),
}));
