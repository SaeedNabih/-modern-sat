"use client";
import { useModalStore } from "@/store/modalStore";

const MODAL_TYPES = {
  SUCCESS: "success",
  ERROR: "error",
  WARNING: "warning",
  INFO: "info",
  CONFIRM: "confirm",
};

const DEFAULT_TEXTS = {
  SUCCESS: { title: "Success", confirmText: "OK" },
  ERROR: { title: "Error", confirmText: "OK" },
  WARNING: { title: "Warning", confirmText: "OK" },
  INFO: { title: "Information", confirmText: "OK" },
  CONFIRM: { title: "Confirmation", confirmText: "Yes", cancelText: "No" },
};

export const useModal = () => {
  const { showModal, hideModal } = useModalStore();

  const createModal = (type, message, options = {}) => {
    const baseConfig = {
      message,
      type,
      showCancel: type === MODAL_TYPES.CONFIRM,
      ...DEFAULT_TEXTS[type.toUpperCase()],
      ...options,
    };

    showModal(baseConfig);
  };

  const showSuccess = (message, title = DEFAULT_TEXTS.SUCCESS.title) => {
    createModal(MODAL_TYPES.SUCCESS, message, { title });
  };

  const showError = (message, title = DEFAULT_TEXTS.ERROR.title) => {
    createModal(MODAL_TYPES.ERROR, message, { title });
  };

  const showWarning = (message, title = DEFAULT_TEXTS.WARNING.title) => {
    createModal(MODAL_TYPES.WARNING, message, { title });
  };

  const showInfo = (message, title = DEFAULT_TEXTS.INFO.title) => {
    createModal(MODAL_TYPES.INFO, message, { title });
  };

  const showConfirm = (
    message,
    onConfirm,
    title = DEFAULT_TEXTS.CONFIRM.title
  ) => {
    createModal(MODAL_TYPES.CONFIRM, message, {
      title,
      onConfirm,
      showCancel: true,
    });
  };

  const showCustomModal = (options) => {
    showModal({
      type: MODAL_TYPES.INFO,
      showCancel: false,
      confirmText: "OK",
      ...options,
    });
  };

  return {
    showModal,
    hideModal,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showConfirm,
    showCustomModal,
    MODAL_TYPES,
    DEFAULT_TEXTS,
  };
};
