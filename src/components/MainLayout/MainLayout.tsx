import { Outlet } from "react-router-dom";
import styles from "./MainLayout.module.scss";
import Footer from "./Footer/Footer";
import { Navbar } from "./Navbar/Navbar";

const MainLayout = () => {
  return (
    <div className={styles.layoutWrapper}>
      <div className={styles.orbContainer} aria-hidden="true">
        <div className={styles.glowOrbRight}></div>
        <div className={styles.glowOrbLeft}></div>
      </div>

      <div className={styles.contentContainer}>
        <Navbar />
        <main className={styles.mainContent}>
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;
