import { createContext, useContext, useState } from "react";
import CustomToast from "../components/CustomToast";
const ToastContext = createContext();
export function ToastProvider({ children }) {
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "success",
  });
  const showToast = (message, type = "success") => {
    setToast({
      visible: true,
      message,
      type,
    });
    setTimeout(() => {
      setToast({
        visible: false,
        message: "",
        type: "success",
      });
    }, 2000);
  };
  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast.visible && (
        <CustomToast message={toast.message} type={toast.type} />
      )}
    </ToastContext.Provider>
  );
}
export function useToast() {
  return useContext(ToastContext);
}
