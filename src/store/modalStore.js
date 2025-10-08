"use client";
import { create } from "zustand";

export const useModalStore = create((set, get) => ({
  isOpen: false,
  title: "",
  message: "",
  type: "info", // 'info', 'success', 'warning', 'error', 'confirm'
  onConfirm: null,
  onCancel: null,
  confirmText: "Confirm",
  cancelText: "Cancel",
  showCancel: true,

  showModal: (options) => {
    set({
      isOpen: true,
      type: "info",
      confirmText: "OK",
      cancelText: "Cancel",
      showCancel: false,
      ...options,
    });
  },

  hideModal: () => {
    set({ isOpen: false });
  },

  confirmModal: () => {
    const { onConfirm, hideModal } = get();
    if (onConfirm) {
      onConfirm();
    }
    hideModal();
  },

  cancelModal: () => {
    const { onCancel, hideModal } = get();
    if (onCancel) {
      onCancel();
    }
    hideModal();
  },
}));
