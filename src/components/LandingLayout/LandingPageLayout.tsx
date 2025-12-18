import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import styles from "./LandingPageLayout.module.scss";
import Footer from "../Footer/Footer";

interface PageLayoutProps {
  children: ReactNode; // the Composition Magic
  showBackBtn?: boolean;
  backLink?: string;
  btnText?: string;
  headerActions?: ReactNode; // custom right side (e.g., nav links)
}

export const LandingPageLayout = ({
  children,
  showBackBtn = true,
  backLink = "/",
  btnText = "← Back Home",
  headerActions,
}: PageLayoutProps) => {
  return (
    <div className={styles.container}>
      {/* reusable Header */}
      <header className={styles.topBar}>
        <div className={styles.logo}>
          Velo<span className={styles.highlight}>City</span>
        </div>

        <div className={styles.headerRight}>
          {headerActions}
          {!headerActions && showBackBtn && (
            <Link to={backLink} className={styles.closeBtn}>
              {btnText}
            </Link>
          )}
        </div>
      </header>

      {/* Dynamic Content */}
      <main className={styles.content}>{children}</main>
      <Footer />
    </div>
  );
};
