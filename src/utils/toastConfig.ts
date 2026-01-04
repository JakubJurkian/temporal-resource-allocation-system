import styles from "../styles/Toast.module.scss";

export const toastConfig = {
  className: styles.toastBase,
  iconTheme: { primary: styles.info, secondary: "#fff" },
  success: {
    iconTheme: { primary: styles.success, secondary: "#fff" },
  },
  error: {
    iconTheme: { primary: styles.error, secondary: "#fff" },
  },
};
