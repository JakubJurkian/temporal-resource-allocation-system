import { Outlet } from "react-router-dom";
import styles from "./MainLayout.module.scss";
import Footer from "../Footer/Footer";
import { Navbar } from "../Navbar/Navbar";

const MainLayout = () => {
  return (
    <>
      <div className={styles.glowOrbRight} aria-hidden="true"></div>
      <div className={styles.glowOrbLeft} aria-hidden="true"></div>
      <div className={styles.container}>
        {/* reusable Header */}
        <Navbar />

        {/* Dynamic Content */}
        <main className={styles.content}>
          <Outlet />
        </main>
        {/* Global Footer */}
        <Footer />
      </div>
    </>
  );
};

export default MainLayout;
