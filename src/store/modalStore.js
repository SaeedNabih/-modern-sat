"use client";
import { create } from "zustand";

const initialState = {
  isOpen: false,
  title: "",
  message: "",
  type: "info",
  onConfirm: null,
  onCancel: null,
  confirmText: "Confirm",
  cancelText: "Cancel",
  showCancel: false,
};

export const useModalStore = create((set, get) => ({
  ...initialState,

  showModal: (options) => {
    set({
      isOpen: true,
      ...initialState,
      ...options,
    });
  },

  hideModal: () => {
    set({
      isOpen: false,
    });
  },

  confirmModal: () => {
    const { onConfirm, hideModal } = get();
    if (onConfirm && typeof onConfirm === "function") {
      onConfirm();
    }
    hideModal();
  },

  cancelModal: () => {
    const { onCancel, hideModal } = get();
    if (onCancel && typeof onCancel === "function") {
      onCancel();
    }
    hideModal();
  },

  resetModal: () => {
    set(initialState);
  },
}));
