import { Link } from "react-router-dom";
import styles from "./LandingBtn.module.scss";

export default function LandingBtn({
  primary,
  to = "/register",
  children = "Start Riding ⚡",
  className = "",
}: {
  primary?: boolean;
  to?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      to={to}
      className={`${
        primary ? styles.primaryCta : styles.secondaryCta
      } ${className}`}
    >
      {children}
    </Link>
  );
}
