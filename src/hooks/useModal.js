import { useModalStore } from "@/store/modalStore";

export const useModal = () => {
  const { showModal, hideModal } = useModalStore();

  const showSuccess = (message, title = "Success") => {
    showModal({
      title,
      message,
      type: "success",
      confirmText: "OK",
      showCancel: false,
    });
  };

  const showError = (message, title = "Error") => {
    showModal({
      title,
      message,
      type: "error",
      confirmText: "OK",
      showCancel: false,
    });
  };

  const showWarning = (message, title = "Warning") => {
    showModal({
      title,
      message,
      type: "warning",
      confirmText: "OK",
      showCancel: false,
    });
  };

  const showInfo = (message, title = "Information") => {
    showModal({
      title,
      message,
      type: "info",
      confirmText: "OK",
      showCancel: false,
    });
  };

  const showConfirm = (message, onConfirm, title = "Confirmation") => {
    showModal({
      title,
      message,
      type: "confirm",
      confirmText: "Yes",
      cancelText: "No",
      showCancel: true,
      onConfirm,
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
  };
};
