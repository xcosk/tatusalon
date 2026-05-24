import { create } from "zustand";

type UiState = {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  lightboxImage: string | null;
  setLightboxImage: (url: string | null) => void;
};

export const useUiStore = create<UiState>((set) => ({
  mobileMenuOpen: false,
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
  lightboxImage: null,
  setLightboxImage: (url) => set({ lightboxImage: url }),
}));
